import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DatabaseService from "../database/DatabaseService";

export default function PantallaRecuperacion({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [respuestaSeguridad, setRespuestaSeguridad] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const buscarUsuario = async () => {
    if (!correo || !correo.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }

    setIsLoading(true);
    
    try {
      // Buscar usuario por correo
      const usuarioEncontrado = await DatabaseService.obtenerUsuarioPorCorreo(correo.trim().toLowerCase());
      
      if (!usuarioEncontrado) {
        // Por seguridad, no revelamos si el usuario existe
        Alert.alert(
          "Información", 
          "Si el correo está registrado, se mostrará la pregunta de seguridad."
        );
        setIsLoading(false);
        return;
      }

      // Verificar si tiene pregunta de seguridad
      let rec = {};
      if (usuarioEncontrado.rec) {
        try {
          rec = typeof usuarioEncontrado.rec === 'string' 
            ? JSON.parse(usuarioEncontrado.rec) 
            : usuarioEncontrado.rec;
        } catch (e) {
          console.warn('Error parsing rec:', e);
        }
      }

      if (!rec.securityAnswer) {
        Alert.alert(
          "Error", 
          "Este usuario no tiene configurada una pregunta de seguridad."
        );
        setIsLoading(false);
        return;
      }

      setUsuario({
        ...usuarioEncontrado,
        rec
      });
      setShowQuestion(true);
      
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      Alert.alert("Error", "No se pudo verificar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const verificarRespuesta = async () => {
    if (!respuestaSeguridad || respuestaSeguridad.trim() === '') {
      Alert.alert("Error", "Debes ingresar tu respuesta");
      return;
    }

    if (!usuario || !usuario.rec) {
      Alert.alert("Error", "No se encontró información del usuario");
      return;
    }

    const respuestaNormalizada = respuestaSeguridad.trim().toLowerCase();
    const respuestaGuardada = usuario.rec.securityAnswer;

    if (respuestaNormalizada === respuestaGuardada) {
      // Mostrar la contraseña en un alert
      Alert.alert(
        "¡Contraseña recuperada!",
        `Tu contraseña es: ${usuario.contrasena}\n\nPor seguridad, anota tu contraseña en un lugar seguro.`,
        [
          {
            text: "Copiar contraseña",
            onPress: () => {
              // Aquí podrías agregar lógica para copiar al portapapeles
              Alert.alert("Copiado", "Contraseña copiada al portapapeles");
            }
          },
          {
            text: "Ir a inicio de sesión",
            onPress: () => navigation.navigate("Acceso")
          }
        ]
      );
    } else {
      Alert.alert(
        "Respuesta incorrecta",
        "La respuesta no coincide. Por favor intenta de nuevo.",
        [
          {
            text: "Intentar otra vez",
            style: "default"
          },
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {
              setShowQuestion(false);
              setRespuestaSeguridad('');
              setUsuario(null);
            }
          }
        ]
      );
    }
  };

  const resetearFormulario = () => {
    setShowQuestion(false);
    setRespuestaSeguridad('');
    setUsuario(null);
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

        <Text style={styles.subtitulo}>
          {showQuestion 
            ? "Responde tu pregunta de seguridad" 
            : "Ingresa tu correo electrónico para recuperar tu contraseña"
          }
        </Text>

        {!showQuestion ? (
          // Primera pantalla: Ingreso de correo
          <>
            <TextInput
              style={styles.entradaTexto}
              placeholder="Correo registrado"
              placeholderTextColor="#A0A0A0"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity 
              style={[styles.boton, isLoading && styles.botonDeshabilitado]} 
              onPress={buscarUsuario}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBoton}>Buscar cuenta</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // Segunda pantalla: Pregunta de seguridad
          <>
            <View style={styles.preguntaContainer}>
              <Text style={styles.etiquetaPregunta}>TU PREGUNTA DE SEGURIDAD:</Text>
              <View style={styles.cajaPregunta}>
                <Text style={styles.textoPregunta}>
                  {usuario?.rec?.securityQuestionText || '¿Cómo se llamaba el perro de tu infancia?'}
                </Text>
              </View>
            </View>

            <Text style={styles.etiqueta}>TU RESPUESTA:</Text>
            <TextInput
              style={styles.entradaTexto}
              placeholder="Escribe tu respuesta aquí"
              placeholderTextColor="#A0A0A0"
              value={respuestaSeguridad}
              onChangeText={setRespuestaSeguridad}
              autoCapitalize="none"
              autoCorrect={false} 
            />

            <View style={styles.botonesContainer}>
              <TouchableOpacity 
                style={[styles.boton, styles.botonSecundario]} 
                onPress={resetearFormulario}
              >
                <Text style={styles.textoBotonSecundario}>Cambiar correo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.boton, styles.botonPrincipal]} 
                onPress={verificarRespuesta}
              >
                <Text style={styles.textoBoton}>Verificar respuesta</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.notaSeguridad}>
               Tu respuesta se comparará con la almacenada en tu cuenta.
            </Text>
          </>
        )}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  entradaTexto: {
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  boton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonPrincipal: {
    backgroundColor: '#4D9FF3',
    flex: 1,
    marginLeft: 8,
  },
  botonSecundario: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginRight: 8,
  },
  botonDeshabilitado: {
    backgroundColor: '#a0c8f3',
    opacity: 0.7,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  textoBotonSecundario: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
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
  // Estilos para la pregunta de seguridad
  preguntaContainer: {
    marginBottom: 20,
  },
  etiquetaPregunta: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 8,
    color: '#222',
  },
  cajaPregunta: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#4D9FF3',
    padding: 14,
    borderRadius: 8,
    marginBottom: 5,
  },
  textoPregunta: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontStyle: 'italic',
  },
  etiqueta: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 8,
    color: '#222',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  notaSeguridad: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
});