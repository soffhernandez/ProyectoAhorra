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
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icono, { backgroundColor: colorIcono }]}>{icono}</View>
        <View style={styles.flex}>
          <Text style={styles.catTitulo}>{nombre}</Text>
          <Text style={styles.catTexto}>${gastado.toLocaleString("es-MX")} de ${total.toLocaleString("es-MX")}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.catPorcentaje}>{Math.round(progreso)}%</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Ionicons name="pencil" size={14} color="#4da6ff" />
            <Ionicons name="trash" size={14} color="#ff4d4d" />
          </View>
        </View>
      </View>
      <ProgressBar progreso={progreso} color={colorBarra} />
      <Text style={styles.catRestante}>Restante: ${restante.toLocaleString("es-MX")}</Text>
    </View>
  )
}

export default function PresupuestoMensualScreen() {
  const [modalCategoria, setModalCategoria] = useState(false)
  const [modalGasto, setModalGasto] = useState(false)

  const categorias = [
    { id: "1", nombre: "Alimentos", total: 5000, gastado: 4800, iconoNombre: "fast-food", iconoColor: "#ffd54f" },
    { id: "2", nombre: "Salud", total: 2500, gastado: 1000, iconoNombre: "fitness", iconoColor: "#ff5252" },
  ]
  const presupuestoTotal = 7500, gastado = 5800, restante = 1700, porcentajeUsado = 77
  const categoriasConCalculo = categorias.map(c => ({ ...c, restante: c.total - c.gastado, progreso: (c.gastado / c.total) * 100 }))

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerAzul}>
        <Text style={styles.tituloHeader}>Presupuesto mensual</Text>
      </View>

      <LinearGradient colors={["#e9f4ff", "#e9f4ff"]} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.resumen}>
            <View style={styles.row}>
              <View style={styles.row}>
                <Ionicons name="wallet-outline" size={18} color="#007bff" />
                <Text style={styles.txtSecundario}>Presupuesto Total</Text>
              </View>
              <Text style={styles.txtSecundario}>Noviembre 2025</Text>
            </View>
            <Text style={styles.montoPrincipal}>${presupuestoTotal.toLocaleString("es-MX")}</Text>
            <Text style={styles.txtGray}>Gastado: ${gastado.toLocaleString("es-MX")}</Text>
            <View style={styles.footer}>
              <View style={styles.row}>
                <Ionicons name="trending-up" size={16} color="#00cc66" />
                <Text style={styles.txtRestante}>Restante: ${restante.toLocaleString("es-MX")}</Text>
              </View>
              <Text style={styles.txtGray}>{porcentajeUsado}% usado</Text>
            </View>
          </View>

          <View style={styles.contenedor}>
            <View style={styles.row}>
              <Ionicons name="warning-outline" size={18} color="#ff9800" />
              <Text style={styles.subtitulo}>Alertas Activas</Text>
            </View>
            <View style={styles.alerta}>
              <Ionicons name="alert-circle" size={18} color="#ff4d4d" />
              <View style={styles.flex}>
                <Text style={styles.alertTitulo}>Alimentos</Text>
                <Text style={styles.alertTxt}>Casi alcanzas tu límite</Text>
              </View>
            </View>
          </View>

          <View style={styles.contenedor}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.botonSecundario} onPress={() => setModalCategoria(true)}>
                <Ionicons name="add" size={18} color="#000" />
                <Text style={styles.btnTxtSec}>Agregar Categoría</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonPrimario} onPress={() => setModalGasto(true)}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.btnTxtPrim}>Agregar Gasto</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.botonReiniciar}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={styles.txtGray}>Reiniciar Mes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contenedor}>
            <Text style={styles.subtitulo}>Categorías ({categorias.length})</Text>
            {categoriasConCalculo.map(item => (
              <CategoriaCard
                key={item.id}
                {...item}
                icono={<Ionicons name={item.iconoNombre} size={20} color={item.iconoColor} />}
                colorIcono={item.iconoColor + "30"}
              />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

<<<<<<< Updated upstream
      {/* NAV */}
      <View style={styles.nav}>
        {[
          ["home-outline", "Inicio"],
          ["swap-horizontal-outline", "Transacciones"],
          ["wallet-outline", "Presupuesto"],
          ["stats-chart", "Gráficas"],
        ].map(([icon, label]) => (
          <TouchableOpacity key={label} style={styles.navItem}>
            <Ionicons name={icon} size={24} color="#007bff" />
            <Text style={styles.navTxt}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
=======
      {/* agregar/editar categoría */}
      {(modalTipo === 'addCategoria' || modalTipo === 'editCategoria') && (
        <FormModal
          visible={true}
          titulo={modalTipo === 'addCategoria' ? "Agregar Categoría" : "Editar Categoría"}
          onClose={cerrarModal}
          onSubmit={modalTipo === 'addCategoria' ? handleAgregarCategoria : handleGuardarEdicionCategoria}
          fields={[
            {
              label: "Nombre de la Categoría",
              placeholder: "Ej: Transporte",
              value: nombreCategoria,
              onChange: setNombreCategoria
            },
            {
              label: "Presupuesto",
              placeholder: "Ej: 3000",
              keyboardType: "numeric",
              value: totalCategoria,
              onChange: setTotalCategoria
            }
          ]}
        />
      )}

      {/* Agregar/Editar Gasto */}
      {(modalTipo === 'addGasto' || modalTipo === 'editGasto') && (
        <FormModal
          visible={true}
          titulo={modalTipo === 'addGasto' ? "Agregar Gasto" : "Editar Gasto"}
          onClose={cerrarModal}
          onSubmit={modalTipo === 'addGasto' ? handleAgregarGasto : handleGuardarEdicionGasto}
          fields={[
            {
              label: "Nombre del Gasto",
              placeholder: "Ej: Comida rápida",
              value: nombreGasto,
              onChange: setNombreGasto
            },
            {
              label: "Monto",
              placeholder: "Ej: 150",
              keyboardType: "numeric",
              value: montoGasto,
              onChange: setMontoGasto
            },
            {
              label: "Categoría",
              type: "picker",
              value: categoriaGasto,
              onChange: setCategoriaGasto,
              options: categorias
            }
          ]}
        />
      )}

      {/* Confirmar eliminar categoría */}
      {modalConfirm === 'deleteCategoria' && (
        <ConfirmModal
          visible={true}
          titulo="Eliminar Categoría"
          mensaje={`¿Estás seguro de que deseas eliminar la categoría "${itemSeleccionado?.nombre}"?`}
          advertencia="Esta acción no se puede deshacer."
          icono="trash-outline"
          isDelete={true}
          onClose={() => {
            setModalConfirm(null)
            setItemSeleccionado(null)
          }}
          onConfirm={handleConfirmarEliminarCategoria}
        />
      )}

      {/*Confirmar eliminar gasto */}
      {modalConfirm === 'deleteGasto' && (
        <ConfirmModal
          visible={true}
          titulo="Eliminar Gasto"
          mensaje={`¿Estás seguro de que deseas eliminar el gasto "${itemSeleccionado?.nombre}" de $${itemSeleccionado?.monto.toLocaleString("es-MX")}?`}
          advertencia="Esta acción no se puede deshacer."
          icono="trash-outline"
          isDelete={true}
          onClose={() => {
            setModalConfirm(null)
            setItemSeleccionado(null)
          }}
          onConfirm={handleConfirmarEliminarGasto}
        />
      )}

      {/* Modal: Confirmar Reiniciar Mes */}
      {modalConfirm === 'resetMes' && (
        <ConfirmModal
          visible={true}
          titulo="Reiniciar Mes"
          mensaje="¿Estás seguro de que deseas reiniciar el mes? Todos los gastos registrados se borrarán."
          advertencia="Esta acción no se puede deshacer."
          icono="refresh-outline"
          isDelete={false}
          onClose={() => setModalConfirm(null)}
          onConfirm={handleConfirmarReiniciar}
        />
      )}
>>>>>>> Stashed changes
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e0f4ff',
    width: '100%',
  },
  gradient: { flex: 1 },
  headerAzul: {
    backgroundColor: "#4da6ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 1000,
  },
  tituloHeader: { 
    fontSize: 20, 
    fontWeight: "600", 
    color: "#fff" 
  },
  resumen: { 
    margin: 20, 
    marginTop: 100, 
    padding: 20, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#cfe3ff", 
    backgroundColor: "#fff" 
  },
  montoPrincipal: { 
    fontSize: 36, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 5 
  },
  txtSecundario: { 
    color: "#333", 
    fontSize: 12, 
    marginLeft: 6, 
    fontWeight: "500"
  },
  txtGray: { 
    color: "#666", 
    fontSize: 12 
  },
  txtRestante: { 
    color: "#333", fontSize: 13, fontWeight: "600", marginLeft: 6 },
  footer: { 
    flexDirection: "row", justifyContent: "space-between", paddingTop: 15, borderTopWidth: 1, borderTopColor: "#e0e0e0" },
  contenedor: { 
    marginHorizontal: 20, marginBottom: 15, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: "#cfe3ff", backgroundColor: "#fff" },
  subtitulo: { 
    fontSize: 15, fontWeight: "600", color: "#333", marginLeft: 8 },
  alerta: { 
    flexDirection: "row", backgroundColor: "#fff3e0", borderLeftWidth: 3, borderLeftColor: "#ff9800", borderRadius: 8, padding: 12, marginTop: 10, gap: 10 },
  alertTitulo: { 
    fontSize: 14, fontWeight: "600", color: "#e65100" },
  alertTxt: { 
    fontSize: 12, color: "#f57c00" },
  botonSecundario: { 
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f6ff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#cfe3ff" },
  botonPrimario: { 
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#007bff", padding: 12, borderRadius: 8 },
  botonReiniciar: { 
    flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
  btnTxtSec: { 
    fontSize: 13, fontWeight: "600", color: "#333", marginLeft: 6 },
  btnTxtPrim: { 
    fontSize: 13, fontWeight: "600", color: "#fff", marginLeft: 6 },
  card: { 
    marginBottom: 20, backgroundColor: "#4da6ff", borderRadius: 12, padding: 15 },
  icono: { 
    width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  catTitulo: { 
    fontSize: 14, fontWeight: "600", color: "#fff" },
  catTexto: { 
    fontSize: 12, color: "#fff" },
  catPorcentaje: { 
    fontSize: 13, fontWeight: "600", color: "#fff" },
  catRestante: { 
    fontSize: 12, color: "#fff", marginTop: 8 },
  progressBar: { 
    height: 6, backgroundColor: "#f0f0f0", borderRadius: 3, marginTop: 8 },
  progressFill: { 
    height: "100%", borderRadius: 3 },
  nav: { 
    flexDirection: "row", backgroundColor: "#fff", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#ddd", position: "absolute", bottom: 0, left: 0, right: 0 },
  navItem: { 
    flex: 1, alignItems: "center" },
  navTxt: { 
    fontSize: 11, color: "#007bff", marginTop: 4, fontWeight: "500" },
  row: { 
    flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  flex: { 
    flex: 1, marginLeft: 12 },
})
