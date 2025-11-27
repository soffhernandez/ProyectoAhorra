import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

export default function PantallaRecuperacion({ navigation }) {
  const [correo, setCorreo] = useState('');

  const recuperarContrasena = () => {
    console.log('Correo para recuperación:', correo);
    // Aquí podrías integrar tu API de recuperación
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedorPantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.tarjeta}>
        
        {/* TÍTULO */}
        <Text style={styles.titulo}>Recuperar Contraseña</Text>
        <Text style={styles.subtitulo}>Ingresa tu correo electrónico</Text>

        {/* INPUT CORREO */}
        <TextInput
          style={styles.entradaTexto}
          placeholder="Correo registrado"
          placeholderTextColor="#A0A0A0"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
        />

        {/* BOTÓN */}
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
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
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
