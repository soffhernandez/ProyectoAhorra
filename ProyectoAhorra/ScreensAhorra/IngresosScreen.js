"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

// ===============================
// MODAL PARA AGREGAR TRANSACCIÓN
// ===============================
const ModalTransaccion = ({ visible, onClose }) => {
  const categorias = ["Sueldo", "Freelance", "Inversiones", "Otros"]

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          <View style={[styles.row, { padding: 20, borderBottomWidth: 1, borderBottomColor: "#cfe3ff" }]}> 
            <Text style={[styles.text, styles.bold, { fontSize: 22, color: "#007bff" }]}>Nueva Transacción</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#007bff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              {/* Monto */}
              <View style={[styles.btn, { backgroundColor: "#4da6ff", paddingVertical: 18 }]}> 
                <Text style={[styles.text, styles.bold, { fontSize: 28, color: "#fff" }]}>$</Text>
                <Text style={[styles.text, styles.bold, { fontSize: 36, color: "#fff", marginLeft: 5 }]}>0.00</Text>
              </View>

              {/* Tipo */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Tipo de transacción</Text>
              <View style={styles.row}>
                <View style={[styles.btn, styles.btnActive, { flex: 1 }]}> 
                  <Ionicons name="arrow-down" size={22} color="#fff" />
                  <Text style={[styles.text, styles.bold, { fontSize: 15, color: "#fff" }]}>Ingreso</Text>
                </View>

                <View style={[styles.btn, { flex: 1, backgroundColor: "#f0f6ff", borderColor: "#cfe3ff" }]}> 
                  <Ionicons name="arrow-up" size={22} color="#4da6ff" />
                  <Text style={[styles.text, styles.bold, { fontSize: 15, color: "#4da6ff" }]}>Gasto</Text>
                </View>
              </View>

              {/* Categorías */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Categoría</Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                {categorias.map((cat) => (
                  <View key={cat} style={styles.chip}>
                    <Text style={[styles.text, styles.bold, { fontSize: 14, color: "#4da6ff" }]}>{cat}</Text>
                  </View>
                ))}
              </View>

              {/* Fecha */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Fecha</Text>
              <View style={styles.input}>
                <Ionicons name="calendar-outline" size={20} color="#4da6ff" />
                <Text style={[styles.text, { fontSize: 15, fontWeight: "600", color: "#333" }]}>31 de octubre, 2025</Text>
              </View>

              {/* Descripción */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Descripción</Text>
              <View style={[styles.input, { minHeight: 100, alignItems: "flex-start" }]}> 
                <Text style={[styles.text, { fontSize: 15, color: "#99bde9" }]}>Agregar descripción...</Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.row, { padding: 20, borderTopWidth: 1, borderTopColor: "#cfe3ff" }]}> 
            <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#f0f6ff", paddingVertical: 14, borderColor: "#cfe3ff" }]} onPress={onClose}>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#4da6ff" }]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnActive, { flex: 1, paddingVertical: 14 }]} onPress={onClose}>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#fff" }]}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// ===============================
// MODAL SIMPLE DE ACTUALIZAR (OPCION B)
// ===============================
const ModalActualizar = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Ionicons name="sync" size={36} color="#007bff" />
          </View>

          <Text style={[styles.text, styles.bold, { fontSize: 20, textAlign: "center", marginTop: 10, color: "#007bff" }]}>Actualizar</Text>

          <Text style={[styles.text, { textAlign: "center", marginTop: 10, paddingHorizontal: 20 }]}>¿Deseas actualizar esta información?</Text>

          <View style={[styles.row, { padding: 20, marginTop: 10 }]}> 
            <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#f0f6ff", marginRight: 8 }]} onPress={onClose}>
              <Text style={[styles.text, styles.bold, { color: "#4da6ff" }]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnActive, { flex: 1, marginLeft: 8 }]} onPress={onClose}>
              <Text style={[styles.text, styles.bold, { color: "#fff" }]}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// =====================================
// PANTALLA PRINCIPAL INGRESOS
// =====================================
export default function IngresosScreen() {
  const [modalTransaccion, setModalTransaccion] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [modalActualizar, setModalActualizar] = useState(false)
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null)

  const transaccionesEjemplo = [
    { id: "1", descripcion: "Salario mensual", monto: 3500, tipo: "Ingreso", categoria: "Sueldo", fecha: "20 de sep. 2025" },
    { id: "2", descripcion: "Compras del supermercado", monto: 450, tipo: "Gasto", categoria: "Alimentación", fecha: "4 de oct. 2025" },
    { id: "3", descripcion: "Gasolina", monto: 120, tipo: "Gasto", categoria: "Transporte", fecha: "9 de oct. 2025" },
    { id: "4", descripcion: "Proyecto freelance", monto: 500, tipo: "Ingreso", categoria: "Otros", fecha: "14 de oct. 2025" },
    { id: "5", descripcion: "Cine y cena", monto: 80, tipo: "Gasto", categoria: "Entretenimiento", fecha: "21 de oct. 2025" },
  ]

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#e9f4ff", "#e9f4ff"]} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.row, { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: "#4da6ff" }]}> 
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.text, styles.bold, { fontSize: 22, color: "#fff" }]}>Ingresos y Transacciones</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* TARJETAS */}
          <View style={styles.row}>
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Balance Total</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#007bff" }]}>$3,350.00</Text>
            </View>
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Total Ingresos</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#00cc66" }]}>$4,000.00</Text>
            </View>
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Total Gastos</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#ff4d4d" }]}>$650.00</Text>
            </View>
          </View>

          {/* BOTÓN AGREGAR */}
          <View style={styles.card}>
            <Text style={[styles.text, styles.bold, { fontSize: 18, marginBottom: 4, color: "#007bff" }]}>Transacciones</Text>
            <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 20 }]}>Registra tus ingresos y gastos</Text>

            <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={() => setModalTransaccion(true)}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#fff" }]}>Agregar Transacción</Text>
            </TouchableOpacity>

            {/* NUEVO BOTÓN: ACTUALIZAR (OPCION B) */}
            <TouchableOpacity style={[styles.btn, { marginTop: 12 }]} onPress={() => setModalActualizar(true)}>
              <Ionicons name="sync" size={22} color="#007bff" />
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#007bff" }]}>Actualizar</Text>
            </TouchableOpacity>
          </View>

          {/* HISTORIAL */}
          <View style={styles.card}>
            <Text style={[styles.text, styles.bold, { fontSize: 18, marginBottom: 4, color: "#007bff" }]}>Historial de Transacciones</Text>
            <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 20 }]}>{transaccionesEjemplo.length} transacciones registradas</Text>

            <FlatList
              data={transaccionesEjemplo}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.icon}>
                    {item.tipo === "Ingreso" ? (
                      <Ionicons name="arrow-down" size={22} color="#00cc66" />
                    ) : (
                      <Ionicons name="arrow-up" size={22} color="#ff4d4d" />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.text, styles.bold, { fontSize: 16, marginBottom: 4, color: "#007bff" }]}>{item.descripcion}</Text>
                    <Text style={[styles.text, { fontSize: 13, color: "#4da6ff" }]}>{item.fecha} · {item.categoria}</Text>

                    <View style={[styles.badge, { backgroundColor: item.tipo === "Ingreso" ? "#e1f7ee" : "#ffecec", marginTop: 6 }]}> 
                      <Text style={[styles.text, styles.bold, { fontSize: 12, color: item.tipo === "Ingreso" ? "#00cc66" : "#ff4d4d" }]}>{item.tipo}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.text, styles.bold, { fontSize: 17, marginBottom: 6, color: item.tipo === "Ingreso" ? "#00cc66" : "#ff4d4d" }]}>{item.tipo === "Ingreso" ? "+" : "-"}${item.monto}</Text>

                    {/* BOTONES */}
                    <View style={styles.row}>
                      <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => { setTransaccionSeleccionada(item); setModalEditar(true) }}>
                        <Ionicons name="pencil" size={18} color="#007bff" />
                      </TouchableOpacity>

                      <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => { setTransaccionSeleccionada(item); setModalEliminar(true) }}>
                        <Ionicons name="trash" size={18} color="#ff4d4d" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>

      {/* NAV BAR */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={26} color="#007bff" />
          <Text style={[styles.text, styles.bold, { fontSize: 12, color: "#007bff", marginTop: 4 }]}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="swap-horizontal-outline" size={26} color="#4da6ff" />
          <Text style={[styles.text, { fontSize: 12, color: "#4da6ff", marginTop: 4, fontWeight: "600" }]}>Transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="wallet-outline" size={26} color="#4da6ff" />
          <Text style={[styles.text, { fontSize: 12, color: "#4da6ff", marginTop: 4, fontWeight: "600" }]}>Presupuesto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart" size={26} color="#4da6ff" />
          <Text style={[styles.text, { fontSize: 12, color: "#4da6ff", marginTop: 4, fontWeight: "600" }]}>Gráficas</Text>
        </TouchableOpacity>
      </View>

      {/* MODALES */}
      <ModalTransaccion visible={modalTransaccion} onClose={() => setModalTransaccion(false)} />

      <Modal visible={modalEditar} transparent animationType="fade" onRequestClose={() => setModalEditar(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.card}>
            <View style={[styles.row, { padding: 20, borderBottomWidth: 1, borderBottomColor: "#cfe3ff" }]}> 
              <Text style={[styles.text, styles.bold, { fontSize: 22, color: "#007bff" }]}>Editar Transacción</Text>
              <TouchableOpacity onPress={() => setModalEditar(false)}>
                <Ionicons name="close" size={28} color="#007bff" />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
              <Text style={[styles.text, { fontSize: 16, marginBottom: 15 }]}>Aquí podrás editar esta transacción más adelante.</Text>

              <Text style={[styles.text, styles.bold, { fontSize: 17, color: "#007bff" }]}>{transaccionSeleccionada?.descripcion}</Text>
              <Text style={[styles.text, { marginTop: 6, color: "#4da6ff" }]}>{transaccionSeleccionada?.fecha} · {transaccionSeleccionada?.categoria}</Text>
              <Text style={[styles.text, styles.bold, { marginTop: 10, fontSize: 20, color: transaccionSeleccionada?.tipo === "Ingreso" ? "#00cc66" : "#ff4d4d" }]}>${transaccionSeleccionada?.monto}</Text>

              <TouchableOpacity style={[styles.btn, styles.btnActive, { marginTop: 25 }]} onPress={() => setModalEditar(false)}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={[styles.text, styles.bold, { color: "#fff" }]}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalEliminar} transparent animationType="fade" onRequestClose={() => setModalEliminar(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.card}>
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Ionicons name="trash" size={40} color="#ff4d4d" />
            </View>

            <Text style={[styles.text, styles.bold, { fontSize: 22, textAlign: "center", marginTop: 10, color: "#ff4d4d" }]}>Eliminar Transacción</Text>

            <Text style={[styles.text, { textAlign: "center", marginTop: 10, paddingHorizontal: 20 }]}>¿Seguro que deseas eliminar esta transacción? Esta acción no se puede deshacer.</Text>

            <View style={[styles.row, { padding: 20 }]}> 
              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#f0f6ff", marginRight: 8 }]} onPress={() => setModalEliminar(false)}>
                <Text style={[styles.text, styles.bold, { color: "#4da6ff" }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#ff4d4d", borderColor: "#ff4d4d", marginLeft: 8 }]} onPress={() => setModalEliminar(false)}>
                <Text style={[styles.text, styles.bold, { color: "#fff" }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: ACTUALIZAR (SIMPLE) */}
      <ModalActualizar visible={modalActualizar} onClose={() => setModalActualizar(false)} />

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e9f4ff", width: "100%", height: "100%" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, marginBottom: 20, gap: 10 },
  section: { padding: 20 },
  text: { color: "#333" },
  bold: { fontWeight: "700" },
  card: { backgroundColor: "#f5f8ff", marginHorizontal: 15, marginBottom: 15, borderRadius: 12, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: "#cfe3ff" },
  cardSmall: { backgroundColor: "#fff", padding: 14, borderRadius: 10, alignItems: "center", flex: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: "#cfe3ff" },
  btn: { backgroundColor: "#f0f6ff", paddingVertical: 16, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 2, borderColor: "#cfe3ff" },
  btnActive: { backgroundColor: "#007bff", borderColor: "#007bff" },
  input: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#cfe3ff", borderRadius: 8, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  chip: { backgroundColor: "#f0f6ff", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: "#cfe3ff" },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#cfe3ff" },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#e9f4ff", justifyContent: "center", alignItems: "center", marginRight: 12 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  nav: { flexDirection: "row", backgroundColor: "#fff", paddingVertical: 10, paddingBottom: 20, borderTopWidth: 1, borderTopColor: "#cfe3ff", shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 10 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(77,166,255,0.3)", justifyContent: "center", alignItems: "center", padding: 20 },
})
