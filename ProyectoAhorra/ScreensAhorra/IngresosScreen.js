import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function IngresosScreen() {
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
            <TouchableOpacity onPress={() => console.log('Volver')}>
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

          {/* Formulario */}
          <View style={styles.contenedorBlanco}>
            <Text style={styles.subtitulo}>Nueva Transacción</Text>
            <Text style={styles.descripcionSeccion}>Registra un ingreso o gasto</Text>

            <View style={styles.amountContainer}>
              <Text style={styles.amountSymbol}>$</Text>
              <Text style={styles.amountValue}>0.00</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tipo de transacción</Text>
              <View style={styles.input}>
                <Text style={styles.inputPlaceholder}>Ingreso</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Monto</Text>
              <View style={styles.input}>
                <Text style={styles.inputPlaceholder}>$0.00</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.input}>
                <Text style={styles.inputPlaceholder}>Seleccionar</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Fecha</Text>
              <View style={styles.input}>
                <Text style={styles.inputPlaceholder}>31 de octubre, 2025</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción</Text>
              <View style={[styles.input, styles.textArea]}>
                <Text style={styles.inputPlaceholder}>Agregar descripción...</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.botonGuardar}>
              <Text style={styles.botonGuardarTexto}>Guardar transacción</Text>
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
                  <Text style={[
                    styles.transaccionMonto,
                    { color: item.tipo === 'Ingreso' ? '#4caf50' : '#f44336' }
                  ]}>
                    {item.tipo === 'Ingreso' ? '+' : '-'}${item.monto.toLocaleString('es-MX')}
                  </Text>
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

  // Tarjetas de Resumen
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

  // Contenedor Blanco
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

  // Amount Display
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  amountSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 5,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Formulario
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
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
  textArea: {
    minHeight: 60,
  },
  botonGuardar: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  botonGuardarTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Transacciones
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
  transaccionMonto: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
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