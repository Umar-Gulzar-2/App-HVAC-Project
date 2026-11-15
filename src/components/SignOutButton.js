/**
 * SignOutButton — icon button in the navy header.
 * Clears the (demo) session and returns to /login. Chunk 2 swaps in
 * Firebase signOut() with the same behaviour.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useDemoSession } from '../context/DemoSessionContext';
import { colors } from '../theme/theme';

export default function SignOutButton() {
  const router = useRouter();
  const { signOut } = useDemoSession();

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  return (
    <Pressable
      onPress={handleSignOut}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Sign out"
      style={styles.button}
      testID="sign-out"
    >
      <Ionicons name="log-out-outline" size={20} color={colors.textOnNavyMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 4 },
});
