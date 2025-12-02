import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Feather } from '@expo/vector-icons';


export default function PantallaRecuperacion({ navigation }) {
  const [correo, setCorreo] = useState('');

  const recuperarContrasena = () => {
  if (!correo || !correo.includes("@")) {
    alert("Por favor ingresa un correo válido");
    return;
  }

  alert("Se enviaron las instrucciones de recuperación a tu correo.");
  navigation.navigate("Acceso"); 
};

 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.contenedorPantalla}
    >
      <View style={styles.tarjeta}>
       <View style={styles.header}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Feather name="arrow-left" size={28} color="#000" />
  </TouchableOpacity>

  <Text style={styles.titulo}>Recuperar Contraseña</Text>
</View>

        <Text style={styles.subtitulo}>Ingresa tu correo electrónico</Text>
        <TextInput
          style={styles.entradaTexto}
          placeholder="Correo registrado"
          placeholderTextColor="#A0A0A0"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
        />

        <TouchableOpacity 
          style={styles.boton} 
           onPress={recuperarContrasena}
        >
  <Text style={styles.textoBoton}>Enviar instrucciones</Text>
</TouchableOpacity>


      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorPantalla: {
    flex: 1,
    backgroundColor: '#8ad6f6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjeta: {
    width: '85%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    padding: 22,
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { height: 4, width: 0 },
  },
 titulo: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginBottom: 10,
  marginTop: 5,   
},

  subtitulo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  entradaTexto: {
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#4D9FF3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  botonRegresar: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},

iconoRegresar: {
  fontSize: 20,
  marginRight: 6,
  marginTop: 2,
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