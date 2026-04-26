// https://reactnavigation.org/docs/customizing-tabbar/
// https://stackoverflow.com/questions/71742003/how-to-use-stack-and-tab-navigation-at-same-time

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Icon, PaperProvider } from 'react-native-paper';
import Home from './Home';
import Library from './Library';
import NewWorkout from './NewWorkout';
import { initialize } from './Database';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    const init = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error('Initialization error', error);
      }
    };
    init();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: () => {
              let iconName;

              if (route.name === 'Koti') {
                iconName = 'book-outline';
              } else if (route.name === 'Liikepankki') {
                iconName = 'weight-lifter';
              } else if (route.name === 'Lisää harjoitus') {
                iconName = 'plus';
              }
              return <Icon source={iconName} size={30} />;
            }
          })}>
          <Tab.Screen name="Koti" component={Home} />
          <Tab.Screen name="Lisää harjoitus" component={NewWorkout} />
          <Tab.Screen name="Liikepankki" component={Library} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
