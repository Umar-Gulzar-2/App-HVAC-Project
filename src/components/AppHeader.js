/**
 * AppHeader — flat deep-navy page header.
 * variant 'home': mono wordmark + user avatar (initials) + sign-out.
 * variant 'page': back chevron + title. Optional subtitle and meta line.
 * No rounded bottom edge, no decorative marks — chrome stays quiet.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, textStyles, typography } from '../theme/theme';

function initialsOf(name) {
  if (!name) return '··';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function AppHeader({ title, subtitle, meta, variant = 'page', roleLabel, userName, titleMono = false, onBack, right }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.topRow}>
        {variant === 'page' ? (
          <Pressable onPress={handleBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.textOnNavy} />
          </Pressable>
        ) : (
          <Text style={styles.wordmark}>HVAC COMPLY</Text>
        )}
        <View style={styles.topRight}>
          {right}
          {variant === 'home' && userName ? (
            <View style={styles.avatar} accessibilityLabel={`${userName}`}>
              <Text style={styles.avatarText}>{initialsOf(userName)}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {title ? (
        <Text style={[styles.title, titleMono && styles.titleMono]} numberOfLines={2}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
      {meta ? (
        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>
      ) : null}
      {roleLabel ? (
        <View style={styles.roleChip}>
          <View style={styles.roleDot} />
          <Text style={styles.roleText}>{roleLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.navy900,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 34, marginBottom: spacing.md },
  backButton: { marginLeft: -6 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  wordmark: {
    fontFamily: fonts.monoSemibold,
    fontSize: typography.sizeCaption,
    letterSpacing: 2.4,
    color: colors.textOnNavyMuted,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.navy700,
    borderWidth: 1,
    borderColor: '#27486B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.semibold, fontSize: typography.sizeCaption, color: colors.textOnNavy, letterSpacing: 0.3 },
  title: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizeHeading,
    letterSpacing: -0.4,
    color: colors.textOnNavy,
  },
  titleMono: {
    fontFamily: fonts.monoSemibold,
    fontSize: 20,
    letterSpacing: 0.4,
    fontVariant: ['tabular-nums'],
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBodySmall,
    color: colors.textOnNavyMuted,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  meta: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 1,
    color: '#6E87A3',
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#2A4A6D',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5BA0F0' },
  roleText: { fontFamily: fonts.medium, fontSize: typography.sizeMeta, color: colors.textOnNavyMuted, letterSpacing: 0.4 },
});
