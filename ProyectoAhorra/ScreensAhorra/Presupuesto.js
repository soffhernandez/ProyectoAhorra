"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

const ProgressBar = ({ progreso, color }) => (
  <View style={styles.progressBar}>
    <View style={[styles.progressFill, { width: `${Math.min(progreso, 100)}%`, backgroundColor: color }]} />
  </View>
)

const CategoriaCard = ({ nombre, gastado, total, restante, progreso, icono, colorIcono }) => {
  const colorBarra = progreso > 95 ? "#ff4d4d" : progreso > 75 ? "#faad14" : "#00cc66"

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: "#4da6ff", borderWidth: 1, borderColor: "#cfe3ff", borderRadius: 12, padding: 15 },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.icono, { backgroundColor: colorIcono }]}>{icono}</View>
        <View style={styles.flex}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 2 }}>{nombre}</Text>
          <Text style={{ fontSize: 12, color: "#ffffff" }}>
            ${gastado.toLocaleString("es-MX")} de ${total.toLocaleString("es-MX")}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#ffffff", marginBottom: 5 }}>
            {Math.round(progreso)}%
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={{ padding: 4 }}>
              <Ionicons name="pencil" size={14} color="#4da6ff" />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 4 }}>
              <Ionicons name="trash" size={14} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ProgressBar progreso={progreso} color={colorBarra} />

      <Text style={{ fontSize: 12, color: "#ffffff", marginTop: 8 }}>
        Restante: ${restante.toLocaleString("es-MX")}
      </Text>
    </View>
  )
}

const ModalAgregarCategoria = ({ visible, onClose }) => {
  const [iconoSeleccionado, setIconoSeleccionado] = useState(0)
  const [nombre, setNombre] = useState("")
  const [presupuesto, setPresupuesto] = useState("")

  const iconos = [
    { id: 0, icono: "cart", color: "#4dd0e1" },
    { id: 1, icono: "home", color: "#ff8a80" },
    { id: 2, icono: "car", color: "#ff80ab" },
    { id: 3, icono: "fast-food", color: "#ffd54f" },
    { id: 4, icono: "fitness", color: "#ff5252" },
    { id: 5, icono: "airplane", color: "#4dd0e1" },
  ]

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Agregar Categoría</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Alimentos"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Presupuesto</Text>
            <View>
              <Text style={{ position: "absolute", left: 12, top: 14, fontSize: 14, color: "#666", zIndex: 1 }}>$</Text>
              <TextInput
                style={[styles.input, { paddingLeft: 30 }]}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={presupuesto}
                onChangeText={setPresupuesto}
              />
            </View>

            <Text style={styles.label}>Ícono</Text>
            <View style={styles.grid}>
              {iconos.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.iconoItem,
                    { backgroundColor: item.color + "20" },
                    iconoSeleccionado === item.id && styles.iconoSeleccionado,
                  ]}
                  onPress={() => setIconoSeleccionado(item.id)}
                >
                  <Ionicons name={item.icono} size={28} color={item.color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.botonCancelar} onPress={onClose}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#666" }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonAgregar} onPress={onClose}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const ModalAgregarGasto = ({ visible, onClose, categorias }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
  const [monto, setMonto] = useState("")

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Agregar Gasto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.grid}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, categoriaSeleccionada === cat.id && styles.chipActivo]}
                  onPress={() => setCategoriaSeleccionada(cat.id)}
                >
                  <Ionicons
                    name={cat.iconoNombre}
                    size={20}
                    color={categoriaSeleccionada === cat.id ? "#fff" : cat.iconoColor}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: categoriaSeleccionada === cat.id ? "#fff" : "#333",
                      marginLeft: 6,
                      fontWeight: "500",
                    }}
                  >
                    {cat.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Monto</Text>
            <View>
              <Text style={{ position: "absolute", left: 12, top: 14, fontSize: 14, color: "#666", zIndex: 1 }}>$</Text>
              <TextInput
                style={[styles.input, { paddingLeft: 30 }]}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={monto}
                onChangeText={setMonto}
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.botonCancelar} onPress={onClose}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#666" }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonAgregar} onPress={onClose}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default function PresupuestoMensualScreen() {
  const [modalCategoria, setModalCategoria] = useState(false)
  const [modalGasto, setModalGasto] = useState(false)

  const categorias = [
    {
      id: "1",
      nombre: "Alimentos",
      total: 5000,
      gastado: 4800,
      iconoNombre: "fast-food",
      iconoColor: "#ffd54f",
    },
    {
      id: "2",
      nombre: "Salud",
      total: 2500,
      gastado: 1000,
      iconoNombre: "fitness",
      iconoColor: "#ff5252",
    },
  ]

  const presupuestoTotal = 7500
  const gastado = 5800
  const restante = 1700
  const porcentajeUsado = 77

  const categoriasConCalculo = categorias.map((cat) => ({
    ...cat,
    restante: cat.total - cat.gastado,
    progreso: (cat.gastado / cat.total) * 100,
  }))

  return (
    <View style={styles.container}>
      <View style={styles.headerAzul}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Presupuesto mensual</Text>
      </View>

      <LinearGradient colors={["#e9f4ff", "#e9f4ff"]} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Tarjeta de Resumen */}
          <View style={[styles.resumen, { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#cfe3ff" }]}>
            <View style={styles.row}>
              <View style={styles.row}>
                <Ionicons name="wallet-outline" size={18} color="#007bff" />
                <Text style={{ color: "#333", fontSize: 12, marginLeft: 6, fontWeight: "500" }}>Presupuesto Total</Text>
              </View>
              <Text style={{ color: "#666", fontSize: 12 }}>Noviembre 2025</Text>
            </View>

            <Text style={[styles.montoPrincipal, { color: "#333" }]}>${presupuestoTotal.toLocaleString("es-MX")}</Text>
            <Text style={{ color: "#666", fontSize: 13, marginBottom: 15 }}>
              Gastado: ${gastado.toLocaleString("es-MX")}
            </Text>

            <View style={[styles.footer, { borderTopColor: "#e0e0e0" }]}>
              <View style={styles.row}>
                <Ionicons name="trending-up" size={16} color="#00cc66" />
                <Text style={{ color: "#333", fontSize: 13, fontWeight: "600", marginLeft: 6 }}>
                  Restante: ${restante.toLocaleString("es-MX")}
                </Text>
              </View>
              <Text style={{ color: "#666", fontSize: 12 }}>{porcentajeUsado}% usado</Text>
            </View>
          </View>

          {/* Alertas Activas */}
          <View style={[styles.contenedor, { backgroundColor: "#ffffff" }]}>
            <View style={styles.row}>
              <Ionicons name="warning-outline" size={18} color="#ff9800" />
              <Text style={[styles.subtitulo, { color: "#333" }]}>Alertas Activas</Text>
            </View>

            <View style={styles.alerta}>
              <Ionicons name="alert-circle" size={18} color="#ff4d4d" />
              <View style={styles.flex}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#e65100", marginBottom: 2 }}>Alimentos</Text>
                <Text style={{ fontSize: 12, color: "#f57c00" }}>Casi alcanzas tu límite</Text>
              </View>
            </View>
          </View>

          {/* Botones de Acción */}
          <View style={[styles.contenedor, { backgroundColor: "#ffffff" }]}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.botonSecundario} onPress={() => setModalCategoria(true)}>
                <Ionicons name="add" size={18} color="#000" />
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", marginLeft: 6 }}>Agregar Categoría</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botonPrimario} onPress={() => setModalGasto(true)}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#fff", marginLeft: 6 }}>Agregar Gasto</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.botonReiniciar}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={{ fontSize: 13, color: "#666", marginLeft: 6 }}>Reiniciar Mes</Text>
            </TouchableOpacity>
          </View>

          {/* Categorías */}
          <View style={[styles.contenedor, { backgroundColor: "#ffffff" }]}>
            <Text style={[styles.subtitulo, { color: "#333" }]}>Categorías ({categorias.length})</Text>

            {categoriasConCalculo.map((item) => (
              <CategoriaCard
                key={item.id}
                nombre={item.nombre}
                gastado={item.gastado}
                total={item.total}
                restante={item.restante}
                progreso={item.progreso}
                icono={<Ionicons name={item.iconoNombre} size={20} color={item.iconoColor} />}
                colorIcono={item.iconoColor + "30"}
              />
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>

      {/* Bottom Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#007bff" />
          <Text style={{ fontSize: 11, color: "#007bff", marginTop: 4, fontWeight: "500" }}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="swap-horizontal-outline" size={24} color="#007bff" />
          <Text style={{ fontSize: 11, color: "#007bff", marginTop: 4, fontWeight: "500" }}>Transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="wallet-outline" size={24} color="#007bff" />
          <Text style={{ fontSize: 11, color: "#007bff", marginTop: 4, fontWeight: "500" }}>Presupuesto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart" size={24} color="#007bff" />
          <Text style={{ fontSize: 11, color: "#007bff", marginTop: 4, fontWeight: "500" }}>Gráficas</Text>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <ModalAgregarCategoria visible={modalCategoria} onClose={() => setModalCategoria(false)} />

      <ModalAgregarGasto visible={modalGasto} onClose={() => setModalGasto(false)} categorias={categorias} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1,
     backgroundColor: "#e9f4ff",
     width: "100%",
    height: "100%",
     },
  gradient: { flex: 1 },
  headerAzul: {
    backgroundColor: "#4da6ff",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 15,
  },

  resumen: { margin: 20, padding: 20, borderRadius: 12, marginTop: 100 },
  montoPrincipal: { fontSize: 40, fontWeight: "bold", marginBottom: 5 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    borderTopWidth: 1,
  },

  contenedor: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  subtitulo: { fontSize: 15, fontWeight: "600", color: "#333", marginLeft: 8 },

  alerta: {
    flexDirection: "row",
    backgroundColor: "#fff3e0",
    borderLeftWidth: 3,
    borderLeftColor: "#ff9800",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    gap: 10,
  },

  botonSecundario: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f6ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  botonPrimario: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
  },
  botonReiniciar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginTop: 15,
  },

  card: { marginBottom: 20 },
  icono: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },

  progressBar: { height: 6, backgroundColor: "#f0f0f0", borderRadius: 3, marginTop: 8 },
  progressFill: { height: "100%", borderRadius: 3 },

  nav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: { flex: 1, alignItems: "center" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(77,166,255,0.3)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, maxHeight: "90%" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cfe3ff",
  },
  modalTitulo: { fontSize: 20, fontWeight: "600", color: "#007bff" },
  modalBody: { padding: 20 },
  modalFooter: { flexDirection: "row", padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: "#cfe3ff" },

  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cfe3ff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  iconoItem: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconoSeleccionado: { borderColor: "#4da6ff", backgroundColor: "#e3f2fd" },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f6ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#cfe3ff",
  },
  chipActivo: { backgroundColor: "#007bff", borderColor: "#007bff" },

  botonCancelar: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f6ff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  botonAgregar: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: "#007bff", alignItems: "center" },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  flex: { flex: 1, marginLeft: 12 },
})
