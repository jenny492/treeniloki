// Modal ja modalin tyyli: https://reactnative.dev/docs/modal
// Alert https://reactnative.dev/docs/alert
// Svg https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md

import { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, View, Pressable, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Text, TextInput, Card } from 'react-native-paper';
import { createExercise, deleteExercise, getAllExercises, editExercise } from './Database';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

export default function Library() {

  const [open, setOpen] = useState(false);
  const [exModalVisible, setExModalVisible] = useState(false);
  const [ilModalVisible, setIlModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const [exerciseValue, setExerciseValue] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState('');

  const [searchKey, setSearchKey] = useState('');
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [illustration, setIllustration] = useState(null);

  // https://www.npmjs.com/package/react-native-axios
  const handleFetch = () => {
    setLoading(true);
    const axios = require('axios');
    let data = JSON.stringify({
      "muscles": [
        searchKey
      ],
      "categories": [
        "string"
      ],
      "types": [
        "string"
      ]
    });
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.workoutapi.com/exercises/filter',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': apiKey
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        setExerciseData(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));

  };

  const handleFetchIllustration = (imageId) => {
    console.log(imageId);
    const axios = require('axios');
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.workoutapi.com/exercises/${imageId}/image`,
      headers: {
        'Accept': 'image/svg+xml',
        'x-api-key': apiKey
      }
    };

    axios.request(config)
      .then((response) => {
        // https://github.com/software-mansion/react-native-svg/issues/2458
        // https://www.geeksforgeeks.org/javascript/how-to-remove-text-from-a-string-in-javascript/
        const cleanSvg = response.data
          .replace(/<\?xml.*?\?>/g, '')
          .replace(/<!DOCTYPE.*?>/g, '');
        setIllustration(cleanSvg);
        console.log(cleanSvg);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIlModalVisible(true));
  }

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
      setExModalVisible(false);
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

  useEffect(() => { updateExercises() }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <Text variant='titleMedium'>Lisää uusi liike liikepankkiin</Text>
        <View style={styles.inputAndButton}>
          <TextInput
            style={styles.textInput}
            label="Liikkeen nimi"
            value={exercise}
            onChangeText={setExercise}
          />
          <Button mode='contained' onPress={handleCreateExercise}>Lisää liike</Button>
        </View>

        <View style={styles.middlePart}>
          <Text variant='titleMedium'>Poista tai muokkaa liikettä</Text>
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
            visible={exModalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>Anna uusi nimi liikkeelle</Text>
                <TextInput style={styles.modalTextInput} value={input} onChangeText={setInput} />
                <View style={styles.buttons}>
                  <Button style={styles.button} mode="contained" onPress={() => setExModalVisible(false)}>
                    Peruuta
                  </Button>
                  <Button mode="contained" onPress={handleEditExercise}>
                    Tallenna
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.buttons}>
            <Button style={styles.button} mode='contained' onPress={handleDeleteExercise}>Poista</Button>
            <Button mode='contained' onPress={() => {
              if (!exerciseValue) {
                Alert.alert('Valitse liike');
                return;
              }
              const selected = exercises.find((item) => item.value === exerciseValue);
              setInput(selected?.label);
              setExModalVisible(true)
            }}>
              Muokkaa
            </Button>
          </View>
        </View>

        <Text variant='titleMedium'>Workout-liikepankki</Text>
        <Text>Hae liikkeitä lihasryhmille Workout-liikepankista englanninkielisellä hakusanalla</Text>

        <View style={styles.inputAndButton}>
          <TextInput
            style={styles.textInput}
            label="Esim. shoulders"
            value={searchKey}
            onChangeText={text => setSearchKey(text)} />
          <Button loading={loading} mode='contained' onPress={handleFetch}>
            Etsi
          </Button>
        </View>

        <FlatList
          data={exerciseData}
          renderItem={({ item }) =>
            <Card style={{ marginBottom: 10 }}>
              <Card.Title title={item.name} />
              <Card.Content>
                <Text variant="bodyMedium">{item.description}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => handleFetchIllustration(item.id)}>
                  Illustration
                </Button>
              </Card.Actions>
            </Card>
          } />

        <Modal
          animationType="slide"
          transparent={true}
          visible={ilModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <SvgXml xml={illustration} width={200}
                height={200}
              />
              <Button mode="contained" onPress={() => setIlModalVisible(false)}>
                Sulje
              </Button>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  inputAndButton: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  middlePart: {
    marginBottom: 30,
    marginTop: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',

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
  modalTextInput: {
    width: '90%',
    marginBottom: 10,
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    marginBottom: 10,
    marginRight: 10,
  },
});
