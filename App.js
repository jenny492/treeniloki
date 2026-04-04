// https://reactnavigation.org/docs/customizing-tabbar/
// https://stackoverflow.com/questions/71742003/how-to-use-stack-and-tab-navigation-at-same-time

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Library from './Library';
import AddExercise from './AddExercise';
import NewExercise from './NewExercise';
import { Icon } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import { initialize } from './Database';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
 
  const ExerciseStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}>
          <Stack.Screen name="AddExercise" component={AddExercise} />
          <Stack.Screen name="NewExercise" component={NewExercise} />
        </Stack.Navigator>
    );
  }


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
          <Tab.Screen name="Lisää harjoitus" component={ExerciseStack} options={{}} />
          <Tab.Screen name="Liikepankki" component={Library} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
