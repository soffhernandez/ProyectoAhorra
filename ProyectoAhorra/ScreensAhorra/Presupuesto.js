import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

// =============================
//  MODAL PARA FILTRAR CATEGORÍA
// =============================
const ModalFiltroCategoria = ({ visible, onClose }) => {
  const categorias = ["Sueldo", "Alimentación", "Transporte", "Otros", "Entretenimiento"]

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

          {categorias.map((cat) => (
            <TouchableOpacity key={cat} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>{cat}</Text>
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
const ModalFiltroFecha = ({ visible, onClose }) => {
  const opcionesFecha = ["Hoy", "Últimos 7 días", "Este mes", "Mes anterior", "Este año"]

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar por Fecha</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#007bff" />
            </TouchableOpacity>
          </View>

          {opcionesFecha.map((f) => (
            <TouchableOpacity key={f} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>{f}</Text>
            </TouchableOpacity>
          ))}
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

const CategoriaCard = ({ nombre, gastado, total, restante, progreso, icono, colorIcono, onEditar, onEliminar, gastos, onEditarGasto, onEliminarGasto }) => {
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
            <TouchableOpacity onPress={onEditar}>
              <Ionicons name="pencil" size={14} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onEliminar}>
              <Ionicons name="trash" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ProgressBar progreso={progreso} color={colorBarra} />
      <Text style={styles.catRestante}>Restante: ${restante.toLocaleString("es-MX")}</Text>
      
      {gastos && gastos.length > 0 && (
        <View style={styles.gastosLista}>
          <Text style={styles.gastosListaTitulo}>Gastos registrados:</Text>
          {gastos.map(gasto => (
            <View key={gasto.id} style={styles.gastoItem}>
              <View style={styles.flex}>
                <Text style={styles.gastoNombre}>{gasto.nombre}</Text>
                <Text style={styles.gastoMonto}>${gasto.monto.toLocaleString("es-MX")}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity onPress={() => onEditarGasto(gasto)}>
                  <Ionicons name="pencil" size={14} color="#ad0808ff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onEliminarGasto(gasto)}>
                  <Ionicons name="trash" size={14} color="#ad0808ff" />
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
const FormModal = ({ visible, titulo, onClose, onSubmit, fields }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitulo}>{titulo}</Text>
        
        {fields.map((field, index) => (
          <View key={index}>
            <Text style={styles.modalLabel}>{field.label}</Text>
            {field.type === 'picker' ? (
              <View style={styles.modalPickerContainer}>
                {field.options.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.modalPickerOption,
                      field.value === option.id && styles.modalPickerOptionSelected
                    ]}
                    onPress={() => field.onChange(option.id)}
                  >
                    <Text style={[
                      styles.modalPickerText,
                      field.value === option.id && styles.modalPickerTextSelected
                    ]}>
                      {option.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
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
        ))}

        <View style={styles.modalBotones}>
          <TouchableOpacity style={styles.modalBotonCancelar} onPress={onClose}>
            <Text style={styles.modalTxtCancelar}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalBotonAceptar} onPress={onSubmit}>
            <Text style={styles.modalTxtAceptar}>{titulo.includes('Editar') ? 'Guardar' : 'Agregar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)

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
            <Text style={styles.modalTxtEliminar}>{isDelete ? 'Eliminar' : 'Reiniciar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)

export default function PresupuestoMensualScreen() {
  const [modalTipo, setModalTipo] = useState(null) // 'addCategoria', 'editCategoria', 'addGasto', 'editGasto'
  const [modalConfirm, setModalConfirm] = useState(null) // 'deleteCategoria', 'deleteGasto', 'resetMes'
  const [itemSeleccionado, setItemSeleccionado] = useState(null)
  
  // Form states
  const [nombreCategoria, setNombreCategoria] = useState("")
  const [totalCategoria, setTotalCategoria] = useState("")
  const [nombreGasto, setNombreGasto] = useState("")
  const [montoGasto, setMontoGasto] = useState("")
  const [categoriaGasto, setCategoriaGasto] = useState("")
  const [modalCategoria, setModalCategoria] = useState(false)
  const [modalFecha, setModalFecha] = useState(false)

  const [gastos, setGastos] = useState([
    { id: "g1", categoriaId: "1", nombre: "Supermercado", monto: 2500 },
    { id: "g2", categoriaId: "1", nombre: "Restaurante", monto: 2300 },
    { id: "g3", categoriaId: "2", nombre: "Consulta médica", monto: 1000 },
  ])

  const [categorias, setCategorias] = useState([
    { id: "1", nombre: "Alimentos", total: 5000, iconoNombre: "fast-food", iconoColor: "#ffd54f" },
    { id: "2", nombre: "Salud", total: 2500, iconoNombre: "fitness", iconoColor: "#ff5252" },
  ])

  const categoriasConGastos = categorias.map(cat => {
    const gastosCategoria = gastos.filter(g => g.categoriaId === cat.id)
    const gastado = gastosCategoria.reduce((sum, g) => sum + g.monto, 0)
    return {
      ...cat,
      gastado,
      gastos: gastosCategoria,
      restante: cat.total - gastado,
      progreso: (gastado / cat.total) * 100
    }
  })

  const presupuestoTotal = 7500
  const gastado = gastos.reduce((sum, g) => sum + g.monto, 0)
  const restante = presupuestoTotal - gastado
  const porcentajeUsado = Math.round((gastado / presupuestoTotal) * 100)

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
  const handleAgregarCategoria = () => {
    if (nombreCategoria && totalCategoria) {
      setCategorias([...categorias, {
        id: Date.now().toString(),
        nombre: nombreCategoria,
        total: parseFloat(totalCategoria),
        iconoNombre: "pricetag",
        iconoColor: "#4da6ff"
      }])
      cerrarModal()
    }
  }

  const handleEditarCategoria = (categoria) => {
    setItemSeleccionado(categoria)
    setNombreCategoria(categoria.nombre)
    setTotalCategoria(categoria.total.toString())
    setModalTipo('editCategoria')
  }

  const handleGuardarEdicionCategoria = () => {
    if (nombreCategoria && totalCategoria) {
      setCategorias(categorias.map(cat => 
        cat.id === itemSeleccionado.id 
          ? { ...cat, nombre: nombreCategoria, total: parseFloat(totalCategoria) }
          : cat
      ))
      cerrarModal()
    }
  }

  const handleEliminarCategoria = (categoria) => {
    setItemSeleccionado(categoria)
    setModalConfirm('deleteCategoria')
  }

  const handleConfirmarEliminarCategoria = () => {
    setCategorias(categorias.filter(cat => cat.id !== itemSeleccionado.id))
    setGastos(gastos.filter(g => g.categoriaId !== itemSeleccionado.id))
    setModalConfirm(null)
    setItemSeleccionado(null)
  }

  // Handlers de Gasto
  const handleAgregarGasto = () => {
    if (nombreGasto && montoGasto && categoriaGasto) {
      setGastos([...gastos, {
        id: Date.now().toString(),
        categoriaId: categoriaGasto,
        nombre: nombreGasto,
        monto: parseFloat(montoGasto)
      }])
      cerrarModal()
    }
  }

  const handleEditarGasto = (gasto) => {
    setItemSeleccionado(gasto)
    setNombreGasto(gasto.nombre)
    setMontoGasto(gasto.monto.toString())
    setCategoriaGasto(gasto.categoriaId)
    setModalTipo('editGasto')
  }

  const handleGuardarEdicionGasto = () => {
    if (nombreGasto && montoGasto && categoriaGasto) {
      setGastos(gastos.map(g => 
        g.id === itemSeleccionado.id 
          ? { ...g, nombre: nombreGasto, monto: parseFloat(montoGasto), categoriaId: categoriaGasto }
          : g
      ))
      cerrarModal()
    }
  }

  const handleEliminarGasto = (gasto) => {
    setItemSeleccionado(gasto)
    setModalConfirm('deleteGasto')
  }

  const handleConfirmarEliminarGasto = () => {
    setGastos(gastos.filter(g => g.id !== itemSeleccionado.id))
    setModalConfirm(null)
    setItemSeleccionado(null)
  }

  const handleConfirmarReiniciar = () => {
    setGastos([])
    setModalConfirm(null)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerAzul}>
        <TouchableOpacity style={{ position: "absolute", left: 20 }}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
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
              <TouchableOpacity style={styles.botonSecundario} onPress={() => setModalTipo('addCategoria')}>
                <Ionicons name="add" size={18} color="#000" />
                <Text style={styles.btnTxtSec}>Agregar Categoría</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonPrimario} onPress={() => setModalTipo('addGasto')}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.btnTxtPrim}>Agregar Gasto</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.botonReiniciar} onPress={() => setModalConfirm('resetMes')}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={styles.txtGray}>Reiniciar Mes</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.contenedor}>
          <Text style={[styles.text, styles.filtroTitulo]}>Filtrar por fecha</Text>
                        <TouchableOpacity
                          style={[styles.filtroBoton, styles.filtroBotonEspaciado]}
                          onPress={() => setModalFecha(true)}
                        >
                          <Text style={[styles.text, { fontWeight: "600", color: "#007bff" }]}>
                            Seleccionar fecha
                          </Text>
                          <Ionicons name="calendar-outline" size={22} color="#4da6ff" />
                        </TouchableOpacity>
          
                        <Text style={[styles.text, styles.filtroTitulo]}>Filtrar por categoría</Text>
                        <TouchableOpacity
                          style={[styles.filtroBoton, styles.filtroBotonCategoria]}
                          onPress={() => setModalCategoria(true)}
                        >
                          <Text style={[styles.text, { fontWeight: "600", color: "#007bff" }]}>
                            Seleccionar categoría
                          </Text>
                          <Ionicons name="filter-outline" size={22} color="#4da6ff" />
                        </TouchableOpacity>
            <Text style={styles.subtitulo}>Categorías ({categorias.length})</Text>
        
            {categoriasConGastos.map(item => (
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
        </ScrollView>
      </LinearGradient>

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
      <ModalFiltroCategoria visible={modalCategoria} onClose={() => setModalCategoria(false)} />
      <ModalFiltroFecha visible={modalFecha} onClose={() => setModalFecha(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  // LAYOUT PRINCIPAL
  container: { 
    flex: 1, 
    backgroundColor: '#e0f4ff', 
    width: '100%' 
  },
  gradient: { 
    flex: 1 
  },
  
  // HEADER 
  headerAzul: { 
    backgroundColor: "#4da6ff", 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 20, 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 1000 
  },
  tituloHeader: { 
    fontSize: 20, 
    fontWeight: "600", 
    color: "#fff" 
  },
  
  // CARD DE RESUMEN
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
    color: "#333", 
    fontSize: 13, 
    fontWeight: "600", 
    marginLeft: 6 
  },
  footer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: "#e0e0e0" 
  },
  
  // CONTENEDORES GENERALES
  contenedor: { 
    marginHorizontal: 20, 
    marginBottom: 15, 
    borderRadius: 12, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: "#cfe3ff", 
    backgroundColor: "#fff" 
  },
  subtitulo: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#333", 
    marginLeft: 8 
  },
  
  //  ALERTAS 
  alerta: { 
    flexDirection: "row", 
    backgroundColor: "#fff3e0", 
    borderLeftWidth: 3, 
    borderLeftColor: "#ff9800", 
    borderRadius: 8, 
    padding: 12, 
    marginTop: 10, 
    gap: 10 
  },
  alertTitulo: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#e65100" 
  },
  alertTxt: { 
    fontSize: 12, 
    color: "#f57c00" 
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
    borderColor: "#cfe3ff" 
  },
  botonPrimario: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#007bff", 
    padding: 12, 
    borderRadius: 8 
  },
  botonReiniciar: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 10 
  },
  btnTxtSec: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#333", 
    marginLeft: 6 
  },
  btnTxtPrim: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#fff", 
    marginLeft: 6 
  },
  
  // CARDS DE CATEGORÍAS
  card: { 
    marginBottom: 20, 
    backgroundColor: "#4da6ff", 
    borderRadius: 12, 
    padding: 15 
  },
  icono: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  catTitulo: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#fff" 
  },
  catTexto: { 
    fontSize: 12, 
    color: "#fff" 
  },
  catPorcentaje: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#fff" 
  },
  catRestante: { 
    fontSize: 12, 
    color: "#fff", 
    marginTop: 8 
  },
  
  // BARRA DE PROGREso
  progressBar: { 
    height: 6, 
    backgroundColor: "#f0f0f0", 
    borderRadius: 3, 
    marginTop: 8 
  },
  progressFill: { 
    height: "100%", 
    borderRadius: 3 
  },
  
  // LISTA DE GASTOS
  gastosLista: { 
    marginTop: 12, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: "rgba(255, 255, 255, 0.3)" 
  },
  gastosListaTitulo: { 
    fontSize: 11, 
    color: "#fff", 
    fontWeight: "600", 
    marginBottom: 8, 
    opacity: 0.9 
  },
  gastoItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    backgroundColor: "rgba(255, 255, 255, 0.15)", 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 6 
  },
  gastoNombre: { 
    fontSize: 12, 
    color: "#fff", 
    fontWeight: "500" 
  },
  gastoMonto: { 
    fontSize: 11, 
    color: "#fff", 
    opacity: 0.9 
  },
  
  // NAVEGACIÓN INFERIOR
  nav: { 
    flexDirection: "row", 
    backgroundColor: "#fff", 
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderTopColor: "#ddd", 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0 
  },
  navItem: { 
    flex: 1, 
    alignItems: "center" 
  },
  navTxt: { 
    fontSize: 11, 
    color: "#007bff", 
    marginTop: 4, 
    fontWeight: "500" 
  },
  
  // === UTILIDADES
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  flex: { 
    flex: 1, 
    marginLeft: 12 
  },
  
  // MODALES - BASE
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    padding: 24, 
    width: "85%", 
    maxWidth: 400 
  },
  modalTitulo: { 
    fontSize: 20, 
    fontWeight: "600", 
    color: "#333", 
    marginBottom: 20, 
    textAlign: "center" 
  },
  
  // === MODALES - FORMULARIOS ===
  modalLabel: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#333", 
    marginBottom: 8 
  },
  modalInput: { 
    backgroundColor: "#f0f6ff", 
    borderWidth: 1, 
    borderColor: "#cfe3ff", 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 14, 
    color: "#333", 
    marginBottom: 16 
  },
  
  // === MODALES - PICKER ===
  modalPickerContainer: { 
    marginBottom: 16 
  },
  modalPickerOption: { 
    backgroundColor: "#f0f6ff", 
    borderWidth: 1, 
    borderColor: "#cfe3ff", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 8 
  },
  modalPickerOptionSelected: { 
    backgroundColor: "#007bff", 
    borderColor: "#007bff" 
  },
  modalPickerText: { 
    fontSize: 14, 
    color: "#333", 
    textAlign: "center" 
  },
  modalPickerTextSelected: { 
    color: "#fff", 
    fontWeight: "600" 
  },
  
  // === MODALES - BOTONES ===
  modalBotones: { 
    flexDirection: "row", 
    gap: 12, 
    marginTop: 8 
  },
  modalBotonCancelar: { 
    flex: 1, 
    backgroundColor: "#ad0808ff", 
    borderWidth: 1, 
    borderColor: "#cfe3ff", 
    borderRadius: 8, 
    padding: 12, 
    alignItems: "center" 
  },
  modalBotonAceptar: { 
    flex: 1, 
    backgroundColor: "#007bff", 
    borderRadius: 8, 
    padding: 12, 
    alignItems: "center" 
  },
  modalBotonEliminar: { 
    flex: 1, 
    backgroundColor: "#ff4d4d", 
    borderRadius: 8, 
    padding: 12, 
    alignItems: "center" 
  },
  modalTxtCancelar: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#333" 
  },
  modalTxtAceptar: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#fff" 
  },
  modalTxtEliminar: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#fff" 
  },
  
  // === MODALES - CONFIRMACIÓN ===
  modalIconoEliminar: { 
    alignItems: "center", 
    marginBottom: 16 
  },
  modalTexto: { 
    fontSize: 14, 
    color: "#666", 
    textAlign: "center", 
    marginBottom: 8 
  },
  modalTextoAdvertencia: { 
    fontSize: 12, 
    color: "#ff4d4d", 
    textAlign: "center", 
    marginBottom: 20 
  },
  filtroTitulo: {
    fontSize: 15,
    marginBottom: 8,
    color: "#007bff",
    fontWeight: "700",
  },

  filtroBloque: {
    marginBottom: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
})