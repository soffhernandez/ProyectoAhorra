import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function PantallaRegistro({navigation}) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [telefono, setTelefono] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [nose, setNose] = useState(false);

  function registrarUsuario() {
    alert('Registro completo:\n' + nombre + '\n' + correo);
  }

  return (
    <View style={styles.page}>
       <View style={styles.phoneContainer}>
      <KeyboardAvoidingView
        style={styles.centeredContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollCentered}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Feather name="arrow-left" size={28} color="#000" />
  </TouchableOpacity>

  <Text style={styles.title}>DATOS PERSONALES</Text>
</View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOMBRE COMPLETO</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CORREO</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@gmail.com"
              value={correo}
              onChangeText={setCorreo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder=""
              value={contrasena}
              onChangeText={setContrasena}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder=""
              value={confirmar}
              onChangeText={setConfirmar}
            />
          </View>

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

          <View style={styles.switchContainer}>
            <Switch value={aceptaTerminos} onValueChange={setAceptaTerminos} />
            <Text style={styles.switchText}>Acepto términos y condiciones.</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
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
  justifyContent: 'center',
  alignItems: 'stretch',
},

scrollCentered: {
  justifyContent: 'center',
  alignItems: 'stretch', 
  flexGrow: 1,
  paddingVertical: 40,
  paddingHorizontal: 25,
  width: '100%',
},


  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },

  inputGroup: {
    width: '90%',
    marginBottom: 18,
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
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 18,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '90%',
  },

  switchText: {
    marginLeft: 8,
    fontSize: 14,
  },

  button: {
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 25,
    width: '90%',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
header: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  marginBottom: 20,
},
backButton: {
  position: 'absolute',
  left: 0,
  top: 0,
  padding: 5,
},

});