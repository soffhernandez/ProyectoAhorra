import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
        <View style={styles.categoriaAcciones}>
          <Text style={styles.categoriaPorcentaje}>{Math.round(progreso)}%</Text>
          <View style={styles.botonesAccionCat}>
            <TouchableOpacity style={styles.botonAccionCat}>
              <Ionicons name="pencil" size={14} color="#1976d2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonAccionCat}>
              <Ionicons name="trash" size={14} color="#f44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <ProgressBar progreso={progreso} color={colorBarra} />
      
      <Text style={styles.categoriaRestante}>
        Restante: ${restante.toLocaleString('es-MX')}
      </Text>
    </View>
  );
};

const ModalAgregarCategoria = ({ visible, onClose }) => {
  const [iconoSeleccionado, setIconoSeleccionado] = useState(0);
  const [nombre, setNombre] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  
  const iconos = [
    { id: 0, icono: 'cart', color: '#4dd0e1' },
    { id: 1, icono: 'home', color: '#ff8a80' },
    { id: 2, icono: 'car', color: '#ff80ab' },
    { id: 3, icono: 'fast-food', color: '#ffd54f' },
    { id: 4, icono: 'bulb', color: '#ffeb3b' },
    { id: 5, icono: 'game-controller', color: '#b388ff' },
    { id: 6, icono: 'shirt', color: '#69f0ae' },
    { id: 7, icono: 'fitness', color: '#ff5252' },
    { id: 8, icono: 'book', color: '#64b5f6' },
    { id: 9, icono: 'airplane', color: '#4dd0e1' },
    { id: 10, icono: 'gift', color: '#ba68c8' },
    { id: 11, icono: 'paw', color: '#ff9800' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Agregar Categoría</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalBody}>
              <Text style={styles.labelModal}>Nombre de la categoría</Text>
              <TextInput 
                style={styles.inputModalText}
                placeholder="Ej: Alimentos"
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
              />

              <Text style={styles.labelModal}>Presupuesto</Text>
              <View style={styles.inputConIcono}>
                <Text style={styles.inputIcono}>$</Text>
                <TextInput 
                  style={[styles.inputModalText, { paddingLeft: 30 }]}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={presupuesto}
                  onChangeText={setPresupuesto}
                />
              </View>

              <Text style={styles.labelModal}>Ícono</Text>
              <View style={styles.iconosGrid}>
                {iconos.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.iconoItem,
                      { backgroundColor: item.color + '20' },
                      iconoSeleccionado === item.id && styles.iconoItemSeleccionado
                    ]}
                    onPress={() => setIconoSeleccionado(item.id)}
                  >
                    <Ionicons name={item.icono} size={28} color={item.color} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.botonModalCancelar} onPress={onClose}>
              <Text style={styles.botonModalCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonModalAgregar} onPress={onClose}>
              <Text style={styles.botonModalAgregarTexto}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ModalAgregarGasto = ({ visible, onClose, categorias }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Agregar Gasto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalBody}>
              <Text style={styles.labelModal}>Categoría</Text>
              <View style={styles.categoriasLista}>
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoriaItemSelect,
                      categoriaSeleccionada === cat.id && styles.categoriaItemSelectActive
                    ]}
                    onPress={() => setCategoriaSeleccionada(cat.id)}
                  >
                    <Ionicons 
                      name={cat.iconoNombre} 
                      size={20} 
                      color={categoriaSeleccionada === cat.id ? '#fff' : cat.iconoColor} 
                    />
                    <Text style={[
                      styles.categoriaItemSelectText,
                      categoriaSeleccionada === cat.id && { color: '#fff' }
                    ]}>
                      {cat.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.labelModal}>Monto</Text>
              <View style={styles.inputConIcono}>
                <Text style={styles.inputIcono}>$</Text>
                <TextInput 
                  style={[styles.inputModalText, { paddingLeft: 30 }]}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={monto}
                  onChangeText={setMonto}
                />
              </View>

              <Text style={styles.labelModal}>Descripción</Text>
              <TextInput 
                style={[styles.inputModalText, styles.textAreaModal]}
                placeholder="Agregar descripción..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={descripcion}
                onChangeText={setDescripcion}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.botonModalCancelar} onPress={onClose}>
              <Text style={styles.botonModalCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonModalAgregar} onPress={onClose}>
              <Text style={styles.botonModalAgregarTexto}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function PresupuestoMensualScreen() {
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);
  
  const categorias = [
    { 
      id: '1', 
      nombre: 'Alimentos', 
      total: 5000, 
      gastado: 4800,
      iconoNombre: 'fast-food',
      iconoColor: '#ffd54f'
    },
    { 
      id: '2', 
      nombre: 'Salud', 
      total: 2500, 
      gastado: 1000,
      iconoNombre: 'fitness',
      iconoColor: '#ff5252'
    },
  ];

  const presupuestoTotal = 7500;
  const gastado = 5800;
  const restante = 1700;
  const porcentajeUsado = 77;

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
            <TouchableOpacity>
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
              <Text style={styles.resumenFecha}>Noviembre 2025</Text>
            </View>
            
            <Text style={styles.montoPrincipal}>${presupuestoTotal.toLocaleString('es-MX')}</Text>
            <Text style={styles.montoSecundario}>Gastado: ${gastado.toLocaleString('es-MX')}</Text>
            
            <View style={styles.resumenFooter}>
              <View style={styles.resumenFooterItem}>
                <Ionicons name="trending-up" size={16} color="#fff" />
                <Text style={styles.resumenFooterText}>
                  Restante: ${restante.toLocaleString('es-MX')}
                </Text>
              </View>
              <Text style={styles.resumenPorcentaje}>{porcentajeUsado}% usado</Text>
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
                <Text style={styles.alertaTitulo}>Alimentos</Text>
                <Text style={styles.alertaMensaje}>Casi alcanzas tu límite</Text>
              </View>
            </View>
          </View>

          {/* Botones de Acción */}
          <View style={styles.contenedorBlanco}>
            <View style={styles.botonesContainer}>
              <TouchableOpacity 
                style={styles.botonSecundario}
                onPress={() => setModalCategoria(true)}
              >
                <Ionicons name="add" size={18} color="#000" />
                <Text style={styles.botonSecundarioTexto}>Agregar Categoría</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.botonPrimario}
                onPress={() => setModalGasto(true)}
              >
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
            <Text style={styles.categoriasTitulo}>Categorías ({categorias.length})</Text>
            
            {categoriasConCalculo.map((item) => (
              <CategoriaCard 
                key={item.id}
                nombre={item.nombre} 
                gastado={item.gastado} 
                total={item.total} 
                restante={item.restante}
                progreso={item.progreso}
                icono={<Ionicons name={item.iconoNombre} size={20} color={item.iconoColor} />}
                colorIcono={item.iconoColor + '30'}
              />
            ))}
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

      {/* Modales */}
      <ModalAgregarCategoria 
        visible={modalCategoria} 
        onClose={() => setModalCategoria(false)}
      />
      
      <ModalAgregarGasto 
        visible={modalGasto} 
        onClose={() => setModalGasto(false)}
        categorias={categorias}
      />
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
  
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
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
  categoriaAcciones: {
    alignItems: 'flex-end',
  },
  categoriaPorcentaje: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  botonesAccionCat: {
    flexDirection: 'row',
    gap: 8,
  },
  botonAccionCat: {
    padding: 4,
  },
  categoriaRestante: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  labelModal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  inputModalText: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  inputConIcono: {
    position: 'relative',
  },
  inputIcono: {
    position: 'absolute',
    left: 12,
    top: 14,
    fontSize: 14,
    color: '#666',
    zIndex: 1,
  },
  textAreaModal: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  iconosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  iconoItem: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconoItemSeleccionado: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  categoriasLista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  categoriaItemSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  categoriaItemSelectActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  categoriaItemSelectText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  botonModalCancelar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  botonModalCancelarTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  botonModalAgregar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  botonModalAgregarTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});