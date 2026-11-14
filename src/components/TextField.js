/**
 * TextField — labelled form input with inline validation error support.
 * Used for every form in the app (login, signup, service form, admin forms).
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  editable = true,
  testID,
}) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error && styles.inputRowError, multiline && styles.multilineRow, !editable && styles.disabledRow]}>
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          multiline={multiline}
          editable={editable}
          testID={testID}
          accessibilityLabel={label || placeholder}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} accessibilityRole="button">
            <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: {
    fontSize: typography.sizeCaption,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 46,
  },
  multilineRow: { alignItems: 'flex-start', paddingVertical: spacing.sm },
  inputRowError: { borderColor: colors.danger },
  disabledRow: { backgroundColor: colors.surfaceSunken },
  input: { flex: 1, fontSize: typography.sizeBody, color: colors.textPrimary, paddingVertical: 10 },
  multilineInput: { minHeight: 88, textAlignVertical: 'top' },
  toggle: { fontSize: typography.sizeCaption, fontWeight: typography.semibold, color: colors.blue600, paddingLeft: spacing.sm },
  error: { fontSize: typography.sizeCaption, color: colors.danger, marginTop: spacing.xs },
  helper: { fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: spacing.xs },
});
