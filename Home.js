import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { deleteWorkout, getAllData } from './Database';

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

  const handleDeleteWorkout = (workoutId) => {
    Alert.alert('Poista', 'Haluatko varmasti poistaa treenin?', [
      {
        text: 'Kyllä',
        onPress: () => {
          const id = workoutId;
          if (id) {
            delWorkout(id);
          }
        }
      },
      {
        text: 'Ei',
      }
    ]);
  };

  const delWorkout = async (workoutId) => {
    try {
      await deleteWorkout(workoutId);
    } catch (error) {
      console.error('could not delete workout', error);
    }
    fetchWorkouts();
  }
  // https://stackoverflow.com/questions/68472573/react-native-if-else-condition-in-array-map
  const setRow = (set) => {
    if (!set.weight && !set.reps) {
      return;
    } else if (!set.reps) {
      return <Text key={set.set_entry_id} variant="bodyMedium">
        {set.weight} kg
      </Text>;
    } else {
      return <Text key={set.set_entry_id} variant="bodyMedium">
        {set.weight} kg, {set.reps} toistoa
      </Text>;
    }
  }

  // käytä tässä useFocusEffectiä, jotta data päivittyy joka kerta kun sivu avataan, eikä vain kerran
  useFocusEffect(useCallback(() => { fetchWorkouts() }, []));

  // Tietojen näyttäminen: https://stackoverflow.com/questions/61242323/react-native-flatlist-how-to-loop-through-nested-object
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <FlatList
          data={workouts}
          renderItem={({ item }) =>

            <Card style={{ marginBottom: 10 }}>
              <Card.Title title={item.date} titleVariant='headlineSmall' />

              {item.exercises.map((e, i) => (
                <Card.Content key={e.exercise_id}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', marginTop: 5 }}>
                    {e.name}
                  </Text>

                  {e.sets.map((s, i) => {
                    return setRow(s);
                  })}
                </Card.Content>
              ))}

              <Card.Actions>
                <IconButton icon="delete" mode='contained-tonal' onPress={() => handleDeleteWorkout(item.workout_id)} />
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff'
  },
});
