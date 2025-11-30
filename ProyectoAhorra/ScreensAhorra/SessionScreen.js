import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Alerta } from 'react-native';
import Checkbox from 'expo-checkbox';  // <-- si no lo tienes: npm install expo-checkbox

export default function PantallaAcceso({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

 const iniciarSesion = () => {
    if (usuario.trim() === '') {
      Alert.alert(
        'Campo requerido',
        'Por favor ingresa tu usuario o correo electrónico',
        [{ text: 'OK' }]
      );
      return;
    }

    if (contrasena.trim() === '') {
      Alert.alert(
        'Campo requerido',
        'Por favor ingresa tu contraseña',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('AhorraMas');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.contenedorPantalla}
    >
      <View style={styles.tarjeta}>
        
        <Text style={styles.tituloCampo}>USUARIO</Text>
        <TextInput
          style={styles.entradaTexto}
          placeholder="Ingresar Correo"
          placeholderTextColor="#A0A0A0"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          keyboardType="email-address"
        />
 
        <Text style={styles.tituloCampo}>CONTRASEÑA</Text>
        <TextInput
          style={styles.entradaTexto}
          placeholder="Ingresar Contraseña"
          placeholderTextColor="#A0A0A0"
          secureTextEntry={!mostrarContrasena}
          value={contrasena}
          onChangeText={setContrasena}
        />

        <View style={styles.filaCheckbox}>
          <Checkbox
            value={mostrarContrasena}
            onValueChange={setMostrarContrasena}
            color={mostrarContrasena ? '#4D9FF3' : undefined}
          />
          <Text style={styles.textoCheckbox}>Mostrar contraseña</Text>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Recuperacion')}
        >
          <Text style={styles.olvidoContrasena}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.boton} 
          onPress={iniciarSesion}
        >
          <Text style={styles.textoBoton}>INGRESAR</Text>
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
  maxWidth: 380,          // <-- limita tamaño en navegador / pantallas grandes
  backgroundColor: '#ffffff',
  padding: 22,
  borderRadius: 15,
  elevation: 6,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: { height: 4, width: 0 },
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
    marginBottom: 18,
    gap: 6,
  },
  textoCheckbox: {
    fontSize: 14,
    color: '#333',
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
  olvidoContrasena: {
    color: '#4D9FF3',         
    fontSize: 15,
    textAlign: 'center',      
    marginBottom: 12,        
    marginTop: 4,             
  },
});