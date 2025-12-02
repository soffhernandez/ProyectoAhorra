import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { Controlador } from "../controllers/UsuarioController";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const screenWidth = Dimensions.get("window").width;
const controlador = new Controlador();

export default function Graficas() {
  const navigation = useNavigation();

  const [ingresosCategorias, setIngresosCategorias] = useState([]);
  const [egresosCategorias, setEgresosCategorias] = useState([]);
  const [mensual, setMensual] = useState(null);

  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0, balance: 0 });

  useFocusEffect(
  useCallback(() => {
    inicializar(); 
  }, [])
);

  const inicializar = async () => {
    await controlador.initialize();    
    await cargarDatos();
  };

  const cargarDatos = async () => {
    const transacciones = await controlador.obtenerTransacciones();

    const categoriasIngresos = {};
    const categoriasGastos = {};

    const ingresosMes = {};
    const gastosMes = {};

    let totalIngresos = 0;
    let totalGastos = 0;

    transacciones.forEach(t => {
      // ------ PIE CHART CATEGORÍAS ------
      if (t.ingresos > 0) {
        categoriasIngresos[t.categoria] = (categoriasIngresos[t.categoria] || 0) + t.ingresos;
        totalIngresos += t.ingresos;
      }

      if (t.gastos > 0) {
        categoriasGastos[t.categoria] = (categoriasGastos[t.categoria] || 0) + t.gastos;
        totalGastos += t.gastos;
      }

      // ------ LÍNEA MENSUAL ------
      const mes = t.fecha.slice(5, 7); // Ej: "2025-01-13" → "01"

      ingresosMes[mes] = (ingresosMes[mes] || 0) + t.ingresos;
      gastosMes[mes] = (gastosMes[mes] || 0) + t.gastos;
    });

    // -------- DATOS CATEGORÍAS --------
    setIngresosCategorias(
      Object.keys(categoriasIngresos).map((cat, i) => ({
        name: cat,
        population: categoriasIngresos[cat],
        color: coloresIngresos[i % coloresIngresos.length],
        legendFontColor: "#333",
        legendFontSize: 13,
      }))
    );

    setEgresosCategorias(
      Object.keys(categoriasGastos).map((cat, i) => ({
        name: cat,
        population: categoriasGastos[cat],
        color: coloresGastos[i % coloresGastos.length],
        legendFontColor: "#333",
        legendFontSize: 13,
      }))
    );

    // -------- DATOS MENSUALES --------
    const meses = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    const etiquetas = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

    setMensual({
      labels: etiquetas,
      datasets: [
        { data: meses.map(m => ingresosMes[m] || 0), color: () => "#00cc66" },
        { data: meses.map(m => gastosMes[m] || 0), color: () => "#ff4d4d" },
      ]
    });

    // -------- RESUMEN --------
    setResumen({
      ingresos: totalIngresos,
      gastos: totalGastos,
      balance: totalIngresos - totalGastos,
    });
  };

  if (!mensual) return <Text style={{ margin: 20 }}>Cargando gráficas...</Text>;

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
            <Text style={[styles.summaryValue, { color: "#00cc66" }]}>${resumen.ingresos}</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: "#fff5f5" }]}>
            <Ionicons name="trending-down-outline" size={22} color="#ff4d4d" />
            <Text style={styles.summaryLabel}>Gastos</Text>
            <Text style={[styles.summaryValue, { color: "#ff4d4d" }]}>${resumen.gastos}</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: "#f5f8ff" }]}>
            <Ionicons name="cash-outline" size={22} color="#4da6ff" />
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={[styles.summaryValue, { color: "#4da6ff" }]}>${resumen.balance}</Text>
          </View>
        </View>

        {/* PIE: INGRESOS */}
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

        {/* PIE: GASTOS */}
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

const coloresIngresos = ["#00cc66", "#4da6ff", "#00b3b3", "#33cc33"];
const coloresGastos = ["#ff4d4d", "#ff9966", "#ff6666", "#cc0000"];

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
