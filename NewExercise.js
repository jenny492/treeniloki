// https://hossein-zare.github.io/react-native-dropdown-picker-website/
// https://stackoverflow.com/questions/30266831/hide-show-components-in-react-native elementtien pillottaminen ja näyttäminen

import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { initialize, getAllExercises, createWorkout, saveReps } from './Database';

export default function NewExercise({ navigation }) {

    const [open, setOpen] = useState(false);
    const [exerciseValue, setExerciseValue] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [workoutId, setWorkoutId] = useState('');
    const [showDropdown, setShowDropdown] = useState(true);
    const [showReps, setShowReps] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);

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
        if (!workoutId) {
            console.error('No workout found');
            return;
        } else if (!exerciseValue) {
            Alert.alert('Valitse liike');
            return;
        }
        try {
            await saveReps(workoutId, exerciseValue, weight, reps);

            const selectedExercise = exercises.find((exercise) => exercise.value === exerciseValue);

            setSetFields((prev) => [
                ...prev,
                { exerciseName: selectedExercise.label, weight, reps }
            ]);
        } catch (error) {
            console.error('Could not save reps', error);
        }
        console.log('Workout ID:', workoutId);
    };

    const handleNextExercise = async () => {
        Alert.alert('Harjoitus tallennettu');
        setShowDropdown(true);
        setShowReps(false);
        setShowNextButton(false);
        setExerciseValue(null);
        setWeight('');
        setReps('');
    };

    useEffect(() => {
        const init = async () => {
            await initialize();
            await createWorkout().then((result) => setWorkoutId(result));
            await fetchExercises();
        };

        init();
    }, []);

    useEffect(() => {
    if (exerciseValue !== null) {
        setShowDropdown(false);
        setShowReps(true);
        setShowNextButton(true);
    }

}, [exerciseValue]);

    return (
        <View style={styles.container}>
            {showDropdown && (
                <DropDownPicker
                    placeholder='Valitse liike'
                    open={open}
                    value={exerciseValue}
                    items={exercises}
                    setOpen={setOpen}
                    setValue={setExerciseValue}
                    setItems={setExercises}
                />
            )}

            {showReps && (
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
            
            <Button mode="contained" onPress={handleSaveReps}>
                Lisää toistot
            </Button>
            </View>
            )}

            <FlatList
                data={setFields}
                renderItem={({ item }) =>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>{item.exerciseName} </Text>
                        <Text>{item.weight} kg, {item.reps} toistoa</Text>
                    </View>}
            />

            {showNextButton && (
                <Button mode="contained" onPress={handleNextExercise}>
                    Seuraava liike
                </Button>
            )}

            <FlatList />


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
