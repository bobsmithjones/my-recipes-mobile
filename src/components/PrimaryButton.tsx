// src/components/PrimaryButton.tsx
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
};

export function PrimaryButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#2f6fed',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
