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
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../src/components/Button';
import TextField from '../src/components/TextField';
import { useDemoSession } from '../src/context/DemoSessionContext';
import { colors, radius, spacing, typography } from '../src/theme/theme';

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
    // Demo sign-in: chooses the dashboard by the account type below.
    // Chunk 2 replaces this block with Firebase signInWithEmailAndPassword.
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
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        {/* Brand block — deep navy foundation */}
        <View style={styles.brand}>
          <View style={styles.brandBar} />
          <Text style={styles.brandName}>HVAC Comply</Text>
          <Text style={styles.brandTagline}>Commercial HVAC equipment & refrigerant recordkeeping{'\n'}with compliance attention review</Text>
        </View>

        {/* Auth card */}
        <View style={styles.card}>
          {/* Mode switch */}
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
              <Text style={styles.intro}>Create the company account for your HVAC business. You will be the administrator.</Text>
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

        {/* Preview role switcher — clearly labelled as preview, not authentication */}
        <View style={styles.preview}>
          <View style={styles.previewHeader}>
            <Ionicons name="eye-outline" size={15} color={colors.textOnNavyMuted} />
            <Text style={styles.previewTitle}>Preview this build</Text>
          </View>
          <Text style={styles.previewText}>
            Firebase sign-in connects in Milestone 2. Use these buttons to review each role’s screens now.
          </Text>
          <View style={styles.previewButtons}>
            <Button label="Administrator view" variant="secondary" size="sm" onPress={() => previewSignIn('admin')} style={styles.previewButton} />
            <Button label="Technician view" variant="secondary" size="sm" onPress={() => previewSignIn('technician')} style={styles.previewButton} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy900 },
  scroll: { paddingHorizontal: spacing.lg, minHeight: '100%' },
  brand: { marginBottom: spacing.xxl },
  brandBar: { width: 34, height: 4, borderRadius: 2, backgroundColor: colors.blue500, marginBottom: spacing.lg },
  brandName: { fontSize: 34, fontWeight: typography.bold, color: colors.textOnNavy, letterSpacing: -0.8 },
  brandTagline: { fontSize: typography.sizeBodySmall, color: colors.textOnNavyMuted, marginTop: spacing.sm, lineHeight: typography.leadingRelaxed },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.navy700,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  segmentItem: { flex: 1, paddingVertical: 9, borderRadius: radius.sm, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  segmentLabel: { fontSize: typography.sizeCaption, fontWeight: typography.semibold, color: colors.textSecondary },
  segmentLabelActive: { color: colors.navy800 },
  intro: { fontSize: typography.sizeBodySmall, color: colors.textSecondary, marginBottom: spacing.lg, lineHeight: typography.leadingNormal },
  preview: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.navy600,
    backgroundColor: colors.navy800,
    padding: spacing.lg,
  },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  previewTitle: { fontSize: typography.sizeCaption, fontWeight: typography.bold, color: colors.textOnNavy, letterSpacing: 0.5 },
  previewText: { fontSize: typography.sizeCaption, color: colors.textOnNavyMuted, lineHeight: typography.leadingNormal },
  previewButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  previewButton: { flex: 1, backgroundColor: colors.surface },
});
