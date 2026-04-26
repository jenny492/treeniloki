import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { getAllData, deleteWorkout } from './Database';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function Home() {

  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    try {
      const fetchedWorkouts = await getAllData();

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

  const handleDeleteWorkout = async (workoutId) => {
    console.log(workoutId);
    try {
      await deleteWorkout(workoutId);
    } catch (error) {
      console.error('could not delete workout', error);
    }
    fetchWorkouts();
  }

  // käytä tässä useFocusEffectiä, jotta data päivittyy joka kerta kun sivu avataan, eikä vain kerran(?)
  useFocusEffect(useCallback(() => { fetchWorkouts() }, []));

  // Tietojen näyttäminen: https://stackoverflow.com/questions/61242323/react-native-flatlist-how-to-loop-through-nested-object
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text variant='displayMedium'>Treeniloki</Text>
        <FlatList
          data={workouts}
          renderItem={({ item }) =>
            <Card style={{ marginBottom: 10, width: 300 }}>
              <Card.Title title={item.date} />
              {item.exercises.map((e, i) => (
                <Card.Content key={e.exercise_id}>
                  <Text variant="titleMedium">{e.name}</Text>
                  {e.sets.map((s, i) => (
                    <Text key={s.set_entry_id}>{s.weight} kg, {s.reps} toistoa</Text>
                  ))}
                </Card.Content>
              ))}
              <Card.Actions>
                <IconButton icon="delete" onPress={() => handleDeleteWorkout(item.workout_id)} />
              </Card.Actions>
            </Card>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
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
