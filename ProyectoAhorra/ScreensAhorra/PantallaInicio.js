import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function PantallaInicio() {
  return (
    <View style={styles.page}>
      <View style={styles.phoneContainer}>
        <View style={styles.blueContainer}>
          <Text style={styles.title}>¡AHORRA MáS!</Text>

          <Image
            source={require('../assets/cerdito_sinfondo.jpg')}
            style={styles.piggy}
          />
        </View>

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
    backgroundColor: '#f5f5f5',
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

blueContainer: {
  backgroundColor: '#00A6FF',
  width: '115%',
  height: '65%',
  borderBottomRightRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  transform: [{ rotate: '-6deg' }],
},

title: {
  position: 'absolute',
  top: '35%',
  color: '#fff',
  fontSize: 36,
  fontWeight: '900',
  textAlign: 'center',
  width: '100%',
  transform: [{ rotate: '10deg' }],
},



  coin: {
    width: 60,
    height: 60,
    position: 'absolute',
    left: '18%',
    bottom: '25%',
    transform: [{ rotate: '10deg' }],
  },

  piggy: {
    width: 170,
    height: 170,
    position: 'absolute',
    bottom: -40,
    right: '25%',
    transform: [{ rotate: '8deg' }],
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