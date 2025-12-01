import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation } from "@react-navigation/native"
import PresupuestoController from "../controllers/PresupuestoController"
import DatabaseService from "../database/DatabaseService"

// =============================
//  MODAL PARA FILTRAR CATEGORÍA
// =============================
const ModalFiltroCategoria = ({ visible, onClose, categorias, onSeleccionar, seleccionada }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar por Categoría</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#007bff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.modalOption, !seleccionada && styles.modalOptionSelected]}
            onPress={() => {
              onSeleccionar(null)
              onClose()
            }}
          >
            <Text style={[styles.modalOptionText, !seleccionada && styles.modalOptionTextSelected]}>
              Todas las categorías
            </Text>
          </TouchableOpacity>

          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.modalOption, seleccionada === cat.id && styles.modalOptionSelected]}
              onPress={() => {
                onSeleccionar(cat.id)
                onClose()
              }}
            >
              <Text style={[styles.modalOptionText, seleccionada === cat.id && styles.modalOptionTextSelected]}>
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )
}

// =============================
//     MODAL PARA FILTRAR FECHA
// =============================
const ModalFiltroFecha = ({
  visible,
  onClose,
  fechaSeleccionada,
  setFechaSeleccionada,
  mostrarPicker,
  setMostrarPicker,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          {mostrarPicker && (
            <DateTimePicker
              value={fechaSeleccionada}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setFechaSeleccionada(selectedDate)
                }
                setMostrarPicker(false)
              }}
            />
          )}
          <TouchableOpacity
            style={styles.aplicarBoton}
            onPress={() => {
              setMostrarPicker(false)
              onClose()
            }}
          >
            <Text style={styles.aplicarTexto}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const ProgressBar = ({ progreso, color }) => (
  <View style={styles.progressBar}>
    <View style={[styles.progressFill, { width: `${Math.min(progreso, 100)}%`, backgroundColor: color }]} />
  </View>
)

const CategoriaCard = ({
  nombre,
  gastado,
  total,
  restante,
  progreso,
  icono,
  colorIcono,
  onEditar,
  onEliminar,
  gastos,
  onEditarGasto,
  onEliminarGasto,
}) => {
  const colorBarra = progreso > 95 ? "#ff4d4d" : progreso > 75 ? "#faad14" : "#00cc66"
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icono, { backgroundColor: colorIcono }]}>{icono}</View>
        <View style={styles.flex}>
          <Text style={styles.catTitulo}>{nombre}</Text>
          <Text style={styles.catTexto}>
            ${gastado.toLocaleString("es-MX")} de ${total.toLocaleString("es-MX")}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.catPorcentaje}>{Math.round(progreso)}%</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <TouchableOpacity onPress={onEditar}>
              <Ionicons name="pencil" size={20} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onEliminar}>
              <Ionicons name="trash" size={20} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ProgressBar progreso={progreso} color={colorBarra} />
      <Text style={styles.catRestante}>Restante: ${restante.toLocaleString("es-MX")}</Text>

      {gastos && gastos.length > 0 && (
        <View style={styles.gastosLista}>
          <Text style={styles.gastosListaTitulo}>Gastos registrados:</Text>
          {gastos.map((gasto) => (
            <View key={gasto.id} style={styles.gastoItem}>
              <View style={styles.flex}>
                <Text style={styles.gastoNombre}>{gasto.nombre}</Text>
                <Text style={styles.gastoMonto}>${gasto.monto.toLocaleString("es-MX")}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity onPress={() => onEditarGasto(gasto)}>
                  <Ionicons name="pencil" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onEliminarGasto(gasto)}>
                  <Ionicons name="trash" size={20} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

// Modal unificado para formularios (Agregar/Editar)
const FormModal = ({ visible, titulo, onClose, onSubmit, fields }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitulo}>{titulo}</Text>

            {fields.map((field, index) => {
              const isPicker = field.type === "picker"

              return (
                <View key={index}>
                  <Text style={styles.modalLabel}>{field.label}</Text>
                  {isPicker ? (
                    <View style={styles.modalPickerContainer}>
                      {field.options && field.options.length > 0 ? (
                        field.options.map((option) => (
                          <TouchableOpacity
                            key={option.id}
                            style={[
                              styles.modalPickerOption,
                              field.value === option.id && styles.modalPickerOptionSelected,
                            ]}
                            onPress={() => {
                              field.onChange(option.id)
                            }}
                          >
                            <Text
                              style={[
                                styles.modalPickerText,
                                field.value === option.id && styles.modalPickerTextSelected,
                              ]}
                            >
                              {option.nombre}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={styles.txtGray}>No hay categorías disponibles. Crea una primero.</Text>
                      )}
                    </View>
                  ) : (
                    <TextInput
                      style={styles.modalInput}
                      placeholder={field.placeholder}
                      placeholderTextColor="#999"
                      keyboardType={field.keyboardType || "default"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  )}
                </View>
              )
            })}

            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.modalBotonCancelar} onPress={onClose}>
                <Text style={styles.modalTxtCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBotonAceptar}
                onPress={() => {
                  onSubmit()
                }}
              >
                <Text style={styles.modalTxtAceptar}>{titulo.includes("Editar") ? "Guardar" : "Agregar"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

// Modal de confirmación para eliminar
const ConfirmModal = ({ visible, titulo, mensaje, advertencia, icono, onClose, onConfirm, isDelete }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalIconoEliminar}>
          <Ionicons name={icono} size={40} color={isDelete ? "#ff4d4d" : "#ff9800"} />
        </View>
        <Text style={styles.modalTitulo}>{titulo}</Text>
        <Text style={styles.modalTexto}>{mensaje}</Text>
        <Text style={styles.modalTextoAdvertencia}>{advertencia}</Text>
        <View style={styles.modalBotones}>
          <TouchableOpacity style={styles.modalBotonCancelar} onPress={onClose}>
            <Text style={styles.modalTxtCancelar}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalBotonEliminar} onPress={onConfirm}>
            <Text style={styles.modalTxtEliminar}>{isDelete ? "Eliminar" : "Reiniciar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)

const GastoCard = ({ gasto, categoria, onEditar, onEliminar }) => {
  return (
    <View style={styles.gastoCardIndividual}>
      <View style={styles.row}>
        <View style={[styles.iconoGasto, { backgroundColor: categoria?.iconoColor + "30" || "#4da6ff30" }]}>
          <Ionicons name={categoria?.iconoNombre || "cash"} size={18} color={categoria?.iconoColor || "#4da6ff"} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.gastoCardNombre}>{gasto.nombre}</Text>
          <Text style={styles.gastoCardCategoria}>{categoria?.nombre || "Sin categoría"}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.gastoCardMonto}>${gasto.monto.toLocaleString("es-MX")}</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
            <TouchableOpacity onPress={() => onEditar(gasto)}>
              <Ionicons name="pencil" size={18} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEliminar(gasto)}>
              <Ionicons name="trash" size={18} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function PresupuestoMensualScreen() {
  const navigation = useNavigation()
  const [modalTipo, setModalTipo] = useState(null)
  const [modalConfirm, setModalConfirm] = useState(null)
  const [itemSeleccionado, setItemSeleccionado] = useState(null)

  // Form states
  const [nombreCategoria, setNombreCategoria] = useState("")
  const [totalCategoria, setTotalCategoria] = useState("")
  const [nombreGasto, setNombreGasto] = useState("")
  const [montoGasto, setMontoGasto] = useState("")
  const [categoriaGasto, setCategoriaGasto] = useState("")

  const [modalCategoria, setModalCategoria] = useState(false)
  const [modalFecha, setModalFecha] = useState(false)
  const [mostrarPicker, setMostrarPicker] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())

  const [categoriaFiltro, setCategoriaFiltro] = useState(null)
  const [fechaFiltro, setFechaFiltro] = useState(null)

  // Estados para datos de BD
  const [categorias, setCategorias] = useState([])
  const [gastos, setGastos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Inicializar BD y cargar datos
  useEffect(() => {
    const inicializar = async () => {
      try {
        await DatabaseService.initialize()
        await cargarDatos()

        PresupuestoController.addListener(cargarDatos)
        setCargando(false)
      } catch (error) {
        console.error("Error al inicializar:", error)
        Alert.alert("Error", "No se pudo inicializar la base de datos")
        setCargando(false)
      }
    }

    inicializar()

    return () => {
      PresupuestoController.removeListener(cargarDatos)
    }
  }, [])

  const cargarDatos = async () => {
    try {
      console.log("[v0] ===== CARGANDO DATOS =====")
      const cats = await PresupuestoController.fetchCategorias()
      const gsts = await PresupuestoController.fetchGastos()

      console.log("[v0] Categorías cargadas:", cats.length)
      console.log("[v0] Gastos cargados:", gsts.length)

      // Convertir datos de BD al formato esperado
      const categoriasFormateadas = cats.map((cat) => ({
        id: cat.id.toString(),
        nombre: cat.nombre,
        total: cat.total,
        iconoNombre: cat.iconoNombre || cat.icono_nombre || "pricetag",
        iconoColor: cat.iconoColor || cat.icono_color || "#4da6ff",
      }))

      const gastosFormateados = gsts.map((gasto) => ({
        id: gasto.id.toString(),
        categoriaId: (gasto.categoriaId || gasto.categoria_id).toString(),
        nombre: gasto.nombre,
        monto: Number.parseFloat(gasto.monto),
        fecha: gasto.fecha, // Assuming fecha is available in the gasto object
      }))

      console.log("[v0] Actualizando state con nuevos datos...")
      setCategorias(categoriasFormateadas)
      setGastos(gastosFormateados)
      console.log("[v0] State actualizado correctamente")
    } catch (error) {
      console.error("[v0] Error al cargar datos:", error)
      Alert.alert("Error", "No se pudieron cargar los datos")
    }
  }

  const categoriasConGastos = categorias.map((cat) => {
    const gastosCategoria = gastos.filter((g) => g.categoriaId === cat.id)
    const gastado = gastosCategoria.reduce((sum, g) => sum + g.monto, 0)
    return {
      ...cat,
      gastado,
      gastos: gastosCategoria,
      restante: cat.total - gastado,
      progreso: (gastado / cat.total) * 100,
    }
  })

  const presupuestoTotal = categorias.reduce((sum, cat) => sum + cat.total, 0)
  const gastado = gastos.reduce((sum, g) => sum + g.monto, 0)
  const restante = presupuestoTotal - gastado
  const porcentajeUsado = presupuestoTotal > 0 ? Math.round((gastado / presupuestoTotal) * 100) : 0

  const limpiarFormulario = () => {
    setNombreCategoria("")
    setTotalCategoria("")
    setNombreGasto("")
    setMontoGasto("")
    setCategoriaGasto("")
    setItemSeleccionado(null)
  }

  const cerrarModal = () => {
    setModalTipo(null)
    limpiarFormulario()
  }

  // Handlers de Categoría
  const handleAgregarCategoria = async () => {
    // Validar nombre
    if (!nombreCategoria || !nombreCategoria.trim()) {
      Alert.alert("Error", "Por favor ingresa el nombre de la categoría")
      return
    }

    if (nombreCategoria.trim().length < 3) {
      Alert.alert("Error", "El nombre debe tener al menos 3 caracteres")
      return
    }

    if (nombreCategoria.trim().length > 30) {
      Alert.alert("Error", "El nombre no puede exceder 30 caracteres")
      return
    }

    // Validar presupuesto
    if (!totalCategoria || totalCategoria.trim() === "") {
      Alert.alert("Error", "Por favor ingresa el presupuesto")
      return
    }

    const presupuesto = Number.parseFloat(totalCategoria)
    if (isNaN(presupuesto)) {
      Alert.alert("Error", "El presupuesto debe ser un número válido")
      return
    }

    if (presupuesto <= 0) {
      Alert.alert("Error", "El presupuesto debe ser mayor a 0")
      return
    }

    if (presupuesto > 1000000000) {
      Alert.alert("Error", "El presupuesto es demasiado alto")
      return
    }

    try {
      await PresupuestoController.agregarCategoria(nombreCategoria.trim(), presupuesto, "pricetag", "#4da6ff")
      cerrarModal()
      Alert.alert("Éxito", "Categoría agregada correctamente")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const handleEditarCategoria = (categoria) => {
    setItemSeleccionado(categoria)
    setNombreCategoria(categoria.nombre)
    setTotalCategoria(categoria.total.toString())
    setModalTipo("editCategoria")
  }

  const handleGuardarEdicionCategoria = async () => {
    // Validar nombre
    if (!nombreCategoria || !nombreCategoria.trim()) {
      Alert.alert("Error", "Por favor ingresa el nombre de la categoría")
      return
    }

    if (nombreCategoria.trim().length < 3) {
      Alert.alert("Error", "El nombre debe tener al menos 3 caracteres")
      return
    }

    if (nombreCategoria.trim().length > 30) {
      Alert.alert("Error", "El nombre no puede exceder 30 caracteres")
      return
    }

    // Validar presupuesto
    if (!totalCategoria || totalCategoria.trim() === "") {
      Alert.alert("Error", "Por favor ingresa el presupuesto")
      return
    }

    const presupuesto = Number.parseFloat(totalCategoria)
    if (isNaN(presupuesto)) {
      Alert.alert("Error", "El presupuesto debe ser un número válido")
      return
    }

    if (presupuesto <= 0) {
      Alert.alert("Error", "El presupuesto debe ser mayor a 0")
      return
    }

    if (presupuesto > 1000000000) {
      Alert.alert("Error", "El presupuesto es demasiado alto")
      return
    }

    try {
      await PresupuestoController.modificarCategoria(itemSeleccionado.id, nombreCategoria.trim(), presupuesto)
      cerrarModal()
      Alert.alert("Éxito", "Categoría actualizada correctamente")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const handleEliminarCategoria = (categoria) => {
    setItemSeleccionado(categoria)
    setModalConfirm("deleteCategoria")
  }

  const handleConfirmarEliminarCategoria = async () => {
    try {
      await PresupuestoController.eliminarCategoria(itemSeleccionado.id)
      setModalConfirm(null)
      setItemSeleccionado(null)
      Alert.alert("Éxito", "Categoría eliminada correctamente")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  // Handlers de Gasto
  const handleAgregarGasto = async () => {
    // Validar nombre del gasto
    if (!nombreGasto || !nombreGasto.trim()) {
      Alert.alert("Error", "Por favor ingresa el nombre del gasto")
      return
    }

    if (nombreGasto.trim().length < 3) {
      Alert.alert("Error", "El nombre debe tener al menos 3 caracteres")
      return
    }

    if (nombreGasto.trim().length > 50) {
      Alert.alert("Error", "El nombre no puede exceder 50 caracteres")
      return
    }

    // Validar monto
    if (!montoGasto || montoGasto.trim() === "") {
      Alert.alert("Error", "Por favor ingresa el monto")
      return
    }

    const monto = Number.parseFloat(montoGasto)
    if (isNaN(monto)) {
      Alert.alert("Error", "El monto debe ser un número válido")
      return
    }

    if (monto <= 0) {
      Alert.alert("Error", "El monto debe ser mayor a 0")
      return
    }

    if (monto > 1000000000) {
      Alert.alert("Error", "El monto es demasiado alto")
      return
    }

    // Validar categoría
    if (!categoriaGasto) {
      Alert.alert("Error", "Por favor selecciona una categoría")
      return
    }

    try {
      await PresupuestoController.agregarGasto(categoriaGasto, nombreGasto.trim(), monto)
      cerrarModal()
      await cargarDatos()
      Alert.alert("Éxito", "Gasto agregado correctamente")
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo agregar el gasto")
    }
  }

  const handleEditarGasto = (gasto) => {
    setItemSeleccionado(gasto)
    setNombreGasto(gasto.nombre)
    setMontoGasto(gasto.monto.toString())
    setCategoriaGasto(gasto.categoriaId)
    setModalTipo("editGasto")
  }

  const handleGuardarEdicionGasto = async () => {
    // Validar nombre del gasto
    if (!nombreGasto || !nombreGasto.trim()) {
      Alert.alert("Error", "Por favor ingresa el nombre del gasto")
      return
    }

    if (nombreGasto.trim().length < 3) {
      Alert.alert("Error", "El nombre debe tener al menos 3 caracteres")
      return
    }

    if (nombreGasto.trim().length > 50) {
      Alert.alert("Error", "El nombre no puede exceder 50 caracteres")
      return
    }

    // Validar monto
    if (!montoGasto || montoGasto.trim() === "") {
      Alert.alert("Error", "Por favor ingresa el monto")
      return
    }

    const monto = Number.parseFloat(montoGasto)
    if (isNaN(monto)) {
      Alert.alert("Error", "El monto debe ser un número válido")
      return
    }

    if (monto <= 0) {
      Alert.alert("Error", "El monto debe ser mayor a 0")
      return
    }

    if (monto > 1000000000) {
      Alert.alert("Error", "El monto es demasiado alto")
      return
    }

    // Validar categoría
    if (!categoriaGasto) {
      Alert.alert("Error", "Por favor selecciona una categoría")
      return
    }

    try {
      await PresupuestoController.modificarGasto(itemSeleccionado.id, categoriaGasto, nombreGasto.trim(), monto)
      cerrarModal()
      Alert.alert("Éxito", "Gasto actualizado correctamente")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const handleEliminarGasto = (gasto) => {
    setItemSeleccionado(gasto)
    setModalConfirm("deleteGasto")
  }

  const handleConfirmarEliminarGasto = async () => {
    try {
      await PresupuestoController.eliminarGasto(itemSeleccionado.id)
      setModalConfirm(null)
      setItemSeleccionado(null)
      Alert.alert("Éxito", "Gasto eliminado correctamente")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const handleConfirmarReiniciar = async () => {
    try {
      await PresupuestoController.reiniciarMes()
      setModalConfirm(null)
      Alert.alert("Éxito", "Mes reiniciado correctamente")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const gastosFiltrados = gastos.filter((gasto) => {
    // Filtro por categoría
    if (categoriaFiltro && gasto.categoriaId !== categoriaFiltro) {
      return false
    }

    // Filtro por fecha funcional
    if (fechaFiltro) {
      const gastoFecha = new Date(gasto.fecha)
      const filtroFecha = new Date(fechaFiltro)

      // Comparar solo año, mes y día (ignorar horas)
      const gastoSoloFecha = new Date(gastoFecha.getFullYear(), gastoFecha.getMonth(), gastoFecha.getDate())
      const filtroSoloFecha = new Date(filtroFecha.getFullYear(), filtroFecha.getMonth(), filtroFecha.getDate())

      if (gastoSoloFecha.getTime() !== filtroSoloFecha.getTime()) {
        return false
      }
    }

    return true
  })

  if (cargando) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 18, color: "#007bff" }}>Cargando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Presupuesto mensual</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
            <Ionicons name="person-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
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
            {categoriasConGastos.filter((cat) => cat.progreso > 90).length > 0 ? (
              categoriasConGastos
                .filter((cat) => cat.progreso > 90)
                .map((cat) => {
                  const excedido = cat.progreso > 100
                  const cantidadExcedida = excedido ? cat.gastado - cat.total : 0

                  return (
                    <View key={cat.id} style={styles.alerta}>
                      <Ionicons name="alert-circle" size={18} color="#ff4d4d" />
                      <View style={styles.flex}>
                        <Text style={styles.alertTitulo}>{cat.nombre}</Text>
                        <Text style={styles.alertTxt}>
                          {excedido
                            ? `Presupuesto excedido por $${cantidadExcedida.toLocaleString("es-MX")}`
                            : `Casi alcanzas tu límite (${Math.round(cat.progreso)}%)`}
                        </Text>
                      </View>
                    </View>
                  )
                })
            ) : (
              <Text style={[styles.txtGray, { marginTop: 10 }]}>No hay alertas activas</Text>
            )}
          </View>

          <View style={styles.contenedor}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.botonSecundario} onPress={() => setModalTipo("addCategoria")}>
                <Ionicons name="add" size={18} color="#000" />
                <Text style={styles.btnTxtSec}>Agregar Categoría</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonPrimario} onPress={() => setModalTipo("addGasto")}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.btnTxtPrim}>Agregar Gasto</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.botonReiniciar} onPress={() => setModalConfirm("resetMes")}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={styles.txtGray}>Reiniciar Mes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contenedor}>
            <Text style={[styles.text, styles.filtroTitulo]}>Filtrar por fecha</Text>

            <TouchableOpacity
              style={[styles.filtroBoton, styles.filtroBotonEspaciado]}
              onPress={() => {
                setModalFecha(true)
                setMostrarPicker(true)
              }}
            >
              <Text style={[styles.text, { fontWeight: "600", color: "#007bff" }]}>
                {fechaFiltro ? fechaFiltro.toLocaleDateString("es-MX") : "Todas las fechas"}
              </Text>
              <Ionicons name="calendar-outline" size={22} color="#4da6ff" />
            </TouchableOpacity>

            <Text style={[styles.text, styles.filtroTitulo]}>Filtrar por categoría</Text>

            <TouchableOpacity
              style={[styles.filtroBoton, styles.filtroBotonCategoria]}
              onPress={() => setModalCategoria(true)}
            >
              <Text style={[styles.text, { fontWeight: "600", color: "#007bff" }]}>
                {categoriaFiltro
                  ? categorias.find((c) => c.id === categoriaFiltro)?.nombre || "Seleccionar categoría"
                  : "Todas las categorías"}
              </Text>
              <Ionicons name="filter-outline" size={22} color="#4da6ff" />
            </TouchableOpacity>

            <Text style={styles.subtitulo}>Categorías ({categorias.length})</Text>

            {categoriasConGastos.map((item) => (
              <CategoriaCard
                key={item.id}
                {...item}
                icono={<Ionicons name={item.iconoNombre} size={20} color={item.iconoColor} />}
                colorIcono={item.iconoColor + "30"}
                onEditar={() => handleEditarCategoria(item)}
                onEliminar={() => handleEliminarCategoria(item)}
                onEditarGasto={handleEditarGasto}
                onEliminarGasto={handleEliminarGasto}
              />
            ))}
          </View>

          <View style={styles.contenedor}>
            <View style={styles.row}>
              <View style={styles.row}>
                <Ionicons name="receipt-outline" size={18} color="#007bff" />
                <Text style={styles.subtitulo}>Todos los Gastos ({gastosFiltrados.length})</Text>
              </View>
              {(categoriaFiltro || fechaFiltro) && (
                <TouchableOpacity
                  onPress={() => {
                    setCategoriaFiltro(null)
                    setFechaFiltro(null)
                  }}
                >
                  <Text style={styles.txtLimpiarFiltros}>Limpiar filtros</Text>
                </TouchableOpacity>
              )}
            </View>

            {gastosFiltrados.length > 0 ? (
              gastosFiltrados.map((gasto) => {
                const categoria = categorias.find((c) => c.id === gasto.categoriaId)
                return (
                  <GastoCard
                    key={gasto.id}
                    gasto={gasto}
                    categoria={categoria}
                    onEditar={handleEditarGasto}
                    onEliminar={handleEliminarGasto}
                  />
                )
              })
            ) : (
              <Text style={[styles.txtGray, { marginTop: 10, textAlign: "center" }]}>
                {categoriaFiltro || fechaFiltro
                  ? "No hay gastos con los filtros seleccionados"
                  : "No hay gastos registrados. Agrega uno para comenzar."}
              </Text>
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Agregar/Editar Categoría */}
      {(modalTipo === "addCategoria" || modalTipo === "editCategoria") && (
        <FormModal
          visible={true}
          titulo={modalTipo === "addCategoria" ? "Agregar Categoría" : "Editar Categoría"}
          onClose={cerrarModal}
          onSubmit={modalTipo === "addCategoria" ? handleAgregarCategoria : handleGuardarEdicionCategoria}
          fields={[
            {
              label: "Nombre de la Categoría",
              placeholder: "Ej: Transporte",
              value: nombreCategoria,
              onChange: setNombreCategoria,
            },
            {
              label: "Presupuesto",
              placeholder: "Ej: 3000",
              keyboardType: "numeric",
              value: totalCategoria,
              onChange: setTotalCategoria,
            },
          ]}
        />
      )}

      {/* Agregar/Editar Gasto */}
      {(modalTipo === "addGasto" || modalTipo === "editGasto") && (
        <FormModal
          visible={true}
          titulo={modalTipo === "addGasto" ? "Agregar Gasto" : "Editar Gasto"}
          onClose={cerrarModal}
          onSubmit={modalTipo === "addGasto" ? handleAgregarGasto : handleGuardarEdicionGasto}
          fields={[
            {
              label: "Nombre del Gasto",
              placeholder: "Ej: Comida rápida",
              value: nombreGasto,
              onChange: setNombreGasto,
            },
            {
              label: "Monto",
              placeholder: "Ej: 150",
              keyboardType: "numeric",
              value: montoGasto,
              onChange: setMontoGasto,
            },
            {
              label: "Categoría",
              type: "picker",
              value: categoriaGasto,
              onChange: setCategoriaGasto,
              options: categorias,
            },
          ]}
        />
      )}

      {/* Confirmar eliminar categoría */}
      {modalConfirm === "deleteCategoria" && (
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

      {/* Confirmar eliminar gasto */}
      {modalConfirm === "deleteGasto" && (
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
      {modalConfirm === "resetMes" && (
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

      <ModalFiltroFecha
        visible={modalFecha}
        onClose={() => setModalFecha(false)}
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={(fecha) => {
          setFechaSeleccionada(fecha)
          setFechaFiltro(fecha)
        }}
        mostrarPicker={mostrarPicker}
        setMostrarPicker={setMostrarPicker}
      />

      <ModalFiltroCategoria
        visible={modalCategoria}
        onClose={() => setModalCategoria(false)}
        categorias={categorias}
        onSeleccionar={setCategoriaFiltro}
        seleccionada={categoriaFiltro}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  // LAYOUT PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: "#e0f4ff",
    width: "100%",
  },
  gradient: {
    flex: 1,
  },

  // CARD DE RESUMEN
  resumen: {
    margin: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cfe3ff",
    backgroundColor: "#fff",
  },
  montoPrincipal: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  txtSecundario: {
    color: "#333",
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  txtGray: {
    color: "#666",
    fontSize: 12,
  },
  txtRestante: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },

  // CONTENEDORES GENERALES
  contenedor: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#cfe3ff",
    backgroundColor: "#fff",
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },

  // ALERTAS
  alerta: {
    flexDirection: "row",
    backgroundColor: "#fff3e0",
    borderLeftWidth: 3,
    borderLeftColor: "#ff9800",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    gap: 10,
  },
  alertTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e65100",
  },
  alertTxt: {
    fontSize: 12,
    color: "#f57c00",
  },

  // BOTONES PRINCIPALES
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
    marginTop: 10,
  },
  btnTxtSec: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  btnTxtPrim: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 6,
  },

  // CARDS DE CATEGORÍAS
  card: {
    marginBottom: 20,
    backgroundColor: "#f0f6ff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  icono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  catTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
  },
  catTexto: {
    fontSize: 12,
    color: "#007bff",
  },
  catPorcentaje: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007bff",
  },
  catRestante: {
    fontSize: 12,
    color: "#007bff",
    marginTop: 8,
  },

  // BARRA DE PROGRESO
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // LISTA DE GASTOS
  gastosLista: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#cfe3ff",
  },
  gastosListaTitulo: {
    fontSize: 11,
    color: "#007bff",
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.9,
  },
  gastoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f6ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  gastoNombre: {
    fontSize: 12,
    color: "#007bff",
    fontWeight: "500",
  },
  gastoMonto: {
    fontSize: 11,
    color: "#007bff",
    opacity: 0.9,
  },

  // UTILIDADES
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flex: {
    flex: 1,
    marginLeft: 12,
  },

  // MODALES - BASE
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },

  // MODALES - FORMULARIOS
  modalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#f0f6ff",
    borderWidth: 1,
    borderColor: "#cfe3ff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },

  // MODALES - PICKER
  modalPickerContainer: {
    marginBottom: 16,
  },
  modalPickerOption: {
    backgroundColor: "#f0f6ff",
    borderWidth: 1,
    borderColor: "#cfe3ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  modalPickerOptionSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  modalPickerText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  modalPickerTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  // MODALES - BOTONES
  modalBotones: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalBotonCancelar: {
    flex: 1,
    backgroundColor: "#f0f6ff",
    borderWidth: 1,
    borderColor: "#cfe3ff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  modalBotonAceptar: {
    flex: 1,
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  modalBotonEliminar: {
    flex: 1,
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  modalTxtCancelar: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  modalTxtAceptar: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  modalTxtEliminar: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // MODALES - CONFIRMACIÓN
  modalIconoEliminar: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTexto: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  modalTextoAdvertencia: {
    fontSize: 12,
    color: "#ff4d4d",
    textAlign: "center",
    marginBottom: 20,
  },

  filtroTitulo: {
    fontSize: 15,
    marginBottom: 8,
    color: "#007bff",
    fontWeight: "700",
  },
  filtroBoton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cfe3ff",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filtroBotonEspaciado: {
    marginBottom: 18,
  },
  filtroBotonCategoria: {
    marginBottom: 12,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007bff",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0edff",
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4da6ff",
  },

  // HEADER
  headerIcons: {
    flexDirection: "row",
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

  aplicarBoton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#007bff",
    borderRadius: 10,
  },
  aplicarTexto: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },

  gastoCardIndividual: {
    marginBottom: 12,
    backgroundColor: "#f0f6ff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#cfe3ff",
  },
  iconoGasto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  gastoCardNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
  },
  gastoCardCategoria: {
    fontSize: 11,
    color: "#007bff",
    opacity: 0.7,
    marginTop: 2,
  },
  gastoCardMonto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007bff",
  },
  txtLimpiarFiltros: {
    fontSize: 12,
    color: "#ff4d4d",
    fontWeight: "600",
  },
  modalOptionSelected: {
    backgroundColor: "#007bff",
  },
  modalOptionTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
})
