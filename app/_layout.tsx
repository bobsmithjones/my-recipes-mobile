// app/_layout.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import React from 'react';
import { MealPlanProvider } from '../src/store/mealPlanStore';
import { queryClient } from '../src/store/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <MealPlanProvider>
        <Slot />
      </MealPlanProvider>
    </QueryClientProvider>
  );
}
