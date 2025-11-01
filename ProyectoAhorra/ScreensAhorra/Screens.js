import React, { useState } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import ScreensInicio from './ScreensInicio';
import Presupuesto from './Presupuesto';

export default function Screens() {
  const [screen, setScreen] = useState('menu');
  console.log('Renderizando pantalla:', screen);

  switch (screen) {
    case 'inicio':
      return <ScreensInicio />;
    case 'presupuesto':
      return <Presupuesto />;
    case 'menu':
    default:
      return (
        <View style={styles.container}>
          <Text>Menu de interfaces</Text>
          <Button onPress={() => setScreen('inicio')} title="Inicio" />
          <Button onPress={() => setScreen('presupuesto')} title="Presupuesto" />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
