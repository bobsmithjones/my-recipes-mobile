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
import { Card } from '../../../src/components/Card';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { Screen } from '../../../src/components/Screen';
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
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Loading recipe...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !recipes || Number.isNaN(idNum)) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Error loading recipe</Text>
          <Text>ID: {String(rawId)}</Text>
        </View>
      </Screen>
    );
  }

  const recipe = recipes.find((r: Recipe) => r.id === idNum);

  if (!recipe) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Recipe not found</Text>
          <Text>ID: {idStr}</Text>
        </View>
      </Screen>
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
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
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
          <PrimaryButton
            title="Add to Meal Plan"
            onPress={handleAddToMealPlan}
          />

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
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ing, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.bulletText}>{ing}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Steps */}
        {recipe.steps && recipe.steps.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Steps</Text>
            {recipe.steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{idx + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Notes */}
        {recipe.notes && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{recipe.notes}</Text>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 6 },
  description: { fontSize: 15, color: '#444', marginBottom: 6 },
  meta: { color: '#777', marginBottom: 16, fontSize: 12 },

  actionsRow: {
    marginBottom: 18,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2f6fed',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#2f6fed',
    fontWeight: '500',
    fontSize: 13,
  },

  sectionCard: {
    marginTop: 16,
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
