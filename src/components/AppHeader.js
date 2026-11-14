/**
 * AppHeader — deep navy page header used on every screen.
 * variant: 'page' (back button + title) or 'home' (company / role info).
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme/theme';
import StatusBadge from './StatusBadge';

export default function AppHeader({ title, subtitle, variant = 'page', badgeLabel, onBadgePress, onBack, right }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.topRow}>
        {variant === 'page' ? (
          <Pressable onPress={handleBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={colors.textOnNavy} />
          </Pressable>
        ) : (
          <View style={styles.brandMark}>
            <View style={styles.brandBar} />
            <Text style={styles.brandText}>HVAC COMPLY</Text>
          </View>
        )}
        {right}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}

      {badgeLabel ? (
        <Pressable onPress={onBadgePress} disabled={!onBadgePress} style={styles.badgeWrapper}>
          <StatusBadge label={badgeLabel} tone="navy" style={styles.badge} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.navy900,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 28, marginBottom: spacing.md },
  backButton: { marginLeft: -6, padding: 2 },
  brandMark: { flexDirection: 'row', alignItems: 'center' },
  brandBar: { width: 3, height: 14, backgroundColor: colors.blue500, borderRadius: 2, marginRight: spacing.sm },
  brandText: { fontSize: typography.sizeOverline, fontWeight: typography.bold, letterSpacing: 2, color: colors.textOnNavyMuted },
  title: { fontSize: typography.sizeHeading, fontWeight: typography.bold, color: colors.textOnNavy, letterSpacing: -0.3 },
  subtitle: { fontSize: typography.sizeBodySmall, color: colors.textOnNavyMuted, marginTop: spacing.xs, lineHeight: typography.leadingNormal },
  badgeWrapper: { alignSelf: 'flex-start', marginTop: spacing.md },
  badge: { backgroundColor: colors.navy700, borderColor: colors.navy600 },
});
