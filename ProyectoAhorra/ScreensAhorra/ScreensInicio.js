import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Usuario</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="person-outline" size={28} color="#fff" />
        </View>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Saldo Disponible */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          <Text style={styles.balanceAmount}>$6000.00</Text>
        </View>

        {/* Tu mes de un vistazo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tu mes de un vistazo</Text>
          <View style={styles.graphRow}>
            <Ionicons name="pie-chart-outline" size={48} color="#ff8c00" />
            <Ionicons name="bar-chart-outline" size={48} color="#ff3366" />
          </View>
          <Text style={styles.link}>Ver Gráficas completas</Text>
        </View>

        {/* Tu presupuesto */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tu presupuesto</Text>
          <View style={styles.budgetRow}>
            <Ionicons name="warning-outline" size={22} color="#ff4444" />
            <Text style={styles.alertText}>¡Presupuesto excedido!</Text>
          </View>
          <Text style={styles.link}>Gestionar presupuesto</Text>
        </View>

        {/* Movimientos recientes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Movimientos recientes</Text>
          <Text style={styles.transaction}>Compra del supermercado - $56.00</Text>
          <Text style={styles.transaction}>Gym - $476.00</Text>
          <Text style={styles.transaction}>Café - $10.00</Text>
          <Text style={styles.link}>Gestionar transacciones</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9efff",
    width: "100%",
    height: "100%",

  },
  header: {
    backgroundColor: "#4da6ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "100%",
    elevation: 3,
  },
  greeting: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    width: "100%",
  },
  balanceCard: {
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
    width: "100%",
    marginTop: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#555",
  },
  balanceAmount: {
    fontSize: 36,
    color: "#005cff",
    fontWeight: "bold",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
    elevation: 3,
    width: "100%",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  graphRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 8,
    width: "100%",
  },
  link: {
    color: "#007bff",
    fontWeight: "500",
    marginTop: 10,
    textAlign: "right",
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertText: {
    color: "#ff3b3b",
    fontWeight: "700",
    marginLeft: 5,
  },
  transaction: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    elevation: 5,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontSize: 13,
    color: "#007bff",
    marginTop: 3,
    fontWeight: "500",
  },
});
