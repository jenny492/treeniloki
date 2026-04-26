// Modal ja modalin tyyli: https://reactnative.dev/docs/modal
// Alert https://reactnative.dev/docs/alert

import { useCallback, useState } from 'react';
import { Alert, Modal, StyleSheet, View, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Text, TextInput } from 'react-native-paper';
import { createExercise, deleteExercise, getAllExercises, editExercise } from './Database';


export default function Library() {

  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('')
  const [exerciseValue, setExerciseValue] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState('');

  const handleCreateExercise = async () => {
    try {
      if (!exercise) {
        Alert.alert('Anna liikkeelle nimi');
        return;
      }
      await createExercise(exercise);
      setExercise('');
      await updateExercises();
      Alert.alert('Uusi liike lisätty')
    } catch (error) {
      console.error('Error creating new exercise', error);
    }
  };

  const handleDeleteExercise = async () => {
      Alert.alert('Poista', 'Haluatko varmasti poistaa liikkeen?', [
        {
          text: 'Kyllä',
          onPress: () => delExercise(),
        },
        {
          text: 'Peruuta',
          onPress: () => Alert.alert('Liikettä ei poistettu'),
        }
      ]);
  };

  const delExercise = async () => {
    try {
      await deleteExercise(exerciseValue);
      setExerciseValue(null);
      await updateExercises();
      Alert.alert('Liike poistettu');
    } catch (error) {
      console.error('Error deleting exercise', error);
    }
  }

  const handleEditExercise = async () => {
    try {
      const editedExerciseName = input;
      if (!editedExerciseName) {
        Alert.alert('Liikettä ei muokattu.');
        return;
      }
      await editExercise(exerciseValue, editedExerciseName);
      setInput('');
      setModalVisible(false);
      Alert.alert('Liike muokattu');
      await updateExercises();
    } catch (error) {
      console.error('Error editing exercise', error);
    }
  };

  const updateExercises = async () => {
    try {
      const allExercises = await getAllExercises();
      setExercises(allExercises);
    } catch (error) {
      console.error('Error fetching exercises', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant='titleLarge'>Lisää uusi liike liikepankkiin</Text>
      <TextInput
        style={{ flexDirection: 'row' }}
        label="Liikkeen nimi"
        value={exercise}
        onChangeText={setExercise}
      />
      <Button mode='contained' onPress={handleCreateExercise}>Lisää liike</Button>

      <Text variant='titleLarge'>Poista tai muokkaa</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Anna uusi nimi liikkeelle</Text>
            <TextInput style={styles.textInput} value={input} onChangeText={setInput} />
            <Button mode="contained" onPress={() => setModalVisible(false)}>
              Peruuta
            </Button>
            <Button mode="contained" onPress={handleEditExercise}>
              Tallenna
            </Button>
          </View>
        </View>
      </Modal>

      <Button mode='contained' onPress={handleDeleteExercise}>Poista</Button>
      <Button mode='contained' onPress={() => {
        if (!exerciseValue) {
          Alert.alert('Valitse liike');
          return;
        }

        const selected = exercises.find((item) => item.value === exerciseValue);
        setInput(selected?.label);
        setModalVisible(true)}}>Muokkaa</Button>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    width: '100%',
    marginBottom: 10,
  },
});
