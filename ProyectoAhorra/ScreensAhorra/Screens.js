import React, { useState } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import PantallaInicio from './PantallaInicio';
import ScreensInicio from './ScreensInicio';
import IngresosScreen from './IngresosScreen';
import Presupuesto from './Presupuesto';
import Graficas from './ScreensGraficas';
import TransactionScreen from './TransaccionesScreen';
import ProfileScreen from './PerfilScreen';
import NewTransactionScreen from './NuevaTra';
import PantallaRegistro from './PantallaRegistro';

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
    case 'Registro':
      return <PantallaRegistro/>;
    case 'presupuesto':
      return <Presupuesto />;
    case 'Graficas':
      return <Graficas/>;
    case 'Transacciones':
      return <TransactionScreen/>;
    case 'Perfil':
      return <ProfileScreen/>;
    case 'NTransaccion':
      return <NewTransactionScreen/>;
    case 'menu':
    default:
      return (
        <View style={styles.container}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Menu de interfaces</Text>

          <Button onPress={() => setScreen('PantallaInicio')} title="Log in" />
          <Button onPress={() => setScreen('Registro')} title="Registro" />
          <Button onPress={() => setScreen('inicio')} title="Inicio" />
          <Button onPress={() => setScreen('IngresosScreen')} title="Ingresos" />
          <Button onPress={() => setScreen('presupuesto')} title="Presupuesto" />
          <Button onPress={() => setScreen('Graficas')} title="Graficas" />
          <Button onPress={() => setScreen('Transacciones')} title="Transacciones" />
          <Button onPress={() => setScreen('Perfil')} title="Perfil" />
          <Button onPress={() => setScreen('NTransaccion')} title="Nueva Transaccion" />
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
