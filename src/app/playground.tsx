import { Canvas, Circle } from '@shopify/react-native-skia';
import { Platform, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue, withSpring } from 'react-native-reanimated';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CANVAS_HEIGHT = 280;
const BALL_RADIUS = 42;
const ACCENT_COLOR = '#3c87f7';

function DraggableBall({ width }: { width: number }) {
  const origin = { x: width / 2, y: CANVAS_HEIGHT / 2 };
  const cx = useSharedValue(origin.x);
  const cy = useSharedValue(origin.y);

  const pan = Gesture.Pan()
    .onChange((event) => {
      cx.value += event.changeX;
      cy.value += event.changeY;
    })
    .onEnd(() => {
      cx.value = withSpring(origin.x);
      cy.value = withSpring(origin.y);
    });

  return (
    <GestureDetector gesture={pan}>
      <Canvas style={{ width, height: CANVAS_HEIGHT }}>
        <Circle cx={cx} cy={cy} r={BALL_RADIUS} color={ACCENT_COLOR} />
      </Canvas>
    </GestureDetector>
  );
}

export default function PlaygroundScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const canvasWidth = Math.min(windowWidth, MaxContentWidth) - Spacing.four * 2;

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Playground</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Drag the ball around. It&apos;s a Skia canvas driven entirely by Reanimated shared
            values on the UI thread.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.canvasCard}>
          {Platform.OS === 'web' ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
              Open this screen on iOS or Android to try the Skia canvas demo.
            </ThemedText>
          ) : (
            <DraggableBall width={canvasWidth} />
          )}
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="How this works">
            <ThemedText type="small">
              The ball&apos;s position lives in two Reanimated{' '}
              <ThemedText type="code">useSharedValue</ThemedText>s. A{' '}
              <ThemedText type="code">react-native-gesture-handler</ThemedText> pan gesture updates
              them directly, and <ThemedText type="code">@shopify/react-native-skia</ThemedText>{' '}
              redraws the <ThemedText type="code">Circle</ThemedText> every frame without going
              through React — no re-renders while dragging.
            </ThemedText>
            <ExternalLink href="https://shopify.github.io/react-native-skia/docs/animations/animations/">
              <ThemedText type="linkPrimary">Skia + Reanimated docs</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Data & backend">
            <ThemedText type="small">
              <ThemedText type="code">@tanstack/react-query</ThemedText> is wired up in{' '}
              <ThemedText type="code">src/app/_layout.tsx</ThemedText>, and{' '}
              <ThemedText type="code">@supabase/supabase-js</ThemedText> is configured in{' '}
              <ThemedText type="code">src/lib/supabase.ts</ThemedText>. Add your project URL and
              anon key to <ThemedText type="code">.env</ThemedText> to start querying.
            </ThemedText>
          </Collapsible>
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  canvasCard: {
    minHeight: CANVAS_HEIGHT,
    marginHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: Spacing.four,
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
});
