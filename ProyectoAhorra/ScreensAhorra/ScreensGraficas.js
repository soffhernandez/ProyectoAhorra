import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PieChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Graficas() {
  const navigation = useNavigation();

  const ingresosCategorias = [
    { name: "Salario", population: 60, color: "#00cc66", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Freelance", population: 25, color: "#4da6ff", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Inversiones", population: 15, color: "#00b3b3", legendFontColor: "#333", legendFontSize: 13 },
  ];

  const egresosCategorias = [
    { name: "Renta", population: 40, color: "#ff6666", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Transporte", population: 30, color: "#ff9966", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Alimentos", population: 30, color: "#ff4d4d", legendFontColor: "#333", legendFontSize: 13 },
  ];

  const mensual = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      { data: [100, 120, 140, 130, 150], color: () => "#00cc66" },
      { data: [60, 80, 90, 110, 120], color: () => "#ff4d4d" },
    ],
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Gráficas</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
          <Ionicons name="person-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* RESUMEN */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: "#f0fff5" }]}>
            <Ionicons name="trending-up-outline" size={22} color="#00cc66" />
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={[styles.summaryValue, { color: "#00cc66" }]}>$6,500</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: "#fff5f5" }]}>
            <Ionicons name="trending-down-outline" size={22} color="#ff4d4d" />
            <Text style={styles.summaryLabel}>Gastos</Text>
            <Text style={[styles.summaryValue, { color: "#ff4d4d" }]}>$1,700</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: "#f5f8ff" }]}>
            <Ionicons name="cash-outline" size={22} color="#4da6ff" />
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={[styles.summaryValue, { color: "#4da6ff" }]}>$4,800</Text>
          </View>
        </View>

        {/* INGRESOS PIE */}
        <Text style={styles.sectionTitle}>Ingresos por categoría</Text>
        <PieChart
          data={ingresosCategorias}
          width={screenWidth * 0.9}
          height={200}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
        />

        {/* EGRESOS PIE */}
        <Text style={styles.sectionTitle}>Gastos por categoría</Text>
        <PieChart
          data={egresosCategorias}
          width={screenWidth * 0.9}
          height={200}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
        />

        {/* LÍNEA */}
        <Text style={styles.sectionTitle}>Ingresos vs Gastos por mes</Text>
        <LineChart
          data={mensual}
          width={screenWidth * 0.9}
          height={250}
          chartConfig={chartConfig}
          bezier
        />

      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => "#004080",
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#004080",
  },
  propsForLabels: {
    fontSize: 12,
    fill: "#004080",
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e9f4ff" },
  header: {
    backgroundColor: "#4da6ff",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  greeting: { color: "#fff", fontSize: 22, fontWeight: "700" },
  scroll: { alignItems: "center", paddingBottom: 30 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "90%",
  },

  summaryBox: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
  },

  summaryLabel: { fontSize: 13, color: "#333" },
  summaryValue: { fontSize: 17, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004080",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
});
