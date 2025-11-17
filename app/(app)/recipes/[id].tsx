// app/(app)/recipes/[id].tsx
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getRecipes, type Recipe } from '../../../src/api/recipes';
import { useMealPlan } from '../../../src/store/mealPlanStore';

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams();
  const rawId = params.id;
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;
  const idNum = idStr ? Number(idStr) : NaN;

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes', 'detail'],
    queryFn: () => getRecipes(),
  });

  const {
    addRecipeToMealPlan,
    addIngredientsToShoppingList,
  } = useMealPlan();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading recipe...</Text>
      </View>
    );
  }

  if (error || !recipes || Number.isNaN(idNum)) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Error loading recipe</Text>
        <Text>ID: {String(rawId)}</Text>
      </View>
    );
  }

  const recipe = recipes.find((r: Recipe) => r.id === idNum);

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Recipe not found</Text>
        <Text>ID: {idStr}</Text>
      </View>
    );
  }

  const handleAddToMealPlan = () => {
    addRecipeToMealPlan(recipe);
    Alert.alert('Added', 'Recipe added to your meal plan (mock).');
  };

  const handleAddToShoppingList = () => {
    const ingredients = recipe.ingredients;
    if (!ingredients || ingredients.length === 0) {
      Alert.alert('No ingredients', 'This recipe has no ingredients defined.');
      return;
    }
    addIngredientsToShoppingList(recipe);
    Alert.alert('Added', 'Ingredients added to your shopping list (mock).');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{recipe.title}</Text>

      {recipe.description ? (
        <Text style={styles.description}>{recipe.description}</Text>
      ) : null}

      <Text style={styles.meta}>
        Prep: {recipe.prep_time_minutes ?? '?'} min · Cook:{' '}
        {recipe.cook_time_minutes ?? '?'} min
      </Text>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAddToMealPlan}
        >
          <Text style={styles.primaryButtonText}>Add to Meal Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleAddToShoppingList}
        >
          <Text style={styles.secondaryButtonText}>
            Add Ingredients to List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ing, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.bulletText}>{ing}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Steps */}
      {recipe.steps && recipe.steps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {recipe.steps.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{idx + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Notes */}
      {recipe.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{recipe.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  content: { padding: 16, paddingBottom: 32 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 6 },
  description: { fontSize: 15, color: '#444', marginBottom: 6 },
  meta: { color: '#777', marginBottom: 16, fontSize: 12 },

  actionsRow: {
    flexDirection: 'column',
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: '#2f6fed',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2f6fed',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2f6fed',
    fontWeight: '500',
    fontSize: 13,
  },

  section: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '500', marginBottom: 8 },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    marginRight: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    width: 20,
    fontWeight: '500',
    color: '#333',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  notes: {
    fontSize: 14,
    color: '#444',
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
  },
  muted: { color: '#666', marginTop: 8 },
});
