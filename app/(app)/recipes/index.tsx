// app/(app)/recipes/index.tsx
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getRecipes, type Recipe } from '../../../src/api/recipes';
import { Card } from '../../../src/components/Card';
import { Screen } from '../../../src/components/Screen';


export default function RecipeListScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['recipes', search],
    queryFn: () => getRecipes(search),
  });

  const onOpenRecipe = (id: number) => {
    router.push(`/recipes/${id}`);
  };

  return (
    <Screen>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.subtitle}>
        Search and explore your saved recipes.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Search recipes (e.g. garlic, squash)…"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => refetch()}
        returnKeyType="search"
      />

      {(isLoading || isRefetching) && (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading recipes…</Text>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>
          Error loading recipes. Check your mock or API.
        </Text>
      )}

      <FlatList
        data={data ?? []}
        keyExtractor={(item: Recipe) => item.id.toString()}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading && !error ? (
            <Text style={styles.emptyText}>
              No recipes found. Try clearing your search.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onOpenRecipe(item.id)}
          >
            <Card>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.description ? (
                <Text numberOfLines={2} style={styles.cardDescription}>
                  {item.description}
                </Text>
              ) : null}
              <View style={styles.cardMetaRow}>
                <Text style={styles.cardMeta}>
                  Prep {item.prep_time_minutes ?? '?'} min
                </Text>
                <Text style={styles.cardDot}>•</Text>
                <Text style={styles.cardMeta}>
                  Cook {item.cook_time_minutes ?? '?'} min
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

// keep your existing styles, but drop container bg/padding if Screen handles it
const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '600' },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingText: { marginLeft: 8, color: '#555' },
  errorText: { color: 'red', marginBottom: 8 },
  listContent: { paddingTop: 4, paddingBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '500', marginBottom: 4 },
  cardDescription: { color: '#555', marginBottom: 8, fontSize: 14 },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardMeta: { color: '#777', fontSize: 12 },
  cardDot: { marginHorizontal: 6, color: '#ccc' },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#666' },
});
