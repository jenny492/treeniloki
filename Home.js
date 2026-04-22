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
        if (!formatted.includes(existingWorkout)) {
          formatted.push({
            workout_id: value.workout_id,
            exercises: []
          });
          console.log('pushed workout ', formatted);
        }
        if (existingWorkout) {
          const existingExercise = existingWorkout.exercises.find(exercise => exercise.exercise_id === value.exercise_id);
          if (!existingExercise) {
            existingWorkout.exercises.push({
              exercise_id: value.exercise_id,
              name: value.name,
              sets: []
            })
            console.log('pushed exercise ', existingExercise);
          }

          if (existingExercise) {
            const existingSet = existingExercise.sets.find(set => set.set_entry_id === value.set_entry_id);
            if (!existingSet) {
              existingExercise.sets.push({
                set_entry_id: value.set_entry_id,
                weight: value.weight,
                reps: value.reps
              })
              console.log('pushed set ', existingSet);
            }
          }
        }

      })
      console.log('formatted: ', formatted);
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
