// src/store/mealPlanStore.tsx
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { Recipe } from '../api/recipes';

export type PlannedRecipe = {
  id: number;
  recipeId: number;
  title: string;
};

export type ShoppingItem = {
  id: number;
  name: string;
  fromRecipeId: number;
  fromRecipeTitle: string;
};

type MealPlanContextValue = {
  plannedRecipes: PlannedRecipe[];
  shoppingItems: ShoppingItem[];
  addRecipeToMealPlan: (recipe: Recipe) => void;
  addIngredientsToShoppingList: (recipe: Recipe) => void;
  clearMealPlan: () => void;
  clearShoppingList: () => void;
};

const MealPlanContext = createContext<MealPlanContextValue | undefined>(
  undefined
);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [plannedRecipes, setPlannedRecipes] = useState<PlannedRecipe[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  const addRecipeToMealPlan = (recipe: Recipe) => {
    setPlannedRecipes((prev) => [
      ...prev,
      {
        id: Date.now(),
        recipeId: recipe.id,
        title: recipe.title,
      },
    ]);
  };

  const addIngredientsToShoppingList = (recipe: Recipe) => {
    const ingredients = recipe.ingredients;
    if (!ingredients || ingredients.length === 0) return;
  
    setShoppingItems((prev) => [
      ...prev,
      ...ingredients.map((name) => ({
        id: Date.now() + Math.random(),
        name,
        fromRecipeId: recipe.id,
        fromRecipeTitle: recipe.title,
      })),
    ]);
  };
  
  const clearMealPlan = () => setPlannedRecipes([]);
  const clearShoppingList = () => setShoppingItems([]);

  return (
    <MealPlanContext.Provider
      value={{
        plannedRecipes,
        shoppingItems,
        addRecipeToMealPlan,
        addIngredientsToShoppingList,
        clearMealPlan,
        clearShoppingList,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const ctx = useContext(MealPlanContext);
  if (!ctx) {
    throw new Error('useMealPlan must be used within MealPlanProvider');
  }
  return ctx;
}
