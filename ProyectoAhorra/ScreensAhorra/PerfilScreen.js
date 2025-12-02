import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseService from "../database/DatabaseService";

const Field = ({ icon, value }) => (
  <View style={styles.inputRow}>
    <Ionicons name={icon} size={16} color="#999" style={{ marginRight: 6 }} />
    <TextInput style={styles.input} value={value} editable={false} />
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

export default function PerfilScreen({ navigation }) {

  const [user, setUser] = useState({
    nombre: "",
    correo: "",
    telefono: ""
  });

  useEffect(() => {
    async function cargarUsuario() {
      const datos = await DatabaseService.obtenerUltimoUsuario();
      if (datos) setUser(datos);
    }
    cargarUsuario();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
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
          <Field icon="person-outline" value={user.nombre} />

          <Text style={styles.label}>Correo electrónico</Text>
          <Field icon="mail-outline" value={user.correo} />

          <Text style={styles.label}>Teléfono</Text>
          <Field icon="call-outline" value={user.telefono} />

        </Section>

        <TouchableOpacity
          style={styles.logout}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "InicioApp" }],
            })
          }
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f4ff', width: '100%' },
  header: {
    backgroundColor: "#4da6ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  profileCard: {
    backgroundColor: '#66ccff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 16
  },
  scrollContent: { paddingTop: 110, paddingBottom: 140, paddingHorizontal: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    paddingHorizontal: 8
  },
  input: { flex: 1, paddingVertical: 6, color: '#333' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontWeight: 'bold', fontSize: 15, color: '#333', marginLeft: 6 },
  sectionSubtitle: { fontSize: 12, color: '#777', marginBottom: 10 },
  label: { fontSize: 13, color: '#333', marginTop: 8, marginBottom: 4 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 25,
    marginTop: 10
  },
  logoutText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },
  profileText: { color: '#fff', fontSize: 16, marginTop: 8 }
});
