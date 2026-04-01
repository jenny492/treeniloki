import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Library from './Library';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Koti" component={Home} />
        <Tab.Screen name="Liikepankki" component={Library} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
