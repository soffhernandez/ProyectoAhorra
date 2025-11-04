import { useState } from "react"
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

// COMPONENTE: Modal para Agregar/Editar Transacción
// NOTA: Este modal solo muestra la interfaz pero NO guarda transacciones
const ModalTransaccion = ({ visible, onClose }) => {
  // Lista de categorías disponibles para clasificar transacciones
  const categorias = ["Sueldo", "Freelance", "Inversiones", "Otros"]

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      {/* Fondo oscuro semitransparente */}
      <View style={styles.modalOverlay}>
        {/* Contenedor principal del modal */}
        <View style={styles.card}>
          {/* HEADER DEL MODAL: Título y botón de cerrar */}
          <View style={[styles.row, { padding: 20, borderBottomWidth: 1, borderBottomColor: "#cfe3ff" }]}>
            <Text style={[styles.text, styles.bold, { fontSize: 22, color: "#007bff" }]}>Nueva Transacción</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#007bff" />
            </TouchableOpacity>
          </View>

          {/* CONTENIDO DEL MODAL: Formulario scrolleable */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              {/* CAMPO: Monto de la transacción */}
              <View style={[styles.btn, { backgroundColor: "#4da6ff", paddingVertical: 18 }]}>
                <Text style={[styles.text, styles.bold, { fontSize: 28, color: "#fff" }]}>$</Text>
                <Text style={[styles.text, styles.bold, { fontSize: 36, color: "#fff", marginLeft: 5 }]}>0.00</Text>
              </View>

              {/* CAMPO: Selector de tipo (Ingreso o Gasto) */}
              <Text
                style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}
              >
                Tipo de transacción
              </Text>
              <View style={styles.row}>
                {/* Botón Ingreso (activo por defecto) */}
                <View style={[styles.btn, styles.btnActive, { flex: 1 }]}>
                  <Ionicons name="arrow-down" size={22} color="#fff" />
                  <Text style={[styles.text, styles.bold, { fontSize: 15, color: "#fff" }]}>Ingreso</Text>
                </View>

                {/* Botón Gasto */}
                <View style={[styles.btn, { flex: 1, backgroundColor: "#f0f6ff", borderColor: "#cfe3ff" }]}>
                  <Ionicons name="arrow-up" size={22} color="#4da6ff" />
                  <Text style={[styles.text, styles.bold, { fontSize: 15, color: "#4da6ff" }]}>Gasto</Text>
                </View>
              </View>

              {/* CAMPO: Selector de categoría */}
              <Text
                style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}
              >
                Categoría
              </Text>

              {/* categorias */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                {categorias.map((cat) => (
                  <View key={cat} style={styles.chip}>
                    <Text style={[styles.text, styles.bold, { fontSize: 14, color: "#4da6ff" }]}>{cat}</Text>
                  </View>
                ))}
              </View>

              {/* CAMPO: Selector de fecha */}
              <Text
                style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}
              >
                Fecha
              </Text>
              <View style={styles.input}>
                <Ionicons name="calendar-outline" size={20} color="#4da6ff" />
                <Text style={[styles.text, { fontSize: 15, fontWeight: "600", color: "#333" }]}>
                  31 de octubre, 2025
                </Text>
              </View>

              {/* CAMPO: Área de texto para descripción */}
              <Text
                style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}
              >
                Descripción
              </Text>
              <View style={[styles.input, { minHeight: 100, alignItems: "flex-start" }]}>
                <Text style={[styles.text, { fontSize: 15, color: "#99bde9" }]}>Agregar descripción...</Text>
              </View>
            </View>
          </ScrollView>

          {/* FOOTER DEL MODAL: Botones de acción */}
          <View style={[styles.row, { padding: 20, borderTopWidth: 1, borderTopColor: "#cfe3ff" }]}>
            {/* Botón Cancelar */}
            <TouchableOpacity
              style={[styles.btn, { flex: 1, backgroundColor: "#f0f6ff", paddingVertical: 14, borderColor: "#cfe3ff" }]}
              onPress={onClose}
            >
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#4da6ff" }]}>Cancelar</Text>
            </TouchableOpacity>
            {/* Botón Guardar - DESHABILITADO: Solo cierra el modal sin guardar */}
            <TouchableOpacity
              style={[styles.btn, styles.btnActive, { flex: 1, paddingVertical: 14 }]}
              onPress={onClose}
            >
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#fff" }]}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Muestra el resumen financiero y el historial de transacciones
export default function IngresosScreen() {
  // Estado para controlar la visibilidad del modal
  const [modalTransaccion, setModalTransaccion] = useState(false)

  // Datos de ejemplo para las transacciones
  const transaccionesEjemplo = [
    {
      id: "1",
      descripcion: "Salario mensual",
      monto: 3500.0,
      tipo: "Ingreso",
      categoria: "Sueldo",
      fecha: "20 de sep. 2025",
    },
    {
      id: "2",
      descripcion: "Compras del supermercado",
      monto: 450.0,
      tipo: "Gasto",
      categoria: "Alimentación",
      fecha: "4 de oct. 2025",
    },
    { id: "3", descripcion: "Gasolina", monto: 120.0, tipo: "Gasto", categoria: "Transporte", fecha: "9 de oct. 2025" },
    {
      id: "4",
      descripcion: "Proyecto freelance",
      monto: 500.0,
      tipo: "Ingreso",
      categoria: "Otros",
      fecha: "14 de oct. 2025",
    },
    {
      id: "5",
      descripcion: "Cine y cena",
      monto: 80.0,
      tipo: "Gasto",
      categoria: "Entretenimiento",
      fecha: "21 de oct. 2025",
    },
  ]

  return (
    <View style={styles.container}>
      {/* Fondo degradado de la pantalla */}
      <LinearGradient colors={["#e9f4ff", "#e9f4ff"]} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ========== SECCIÓN: Header con botón de regreso ========== */}
          <View
            style={[
              styles.row,
              { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: "#4da6ff" },
            ]}
          >
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.text, styles.bold, { fontSize: 22, color: "#fff" }]}>Ingresos</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* ========== SECCIÓN: Tarjetas de Resumen Financiero ========== */}
          {/* Muestra Balance Total, Total Ingresos y Total Gastos */}
          <View style={styles.row}>
            {/* Tarjeta: Balance Total */}
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Balance Total</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#007bff" }]}>$3,350.00</Text>
            </View>
            {/* Tarjeta: Total Ingresos (verde) */}
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Total Ingresos</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#00cc66" }]}>$4,000.00</Text>
            </View>
            {/* Tarjeta: Total Gastos (rojo) */}
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Total Gastos</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#ff4d4d" }]}>$650.00</Text>
            </View>
          </View>

          {/* ========== SECCIÓN: Botón para Agregar Transacción ========== */}
          <View style={styles.card}>
            <Text style={[styles.text, styles.bold, { fontSize: 18, marginBottom: 4, color: "#007bff" }]}>
              Transacciones
            </Text>
            <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 20 }]}>
              Registra tus ingresos y gastos
            </Text>

            {/* Botón que abre el modal (sin funcionalidad de guardado) */}
            <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={() => setModalTransaccion(true)}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#fff" }]}>Agregar Transacción</Text>
            </TouchableOpacity>
          </View>

          {/* ========== SECCIÓN: Historial de Transacciones ========== */}
          <View style={styles.card}>
            <Text style={[styles.text, styles.bold, { fontSize: 18, marginBottom: 4, color: "#007bff" }]}>
              Historial de Transacciones
            </Text>
            <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 20 }]}>
              5 transacciones registradas
            </Text>

            {/* Lista de transacciones */}
            <FlatList
              data={transaccionesEjemplo}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  {/* Icono de tipo de transacción (flecha arriba/abajo) */}
                  <View style={styles.icon}>
                    {item.tipo === "Ingreso" ? (
                      <Ionicons name="arrow-down" size={22} color="#00cc66" />
                    ) : (
                      <Ionicons name="arrow-up" size={22} color="#ff4d4d" />
                    )}
                  </View>
                  {/* Información de la transacción */}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.text, styles.bold, { fontSize: 16, marginBottom: 4, color: "#007bff" }]}>
                      {item.descripcion}
                    </Text>
                    <Text style={[styles.text, { fontSize: 13, color: "#4da6ff" }]}>
                      {item.fecha} · {item.categoria}
                    </Text>
                    {/* Badge de tipo (Ingreso/Gasto) */}
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: item.tipo === "Ingreso" ? "#e1f7ee" : "#ffecec", marginTop: 6 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          styles.bold,
                          { fontSize: 12, color: item.tipo === "Ingreso" ? "#00cc66" : "#ff4d4d" },
                        ]}
                      >
                        {item.tipo}
                      </Text>
                    </View>
                  </View>
                  {/* Monto y botones de acción */}
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={[
                        styles.text,
                        styles.bold,
                        { fontSize: 17, marginBottom: 6, color: item.tipo === "Ingreso" ? "#00cc66" : "#ff4d4d" },
                      ]}
                    >
                      {item.tipo === "Ingreso" ? "+" : "-"}${item.monto.toLocaleString("es-MX")}
                    </Text>
                    {/* Botones de editar y eliminar */}
                    <View style={styles.row}>
                      <TouchableOpacity style={{ marginLeft: 12 }}>
                        <Ionicons name="pencil" size={18} color="#007bff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 12 }}>
                        <Ionicons name="trash" size={18} color="#ff4d4d" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>

          {/* Espacio al final para evitar que el contenido quede detrás de la navegación */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>

      {/* Barra de navegación con 4 opciones principales */}
      <View style={styles.nav}>
        {/* Tab: Inicio (activo) */}
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={26} color="#007bff" />
          <Text style={[styles.text, styles.bold, { fontSize: 12, color: "#007bff", marginTop: 4 }]}>Inicio</Text>
        </TouchableOpacity>

        {/* Tab: Transacciones */}
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="swap-horizontal-outline" size={26} color="#4da6ff" />
          <Text style={[styles.text, { fontSize: 12, color: "#4da6ff", marginTop: 4, fontWeight: "600" }]}>
            Transacciones
          </Text>
        </TouchableOpacity>

        {/* Tab: Presupuesto */}
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="wallet-outline" size={26} color="#4da6ff" />
          <Text style={[styles.text, { fontSize: 12, color: "#4da6ff", marginTop: 4, fontWeight: "600" }]}>
            Presupuesto
          </Text>
        </TouchableOpacity>

        {/* Tab: Gráficas */}
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart" size={26} color="#4da6ff" />
          <Text style={[styles.text, { fontSize: 12, color: "#4da6ff", marginTop: 4, fontWeight: "600" }]}>
            Gráficas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de transacción (solo muestra la interfaz, no guarda datos) */}
      <ModalTransaccion visible={modalTransaccion} onClose={() => setModalTransaccion(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  // Contenedor principal que ocupa toda la pantalla
  container: {
    flex: 1,
    backgroundColor: "#e9f4ff",
    width: "100%",
    height: "100%",
  },
  // Layout horizontal con elementos espaciados y centrados
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 10,
  },
  // Sección con padding para contenido del modal
  section: {
    padding: 20,
  },
  // Estilo base para todo el texto
  text: {
    color: "#333",
  },
  // Modificador para texto en negrita
  bold: {
    fontWeight: "700",
  },
  // Tarjeta grande con sombra (usada para secciones principales)
  card: {
    backgroundColor: "#f5f8ff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  // Tarjeta pequeña para resumen financiero (Balance, Ingresos, Gastos)
  cardSmall: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  // Botón base (gris claro con borde)
  btn: {
    backgroundColor: "#f0f6ff",
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#cfe3ff",
  },
  // Modificador para botón activo (azul)
  btnActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  // Campo de entrada de texto con icono
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cfe3ff",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // Chip para categorías (píldora redondeada)
  chip: {
    backgroundColor: "#f0f6ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  // Item de transacción en el historial
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  // Icono circular para tipo de transacción
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e9f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  // Badge pequeño para etiquetas (Ingreso/Gasto)
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  // Barra de navegación inferior
  nav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#cfe3ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  // Item individual de la navegación
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Fondo oscuro del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(77,166,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
})
