// https://hossein-zare.github.io/react-native-dropdown-picker-website/

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { initialize, getAllExercises, createWorkout, saveReps } from './Database';

export default function NewExercise({ navigation }) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [workoutId, setWorkoutId] = useState('');

    const [setFields, setSetFields] = useState([]);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

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
            console.log('Exercises', exercises)
            console.log('Fetched exercises', formatted);
        } catch (error) {
            console.error('Could not fetch exercises', error);
        }
    };

    const handleSaveReps = async () => {
        console.log(workoutId);
        if (!workoutId) {
            console.error('No workout found');
            return;
        }
        try {
            await saveReps(workoutId, value, weight, reps);
            setSetFields((prev) => [
                ...prev,
                { weight, reps }
            ]);
        } catch (error) {
            console.error('Could not save reps', error);
        }
        console.log('Workout ID:', workoutId);
    };

    useEffect(() => {
        const init = async () => {
            await initialize();
            await createWorkout().then((result) => setWorkoutId(result));
            await fetchExercises();

        };

        init();
    }, []);

    return (
        <View style={styles.container}>

            <DropDownPicker
                placeholder='Valitse liike'
                open={open}
                value={value}
                items={exercises}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setExercises}
            />

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
            </View>
            <Button mode="contained" onPress={handleSaveReps}>
                Lisää toistoja
            </Button>

            <FlatList
                data={setFields}
                renderItem={({ item }) =>
                    <View style={{ flexDirection:'row' }}>
                        <Text>{exercises.find((exercise) => exercise.value === value)?.label} </Text>
                        <Text>{item.weight} kg, {item.reps} toistoa</Text>
                    </View>}
            />
            

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
