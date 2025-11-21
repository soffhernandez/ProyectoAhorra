import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Graficas() {
  return (
    <View style={styles.container}>
       <View style={styles.header}>
          <Text style={styles.greeting}>Graficas</Text>
            <View style={styles.headerIcons}>
              <Ionicons name="person-outline" size={28} color="#fff" />
            </View>
         </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} alwaysBounceVertical={true}>
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
        <Text style={styles.sectionTitle}>Ingresos y Egresos por categoría</Text>

        <View style={styles.chartRow}>
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>Ingresos</Text>
            <View style={styles.fakeChartCircle} />
            <View style={styles.legend}>
              <View style={[styles.dot, { backgroundColor: "#00cc66" }]} />
              <Text style={styles.legendText}>Salario</Text>
              <View style={[styles.dot, { backgroundColor: "#4da6ff" }]} />
              <Text style={styles.legendText}>Freelance</Text>
              <View style={[styles.dot, { backgroundColor: "#00b3b3" }]} />
              <Text style={styles.legendText}>Inversiones</Text>
            </View>
          </View>

          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>Egresos</Text>
            <View style={[styles.fakeChartCircle, { backgroundColor: "#ffb3b3" }]} />
            <View style={styles.legend}>
              <View style={[styles.dot, { backgroundColor: "#ff6666" }]} />
              <Text style={styles.legendText}>Renta</Text>
              <View style={[styles.dot, { backgroundColor: "#ff9966" }]} />
              <Text style={styles.legendText}>Transporte</Text>
              <View style={[styles.dot, { backgroundColor: "#ff4d4d" }]} />
              <Text style={styles.legendText}>Alimentos</Text>
            </View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Ingresos y Egresos por mes</Text>

        <View style={styles.barBox}>
          <View style={styles.barLabels}>
            <Text style={styles.barLegendIncome}> Ingresos</Text>
            <Text style={styles.barLegendExpense}> Egresos</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fakeBars}
          >
            {[
              { mes: "Ene", ingreso: 100, gasto: 60 },
              { mes: "Feb", ingreso: 120, gasto: 80 },
              { mes: "Mar", ingreso: 140, gasto: 90 },
              { mes: "Abr", ingreso: 130, gasto: 110 },
              { mes: "May", ingreso: 150, gasto: 120 },
            ].map((item, index) => (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barPair}>
                  <View
                    style={[
                      styles.bar,
                      { height: item.ingreso, backgroundColor: "#00cc66" },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      { height: item.gasto, backgroundColor: "#ff4d4d" },
                    ]}
                  />
                </View>
                <Text style={styles.monthLabel}>{item.mes}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: "#e9f4ff", 
    width: "100%",
    height: "100%", },

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
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },

  scroll: {
    flexGrow: 1,
    paddingBottom: 30,
    justifyContent: "flex-start",
    alignItems: "center", 
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",        
    maxWidth: 380,       
    marginTop: 20,
    marginBottom: 25,
  },
  summaryBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 20,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: { fontSize: 13, color: "#333", marginTop: 5 },
  summaryValue: { fontSize: 16, fontWeight: "700", marginTop: 3 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#004080",
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: "5%",
  },

  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 30,
    width: "90%",
    maxWidth: 380,
  },
  chartBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 10,
    elevation: 3,
  },
  chartTitle: { fontSize: 15, fontWeight: "600", marginBottom: 10 },
  fakeChartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#b3e6b3",
    marginBottom: 10,
  },
  legend: { alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginVertical: 3 },
  legendText: { fontSize: 13, color: "#333" },

  barBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    marginBottom: 40,
    width: "90%",
    maxWidth: 380,
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  barLegendIncome: { color: "#00cc66", fontWeight: "600" },
  barLegendExpense: { color: "#ff4d4d", fontWeight: "600" },

  fakeBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  barColumn: { alignItems: "center", marginHorizontal: 10 },
  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  bar: { width: 18, borderRadius: 6, marginHorizontal: 3 },
  monthLabel: { fontSize: 13, color: "#333", marginTop: 5 },


  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 13, color: "#007bff", marginTop: 3, fontWeight: "500" },
  headerIcons: {
    flexDirection: "row",
  },
  greeting: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

});
