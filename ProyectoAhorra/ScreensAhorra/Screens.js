import React, { useState } from 'react'
import { Text, StyleSheet, View, Button} from 'react-native'
import PantallaInicio from './PantallaInicio';
import ScreensInicio from './ScreensInicio';
import IngresosScreen from './IngresosScreen';
import PresupuestoMensualScreen from './PresupuestoMensualScreen';


export default function Screens(){
    const [screen, setScreen] = useState('menu');
    console.log('Renderizando pantalla:', screen);
    switch(screen){
        case 'inicio':
            return < ScreensInicio/>
        case 'IngresosScreen':
            return < IngresosScreen/>
        case 'PresupuestoMensualScreen':
            return < PresupuestoMensualScreen/>
        case 'PantallaInicio':
            return < PantallaInicio/>

        case 'menu':
            default:
                return (
                    <View>
                         <Text> Menu de interfaces </Text>
                         
                         <Button onPress={()=>setScreen('PantallaInicio')} title ='Log in'/> 
                         <Button onPress={()=>setScreen('inicio')} title ='Inicio'/> 
                         <Button onPress={()=>setScreen('IngresosScreen')} title ='Ingresos'/> 
                         <Button onPress={()=>setScreen('PresupuestoMensualScreen')} title ='Presupuesto'/> 
                    </View>
           )             
    }
}