import { Stack } from 'expo-router';
import React from 'react';

export default function MealPlanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Meal Plan' }}
      />
    </Stack>
  );
}