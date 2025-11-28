import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function PantallaInicio() {
  return (
    <View style={styles.page}>
      <View style={styles.phoneContainer}>

        {/* CONTENEDOR AZUL */}
        <View style={styles.blueContainerWrapper}>
          <View style={styles.blueBackground} />
          
          <View style={styles.blueContent}>
            <Text style={styles.title}>¡AHORRA MÁS!</Text>
            <Image
              source={require('../assets/cerdito_sinfondo.png')}
              style={styles.cerdito}
            />
          </View>
        </View>

        {/* PARTE INFERIOR */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Acceso</Text>
          </TouchableOpacity>

          <Text style={styles.link}>¿Aún no tienes cuenta?</Text>
        </View>

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

  blueContainerWrapper: {
    width: '100%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  blueBackground: {
    backgroundColor: '#00A6FF',
    width: '150%',
    height: '140%',
    borderBottomRightRadius: 100,
    transform: [{ rotate: '30deg' }],
    position: 'absolute',
    top: -300,
    left: '-25%',
  },

  blueContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '90%',
  },

  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: -20,
    width: '100%',
  },

  cerdito: {
    width: 220,
    height: 220,
    position: 'absolute',
    bottom: -40,
    right: '5%',
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },

  button: {
    backgroundColor: '#E8F2FF',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  buttonText: {
    color: '#007BFF',
    fontWeight: '600',
    fontSize: 16,
  },

  link: {
    color: '#7F3DFF',
    fontSize: 15,
  },
});
