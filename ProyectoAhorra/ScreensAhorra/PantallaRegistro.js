import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DatabaseService from "../database/DatabaseService";

export default function PantallaRegistro({navigation}) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [telefono, setTelefono] = useState('');
  const [respuestaSeguridad, setRespuestaSeguridad] = useState(''); 
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [nose, setNose] = useState(false);

  async function registrarUsuario() {
    try {
      // Validaciones básicas
      if (!nombre || !correo || !contrasena || !confirmar) {
        alert("Llena todos los campos");
        return;
      }

      if (contrasena !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
      }

      if (!respuestaSeguridad || respuestaSeguridad.trim() === '') {
        alert("Debes responder la pregunta de seguridad");
        return;
      }

      if (!aceptaTerminos) {
        alert("Debes aceptar los términos");
        return;
      }

      // Crear objeto rec con la pregunta de seguridad
      const rec = {
        securityQuestion: 'childhood_dog',
        securityAnswer: respuestaSeguridad.trim().toLowerCase(),
        securityQuestionText: '¿Cómo se llamaba el perro de tu infancia?',
        securitySetAt: new Date().toISOString()
      };

      // Convertir rec a string JSON para la base de datos
      const recString = JSON.stringify(rec);

      console.log("Datos a registrar:", {
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena: contrasena,
        telefono: telefono || '', // Asegurar que no sea undefined
        rec: recString
      });

      // Guardar usuario en la base de datos
      await DatabaseService.agregarUsuarioRegistro({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena: contrasena,
        telefono: telefono || '', // Enviar string vacío si no hay teléfono
        rec: recString // Enviar como string JSON
      });

      alert("Usuario registrado exitosamente");

      // Regresar a Inicio
      navigation.navigate("InicioApp");

    } catch (error) {
      console.log("Error completo al registrar:", error);
      console.log("Mensaje de error:", error.message);
      
      // Manejar error de correo duplicado
      if (error.message && (error.message.includes('UNIQUE') || error.message.includes('duplicate'))) {
        alert("El correo ya está registrado");
      } else if (error.message && error.message.includes('NOT NULL')) {
        alert("Error: Faltan campos requeridos");
      } else {
        alert("Error al registrar usuario. Revisa la consola para más detalles.");
      }
    }
  }

  return (
    <View style={styles.page}>
      <View style={styles.phoneContainer}>
        <KeyboardAvoidingView
          style={styles.centeredContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                keyboardType="email-address"
                autoCapitalize="none"
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

            <View style={styles.securityQuestionContainer}>
              <Text style={styles.securityQuestionTitle}>
                PREGUNTA DE SEGURIDAD
              </Text>
              
              <View style={styles.questionBox}>
                <Text style={styles.questionText}>
                  ¿Cómo se llamaba el perro de tu infancia?
                </Text>
                <Text style={styles.questionHint}>
                  Esta información te ayudará a recuperar tu contraseña si la olvidas.
                </Text>
              </View>

              <Text style={styles.label}>TU RESPUESTA</Text>
              <TextInput
                style={styles.input}
                placeholder="Escribe tu respuesta aquí"
                value={respuestaSeguridad}
                onChangeText={setRespuestaSeguridad}
              />
            </View>

            <View style={styles.switchContainer}>
              <Switch 
                value={aceptaTerminos} 
                onValueChange={setAceptaTerminos} 
                trackColor={{ false: "#767577", true: "#007BFF" }}
                thumbColor={aceptaTerminos ? "#fff" : "#f4f3f4"}
              />
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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },

  inputGroup: {
    width: '100%',
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
  },

  securityQuestionContainer: {
    width: '100%',
    marginBottom: 18,
    marginTop: 10,
  },

  securityQuestionTitle: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 8,
    color: '#222',
  },

  questionBox: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },

  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 6,
  },

  questionHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
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
    width: '100%',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});