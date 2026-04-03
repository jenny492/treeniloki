import { StyleSheet, Text, View, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { initialize, db } from './Database';

export default function Home() {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [exercise, setExercise] = useState([]);

  const fetchExercises = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM exercise');
      const formatted = result.map((item) => ({
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
      <Text>Home</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={exercise}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setExercise}
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
});
