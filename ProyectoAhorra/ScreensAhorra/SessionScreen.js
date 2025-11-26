import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import Checkbox from 'expo-checkbox';

export default function SessionScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const iniciarSesion = () => {
    console.log('Usuario:', usuario);
    console.log('Contraseña:', contrasena);
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedorPantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.tarjeta}>

        {/* USUARIO */}
        <Text style={styles.tituloCampo}>USUARIO</Text>
        <TextInput
          style={styles.entradaTexto}
          placeholder="Ingresar Correo"
          placeholderTextColor="#A0A0A0"
          value={usuario}
          onChangeText={setUsuario}
        />

        {/* CONTRASEÑA */}
        <Text style={styles.tituloCampo}>CONTRASEÑA</Text>
        <TextInput
          style={styles.entradaTexto}
          placeholder="Ingresar Contraseña"
          placeholderTextColor="#A0A0A0"
          secureTextEntry={!mostrarContrasena}
          value={contrasena}
          onChangeText={setContrasena}
        />

        {/* CHECKBOX MOSTRAR CONTRASEÑA */}
        <View style={styles.filaCheckbox}>
          <Checkbox
            value={mostrarContrasena}
            onValueChange={setMostrarContrasena}
            color={mostrarContrasena ? '#4D9FF3' : undefined}
          />
          <Text style={styles.textoCheckbox}>Mostrar_contraseña</Text>
        </View>

        {/* OLVIDO CONTRASEÑA */}
        <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
          <Text style={styles.olvidoContrasena}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/* BOTÓN INGRESAR */}
        <TouchableOpacity style={styles.boton} onPress={iniciarSesion}>
          <Text style={styles.textoBoton}>INGRESAR</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorPantalla: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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

  tituloCampo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 4,
  },

  entradaTexto: {
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
  },

  filaCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },

  textoCheckbox: {
    fontSize: 14,
    color: '#333',
  },

  olvidoContrasena: {
    color: '#4D9FF3',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },

  boton: {
    backgroundColor: '#1A1A1A',
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
