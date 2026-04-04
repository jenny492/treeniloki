import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function AddExercise({ navigation }) {
  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate('NewExercise')}>
        Press me
      </Button>
      <Text>Käytä pohjana edellistä</Text>
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
