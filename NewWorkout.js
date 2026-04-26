// https://hossein-zare.github.io/react-native-dropdown-picker-website/
// https://stackoverflow.com/questions/30266831/hide-show-components-in-react-native elementtien pillottaminen ja näyttäminen

import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState, useCallback } from 'react';
import { initialize, getAllExercises, createWorkout, saveReps, getSetsForExercise, deleteWorkout } from './Database';
import { useFocusEffect } from '@react-navigation/native';

export default function NewWorkout({ navigation }) {

    const [open, setOpen] = useState(false);
    const [exerciseValue, setExerciseValue] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [savedExercises, setSavedExercises] = useState([]);
    const [workoutId, setWorkoutId] = useState(null);

    const [currentSet, setCurrentSet] = useState([]);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                await initialize();
                await updateExercises();
            } catch (error) {
                console.error('Initialization error', error);
            }
        };

        init();
    }, []);

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
        Alert.alert('Peruuta', 'Haluatko varmasti peruuttaa treenin? Tallentamattomat tiedot häviävät.', [
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
            await saveReps(currentWorkoutId, exerciseValue, weight, reps);
            setCurrentSet((prev) => [
                ...prev,
                { weight: weight, reps: reps }
            ]);
        } catch (error) {
            console.error('Could not save reps', error);
        }
    };

    const deleteRep = () => {
        // toteuta poisto
    };

    const handleAddExercise = async () => {
        try {
            setSavedExercises(prev => [
                ...prev,
                {
                    name: exercises.find((ex) => ex.value === exerciseValue)?.label,
                    sets: currentSet
                }
            ]);

        } catch (error) {
            console.error('Could not fetch sets', error);
        }
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

    const deleteExercise = () => {
        Alert.alert('Poista', 'Haluatko varmasti poistaa liikkeen?', [
            {
                text: 'Kyllä',
                onPress: () => {
                    // toteuta poisto
                }
            },
            {
                text: 'Ei',
                onPress: () => Alert.alert('Ei poistettu'),
            }
        ]);
    };

    useFocusEffect(
        useCallback(() => {
            updateExercises();
        }, [])
    );

    return (
        <View style={styles.container}>

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
                <View>
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
                            Lisää toistot
                        </Button>
                    </View>

                    <FlatList
                        data={currentSet}
                        renderItem={({ item }) =>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text>{item.weight} kg, {item.reps} toistoa</Text>
                                <IconButton icon='delete-outline' onPress={deleteRep} />
                            </View>
                        }
                    />

                    <Button mode="contained" onPress={handleAddExercise}>
                        Seuraava liike
                    </Button>
                </View>
            )}

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
                            <IconButton icon="delete" onPress={deleteExercise} />
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
