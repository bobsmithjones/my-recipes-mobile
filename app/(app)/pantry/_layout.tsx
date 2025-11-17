import { Stack } from 'expo-router';
import React from 'react';

export default function PantryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Pantry' }}
      />
    </Stack>
  );
}