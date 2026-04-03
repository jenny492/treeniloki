// https://reactnavigation.org/docs/customizing-tabbar/

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Library from './Library';
import { Icon } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function App() {
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
              return <Icon source={iconName} size={30} />;
            }
          })}>
          <Tab.Screen name="Koti" component={Home} />
          <Tab.Screen name="Liikepankki" component={Library} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
