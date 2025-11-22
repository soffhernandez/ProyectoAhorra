import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Pantallas
import InicioScreen from './ScreensAhorra/PantallaInicio';


import ScreensInicio from './ScreensAhorra/ScreensInicio';
import IngresosScreen from './ScreensAhorra/IngresosScreen';
import Presupuesto from './ScreensAhorra/Presupuesto';
import Graficas from './ScreensAhorra/ScreensGraficas';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Ingresos') iconName = 'cash';
          else if (route.name === 'Presupuesto') iconName = 'wallet';
          else if (route.name === 'Gráficas') iconName = 'bar-chart';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={ScreensInicio} />
      <Tab.Screen name="Ingresos" component={IngresosScreen} />
      <Tab.Screen name="Presupuesto" component={Presupuesto} />
      <Tab.Screen name="Gráficas" component={Graficas} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InicioApp" component={InicioScreen} />

        <Stack.Screen name="AhorraMas" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
