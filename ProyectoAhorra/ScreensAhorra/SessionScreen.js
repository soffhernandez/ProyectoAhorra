import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function PantallaAcceso({ navigation }) {

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  const validarUsuario = () => {
    if (!usuario.trim()) return setErrorUsuario("El correo es obligatorio."), false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(usuario)) return setErrorUsuario("Formato de correo no válido."), false;
    setErrorUsuario('');
    return true;
  };

  const validarContrasena = () => {
    if (!contrasena.trim()) return setErrorContrasena("La contraseña es obligatoria."), false;
    if (contrasena.length < 6) return setErrorContrasena("Debe tener mínimo 6 caracteres."), false;
    setErrorContrasena('');
    return true;
  };

  const iniciarSesion = () => {
    if (!validarUsuario() || !validarContrasena()) return;
    navigation.navigate('AhorraMas');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.contenedorPantalla}
    >
      <View style={styles.tarjeta}>

        {/* TÍTULO */}
        <Text style={styles.tituloPrincipal}>Bienvenido</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>

        {/* USUARIO */}
        <View style={styles.grupoCampo}>
          <Text style={styles.tituloCampo}>Correo electrónico</Text>
          <TextInput
            style={styles.entradaTexto}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#9E9E9E"
            value={usuario}
            onBlur={validarUsuario}
            onChangeText={(t)=>{ setUsuario(t); if (errorUsuario) validarUsuario(); }}
          />
          {errorUsuario ? <Text style={styles.textoError}>{errorUsuario}</Text> : null}
        </View>

        {/* CONTRASEÑA */}
        <View style={styles.grupoCampo}>
          <Text style={styles.tituloCampo}>Contraseña</Text>
          <TextInput
            style={styles.entradaTexto}
            placeholder="••••••••"
            secureTextEntry={!mostrarContrasena}
            placeholderTextColor="#9E9E9E"
            value={contrasena}
            onBlur={validarContrasena}
            onChangeText={(t)=>{ setContrasena(t); if (errorContrasena) validarContrasena(); }}
          />
          {errorContrasena ? <Text style={styles.textoError}>{errorContrasena}</Text> : null}
        </View>

        {/* MOSTRAR CONTRASEÑA */}
        <View style={styles.filaCheckbox}>
          <Checkbox
            value={mostrarContrasena}
            onValueChange={setMostrarContrasena}
            color={mostrarContrasena ? "#4D9FF3" : undefined}
          />
          <Text style={styles.textoCheckbox}>Mostrar contraseña</Text>
        </View>

        {/* LINK RECUPERAR */}
        <TouchableOpacity onPress={() => navigation.navigate("Recuperacion")}>
          <Text style={styles.olvidoContrasena}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* BOTÓN */}
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
    backgroundColor: "#76c8f1",
    justifyContent: "center",
    alignItems: "center",
  },

  tarjeta: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 26,
    borderRadius: 18,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { height: 4, width: 0 },
  },

  tituloPrincipal: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },

  subtitulo: {
    fontSize: 14,
    color: "#6E6E6E",
    textAlign: "center",
    marginBottom: 25,
  },

  grupoCampo: {
    marginBottom: 16,
  },

  tituloCampo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2F2F2F",
    marginBottom: 6,
  },

  entradaTexto: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#FAFAFA",
  },

  textoError: {
    color: "#E53935",
    fontSize: 13,
    marginTop: 4,
  },

  filaCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 15,
    gap: 6,
  },

  textoCheckbox: {
    fontSize: 14,
    color: "#333",
  },

  olvidoContrasena: {
    color: "#1E88E5",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 18,
  },

  boton: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 4,
  },

  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
