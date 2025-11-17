// app/(app)/shopping-list/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function ShoppingListLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Shopping List' }}
      />
    </Stack>
  );
}