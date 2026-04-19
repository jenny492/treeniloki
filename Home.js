import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { getAllData } from './Database';
import { useFocusEffect } from '@react-navigation/native';


export default function Home() {

  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    try {
      const fetchedWorkouts = await getAllData();
      console.log('Fetched workouts ', fetchedWorkouts);

      const formatted = [];

      Object.values(fetchedWorkouts).forEach(value => {
        const existingWorkout = formatted.find(workout => workout.workout_id === value.workout_id);
        console.log('formatted ', formatted);
        formatted.push({ workout_id: value.workout_id, exercises: [] });
        console.log(value);
      })

      setWorkouts(formatted);
    }
    catch (error) {
      console.error('could not fetch workouts', error);
    }
  }
  // käytä tässä useFocusEffectiä, jotta data päivittyy joka kerta kun sivu avataan, eikä vain kerran(?)
  useFocusEffect(useCallback(() => { fetchWorkouts() }, []));

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={({ item }) =>
          <Card>
            <Card.Title title={item.date} />
            <Card.Content>
            </Card.Content>
          </Card>
        }
      />
      <Text>Tässä näytetään edelliset harjoitukset listana</Text>
      <Button mode="contained" onPress={fetchWorkouts}>
        Päivitä harjoitukset
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
