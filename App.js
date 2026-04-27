// https://reactnavigation.org/docs/customizing-tabbar/
// https://stackoverflow.com/questions/71742003/how-to-use-stack-and-tab-navigation-at-same-time

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme as TabDefaultTheme } from '@react-navigation/native';
import { Icon, BottomNavigation, MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import Home from './Home';
import Library from './Library';
import NewWorkout from './NewWorkout';
import { initialize } from './Database';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',    
  },
};

const tabTheme = {
   ...TabDefaultTheme,
  colors: {
    ...TabDefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',    
  },
};

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
    <PaperProvider theme={theme}>
      <NavigationContainer theme={tabTheme}>
        
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarInactiveTintColor: 'gray',
            tabBarActiveTintColor: 'tomato',
            tabBarIcon: ({ color }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'book-outline';
              } else if (route.name === 'Library') {
                iconName = 'weight-lifter';
              } else if (route.name === 'NewWorkout') {
                iconName = 'plus';
              }
              return <Icon source={iconName} size={30} color={color} />;
            }
          })}>

          <Tab.Screen name="Home" component={Home} options={{title: 'Treeniloki'}} />
          <Tab.Screen name="NewWorkout" component={NewWorkout} options={{title: 'Uusi treeni'}} />
          <Tab.Screen name="Library" component={Library} options={{title: 'Liikepankki'}} />

        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
