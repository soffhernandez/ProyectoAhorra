import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({ icon, placeholder, value, secure }) => (
  <View style={styles.inputRow}>
    <Ionicons name={icon} size={16} color="#999" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      value={value}
      editable={!value}
      secureTextEntry={secure}
    />
  </View>
);

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Perfil</Text>
        <Ionicons name="search" size={22} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Ionicons name="person-outline" size={60} color="#fff" />
          <Text style={styles.profileText}>Mi perfil</Text>
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <SectionHeader icon="information-circle-outline" title="Información Personal" subtitle="Actualiza tus datos personales y de contacto" />
          <Label text="Nombre completo" />
          <InputField icon="person-outline" value="Ana García Martínez" />
          <Label text="Correo electrónico" />
          <InputField icon="mail-outline" value="ana.garcia@email.com" />
          <Label text="Teléfono" />
          <InputField icon="call-outline" value="+34 612 345 678" />
        </View>

        {/* Seguridad */}
        <View style={styles.section}>
          <SectionHeader icon="lock-closed-outline" title="Seguridad" subtitle="Cambia tu contraseña para mantener tu cuenta segura" />
          <Label text="Contraseña actual" />
          <InputField icon="lock-open-outline" placeholder="Introduce tu contraseña actual" secure />
          <Label text="Nueva contraseña" />
          <InputField icon="key-outline" placeholder="Introduce una nueva contraseña" secure />
          <Label text="Confirmar contraseña" />
          <InputField icon="checkmark-circle-outline" placeholder="Confirma tu nueva contraseña" secure />

          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateText}>Actualizar información</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomBar}>
        {[
          ['home-outline', 'Inicio'],
          ['swap-horizontal-outline', 'Transacciones'],
          ['wallet-outline', 'Presupuesto'],
          ['bar-chart-outline', 'Gráficas'],
        ].map(([icon, label]) => (
          <TouchableOpacity key={label} style={styles.bottomButton}>
            <Ionicons name={icon} size={22} color="#007aff" />
            <Text style={styles.bottomText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Small helper components
const SectionHeader = ({ icon, title, subtitle }) => (
  <>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color="#00aaff" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
  </>
);

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f4ff' },
  header: {
    backgroundColor: '#00aaff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  profileCard: {
    margin: 16,
    backgroundColor: '#66ccff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileText: { color: '#fff', fontSize: 16, marginTop: 8 },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontWeight: 'bold', fontSize: 15, color: '#333', marginLeft: 6 },
  sectionSubtitle: { fontSize: 12, color: '#777', marginBottom: 10 },
  label: { fontSize: 13, color: '#333', marginTop: 8, marginBottom: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  inputIcon: { marginRight: 6 },
  input: { flex: 1, paddingVertical: 6, color: '#333' },
  updateButton: {
    backgroundColor: '#00cc99',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  updateText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 25,
  },
  logoutText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  bottomButton: { alignItems: 'center' },
  bottomText: { fontSize: 12, color: '#007aff', marginTop: 2 },
});
