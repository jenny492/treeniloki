import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { getAllData } from './Database';
import { useFocusEffect } from '@react-navigation/native';


export default function Home() {

  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    try {
      const fetchedWorkouts = await getAllData();
      console.log('Fetched workouts ', fetchedWorkouts);

      const formatted = [];
      setWorkouts(fetchedWorkouts);
    }
    catch (error) {
      console.error('could not fetch workouts', error);
    }
  }
  // käytä tässä useFocusEffectiä, jotta data päivittyy joka kerta kun sivu avataan, eikä vain kerran(?)
  useEffect(() => { fetchWorkouts() }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={({ item }) =>
          <Card>
            <Card.Title title={item.date} />
            <Card.Content>
            </Card.Content>
          </Card>
        }
      />
      <Text>Tässä näytetään edelliset harjoitukset listana</Text>
      <Button mode="contained" onPress={fetchWorkouts}>
        Päivitä harjoitukset
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
