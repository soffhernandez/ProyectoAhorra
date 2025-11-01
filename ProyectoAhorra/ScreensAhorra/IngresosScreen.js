import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Modal para Agregar/Editar Transacción
const ModalTransaccion = ({ visible, onClose }) => {
  const categorias = ['Sueldo', 'Freelance', 'Inversiones', 'Otros'];

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
            <Text style={styles.modalTitulo}>Nueva Transacción</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalBody}>
              
              {/* Monto Grande */}
              <View style={styles.amountContainerModal}>
                <Text style={styles.amountSymbolModal}>$</Text>
                <Text style={styles.amountValueModal}>0.00</Text>
              </View>

              {/* Tipo de transacción */}
              <Text style={styles.labelModal}>Tipo de transacción</Text>
              <View style={styles.tipoSelector}>
                <View style={[styles.tipoBoton, styles.tipoBotonActivo]}>
                  <Ionicons name="arrow-down" size={20} color="#fff" />
                  <Text style={[styles.tipoBotonTexto, styles.tipoBotonTextoActivo]}>
                    Ingreso
                  </Text>
                </View>

                <View style={styles.tipoBoton}>
                  <Ionicons name="arrow-up" size={20} color="#f44336" />
                  <Text style={styles.tipoBotonTexto}>Gasto</Text>
                </View>
              </View>

              {/* Categoría */}
              <Text style={styles.labelModal}>Categoría</Text>
              <View style={styles.categoriasGrid}>
                {categorias.map((cat) => (
                  <View key={cat} style={styles.categoriaChip}>
                    <Text style={styles.categoriaChipTexto}>{cat}</Text>
                  </View>
                ))}
              </View>

              {/* Fecha */}
              <Text style={styles.labelModal}>Fecha</Text>
              <View style={styles.inputModal}>
                <Ionicons name="calendar-outline" size={18} color="#666" />
                <Text style={styles.inputModalTexto}>31 de octubre, 2025</Text>
              </View>

              {/* Descripción */}
              <Text style={styles.labelModal}>Descripción</Text>
              <View style={[styles.inputModalField, styles.textAreaModal]}>
                <Text style={styles.inputPlaceholder}>Agregar descripción...</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.botonModalCancelar} onPress={onClose}>
              <Text style={styles.botonModalCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonModalGuardar} onPress={onClose}>
              <Text style={styles.botonModalGuardarTexto}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function IngresosScreen() {
  const [modalTransaccion, setModalTransaccion] = useState(false);

  const transaccionesEjemplo = [
    { id: '1', descripcion: 'Salario mensual', monto: 3500.00, tipo: 'Ingreso', categoria: 'Sueldo', fecha: '20 de sep. 2025' },
    { id: '2', descripcion: 'Compras del supermercado', monto: 450.00, tipo: 'Gasto', categoria: 'Alimentación', fecha: '4 de oct. 2025' },
    { id: '3', descripcion: 'Gasolina', monto: 120.00, tipo: 'Gasto', categoria: 'Transporte', fecha: '9 de oct. 2025' },
    { id: '4', descripcion: 'Proyecto freelance', monto: 500.00, tipo: 'Ingreso', categoria: 'Otros', fecha: '14 de oct. 2025' },
    { id: '5', descripcion: 'Cine y cena', monto: 80.00, tipo: 'Gasto', categoria: 'Entretenimiento', fecha: '21 de oct. 2025' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4dd0e1', '#00bcd4']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Ingresos</Text>
            <View style={{ width: 26 }} />
          </View>

          {/* Tarjetas de Resumen */}
          <View style={styles.tarjetasResumen}>
            <View style={styles.cardResumen}>
              <Text style={styles.labelResumen}>Balance Total</Text>
              <Text style={styles.montoResumen}>$3,350.00</Text>
            </View>
            <View style={styles.cardResumen}>
              <Text style={styles.labelResumen}>Total Ingresos</Text>
              <Text style={[styles.montoResumen, { color: '#4caf50' }]}>$4,000.00</Text>
            </View>
            <View style={styles.cardResumen}>
              <Text style={styles.labelResumen}>Total Gastos</Text>
              <Text style={[styles.montoResumen, { color: '#f44336' }]}>$650.00</Text>
            </View>
          </View>

          {/* Botón para agregar */}
          <View style={styles.contenedorBlanco}>
            <Text style={styles.subtitulo}>Transacciones</Text>
            <Text style={styles.descripcionSeccion}>Registra tus ingresos y gastos</Text>

            <TouchableOpacity 
              style={styles.botonAgregar}
              onPress={() => setModalTransaccion(true)}
            >
              <Ionicons name="add-circle" size={22} color="#fff" />
              <Text style={styles.botonAgregarTexto}>Agregar Transacción</Text>
            </TouchableOpacity>
          </View>

          {/* Historial de Transacciones */}
          <View style={styles.contenedorBlanco}>
            <Text style={styles.subtitulo}>Historial de Transacciones</Text>
            <Text style={styles.descripcionSeccion}>5 transacciones registradas</Text>

            <FlatList
              data={transaccionesEjemplo}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.transaccionItem}>
                  <View style={styles.transaccionIcono}>
                    {item.tipo === 'Ingreso' ? (
                      <Ionicons name="arrow-down" size={20} color="#4caf50" />
                    ) : (
                      <Ionicons name="arrow-up" size={20} color="#f44336" />
                    )}
                  </View>
                  <View style={styles.transaccionInfo}>
                    <Text style={styles.transaccionDescripcion}>{item.descripcion}</Text>
                    <Text style={styles.transaccionDetalles}>
                      {item.fecha} · {item.categoria}
                    </Text>
                    <View style={[
                      styles.transaccionTipoBadge, 
                      { backgroundColor: item.tipo === 'Ingreso' ? '#e8f5e9' : '#ffebee' }
                    ]}>
                      <Text style={[
                        styles.transaccionTipoBadgeText,
                        { color: item.tipo === 'Ingreso' ? '#4caf50' : '#f44336' }
                      ]}>
                        {item.tipo}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transaccionAcciones}>
                    <Text style={[
                      styles.transaccionMonto,
                      { color: item.tipo === 'Ingreso' ? '#4caf50' : '#f44336' }
                    ]}>
                      {item.tipo === 'Ingreso' ? '+' : '-'}${item.monto.toLocaleString('es-MX')}
                    </Text>
                    <View style={styles.accionesBotones}>
                      <TouchableOpacity style={{ marginRight: 10 }}>
                        <Ionicons name="pencil" size={16} color="#1976d2" />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Ionicons name="trash" size={16} color="#f44336" />
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

      {/* Modal */}
      <ModalTransaccion
        visible={modalTransaccion}
        onClose={() => setModalTransaccion(false)}
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
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },

  tarjetasResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  cardResumen: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  labelResumen: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
    textAlign: 'center',
  },
  montoResumen: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  contenedorBlanco: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  descripcionSeccion: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },

  botonAgregar: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botonAgregarTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  transaccionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  transaccionIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transaccionInfo: {
    flex: 1,
  },
  transaccionDescripcion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transaccionDetalles: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  transaccionTipoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  transaccionTipoBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  transaccionAcciones: {
    alignItems: 'flex-end',
  },
  transaccionMonto: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  accionesBotones: {
    flexDirection: 'row',
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

  amountContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  amountSymbolModal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 5,
  },
  amountValueModal: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },

  labelModal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  inputModal: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputModalTexto: {
    fontSize: 14,
    color: '#333',
  },
  inputModalField: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  textAreaModal: {
    minHeight: 100,
  },

  tipoSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  tipoBoton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  tipoBotonActivo: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  tipoBotonTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tipoBotonTextoActivo: {
    color: '#fff',
  },

  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  categoriaChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoriaChipTexto: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
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
  botonModalGuardar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  botonModalGuardarTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});