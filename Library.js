import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { createExercise, deleteExercise } from './Database';
import DropDownPicker from 'react-native-dropdown-picker';
import { getAllExercises } from './Database';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function Library() {

  const [open, setOpen] = useState(false);
  const [exerciseValue, setExerciseValue] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState('');

  const handleCreateExercise = async () => {
    try {
      await createExercise(exercise);
      setExercise('');
    } catch (error) {
      console.error('Error creating new exercise', error);
    }
  };

  const handleDeleteExercise = async () => {
    try {     
      await deleteExercise(exerciseValue);
      setExerciseValue(null);
    } catch (error) {
      console.error('Error deleting exercise', error);
    }
  };

  const getExercises = async () => {
    try {
      const allExercises = await getAllExercises();
      setExercises(allExercises);
    } catch (error) {
      console.error('Error fetching exercises', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getExercises();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text variant='displaySmall'>Lisää uusi liike</Text>
      <TextInput
        style={{ flexDirection: 'row' }}
        label="Harjoituksen nimi"
        value={exercise}
        onChangeText={setExercise}
      />
      <Button mode='contained' onPress={handleCreateExercise}>Lisää harjoitus</Button>

      <Text variant='displaySmall'>Poista liike</Text>
      <DropDownPicker
        placeholder='Valitse liike'
        open={open}
        value={exerciseValue}
        items={exercises}
        setOpen={setOpen}
        setValue={setExerciseValue}
        setItems={setExercises}
        listMode="MODAL"
        modalTitle="Valitse liike"
        searchable={false}
      />

      <Button mode='contained' onPress={handleDeleteExercise}>Poista harjoitus</Button>
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
