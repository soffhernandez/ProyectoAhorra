import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const transactions = [
  { id: 1, title: 'Comida', description: 'Comida en el restaurante', date: '20 de octubre 2025', amount: -120 },
  { id: 2, title: 'Comida', description: 'Comida en el restaurante', date: '20 de octubre 2025', amount: -120 },
  { id: 3, title: 'Comida', description: 'Comida en el restaurante', date: '20 de octubre 2025', amount: -120 },
  { id: 4, title: 'Comida', description: 'Comida en el restaurante', date: '20 de octubre 2025', amount: -120 },
  { id: 5, title: 'Comida', description: 'Comida en el restaurante', date: '20 de octubre 2025', amount: -120 },
];

export default function TransactionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transacciones</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="calendar-outline" size={18} color="#333" />
          <Text style={styles.filterText}>25 Oct 2025</Text>
          <Ionicons name="chevron-down" size={16} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Categoría</Text>
          <Ionicons name="chevron-down" size={16} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {transactions.map(item => (
          <View key={item.id} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>
                {item.description + '\n' + item.date}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>-${Math.abs(item.amount)}</Text>
              <Ionicons name="ellipsis-vertical" size={18} color="#555" />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="home-outline" size={22} color="#007aff" />
          <Text style={styles.bottomText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButtonActive}>
          <Ionicons name="swap-horizontal-outline" size={25} color="#007aff" />
          <Text style={styles.bottomText}>Transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="wallet-outline" size={22} color="#007aff" />
          <Text style={styles.bottomText}>Presupuesto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="bar-chart-outline" size={22} color="#007aff" />
          <Text style={styles.bottomText}>Gráficas</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>Nueva{'\n'}transacciones</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f4ff' },
  header: {
    backgroundColor: '#00aaff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
  filterText: { 
    backgroundColor: '#fff',
    marginHorizontal: 4,
    color: '#333' 
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { color: '#666', fontSize: 13, marginTop: 2 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { color: 'red', fontWeight: 'bold', fontSize: 16 },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },

  bottomButton: { alignItems: 'center' },
  bottomButtonActive: { alignItems: 'center' },
  bottomText: { fontSize: 12, color: '#007aff', marginTop: 2 },
  fab: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    backgroundColor: '#b3ecff',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  fabText: { color: '#007aff', fontWeight: 'bold', textAlign: 'center' },
});
