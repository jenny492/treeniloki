// https://hossein-zare.github.io/react-native-dropdown-picker-website/
// https://stackoverflow.com/questions/30266831/hide-show-components-in-react-native elementtien pillottaminen ja näyttäminen

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createWorkout, deleteWorkout, getAllExercises, saveReps, deleteSetEntry, deleteExerciseFromWorkout } from './Database';

export default function NewWorkout({ navigation }) {

    const [open, setOpen] = useState(false);
    const [exerciseValue, setExerciseValue] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [savedExercises, setSavedExercises] = useState([]);
    const [workoutId, setWorkoutId] = useState(null);

    const [currentSet, setCurrentSet] = useState([]);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    const updateExercises = async () => {
        try {
            const allExercises = await getAllExercises();
            setExercises(allExercises);
        } catch (error) {
            console.error('Error fetching exercises', error);
        }
    };

    const createNewWorkout = async () => {
        try {
            const newWorkoutId = await createWorkout();
            setWorkoutId(newWorkoutId);
            return newWorkoutId;
        } catch (error) {
            console.error('Error creating new workout', error);
            return null;
        }
    };

    const handleCancelWorkout = () => {
        Alert.alert('Peruuta', 'Haluatko varmasti peruuttaa? Tallentamattomat tiedot häviävät.', [
            {
                text: 'Kyllä',
                onPress: () => {
                    const id = workoutId;
                    if (id) {
                        handleDeleteWorkout();
                    }
                    setWorkoutId(null);
                    setCurrentSet([]);
                    setSavedExercises([]);
                    navigation.navigate('Koti');
                }
            },
            {
                text: 'Ei',
                onPress: () => Alert.alert('Ei peruutettu'),
            }
        ]);
    };

    const handleDeleteWorkout = async () => {
        try {
            await deleteWorkout(workoutId);
        }
        catch (error) {
            console.error('Error deleting workout', error);
        }
    };

    const handleAddReps = async () => {
        if (!exerciseValue) {
            Alert.alert('Valitse liike');
            return;
        }
        try {
            let currentWorkoutId = workoutId;
            if (!currentWorkoutId) {
                currentWorkoutId = await createNewWorkout();
            }
            // tallentaa setEntryn tietokantaan ja palauttaa samalla setEntryn id:n
            const setEntryId = await saveReps(currentWorkoutId, exerciseValue, weight, reps);
            setCurrentSet((prev) => [
                ...prev,
                { setEntryId: setEntryId, weight: weight, reps: reps }

            ]);
            console.log('set entry id', setEntryId);
        } catch (error) {
            console.error('Could not save reps', error);
        }
    };

    const deleteRep = async (setEntryId) => {
        console.log('set entry in deleterep', setEntryId)
        try {
            await deleteSetEntry(setEntryId);
            setCurrentSet(currentSet.filter(item => item.setEntryId !== setEntryId)); // https://stackoverflow.com/questions/67979861/how-to-delete-an-element-from-array-in-react
        } catch (error) {
            console.error('Could not delete reps');
        }
    };

    const handleAddExercise = () => {
        setSavedExercises(prev => [
            ...prev,
            {
                exerciseId: exerciseValue,
                name: exercises.find((ex) => ex.value === exerciseValue)?.label,
                sets: currentSet
            }
        ]);
        setExerciseValue(null);
        setCurrentSet([]);
        setWeight('');
        setReps('');
    };

    const handleSaveExercise = () => {
        if (!workoutId) {
            Alert.alert('Ei tallennettavaa');
            return;
        }
        Alert.alert('Tallenna', 'Treeni valmis?', [
            {
                text: 'Kyllä',
                onPress: () => {
                    setWorkoutId(null);
                    setCurrentSet([]);
                    setSavedExercises([]);
                    navigation.navigate('Koti');
                },
            },
            {
                text: 'Ei',
                onPress: () => Alert.alert('Ei tallennettu'),
            }
        ]);
        ;
    };

    const handleDeleteExercise = async (exerciseId) => {
        try {
            await deleteExerciseFromWorkout(exerciseId, workoutId);
            setSavedExercises(prev => prev.filter(item => item.exerciseId !== exerciseId));
        } catch (error) {
            console.error('Could not delete exercise', error);
        }
    };



    useFocusEffect(
        useCallback(() => {
            updateExercises();
        }, [])
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

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

                {exerciseValue && (
                    <View style={{ flex: 1 }}>
                        <View style={styles.setFields}>
                            <TextInput
                                label="Paino"
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType='numeric'
                            />
                            <TextInput
                                label="Toistot"
                                value={reps}
                                onChangeText={setReps}
                                keyboardType='numeric'
                            />

                            <Button mode="contained" onPress={handleAddReps}>
                                Tallenna
                            </Button>
                        </View>

                        <FlatList
                            data={currentSet}
                            renderItem={({ item }) =>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>{item.weight} kg, {item.reps} toistoa</Text>
                                    <IconButton icon='delete-outline' onPress={() => deleteRep(item.setEntryId)} />
                                </View>
                            }
                        />

                        <Button mode="contained" onPress={handleAddExercise}>
                            Seuraava liike
                        </Button>
                    </View>
                )}

                {!exerciseValue && (
                    <View style={{ flex: 1 }}>
                        <Text>Tehdyt liikkeet</Text>
                        <FlatList
                            data={savedExercises}
                            renderItem={({ item }) =>
                                <Card style={{ marginBottom: 10 }}>
                                    <Card.Title title={item.name} />
                                    <Card.Content>
                                        {item.sets.map((setItem, index) => (
                                            <Text key={index}>{setItem.weight} kg, {setItem.reps} toistoa</Text>
                                        ))}

                                    </Card.Content>
                                    <Card.Actions>
                                        <IconButton icon="delete" onPress={() => handleDeleteExercise(item.exerciseId)} />
                                    </Card.Actions>
                                </Card>
                            }
                        />

                        <Button mode="contained" onPress={handleSaveExercise}>
                            Tallenna harjoitus
                        </Button>
                        <Button onPress={handleCancelWorkout}>
                            Peruuta
                        </Button>
                    </View>
                )}

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
    setFields: {
        marginTop: 20,
        flexDirection: 'row',
    },
    input: {
        borderWidth: 1,

    }
});
