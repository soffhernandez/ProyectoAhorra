import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // para el degradado
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Para los iconos

// Componente reutilizable para la barra de progreso
const ProgressBar = ({ progreso, color }) => (
  <View style={styles.progressBarContainer}>
    <View style={{ ...styles.progressBarFill, width: '${progreso}%', backgroundColor: color }} />
  </View>
);

// Componente para una Tarjeta de Categoría
const CategoriaCard = ({ nombre, gastado, total, restante, progreso, icono, colorIcono }) => (
  <View style={styles.categoriaCard}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ ...styles.iconoCategoria, backgroundColor: colorIcono || '#f0f0f0' }}>
        {icono}
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.categoriaNombre}>{nombre}</Text>
        <Text style={styles.categoriaMonto}>${gastado} de ${total}</Text>
      </View>
    </View>
    
    <ProgressBar 
        progreso={progreso} 
        color={progreso > 95 ? '#ff4d4f' : '#32CD32'} // Rojo si está casi al límite, Verde si está bien
    />
    
    <Text style={styles.categoriaRestante}>
      Restante: *${restante}*
      <Text style={{ color: '#888' }}> | {Math.round(progreso)}%</Text>
    </Text>
  </View>
);

export default function PresupuestoMensualScreen() {
  
  // --- Datos de la Interfaz ---
  const presupuestoTotal = 1650;
  const gastado = 1330;
  const restante = presupuestoTotal - gastado;
  const porcentajeUsado = (gastado / presupuestoTotal) * 100;

  const categorias = [
    { 
      id: '1', 
      nombre: 'Alimentos', 
      gastado: 480, 
      total: 500, 
      icono: <MaterialCommunityIcons name="food-fork-drink" size={24} color="#e87c00" />,
      colorIcono: '#fff2e5'
    },
    { 
      id: '2', 
      nombre: 'Salud', 
      gastado: 100, 
      total: 250, 
      icono: <Ionicons name="medical" size={24} color="#389e0d" />,
      colorIcono: '#f6ffed'
    },
  ];

  const categoriasConCalculo = categorias.map(cat => ({
    ...cat,
    restante: cat.total - cat.gastado,
    progreso: (cat.gastado / cat.total) * 100,
  }));

  return (
    <LinearGradient colors={['#5fc9f8', '#00bfff']} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        
        {/* 🔹 Cabecera (Flecha y Título) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => console.log('Volver')}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Presupuesto mensual</Text>
        </View>

        {/* 🔹 Tarjeta de Resumen */}
        <View style={styles.resumenCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Ionicons name="card" size={24} color="#fff" />
            <Text style={{ color: '#fff' }}>Octubre 2025</Text>
          </View>
          <Text style={styles.montoPrincipal}>${presupuestoTotal.toLocaleString('es-MX')}</Text>
          <Text style={styles.montoSecundario}>Gastado: ${gastado.toLocaleString('es-MX')}</Text>
          
          <View style={styles.resumenPie}>
            <MaterialCommunityIcons name="chart-areaspline" size={20} color="#fff" />
            <Text style={styles.resumenRestante}>Restante: *${restante.toLocaleString('es-MX')}*</Text>
            <Text style={styles.resumenPorcentaje}>{Math.round(porcentajeUsado)}% usado</Text>
          </View>
        </View>

        {/* --- */}
        
        {/* 🔹 Contenedor de Alertas y Botones */}
        <View style={styles.contenedorAlertaYBotones}>
          <Text style={styles.subtituloAlert}>
            <Ionicons name="alert-circle-outline" size={18} color="#faad14" /> Alertas Activas
          </Text>
          
          {/* Alerta de Entretenimiento */}
          <View style={styles.alerta}>
            <MaterialCommunityIcons name="alert" size={20} color="#ff4d4f" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
                <Text style={styles.alertaTexto}>Entretenimiento</Text>
                <Text style={styles.alertaMensaje}>Has excedido tu presupuesto en $20</Text>
            </View>
            <TouchableOpacity onPress={() => console.log('Cerrar Alerta')}>
              <Ionicons name="close" size={24} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Botones de Acción */}
          <View style={styles.botonesAccion}>
            <TouchableOpacity style={styles.botonAgregarCategoria}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>+ Agregar Categoría</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonAgregarGasto}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Agregar Gasto</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.botonReiniciar}>
            <Ionicons name="sync" size={18} color="#555" />
            <Text style={{ color: '#555', marginLeft: 5 }}>Reiniciar Mes</Text>
          </TouchableOpacity>
        </View>

        {/* --- */}

        {/* 🔹 Lista de Categorías */}
        <View style={styles.contenedorCategorias}>
          <Text style={{ ...styles.subtitulo, marginBottom: 15 }}>Categorías</Text>
          <FlatList
            data={categoriasConCalculo}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <CategoriaCard 
                nombre={item.nombre} 
                gastado={item.gastado} 
                total={item.total} 
                restante={item.restante}
                progreso={item.progreso}
                icono={item.icono}
                colorIcono={item.colorIcono}
              />
            )}
          />
        </View>
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  // --- Tarjeta de Resumen
  resumenCard: {
    backgroundColor: '#005cff',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 8,
  },
  montoPrincipal: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  montoSecundario: {
    color: '#b3e5ff',
    fontSize: 14,
    marginBottom: 10,
  },
  resumenPie: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 1,
  },
  resumenRestante: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  resumenPorcentaje: {
    color: '#b3e5ff',
    fontSize: 14,
    marginLeft: 'auto',
  },
  // --- Contenedores de Alerta y Categorías
  contenedorAlertaYBotones: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  contenedorCategorias: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtituloAlert: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  // --- Alerta
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6', // Fondo amarillo claro
    borderColor: '#faad14', // Borde amarillo
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  alertaTexto: {
    color: '#d46b08',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertaMensaje: {
    color: '#d46b08',
    fontSize: 13,
  },
  // --- Botones de Acción
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  botonAgregarCategoria: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  botonAgregarGasto: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  botonReiniciar: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 8,
  },
  // --- Categorías
  categoriaCard: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 10,
    // Estilos que imitan la separación visual de la imagen
  },
  iconoCategoria: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriaNombre: {
    fontWeight: '600',
    fontSize: 15,
  },
  categoriaMonto: {
    color: '#666',
    fontSize: 12,
  },
  categoriaRestante: {
    fontSize: 13,
    color: '#333',
    marginTop: 5,
  },
  // --- Barra de Progreso
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
    marginTop: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});