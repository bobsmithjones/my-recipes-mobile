// app/(app)/shopping-list/index.tsx
import React from 'react';
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Card } from '../../../src/components/Card';
import { Screen } from '../../../src/components/Screen';
import { useMealPlan } from '../../../src/store/mealPlanStore';

export default function ShoppingListScreen() {
  const { shoppingItems, clearShoppingList } = useMealPlan();

  // Sort so items from the same recipe are near each other
  const sortedItems = [...shoppingItems].sort((a, b) =>
    a.fromRecipeTitle.localeCompare(b.fromRecipeTitle),
  );

  return (
    <Screen>
      <Text style={styles.title}>Shopping List</Text>
      <Text style={styles.subtitle}>
        Ingredients pulled from your planned recipes.
      </Text>

      <View style={styles.headerRow}>
        <Text style={styles.countText}>Items: {sortedItems.length}</Text>
        {sortedItems.length > 0 && (
          <Button title="Clear All" onPress={clearShoppingList} />
        )}
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          sortedItems.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No items yet.{'\n'}
            Add ingredients from a recipe detail screen.
          </Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.itemCard}>
            <View style={styles.itemMain}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSource}>
                from {item.fromRecipeTitle}
              </Text>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  itemCard: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemMain: { flexShrink: 1 },
  itemName: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  itemSource: { fontSize: 12, color: '#777' },
});
