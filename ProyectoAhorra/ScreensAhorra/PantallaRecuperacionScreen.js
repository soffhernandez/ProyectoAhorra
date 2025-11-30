import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';

export default function PantallaRecuperacion() {
  const [correo, setCorreo] = useState('');

  const recuperarContrasena = () => {
    console.log('Correo para recuperación:', correo);
    // Aquí podrías integrar una API para enviar el correo de recuperación
  };
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.contenedorPantalla}
    >
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>Recuperar Contraseña</Text>

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
  onPress={() => navigation.navigate('AhorraMas')}
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
    marginBottom: 10,
    textAlign: 'center',
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
});