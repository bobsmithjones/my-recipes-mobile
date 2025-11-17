// app/(app)/pantry/index.tsx
import React, { useState } from 'react';
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type PantryItem = {
  id: number;
  name: string;
  quantity?: string;
};

export default function PantryScreen() {
  const [items, setItems] = useState<PantryItem[]>([
    { id: 1, name: 'Garlic', quantity: '3 cloves' },
    { id: 2, name: 'Butter', quantity: '1 stick' },
    { id: 3, name: 'Chicken thighs', quantity: '2 lbs' },
  ]);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const addItem = () => {
    if (!name.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        quantity: quantity.trim() || undefined,
      },
    ]);
    setName('');
    setQuantity('');
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantry</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Ingredient name (e.g. Garlic)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (optional, e.g. 2 cups)"
          value={quantity}
          onChangeText={setQuantity}
        />
        <Button title="Add to Pantry" onPress={addItem} />
      </View>

      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>No items yet. Add something above.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemText}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.quantity ? (
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 12 },
  form: { marginBottom: 16, gap: 8 } as any,
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  list: { flex: 1 },
  empty: { textAlign: 'center', marginTop: 24, color: '#666' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  itemText: { flexShrink: 1 },
  itemName: { fontSize: 16 },
  itemQuantity: { color: '#666', fontSize: 12 },
  remove: { color: 'red', fontSize: 13 },
});
