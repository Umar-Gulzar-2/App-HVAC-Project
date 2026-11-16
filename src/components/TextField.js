/**
 * TextField — labelled form input with inline validation error support.
 * Used for every form in the app (login, signup, service form, admin forms).
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '../theme/theme';

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
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          error && styles.inputRowError,
          multiline && styles.multilineRow,
          !editable && styles.disabledRow,
        ]}
      >
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
    fontFamily: fonts.medium,
    fontSize: typography.sizeCaption,
    color: colors.textSecondary,
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 46,
  },
  multilineRow: { alignItems: 'flex-start', paddingVertical: spacing.sm },
  inputRowFocused: {
    borderColor: colors.blue600,
    shadowColor: colors.blue600,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
  },
  inputRowError: { borderColor: colors.danger },
  disabledRow: { backgroundColor: colors.canvasSunken },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: typography.sizeBody, color: colors.textPrimary, paddingVertical: 10 },
  multilineInput: { minHeight: 88, textAlignVertical: 'top' },
  toggle: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textAccent, paddingLeft: spacing.sm },
  error: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.danger, marginTop: spacing.xs },
  helper: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: spacing.xs },
});
