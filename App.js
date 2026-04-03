// https://reactnavigation.org/docs/customizing-tabbar/

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Library from './Library';
import { Icon, MD3Colors } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import { initialize } from './Database';

const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => { initialize(); }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              let iconName;

              if (route.name === 'Koti') {
                iconName = focused
                  ? 'book'
                  : 'book-outline';
              } else if (route.name === 'Liikepankki') {
                iconName = focused ? 'weight-lifter' : 'weight-lifter';
              }
              return <Icon source={iconName} color={MD3Colors.primary50} size={30} />;
            }
          })}>
          <Tab.Screen name="Koti" component={Home} />
          <Tab.Screen name="Liikepankki" component={Library} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
