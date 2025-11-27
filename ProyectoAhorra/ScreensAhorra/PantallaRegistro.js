import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function PantallaRegistro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [telefono, setTelefono] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  function registrarUsuario() {
    alert(`Registro completo:\n${nombre}\n${correo}`);
  }

  return (
    <View style={styles.page}>
      <View style={styles.phoneContainer}>

        <KeyboardAvoidingView
          style={styles.centeredContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollCentered}
            showsVerticalScrollIndicator={false}
          >

            <Text style={styles.title}>DATOS PERSONALES</Text>

            {/* NOMBRE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOMBRE COMPLETO</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            {/* CORREO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CORREO</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@gmail.com"
                value={correo}
                onChangeText={setCorreo}
              />
            </View>

            {/* CONTRASEÑA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONTRASEÑA</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={contrasena}
                onChangeText={setContrasena}
              />
            </View>

            {/* CONFIRMAR CONTRASEÑA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmar}
                onChangeText={setConfirmar}
              />
            </View>

            {/* TELEFONO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TELÉFONO</Text>
              <TextInput
                style={styles.input}
                placeholder="(000) 000 0000"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
            </View>

            {/* TÉRMINOS Y CONDICIONES */}
            <View style={styles.switchContainer}>
              <Switch
                value={aceptaTerminos}
                onValueChange={setAceptaTerminos}
              />
              <Text style={styles.switchText}>Acepto términos y condiciones.</Text>
            </View>

            {/* BOTÓN */}
            <TouchableOpacity
              style={styles.button}
              onPress={registrarUsuario}
            >
              <Text style={styles.buttonText}>REGISTRARSE</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#cfe3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  phoneContainer: {
    width: 380,
    height: 750,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  centeredContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
  },

  scrollCentered: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 25,
    width: '100%',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },

  inputGroup: {
    width: '90%',
    marginBottom: 18,
    alignSelf: 'center',
  },

  label: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 5,
    color: '#222',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 12,
    alignSelf: 'center',
  },

  switchText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },

  button: {
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
