/**
 * Login / Signup screen.
 *
 * Two modes:
 *  - Sign In: an existing owner or technician signs in.
 *  - Create Account: the company owner creates the company account.
 *
 * PREVIEW NOTE (Chunk 1): authentication is not connected to Firebase yet.
 * The "Preview as" buttons switch roles so both dashboards can be reviewed.
 * Chunk 2 replaces this with real Firebase Authentication.
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../src/components/Button';
import TextField from '../src/components/TextField';
import { useDemoSession } from '../src/context/DemoSessionContext';
import { colors, fonts, radius, spacing, typography } from '../src/theme/theme';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { role, signInAsAdmin, signInAsTechnician } = useDemoSession();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Already signed in (demo session) — go straight to the right dashboard.
  if (role === 'admin') return <Redirect href="/admin" />;
  if (role === 'technician') return <Redirect href="/technician" />;

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
  };

  const handleSignIn = () => {
    const nextErrors = {};
    if (!validateEmail(email)) nextErrors.email = 'Enter a valid email address.';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // Demo sign-in. Chunk 2 replaces this with Firebase
    // signInWithEmailAndPassword (the account type decides the dashboard).
    setTimeout(() => {
      setSubmitting(false);
      signInAsTechnician();
      router.replace('/technician');
    }, 250);
  };

  const handleCreateAccount = () => {
    const nextErrors = {};
    if (companyName.trim().length < 2) nextErrors.companyName = 'Enter your company name.';
    if (ownerName.trim().length < 2) nextErrors.ownerName = 'Enter your name.';
    if (!validateEmail(email)) nextErrors.email = 'Enter a valid email address.';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // Demo account creation: creates the administrator session in memory.
    setTimeout(() => {
      setSubmitting(false);
      signInAsAdmin({ userName: ownerName.trim(), companyName: companyName.trim() });
      router.replace('/admin');
    }, 250);
  };

  const previewSignIn = (target) => {
    if (target === 'admin') {
      signInAsAdmin();
      router.replace('/admin');
    } else {
      signInAsTechnician();
      router.replace('/technician');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand block — navy field, mono lockup, plain-language context */}
        <View style={styles.brand}>
          <Text style={styles.wordmark}>HVAC COMPLY</Text>
          <Text style={styles.brandName}>HVAC Comply</Text>
          <Text style={styles.brandTagline}>
            Equipment, refrigerant and service records{'\n'}for commercial HVAC companies
          </Text>
        </View>

        {/* Credentials sheet */}
        <View style={styles.sheet}>
          <View style={styles.segment}>
            <Pressable style={[styles.segmentItem, mode === 'signin' && styles.segmentActive]} onPress={() => switchMode('signin')}>
              <Text style={[styles.segmentLabel, mode === 'signin' && styles.segmentLabelActive]}>Sign In</Text>
            </Pressable>
            <Pressable style={[styles.segmentItem, mode === 'signup' && styles.segmentActive]} onPress={() => switchMode('signup')}>
              <Text style={[styles.segmentLabel, mode === 'signup' && styles.segmentLabelActive]}>Create Account</Text>
            </Pressable>
          </View>

          {mode === 'signup' ? (
            <>
              <Text style={styles.intro}>
                Create the company account for your business. You will be the administrator.
              </Text>
              <TextField
                label="Company name"
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="e.g. Premier Commercial HVAC"
                autoCapitalize="words"
                error={errors.companyName}
                testID="input-company"
              />
              <TextField
                label="Your name"
                value={ownerName}
                onChangeText={setOwnerName}
                placeholder="e.g. Umar Gulzar"
                autoCapitalize="words"
                error={errors.ownerName}
                testID="input-owner"
              />
            </>
          ) : (
            <Text style={styles.intro}>Sign in with the account issued by your company administrator.</Text>
          )}

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="name@company.com"
            keyboardType="email-address"
            error={errors.email}
            testID="input-email"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            error={errors.password}
            testID="input-password"
          />

          <Button
            label={mode === 'signin' ? 'Sign In' : 'Create Company Account'}
            onPress={mode === 'signin' ? handleSignIn : handleCreateAccount}
            loading={submitting}
            size="lg"
            testID="submit-auth"
          />
        </View>

        {/* Preview dock — clearly not authentication */}
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Preview this build</Text>
          <Text style={styles.previewText}>
            Firebase sign-in connects in Milestone 2. Open each role’s screens now:
          </Text>
          <View style={styles.previewButtons}>
            <Button label="Administrator view" variant="secondary" size="sm" onPress={() => previewSignIn('admin')} style={styles.previewButton} />
            <Button label="Technician view" variant="secondary" size="sm" onPress={() => previewSignIn('technician')} style={styles.previewButton} />
          </View>
        </View>

        <Text style={styles.footer}>Student prototype · not an EPA-approved product</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy900 },
  scroll: { paddingHorizontal: spacing.lg, minHeight: '100%' },
  brand: { marginBottom: spacing.xl },
  wordmark: {
    fontFamily: fonts.monoSemibold,
    fontSize: typography.sizeCaption,
    letterSpacing: 2.6,
    color: '#6E87A3',
    marginBottom: spacing.lg,
  },
  brandName: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizeDisplay,
    letterSpacing: -0.8,
    color: colors.textOnNavy,
  },
  brandTagline: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBodySmall,
    color: colors.textOnNavyMuted,
    marginTop: spacing.sm,
    lineHeight: 19,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.xl,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.canvasSunken,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  segmentItem: { flex: 1, paddingVertical: 9, borderRadius: radius.sm, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairlineStrong },
  segmentLabel: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textSecondary },
  segmentLabelActive: { color: colors.textPrimary },
  intro: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 19,
  },
  preview: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: '#27486B',
    borderRadius: radius.lg,
    backgroundColor: colors.navy800,
    padding: spacing.lg,
  },
  previewLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 1.4,
    color: '#7FA3CC',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  previewText: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textOnNavyMuted, lineHeight: 17 },
  previewButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  previewButton: { flex: 1, backgroundColor: colors.surface },
  footer: {
    fontFamily: fonts.mono,
    fontSize: typography.sizeMeta,
    letterSpacing: 0.8,
    color: '#5E7794',
    textAlign: 'center',
    marginTop: spacing.xl,
    textTransform: 'uppercase',
  },
});
