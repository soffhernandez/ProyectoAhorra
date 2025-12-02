  import React, { useState, useCallback } from "react";
  import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  import { PieChart } from "react-native-chart-kit";
  import { Controlador } from "../controllers/UsuarioController";
  import { useFocusEffect } from "@react-navigation/native";

  export default function App({ navigation }) {
    const [ingresos, setIngresos] = useState(0);
    const [gastos, setGastos] = useState(0);
    const [saldo, setSaldo] = useState(0);
    const [recientes, setRecientes] = useState([]);

    useFocusEffect(
      useCallback(() => {
        cargarDatos();
      }, [])
    );

    const cargarDatos = async () => {
      try {
        const controlador = new Controlador();
        await controlador.initialize();

        const transacciones = await controlador.obtenerTransacciones();

        let totalIngresos = 0;
        let totalGastos = 0;

        transacciones.forEach(t => {
          totalIngresos += Number(t.ingresos || 0);
          totalGastos += Number(t.gastos || 0);
        });

        setIngresos(totalIngresos);
        setGastos(totalGastos);
        setSaldo(totalIngresos - totalGastos);

        // 👇 Obtener las 3 transacciones más recientes
        const recientesFiltradas = [...transacciones]
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 3);

        setRecientes(recientesFiltradas);

      } catch (error) {
        console.log("Error al cargar gráfica:", error);
      }
    };

    const data = [
      {
        name: "Ingresos",
        amount: ingresos,
        color: "#4CAF50",
        legendFontColor: "#333",
        legendFontSize: 14
      },
      {
        name: "Gastos",
        amount: gastos,
        color: "#FF5252",
        legendFontColor: "#333",
        legendFontSize: 14
      }
    ];

    return (
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Usuario</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
            <Ionicons name="person-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>

          {/* SALDO */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo Disponible</Text>
            <Text style={[styles.balanceAmount, { color: saldo >= 0 ? "#005cff" : "#ff3b3b" }]}>
              ${saldo.toFixed(2)}
            </Text>
          </View>

          {/* GRAFICA */}
          {/* GRAFICA */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Tu mes de un vistazo</Text>

  <PieChart
    data={data}
    width={Dimensions.get("window").width - 60}
    height={180}
    chartConfig={{
      backgroundColor: "#fff",
      color: () => `#000`,
    }}
    accessor="amount"
    backgroundColor="transparent"
    paddingLeft="20"
    absolute
  />

  <TouchableOpacity onPress={() => navigation.navigate("Gráficas")}>
    <Text style={styles.link}>Ver gráficas completas</Text>
  </TouchableOpacity>
</View>

{/* PRESUPUESTO */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Tu presupuesto</Text>
  <View style={styles.budgetRow}>
    <Ionicons name="warning-outline" size={22} color="#ff4444" />
    <Text style={styles.alertText}>¡Presupuesto excedido!</Text>
  </View>

  <TouchableOpacity onPress={() => navigation.navigate("Presupuesto")}>
    <Text style={styles.link}>Gestionar presupuesto</Text>
  </TouchableOpacity>
</View>

{/* MOVIMIENTOS */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Movimientos recientes</Text>

  {recientes.length === 0 ? (
    <Text style={styles.transaction}>No hay transacciones aún.</Text>
  ) : (
    recientes.map((t, index) => (
      <Text key={index} style={styles.transaction}>
        {t.descripcion} - ${Number(t.ingresos || t.gastos).toFixed(2)}
      </Text>
    ))
  )}

  <TouchableOpacity onPress={() => navigation.navigate("Transacciones")}>
    <Text style={styles.link}>Gestionar transacciones</Text>
  </TouchableOpacity>
</View>


        </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#d9efff" },
    header: {
      backgroundColor: "#4da6ff",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    greeting: { color: "#fff", fontSize: 22, fontWeight: "700" },
    scrollViewContent: { paddingHorizontal: 20, paddingBottom: 150 },
    balanceCard: {
      backgroundColor: "#fff",
      paddingVertical: 25,
      borderRadius: 20,
      elevation: 3,
      alignItems: "center",
      marginTop: 20,
    },
    balanceLabel: { fontSize: 16, color: "#555" },
    balanceAmount: { fontSize: 36, fontWeight: "bold", marginTop: 8 },
    card: {
      backgroundColor: "#fff",
      padding: 18,
      borderRadius: 20,
      marginTop: 20,
      elevation: 3,
    },
    cardTitle: { fontSize: 17, fontWeight: "700", marginBottom: 10 },
    link: { color: "#007bff", marginTop: 10, textAlign: "right" },
    budgetRow: { flexDirection: "row", alignItems: "center" },
    alertText: { color: "#ff3b3b", fontWeight: "700", marginLeft: 5 },
    transaction: { fontSize: 15, marginBottom: 6 },
  });
