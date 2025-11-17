// app/(app)/meal-plan/index.tsx
import React from 'react';
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useMealPlan } from '../../../src/store/mealPlanStore';

export default function MealPlanScreen() {
  const { plannedRecipes, clearMealPlan } = useMealPlan();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Plan</Text>
      <Text style={styles.subtitle}>
        Quick overview of recipes you’ve planned to cook.
      </Text>

      <View style={styles.headerRow}>
        <Text style={styles.countText}>
          Planned recipes: {plannedRecipes.length}
        </Text>
        {plannedRecipes.length > 0 && (
          <Button title="Clear All" onPress={clearMealPlan} />
        )}
      </View>

      <FlatList
        data={plannedRecipes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          plannedRecipes.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No recipes in your meal plan yet.{'\n'}
            Add some from a recipe detail screen.
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{index + 1}</Text>
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>
                Recipe ID: {item.recipeId}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
  title: { fontSize: 24, fontWeight: '600' },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  countText: { fontSize: 13, color: '#555' },
  listContent: { paddingTop: 8, paddingBottom: 16 },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2f6fed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  cardTextBlock: { flexShrink: 1 },
  cardTitle: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#777' },
});
