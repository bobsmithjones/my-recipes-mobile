// src/components/Screen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

type ScreenProps = {
  children: React.ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
