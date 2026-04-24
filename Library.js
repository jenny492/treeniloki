import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { createExercise } from './Database';

export default function Library() {

  const [exercise, setExercise] = useState('');

  const handleCreateExercise = async () => {
    try {
      await createExercise(exercise);
    } catch (error) {
      console.error('Error creating new exercise', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text variant='displaySmall'>Library</Text>
      <TextInput
      style={{flexDirection: 'row'}}
        label="Harjoituksen nimi"
        value={exercise}
        onChangeText={setExercise}

      />
      <Button onPress={handleCreateExercise}>Lisää harjoitus</Button>
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
