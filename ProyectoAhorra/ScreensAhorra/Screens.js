import React, { useState } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import PantallaInicio from './PantallaInicio';
import ScreensInicio from './ScreensInicio';
import IngresosScreen from './IngresosScreen';
import PresupuestoMensualScreen from './PresupuestoMensualScreen';
import Presupuesto from './Presupuesto';

export default function Screens() {
  const [screen, setScreen] = useState('menu');
  console.log('Renderizando pantalla:', screen);

  switch (screen) {
    case 'inicio':
      return <ScreensInicio />;
    case 'IngresosScreen':
      return <IngresosScreen />;
    case 'PresupuestoMensualScreen':
      return <PresupuestoMensualScreen />;
    case 'PantallaInicio':
      return <PantallaInicio />;
    case 'presupuesto':
      return <Presupuesto />;

    case 'menu':
    default:
      return (
        <View style={styles.container}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Menu de interfaces</Text>

          <Button onPress={() => setScreen('PantallaInicio')} title="Log in" />
          <Button onPress={() => setScreen('inicio')} title="Inicio" />
          <Button onPress={() => setScreen('IngresosScreen')} title="Ingresos" />
          <Button onPress={() => setScreen('PresupuestoMensualScreen')} title="Presupuesto mensual" />
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
