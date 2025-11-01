import React, { useState } from 'react'
import { Text, StyleSheet, View, Button} from 'react-native'
import ScreensInicio from './ScreensInicio';


export default function Screens(){
    const [screen, setScreen] = useState('menu');
    console.log('Renderizando pantalla:', screen);
    switch(screen){
        case 'inicio':
            return < ScreensInicio/>
             case 'menu':
            default:
                return (
                    <View>
                         <Text> Menu de interfaces </Text>
                         <Button onPress={()=>setScreen('inicio')} title ='inicio'/> 
                    </View>
           )             
}
}