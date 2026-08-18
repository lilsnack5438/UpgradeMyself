// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

import '@supabase/functions-js/edge-runtime.d.ts';
import { withSupabase } from '@supabase/server';
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 2048;

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WordEntry {
  word: string;
  meaningVi: string;
}

interface GenerateRequest {
  action: 'generate';
  words: WordEntry[];
}

interface GradeRequest {
  action: 'grade';
  word: string;
  meaningVi: string;
  prompt: string;
  userAnswer: string;
}

type VocabAiRequest = GenerateRequest | GradeRequest;

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}

async function generateQuiz(words: WordEntry[]) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    tools: [
      {
        name: 'submit_quiz_questions',
        description:
          'Submit one quiz prompt per word asking the user to translate it to Vietnamese.',
        input_schema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  word: { type: 'string', description: 'The English word, unchanged.' },
                  prompt: {
                    type: 'string',
                    description:
                      'A short, natural instruction asking the user to translate this word to Vietnamese.',
                  },
                },
                required: ['word', 'prompt'],
              },
            },
          },
          required: ['questions'],
        },
        strict: true,
      },
    ],
    tool_choice: { type: 'tool', name: 'submit_quiz_questions' },
    messages: [
      {
        role: 'user',
        content:
          'Tạo một câu hỏi quiz ngắn gọn, tự nhiên cho mỗi từ tiếng Anh sau, yêu cầu người dùng dịch từ đó sang tiếng Việt. ' +
          "Giữ nguyên đúng từ tiếng Anh trong trường 'word'.\n\n" +
          JSON.stringify(words),
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
  );
  if (!toolUse) {
    throw new Error('Claude did not return a tool_use block for generate');
  }
  return toolUse.input as { questions: { word: string; prompt: string }[] };
}

async function gradeAnswer({ word, meaningVi, prompt, userAnswer }: GradeRequest) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    tools: [
      {
        name: 'submit_grade',
        description: "Submit a grading result for the user's translation attempt.",
        input_schema: {
          type: 'object',
          properties: {
            isCorrect: {
              type: 'boolean',
              description:
                'True if the answer conveys the correct meaning, allowing for synonyms, minor typos, or partial phrasing.',
            },
            feedback: {
              type: 'string',
              description: 'One short, encouraging sentence in Vietnamese explaining the result.',
            },
            modelAnswer: {
              type: 'string',
              description: 'The canonical Vietnamese meaning of the word.',
            },
          },
          required: ['isCorrect', 'feedback', 'modelAnswer'],
        },
        strict: true,
      },
    ],
    tool_choice: { type: 'tool', name: 'submit_grade' },
    messages: [
      {
        role: 'user',
        content:
          `Từ tiếng Anh: "${word}"\n` +
          `Nghĩa tiếng Việt đúng (tham khảo): "${meaningVi}"\n` +
          `Câu hỏi đã hỏi: "${prompt}"\n` +
          `Câu trả lời của người dùng: "${userAnswer}"\n\n` +
          'Chấm điểm câu trả lời này. Chấp nhận từ đồng nghĩa, cách diễn đạt khác, hoặc lỗi chính tả nhỏ ' +
          'miễn là đúng nghĩa. Không chấp nhận nếu sai nghĩa hoặc bỏ trống.',
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
  );
  if (!toolUse) {
    throw new Error('Claude did not return a tool_use block for grade');
  }
  return toolUse.input as { isCorrect: boolean; feedback: string; modelAnswer: string };
}

export default {
  fetch: withSupabase({ auth: ['publishable'] }, async (req) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    let body: VocabAiRequest;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    try {
      if (body.action === 'generate') {
        return jsonResponse(await generateQuiz(body.words));
      }
      if (body.action === 'grade') {
        return jsonResponse(await gradeAnswer(body));
      }
      return jsonResponse({ error: 'Unknown action' }, 400);
    } catch (error) {
      console.error('vocab-ai error:', error);
      return jsonResponse({ error: 'AI request failed' }, 502);
    }
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Set ANTHROPIC_API_KEY in supabase/functions/.env (gitignored, local only)
  3. supabase functions serve vocab-ai --env-file supabase/functions/.env
  4. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/vocab-ai' \
    --header 'apiKey: <your publishable key>' \
    --header 'Content-Type: application/json' \
    --data '{"action":"generate","words":[{"word":"happy","meaningVi":"vui vẻ, hạnh phúc"}]}'

*/
