import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Componente reutilizable para la barra de progreso
const ProgressBar = ({ progreso, color }) => (
  <View style={styles.progressBarContainer}>
    <View 
      style={[
        styles.progressBarFill, 
        { 
          width: `${Math.min(progreso, 100)}%`, 
          backgroundColor: color 
        }
      ]} 
    />
  </View>
);

// Componente para una Tarjeta de Categoría
const CategoriaCard = ({ nombre, gastado, total, restante, progreso, icono, colorIcono }) => {
  const colorBarra = progreso > 95 ? '#ff4d4f' : progreso > 75 ? '#faad14' : '#FFD700';
  
  return (
    <View style={styles.categoriaCard}>
      <View style={styles.categoriaHeader}>
        <View style={[styles.iconoCategoria, { backgroundColor: colorIcono }]}>
          {icono}
        </View>
        <View style={styles.categoriaInfo}>
          <Text style={styles.categoriaNombre}>{nombre}</Text>
          <Text style={styles.categoriaMonto}>
            ${gastado.toLocaleString('es-MX')} de ${total.toLocaleString('es-MX')}
          </Text>
        </View>
        <Text style={styles.categoriaPorcentaje}>{Math.round(progreso)}%</Text>
      </View>
      
      <ProgressBar progreso={progreso} color={colorBarra} />
      
      <Text style={styles.categoriaRestante}>
        Restante: ${restante.toLocaleString('es-MX')}
      </Text>
    </View>
  );
};

export default function PresupuestoMensualScreen() {
  
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
      icono: <MaterialCommunityIcons name="food-apple" size={20} color="#ff8c42" />,
      colorIcono: '#ffe8d6'
    },
    { 
      id: '2', 
      nombre: 'Salud', 
      gastado: 100, 
      total: 250, 
      icono: <MaterialCommunityIcons name="medical-bag" size={20} color="#ff6b9d" />,
      colorIcono: '#ffe0eb'
    },
  ];

  const categoriasConCalculo = categorias.map(cat => ({
    ...cat,
    restante: cat.total - cat.gastado,
    progreso: (cat.gastado / cat.total) * 100,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4dd0e1', '#00bcd4']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => console.log('Volver')}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Presupuesto mensual</Text>
          </View>

          {/* Tarjeta de Resumen */}
          <View style={styles.resumenCard}>
            <View style={styles.resumenHeader}>
              <View style={styles.resumenHeaderLeft}>
                <Ionicons name="wallet-outline" size={18} color="#fff" />
                <Text style={styles.resumenHeaderText}>Presupuesto Total</Text>
              </View>
              <Text style={styles.resumenFecha}>Octubre 2025</Text>
            </View>
            
            <Text style={styles.montoPrincipal}>${presupuestoTotal.toLocaleString('es-MX')}</Text>
            <Text style={styles.montoSecundario}>Gastado: ${gastado.toLocaleString('es-MX')}</Text>
            
            <View style={styles.resumenFooter}>
              <View style={styles.resumenFooterItem}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#fff" />
                <Text style={styles.resumenFooterText}>
                  Restante: ${restante.toLocaleString('es-MX')}
                </Text>
              </View>
              <Text style={styles.resumenPorcentaje}>{Math.round(porcentajeUsado)}% usado</Text>
            </View>
          </View>

          {/* Alertas Activas */}
          <View style={styles.contenedorBlanco}>
            <View style={styles.seccionHeader}>
              <Ionicons name="warning-outline" size={18} color="#ff9800" />
              <Text style={styles.seccionTitulo}>Alertas Activas</Text>
            </View>
            
            <View style={styles.alerta}>
              <View style={styles.alertaIcono}>
                <Ionicons name="alert-circle" size={18} color="#ff5252" />
              </View>
              <View style={styles.alertaContenido}>
                <Text style={styles.alertaTitulo}>Entretenimiento</Text>
                <Text style={styles.alertaMensaje}>Has excedido tu presupuesto en $20</Text>
              </View>
              <TouchableOpacity onPress={() => console.log('Cerrar')}>
                <Ionicons name="close" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Botones de Acción */}
            <View style={styles.botonesContainer}>
              <TouchableOpacity style={styles.botonSecundario}>
                <Ionicons name="add" size={18} color="#000" />
                <Text style={styles.botonSecundarioTexto}>Agregar Categoría</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.botonPrimario}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.botonPrimarioTexto}>Agregar Gasto</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.botonReiniciar}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={styles.botonReiniciarTexto}>Reiniciar Mes</Text>
            </TouchableOpacity>
          </View>

          {/* Categorías */}
          <View style={styles.contenedorBlanco}>
            <Text style={styles.categoriasTitulo}>Categorías</Text>
            
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
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#00bcd4" />
          <Text style={styles.navTextActive}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="swap-horizontal-outline" size={24} color="#999" />
          <Text style={styles.navText}>Transacciones</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="wallet-outline" size={24} color="#999" />
          <Text style={styles.navText}>Presupuesto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bar-chart-outline" size={24} color="#999" />
          <Text style={styles.navText}>Gráficas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00bcd4',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 15,
  },
  
  // Tarjeta de Resumen
  resumenCard: {
    backgroundColor: '#1976d2',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resumenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resumenHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumenHeaderText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.9,
  },
  resumenFecha: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  montoPrincipal: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  montoSecundario: {
    color: '#bbdefb',
    fontSize: 13,
    marginBottom: 15,
  },
  resumenFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  resumenFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumenFooterText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  resumenPorcentaje: {
    color: '#bbdefb',
    fontSize: 12,
  },
  
  // Contenedor Blanco
  contenedorBlanco: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  
  // Alerta
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  alertaIcono: {
    marginRight: 10,
  },
  alertaContenido: {
    flex: 1,
  },
  alertaTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 2,
  },
  alertaMensaje: {
    fontSize: 12,
    color: '#f57c00',
  },
  
  // Botones
  botonesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  botonSecundario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  botonSecundarioTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  botonPrimario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
  },
  botonPrimarioTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
  botonReiniciar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  botonReiniciarTexto: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  
  // Categorías
  categoriasTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  categoriaCard: {
    marginBottom: 20,
  },
  categoriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconoCategoria: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriaInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoriaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  categoriaMonto: {
    fontSize: 12,
    color: '#999',
  },
  categoriaPorcentaje: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  categoriaRestante: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  
  // Barra de Progreso
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextActive: {
    fontSize: 11,
    color: '#00bcd4',
    marginTop: 4,
    fontWeight: '500',
  },
  navText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
});