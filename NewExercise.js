// https://hossein-zare.github.io/react-native-dropdown-picker-website/

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { initialize, getAllExercises, createWorkout, saveReps } from './Database';

export default function NewExercise({ navigation }) {

    const [open, setOpen] = useState(false);
    const [exercise, setExercise] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [workout, setWorkout] = useState(null);

    const [setFields, setSetFields] = useState([{ weight: 0, reps: 0 }]);
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);

    const fetchExercises = async () => {
        try {
            const allExercises = await getAllExercises();
            const formatted = allExercises
                .sort((a, b) => a.name.localeCompare(b.name)) // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
                .map((item) => ({
                    label: item.name,
                    value: item.exercise_id
                }));
            setExercises(formatted);
        } catch (error) {
            console.error('Could not fetch exercises', error);
        }
    };

    const saveReps = async () => {
        if (!workout) {
            console.error('No workout found');
            return;
        }
        try {
            await saveReps(workout.workout_id, weight, reps);
        } catch (error) {
            console.error('Could not save reps', error);
        }
        console.log(workout);
    };

    useEffect(() => {
        const init = async () => {
            await initialize();
            await createWorkout().then((result) => setWorkout(result));
            await fetchExercises();
            
        };

        init();
    }, []);

    return (
        <View style={styles.container}>
            <DropDownPicker
                placeholder='Valitse liike'
                open={open}
                value={exercise}
                items={exercises}
                setOpen={setOpen}
                setValue={setExercise}
                setItems={setExercises}
            />

            <View style={styles.setFields}>
                <TextInput
                    label="Paino"
                    value={weight}
                />
                <TextInput
                    label="Toistot"
                    value={reps}
                />
            </View>

            <FlatList
                data={setFields}
                renderItem={({ item }) =>
                    <View>
                        <Text>{item.weight} kg, {item.reps} toistoa</Text>
                    </View>}
            />
            <Button mode="contained" onPress={saveReps}>
                Lisää toistoja
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
