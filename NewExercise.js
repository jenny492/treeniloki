// https://hossein-zare.github.io/react-native-dropdown-picker-website/

import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { initialize, db } from './Database';

export default function NewExercise({ navigation }) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [exercise, setExercise] = useState([]);

    const fetchExercises = async () => {
        try {
            const result = await db.getAllAsync('SELECT * FROM exercise');
            const formatted = result
                .sort((a, b) => a.name.localeCompare(b.name)) // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
                .map((item) => ({
                    label: item.name,
                    value: item.exercise_id
                }));
            setExercise(formatted);
        } catch (error) {
            console.error('Could not fetch exercises', error);
        }
    };

    

    useEffect(() => {
        const init = async () => {
            await initialize();
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
                items={exercise}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setExercise}
            />
            <Button mode="contained" onPress={() => console.log(value)}>
                Lisää toistot
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
});
