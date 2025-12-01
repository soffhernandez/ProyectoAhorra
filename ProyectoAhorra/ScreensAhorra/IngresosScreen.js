import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, Modal, Alert, StyleSheet, TextInput, } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Controlador } from "../controllers/UsuarioController";

// =============================
//  MODAL PARA FILTRAR CATEGORÍA
// =============================
const ModalFiltroCategoria = ({ visible, onClose, onSelectCategoria }) => {
  const categorias = ["Sueldo", "Alimentación", "Transporte", "Otros", "Entretenimiento"];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar por Categoría</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="rgba(0, 123, 255, 1)" />
            </TouchableOpacity>
          </View>

          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.modalOption}
              onPress={() => {
                onSelectCategoria(cat);
                onClose();
              }}
            >
              <Text style={styles.modalOptionText}>{cat}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.modalOption, { marginTop: 8 }]}
            onPress={() => {
              onSelectCategoria(null); // Quitar filtro
              onClose();
            }}
          >
            <Text style={[styles.modalOptionText, { color: "#007bff" }]}>Quitar filtro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
  onApply,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          {mostrarPicker && (
            <DateTimePicker
              value={fechaSeleccionada || new Date()}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setFechaSeleccionada(selectedDate);
                }
                setMostrarPicker(false);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.aplicarBoton}
            onPress={() => {
              setMostrarPicker(false);
              onApply(fechaSeleccionada);
              onClose();
            }}
          >
            <Text style={styles.aplicarTexto}>Aplicar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aplicarBoton, { marginTop: 10, backgroundColor: "#f0f6ff" }]}
            onPress={() => {
              // Quitar filtro
              onApply(null);
              onClose();
            }}
          >
            <Text style={[styles.aplicarTexto, { color: "#007bff" }]}>Quitar filtro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ===============================
// MODAL PARA AGREGAR/EDITAR TRANSACCIÓN
// ===============================
const ModalTransaccion = ({ visible, onClose, onSave, initialData = null }) => {
  // Categorías
  const categorias = ["Sueldo", "Freelance", "Inversiones", "Otros", "Alimentación", "Transporte", "Entretenimiento"];

  const [tipo, setTipo] = useState(initialData?.tipo ?? "Ingreso");
  const [categoria, setCategoria] = useState(initialData?.categoria ?? categorias[0]);
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "");
  const [cantidad, setCantidad] = useState(
    initialData?.monto !== undefined ? String(Number(initialData.monto).toFixed(2)) : "0.00"
  );
  const [fecha, setFecha] = useState(initialData?.fecha ? new Date(initialData.fecha) : new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  useEffect(() => {
    if (visible && initialData) {
      // Si abrimos para editar, precargar
      setTipo(initialData.tipo ?? "Ingreso");
      setCategoria(initialData.categoria ?? categorias[0]);
      setDescripcion(initialData.descripcion ?? "");
      setCantidad(initialData.monto !== undefined ? String(Number(initialData.monto).toFixed(2)) : "0.00");
      setFecha(initialData.fecha ? new Date(initialData.fecha) : new Date());
    } else if (visible && !initialData) {
      // limpiar al abrir nuevo
      setTipo("Ingreso");
      setCategoria(categorias[0]);
      setDescripcion("");
      setCantidad("0.00");
      setFecha(new Date());
    }
  }, [visible, initialData]);

  const handleGuardar = async () => {
    const cantidadNum = Number(cantidad.replace(/,/g, ".")) || 0;
    if (!descripcion.trim()) {
      Alert.alert("Error", "Agrega una descripción.");
      return;
    }
    if (!categoria) {
      Alert.alert("Error", "Selecciona una categoría.");
      return;
    }
    if (cantidadNum <= 0) {
      Alert.alert("Error", "La cantidad debe ser mayor a 0.");
      return;
    }

    const limite = cantidadNum;
    const ingresos = tipo === "Ingreso" ? cantidadNum : 0;
    const gastos = tipo === "Gasto" ? cantidadNum : 0;

    const payload = {
      fecha: fecha.toISOString(),
      limite,
      cantidad: cantidadNum,
      categoria,
      desc: descripcion.trim(),
      ingresos,
      gastos,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      Alert.alert("Error", err?.message || "No se pudo guardar la transacción.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          <View style={[styles.row, { padding: 20, borderBottomWidth: 1, borderBottomColor: "#cfe3ff" }]}>
            <Text style={[styles.text, styles.bold, { fontSize: 22, color: "#007bff" }]}>
              {initialData ? "Editar Transacción" : "Nueva Transacción"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#007bff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.section}>
              {/* Monto editable */}
              <View style={[styles.btn, { backgroundColor: "#4da6ff", paddingVertical: 12, justifyContent: "flex-start", gap: 12 }]}>
                <Text style={[styles.text, styles.bold, { fontSize: 22, color: "#fff" }]}>$</Text>
                <TextInput
                  value={cantidad}
                  onChangeText={(t) => {
                    // allow decimals and commas
                    const sanitized = t.replace(/[^\d.,]/g, "");
                    setCantidad(sanitized);
                  }}
                  keyboardType="numeric"
                  style={{ color: "#fff", fontSize: 28, fontWeight: "700", flex: 1 }}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                />
              </View>

              {/* Tipo */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Tipo de transacción</Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => setTipo("Ingreso")} style={[styles.btn, tipo === "Ingreso" ? styles.btnActive : { backgroundColor: "#f0f6ff", borderColor: "#cfe3ff" }, { flex: 1 }]}>
                  <Ionicons name="arrow-down" size={22} color={tipo === "Ingreso" ? "#fff" : "#4da6ff"} />
                  <Text style={[styles.text, styles.bold, { fontSize: 15, color: tipo === "Ingreso" ? "#fff" : "#4da6ff" }]}>Ingreso</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setTipo("Gasto")} style={[styles.btn, tipo === "Gasto" ? styles.btnActive : { backgroundColor: "#f0f6ff", borderColor: "#cfe3ff" }, { flex: 1 }]}>
                  <Ionicons name="arrow-up" size={22} color={tipo === "Gasto" ? "#fff" : "#4da6ff"} />
                  <Text style={[styles.text, styles.bold, { fontSize: 15, color: tipo === "Gasto" ? "#fff" : "#4da6ff" }]}>Gasto</Text>
                </TouchableOpacity>
              </View>

              {/* Categorías */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Categoría</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                {categorias.map((cat) => (
                  <TouchableOpacity key={cat} onPress={() => setCategoria(cat)} style={[styles.chip, categoria === cat ? { borderWidth: 1.5 } : {}]}>
                    <Text style={[styles.text, styles.bold, { fontSize: 14, color: "#4da6ff" }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Fecha */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Fecha</Text>
              <TouchableOpacity style={styles.input} onPress={() => setMostrarPicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#4da6ff" />
                <Text style={[styles.text, { fontSize: 15, fontWeight: "600", color: "#333" }]}>{fecha.toLocaleDateString("es-MX")}</Text>
              </TouchableOpacity>

              {mostrarPicker && (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="calendar"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setFecha(selectedDate);
                    }
                    setMostrarPicker(false);
                  }}
                />
              )}

              {/* Cantidad quick control */}
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => {
                    const cur = Number(cantidad.replace(/,/g, ".") || 0);
                    const next = (cur + 10).toFixed(2);
                    setCantidad(String(next));
                  }}
                >
                  <Text style={[styles.text, { color: "#007bff" }]}>+10</Text>
                </TouchableOpacity>
              </View>

              {/* Descripción (editable) */}
              <Text style={[styles.text, styles.bold, { fontSize: 15, marginTop: 12, marginBottom: 8, color: "#007bff" }]}>Descripción</Text>
              <TextInput
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Agregar descripción..."
                style={[styles.input, { minHeight: 100, textAlignVertical: "top" }]}
                multiline
              />
            </View>
          </ScrollView>

          <View style={[styles.row, { padding: 20, borderTopWidth: 1, borderTopColor: "#cfe3ff" }]}>
            <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#f0f6ff", paddingVertical: 14, borderColor: "#cfe3ff" }]} onPress={onClose}>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#4da6ff" }]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnActive, { flex: 1, paddingVertical: 14 }]} onPress={handleGuardar}>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#fff" }]}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ===============================
// MODAL SIMPLE DE ACTUALIZAR 
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
  );
};

// =====================================
// PANTALLA PRINCIPAL INGRESOS
// =====================================
export default function IngresosScreen({ navigation }) {
  // instantiate controlador once per component instance
  const controlador = useMemo(() => new Controlador(), []);

  // Modales
  const [modalTransaccion, setModalTransaccion] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);

  // Filtros
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalFecha, setModalFecha] = useState(false);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState(null); // guardaremos Date o null

  // Transacciones
  const [transacciones, setTransacciones] = useState([]);

  // Cargar transacciones desde controlador
  const cargarTransacciones = async () => {
    try {
      const data = await controlador.obtenerTransacciones();
      const mapped = data.map((t) => {
        const tipo = (t.ingresos && Number(t.ingresos) > 0)
          ? "Ingreso"
          : (t.gastos && Number(t.gastos) > 0)
            ? "Gasto"
            : (Number(t.cantidad) >= 0 ? "Ingreso" : "Gasto");

        const monto = tipo === "Ingreso" ? Number(t.ingresos || t.cantidad) : Number(t.gastos || t.cantidad);
        let fechaObj;
        try {
          fechaObj = new Date(t.fecha);
          if (isNaN(fechaObj.getTime())) fechaObj = new Date();
        } catch {
          fechaObj = new Date();
        }
        return {
          id: String(t.id),
          descripcion: t.desc,
          monto,
          tipo,
          categoria: t.categoria,
          fecha: fechaObj,
        };
      });

      // ordenar descendente por fecha
      mapped.sort((a, b) => b.fecha - a.fecha);
      setTransacciones(mapped);
    } catch (err) {
      console.error("Error cargando transacciones:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (controlador.initialize) await controlador.initialize();
        await cargarTransacciones();
      } catch (err) {
        console.error("Error init controlador:", err);
      }
    };

    init();

    // Listener para refrescar cuando haya cambios
    const listener = () => cargarTransacciones();
    if (controlador.addListener) controlador.addListener(listener);
    return () => {
      if (controlador.removeListener) controlador.removeListener(listener);
    };
  }, [controlador]);

  // Aplicar filtros: memoizado para rendimiento
  const transaccionesFiltradas = useMemo(() => {
    return transacciones.filter((t) => {
      let coincideCategoria = true;
      let coincideFecha = true;

      if (categoriaFiltro) {
        coincideCategoria = t.categoria === categoriaFiltro;
      }
      if (fechaFiltro instanceof Date) {
        const a = t.fecha;
        coincideFecha =
          a.getFullYear() === fechaFiltro.getFullYear() &&
          a.getMonth() === fechaFiltro.getMonth() &&
          a.getDate() === fechaFiltro.getDate();
      }
      return coincideCategoria && coincideFecha;
    });
  }, [transacciones, categoriaFiltro, fechaFiltro]);

  // Crear transacción (llamado desde modal)
  const handleCrearTransaccion = async (payload) => {
    try {
      await controlador.crearTransaccion(
        payload.fecha,
        payload.limite,
        payload.cantidad,
        payload.categoria,
        payload.desc,
        payload.ingresos,
        payload.gastos
      );
    } catch (err) {
      console.error("Error crear transacción:", err);
      throw err;
    }
  };

  // Actualizar transacción (desde modal editar)
  const handleActualizarTransaccion = async (id, payload) => {
    try {
      await controlador.actualizarTransaccion(
        id,
        payload.fecha,
        payload.limite,
        payload.cantidad,
        payload.categoria,
        payload.desc,
        payload.ingresos,
        payload.gastos
      );
    } catch (err) {
      console.error("Error actualizar transacción:", err);
      throw err;
    }
  };

  // Eliminar transacción
  const handleEliminarTransaccion = async (id) => {
    try {
      await controlador.eliminarTransaccion(id);
      setModalEliminar(false);
      setTransaccionSeleccionada(null);
    } catch (err) {
      console.error("Error al eliminar:", err);
      Alert.alert("Error", "No se pudo eliminar la transacción.");
    }
  };

  // Helpers para abrir modal editar con la transaccion
  const abrirEditar = (item) => {
    setTransaccionSeleccionada(item);
    setModalEditar(true);
  };

  // Formateo de fecha para mostrar en listado
  const formatFechaDisplay = (date) => {
    try {
      return date.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return String(date);
    }
  };

  const confirmarEliminar = () => {
    if (!transaccionSeleccionada) return;
    Alert.alert(
      "Confirmar",
      "¿Deseas eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => handleEliminarTransaccion(Number(transaccionSeleccionada.id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#e9f4ff", "#e9f4ff"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Ingresos y Transacciones</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
              <Ionicons name="person-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* TARJETAS */}
          <View style={styles.row}>
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Balance Total</Text>
              {/* Balance calculado */}
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#007bff" }]}>
                ${transacciones.reduce((acc, t) => (t.tipo === "Ingreso" ? acc + t.monto : acc - t.monto), 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Total Ingresos</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#00cc66" }]}>
                ${transacciones.filter(t => t.tipo === "Ingreso").reduce((s, t) => s + t.monto, 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.cardSmall}>
              <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 6 }]}>Total Gastos</Text>
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#ff4d4d" }]}>
                ${transacciones.filter(t => t.tipo === "Gasto").reduce((s, t) => s + t.monto, 0).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* BOTÓN AGREGAR */}
          <View style={styles.card}>
            <Text style={[styles.text, styles.bold, { fontSize: 18, marginBottom: 4, color: "#007bff" }]}>Transacciones</Text>
            <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 20 }]}>{transacciones.length} transacciones registradas</Text>

            <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={() => { setModalTransaccion(true); setTransaccionSeleccionada(null); }}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#fff" }]}>Agregar Transacción</Text>
            </TouchableOpacity>

            {/* ACTUALIZAR */}
            <TouchableOpacity style={[styles.btn, { marginTop: 12 }]} onPress={() => setModalActualizar(true)}>
              <Ionicons name="sync" size={22} color="#007bff" />
              <Text style={[styles.text, styles.bold, { fontSize: 16, color: "#007bff" }]}>Actualizar</Text>
            </TouchableOpacity>
          </View>

          {/* HISTORIAL */}
          <View style={styles.card}>
            <Text style={[styles.text, styles.bold, { fontSize: 18, marginBottom: 4, color: "#007bff" }]}>Historial de Transacciones</Text>
            <Text style={[styles.text, { fontSize: 13, color: "#4da6ff", marginBottom: 20 }]}>{transaccionesFiltradas.length} transacciones registradas</Text>
            <View style={styles.filtroBloque}>
              {/* FILTROS */}
              <Text style={[styles.text, styles.filtroTitulo]}>Filtrar por fecha</Text>
              <TouchableOpacity
                style={[styles.filtroBoton, styles.filtroBotonEspaciado]}
                onPress={() => {
                  setModalFecha(true);
                  setMostrarPicker(true);
                }}
              >
                <Text style={[styles.text, { fontWeight: "600", color: "#007bff" }]}>
                  {fechaFiltro ? fechaFiltro.toLocaleDateString("es-MX") : fechaSeleccionada.toLocaleDateString("es-MX")}
                </Text>
                <Ionicons name="calendar-outline" size={22} color="#4da6ff" />
              </TouchableOpacity>

              <Text style={[styles.text, styles.filtroTitulo]}>Filtrar por categoría</Text>
              <TouchableOpacity
                style={[styles.filtroBoton, styles.filtroBotonCategoria]}
                onPress={() => setModalCategoria(true)}
              >
                <Text style={[styles.text, { fontWeight: "600", color: "#007bff" }]}>
                  {categoriaFiltro ? categoriaFiltro : "Seleccionar categoría"}
                </Text>
                <Ionicons name="filter-outline" size={22} color="#4da6ff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={transaccionesFiltradas}
              keyExtractor={(item) => item.id}
              nestedScrollEnabled={true}
              scrollEnabled={true}
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
                    <Text style={[styles.text, { fontSize: 13, color: "#4da6ff" }]}>{formatFechaDisplay(item.fecha)} · {item.categoria}</Text>

                    <View style={[styles.badge, { backgroundColor: item.tipo === "Ingreso" ? "#e1f7ee" : "#ffecec", marginTop: 6 }]}>
                      <Text style={[styles.text, styles.bold, { fontSize: 12, color: item.tipo === "Ingreso" ? "#00cc66" : "#ff4d4d" }]}>{item.tipo}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.text, styles.bold, { fontSize: 17, marginBottom: 6, color: item.tipo === "Ingreso" ? "#00cc66" : "#ff4d4d" }]}>{item.tipo === "Ingreso" ? "+" : "-"}${item.monto.toFixed(2)}</Text>

                    {/* BOTONES */}
                    <View style={styles.row}>
                      <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => abrirEditar(item)}>
                        <Ionicons name="pencil" size={18} color="#007bff" />
                      </TouchableOpacity>

                      <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => { setTransaccionSeleccionada(item); setModalEliminar(true); }}>
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

      {/* MODALES */}
      <ModalFiltroCategoria
        visible={modalCategoria}
        onClose={() => setModalCategoria(false)}
        onSelectCategoria={(cat) => setCategoriaFiltro(cat)}
      />

      <ModalFiltroFecha
        visible={modalFecha}
        onClose={() => setModalFecha(false)}
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
        mostrarPicker={mostrarPicker}
        setMostrarPicker={setMostrarPicker}
        onApply={(d) => setFechaFiltro(d)}
      />

      <ModalTransaccion
        visible={modalTransaccion}
        onClose={() => setModalTransaccion(false)}
        onSave={handleCrearTransaccion}
      />

      {/* Modal editar */}
      <ModalTransaccion
        visible={modalEditar}
        onClose={() => { setModalEditar(false); setTransaccionSeleccionada(null); }}
        initialData={
          transaccionSeleccionada
            ? {
                fecha: transaccionSeleccionada.fecha ? transaccionSeleccionada.fecha.toISOString() : new Date().toISOString(),
                monto: transaccionSeleccionada.monto,
                tipo: transaccionSeleccionada.tipo,
                categoria: transaccionSeleccionada.categoria,
                descripcion: transaccionSeleccionada.descripcion,
              }
            : null
        }
        onSave={async (payload) => {
          if (!transaccionSeleccionada) return;
          await handleActualizarTransaccion(Number(transaccionSeleccionada.id), {
            fecha: payload.fecha,
            limite: payload.limite,
            cantidad: payload.cantidad,
            categoria: payload.categoria,
            desc: payload.desc,
            ingresos: payload.ingresos,
            gastos: payload.gastos,
          });
        }}
      />

      {/* Modal eliminar (confirmación) */}
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

              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#ff4d4d", borderColor: "#ff4d4d", marginLeft: 8 }]} onPress={() => { confirmarEliminar(); }}>
                <Text style={[styles.text, styles.bold, { color: "#fff" }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalActualizar visible={modalActualizar} onClose={() => setModalActualizar(false)} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e9f4ff", width: "100%", height: "100%" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, marginBottom: 20, gap: 10, marginTop: 20 },
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
  }, aplicarBoton: {
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

})
