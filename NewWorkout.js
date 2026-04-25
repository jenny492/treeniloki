// https://hossein-zare.github.io/react-native-dropdown-picker-website/
// https://stackoverflow.com/questions/30266831/hide-show-components-in-react-native elementtien pillottaminen ja näyttäminen

import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState, useCallback } from 'react';
import { initialize, getAllExercises, createWorkout, saveReps, getSetsForExercise } from './Database';
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
                await getExercises();
            } catch (error) {
                console.error('Initialization error', error);
            }
        };

        init();
    }, []);

    const getExercises = async () => {
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
        setWorkoutId(null);
        setCurrentSet([]);
        setSavedExercises([]);
        navigation.navigate('Koti');
    };

    useFocusEffect(
        useCallback(() => {
            getExercises();
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
            />

            {exerciseValue && (
                <View>
                    <View style={styles.setFields}>
                        <Text>{exercises.find((ex) => ex.value === exerciseValue)?.label}</Text>
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
                            <Text>{item.weight} kg, {item.reps} toistoa</Text>
                        }
                    />

                    <Button mode="contained" onPress={handleAddExercise}>
                        Seuraava liike
                    </Button>
                </View>
            )}

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
                            <IconButton icon="delete" />
                        </Card.Actions>
                    </Card>
                }
            />

            <Button mode="contained" onPress={handleSaveExercise}>
                Tallenna harjoitus
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
