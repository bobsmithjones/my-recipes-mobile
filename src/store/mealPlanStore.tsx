// src/store/mealPlanStore.tsx
import type { ReactNode } from 'react';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import type { Recipe } from '../api/recipes';
import { loadObject, removeItem, saveObject } from '../utils/storage';
  
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
  
  // Storage keys (bump version to avoid old junk)
  const MEAL_PLAN_KEY = '@myrecipes/v1/mealPlan';
  const SHOPPING_LIST_KEY = '@myrecipes/v1/shoppingItems';
  
  export function MealPlanProvider({ children }: { children: ReactNode }) {
    const [plannedRecipes, setPlannedRecipes] = useState<PlannedRecipe[]>([]);
    const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
    const [hydrated, setHydrated] = useState(false);
  
    // Load from storage on first mount
    useEffect(() => {
      const loadFromStorage = async () => {
        try {
          const savedPlan = await loadObject<PlannedRecipe[]>(MEAL_PLAN_KEY);
          const savedShopping = await loadObject<ShoppingItem[]>(SHOPPING_LIST_KEY);
  
          if (savedPlan && Array.isArray(savedPlan)) {
            console.log('[MealPlan] Loaded plan from storage:', savedPlan.length);
            setPlannedRecipes(savedPlan);
          } else {
            console.log('[MealPlan] No saved plan found');
          }
  
          if (savedShopping && Array.isArray(savedShopping)) {
            console.log('[MealPlan] Loaded shopping from storage:', savedShopping.length);
            setShoppingItems(savedShopping);
          } else {
            console.log('[MealPlan] No saved shopping list found');
          }
        } catch (err) {
          console.warn('[MealPlan] Error loading from storage:', err);
        } finally {
          setHydrated(true);
        }
      };
  
      loadFromStorage();
    }, []);
  
    // Persist meal plan whenever it changes, but only after hydration
    useEffect(() => {
      if (!hydrated) return;
      console.log('[MealPlan] Saving plan to storage, count:', plannedRecipes.length);
      saveObject(MEAL_PLAN_KEY, plannedRecipes);
    }, [hydrated, plannedRecipes]);
  
    // Persist shopping list whenever it changes, but only after hydration
    useEffect(() => {
      if (!hydrated) return;
      console.log('[MealPlan] Saving shopping to storage, count:', shoppingItems.length);
      saveObject(SHOPPING_LIST_KEY, shoppingItems);
    }, [hydrated, shoppingItems]);
  
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
  
      const newItems: ShoppingItem[] = ingredients.map((name) => ({
        id: Date.now() + Math.random(),
        name,
        fromRecipeId: recipe.id,
        fromRecipeTitle: recipe.title,
      }));
  
      setShoppingItems((prev) => {
        const next = [...prev, ...newItems];
        console.log(
          '[MealPlan] addIngredientsToShoppingList -> new total items:',
          next.length
        );
        return next;
      });
    };
  
    const clearMealPlan = () => {
      setPlannedRecipes([]);
      removeItem(MEAL_PLAN_KEY);
      console.log('[MealPlan] Cleared plan & storage');
    };
  
    const clearShoppingList = () => {
      setShoppingItems([]);
      removeItem(SHOPPING_LIST_KEY);
      console.log('[MealPlan] Cleared shopping list & storage');
    };
  
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
  