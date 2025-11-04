import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NewTransactionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Transacción</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Tipo de transacción</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.typeButton}>
            <Ionicons name="trending-up-outline" size={20} color="#00cc99" />
            <Text style={styles.typeText}>Ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeButton, styles.typeButtonActive]}>
            <Ionicons name="trending-down-outline" size={20} color="#ff6666" />
            <Text style={[styles.typeText, { color: '#ff6666' }]}>Gasto</Text>
          </TouchableOpacity>
        </View>

        <Label text="Monto *" />
        <View style={styles.inputRow}>
          <Text style={styles.currency}>$</Text>
          <TextInput style={styles.input} placeholder="0" keyboardType="numeric" />
        </View>

        <Label text="Categoría *" />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Selecciona una categoría"
            editable={false}
          />
          <Ionicons name="chevron-down" size={18} color="#777" />
        </View>

        <Label text="Fecha *" />
        <View style={styles.inputRow}>
          <Ionicons name="calendar-outline" size={18} color="#777" />
          <Text style={styles.inputText}>28 de octubre de 2025</Text>
        </View>

        <Label text="Descripción *" />
        <TextInput
          style={styles.textArea}
          placeholder="Ej: Compra en supermercado"
          placeholderTextColor="#aaa"
          multiline
        />

        <View style={styles.infoBox}>
          <Ionicons name="lock-closed-outline" size={16} color="#007aff" />
          <Text style={styles.infoText}>Los datos se guardarán de forma segura</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Guardar Transacción</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 6, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  typeButtonActive: { borderColor: '#ff6666', backgroundColor: '#ffecec' },
  typeText: { fontSize: 14, marginTop: 4, color: '#333' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  currency: { fontSize: 16, color: '#333', marginRight: 4 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  inputText: { flex: 1, fontSize: 15, color: '#333', marginLeft: 8 },
  textArea: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f2ff',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  infoText: { fontSize: 12, color: '#007aff', marginLeft: 6 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
  },
  cancelText: { textAlign: 'center', color: '#333', fontWeight: '600' },
  saveText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
});
