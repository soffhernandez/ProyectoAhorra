import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ScreensInicio from './ScreensAhorra/ScreensInicio'; 
import IngresosScreen from './ScreensAhorra/IngresosScreen';
import Presupuesto from './ScreensAhorra/Presupuesto';
import Graficas from './ScreensAhorra/ScreensGraficas';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Ingresos') {
            iconName = 'cash';
          } else if (route.name === 'Presupuesto') {
            iconName = 'wallet';
          } else if (route.name === 'Gráficas') {
            iconName = 'bar-chart';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF', 
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60, 
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
      <MyTabs />
    </NavigationContainer>
  );
}
