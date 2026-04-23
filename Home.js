import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { getAllData } from './Database';
import { useFocusEffect } from '@react-navigation/native';


export default function Home() {

  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    try {
      const fetchedWorkouts = await getAllData();
      console.log('fetched workouts', fetchedWorkouts);

      // https://blog.logrocket.com/guide-object-groupby-alternative-array-reduce/
      // https://medium.com/@finnkumar6/array-grouping-in-javascript-a-quick-and-efficient-guide-771a974fa4d4
      // https://www.wisdomgeek.com/development/web-development/javascript/how-to-groupby-using-reduce-in-javascript/
      const grouped = Object.values(fetchedWorkouts).reduce((acc, currentWorkout) => {
        const { workout_id } = currentWorkout;
        if (!acc[workout_id]) {
          acc[workout_id] = {
            workout_id: currentWorkout.workout_id,
            date: currentWorkout.date,
            exercises: []
          };
        }

        let exercise = acc[workout_id].exercises.find(ex => ex.exercise_id === currentWorkout.exercise_id);
        if (!exercise) {
          exercise = {
            exercise_id: currentWorkout.exercise_id,
            name: currentWorkout.name,
            sets: []
          }
          acc[workout_id].exercises.push(exercise);
        }

        exercise.sets.push({
          set_entry_id: currentWorkout.set_entry_id,
          weight: currentWorkout.weight,
          reps: currentWorkout.reps
        });

        return acc;
      }, {});

      setWorkouts(Object.values(grouped));
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
          <Card style={{ marginBottom: 10, width: 300 }}>
            <Card.Title title={item.date} />
            <Card.Content>
              <Text>{item.exercises.map(ex => ex.name)}</Text>
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
