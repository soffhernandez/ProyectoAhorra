import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Field = ({ icon, placeholder, value, secure }) => (
  <View style={styles.inputRow}>
    <Ionicons name={icon} size={16} color="#999" style={{ marginRight: 6 }} />
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

const Section = ({ icon, title, subtitle, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color="#00aaff" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    {children}
  </View>
);

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Perfil</Text>
        <Ionicons name="search" size={22} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Ionicons name="person-outline" size={60} color="#fff" />
          <Text style={styles.profileText}>Mi perfil</Text>
        </View>

        <Section
          icon="information-circle-outline"
          title="Información Personal"
          subtitle="Actualiza tus datos personales y de contacto">
          <Text style={styles.label}>Nombre completo</Text>
          <Field icon="person-outline" value="Ana García Martínez" />
          <Text style={styles.label}>Correo electrónico</Text>
          <Field icon="mail-outline" value="ana.garcia@email.com" />
          <Text style={styles.label}>Teléfono</Text>
          <Field icon="call-outline" value="+52 442 5678 678" />
        </Section>

        <Section
          icon="lock-closed-outline"
          title="Seguridad"
          subtitle="Cambia tu contraseña para mantener tu cuenta segura">
          <Text style={styles.label}>Contraseña actual</Text>
          <Field icon="lock-open-outline" placeholder="Introduce tu contraseña actual" secure />
          <Text style={styles.label}>Nueva contraseña</Text>
          <Field icon="key-outline" placeholder="Introduce una nueva contraseña" secure />
          <Text style={styles.label}>Confirmar contraseña</Text>
          <Field icon="checkmark-circle-outline" placeholder="Confirma tu nueva contraseña" secure />
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateText}>Actualizar información</Text>
          </TouchableOpacity>
        </Section>

        <TouchableOpacity style={styles.logout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

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

const styles = StyleSheet.create({
 container: { 
    flex: 1, 
    backgroundColor: '#e0f4ff',
    width: '100%',
  },
  header: {
    backgroundColor: '#4da6ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#66ccff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: { flex: 1, paddingVertical: 6, color: '#333' },
  updateButton: {
    backgroundColor: '#00cc99',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  bottomButton: { alignItems: 'center', flex: 1 },
  bottomText: { fontSize: 12, color: '#007aff', marginTop: 2 },
  scrollContent: { paddingTop: 110, paddingBottom: 140, paddingHorizontal: 16 },
  profileText: { color: '#fff', fontSize: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontWeight: 'bold', fontSize: 15, color: '#333', marginLeft: 6 },
  sectionSubtitle: { fontSize: 12, color: '#777', marginBottom: 10 },
  label: { fontSize: 13, color: '#333', marginTop: 8, marginBottom: 4 },
  updateText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  logoutText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },
});
