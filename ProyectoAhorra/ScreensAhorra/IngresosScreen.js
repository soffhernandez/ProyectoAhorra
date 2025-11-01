import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  // para el degradado

export default function IngresosScreen() {
  const transaccionesEjemplo = [
    { id: '1', descripcion: 'Salario mensual', monto: '+$3500.00', tipo: 'Ingreso', categoria: 'Sueldo', fecha: '20 sep. 2025' },
    { id: '2', descripcion: 'Compras del supermercado', monto: '-$450.00', tipo: 'Gasto', categoria: 'Alimentación', fecha: '4 oct. 2025' },
    { id: '3', descripcion: 'Gasolina', monto: '-$120.00', tipo: 'Gasto', categoria: 'Transporte', fecha: '9 oct. 2025' },
    { id: '4', descripcion: 'Proyecto freelance', monto: '+$500.00', tipo: 'Ingreso', categoria: 'Otros', fecha: '14 oct. 2025' },
    { id: '5', descripcion: 'Cine y cena', monto: '-$80.00', tipo: 'Gasto', categoria: 'Entretenimiento', fecha: '21 oct. 2025' },
  ];

  return (
    <LinearGradient colors={['#5fc9f8', '#b3e5ff']} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {/* 🔹 Título */}
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff' }}>Ingresos</Text>
        </View>

        {/* 🔹 Tarjetas superiores */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          <View style={styles.cardResumen}>
            <Text style={styles.labelResumen}>Balance Total</Text>
            <Text style={{ color: '#333', fontWeight: 'bold' }}>$3350.00</Text>
          </View>
          <View style={styles.cardResumen}>
            <Text style={styles.labelResumen}>Total Ingresos</Text>
            <Text style={{ color: 'green', fontWeight: 'bold' }}>$4000.00</Text>
          </View>
          <View style={styles.cardResumen}>
            <Text style={styles.labelResumen}>Total Gastos</Text>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>$650.00</Text>
          </View>
        </View>

        {/* 🔹 Formulario */}
        <View style={styles.contenedorBlanco}>
          <Text style={styles.subtitulo}>Nueva Transacción</Text>
          <Text style={{ color: '#888', marginBottom: 10 }}>Registra un ingreso o gasto</Text>

          <TextInput style={styles.input} placeholder="Tipo de transacción" />
          <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Categoría" />
          <TextInput style={styles.input} placeholder="Fecha" />
          <TextInput style={styles.input} placeholder="Descripción" />

          <TouchableOpacity style={styles.botonGuardar}>
            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>+ Guardar Transacción</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 Lista de transacciones */}
        <View style={styles.contenedorBlanco}>
          <Text style={styles.subtitulo}>Historial de Transacciones</Text>
          <Text style={{ color: '#888', marginBottom: 10 }}>5 transacciones registradas</Text>

          <FlatList
            data={transaccionesEjemplo}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.transaccion}>
                <View>
                  <Text style={{ fontWeight: '600' }}>{item.descripcion}</Text>
                  <Text style={{ color: '#666', fontSize: 12 }}>
                    {item.fecha} · {item.categoria}
                  </Text>
                </View>
                <Text style={{ color: item.tipo === 'Ingreso' ? 'green' : 'red', fontWeight: 'bold' }}>
                  {item.monto}
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = {
  cardResumen: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
  },
  labelResumen: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  contenedorBlanco: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  botonGuardar: {
    backgroundColor: '#005cff',
    padding: 12,
    borderRadius: 6,
    marginTop: 5,
  },
  transaccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
};