// https://docs.expo.dev/versions/latest/sdk/sqlite/

import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

export const db = SQLite.openDatabaseSync('treenilokidb');

export const initialize = async () => {
    try {
        await createTables();
    } catch (error) {
        console.error('Could not open database', error);
    }
};

const createTables = async () => {
    try {
        await db.execAsync(`

            CREATE TABLE IF NOT EXISTS workout (
                workout_id INTEGER PRIMARY KEY NOT NULL, 
                date TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS exercise (
                exercise_id INTEGER PRIMARY KEY NOT NULL, 
                name TEXT NOT NULL UNIQUE,  
                instruction TEXT
            );

            CREATE TABLE IF NOT EXISTS set_entry (
                set_entry_id INTEGER PRIMARY KEY NOT NULL,
                workout_id INTEGER NOT NULL, 
                exercise_id INTEGER NOT NULL, 
                weight INTEGER, 
                reps INTEGER, 
                FOREIGN KEY(workout_id) REFERENCES workout(workout_id),
                FOREIGN KEY(exercise_id) REFERENCES exercise(exercise_id)
            );

    `);

    } catch (error) {
        console.error('Could not create tables', error);
    }
}

export const createWorkout = async () => {
    try {
        await db.runAsync('INSERT INTO workout (date) VALUES (date(\'now\'))');
        const result = await db.getAllAsync('SELECT last_insert_rowid();'); // https://forum.xojo.com/t/sqlite-return-id-of-record-inserted/37896/3
        return result[0]['last_insert_rowid()'];
    } catch (error) {
        console.error('Could not create workout', error);
        return null;
    }
}

export const createExercise = async (name) => {
    try {
        const existingExercise = await getExerciseByName(name);

        if (existingExercise) {
            Alert.alert('Virhe', 'Liike on jo olemassa');
            return;
        }

        await db.runAsync('INSERT INTO exercise (name) VALUES (?)', name);
    } catch (error) {
        console.error('Could not create exercise', error);
    }
}

export const getExerciseByName = async (name) => {
    try {
        const result = await db.getFirstAsync('SELECT * FROM exercise WHERE name = ?', name);
        return result;
    } catch (error) {
        console.error('Could not fetch exercise by name', error);
        return null;
    }
}

export const deleteExercise = async (exerciseId) => {
    try {
        await db.runAsync('DELETE FROM exercise WHERE exercise_id = ?', Number(exerciseId));
    } catch (error) {
        console.error('Could not delete exercise', error);
    }
}

export const editExercise = async (exerciseId, editedName) => {
    try {
        await db.runAsync('UPDATE exercise SET name = ? WHERE exercise_id = ?', editedName, Number(exerciseId));
    } catch (error) {
        console.error('Could not edit exercise', error);
    }
}

export const getAllExercises = async () => {
    try {
        const result = await db.getAllAsync('SELECT * FROM exercise');
        const formatted = result
            .sort((a, b) => a.name.localeCompare(b.name)) // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
            .map((item) => ({
                label: item.name,
                value: item.exercise_id
            }));
        return formatted;
    } catch (error) {
        console.error('Could not fetch exercises', error);
        return [];
    }
}

export const getAllData = async () => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
            se.set_entry_id, 
            w.workout_id, 
            w.date, 
            e.exercise_id, 
            e.name, 
            se.weight, 
            se.reps 
            FROM set_entry se 
            JOIN workout w ON se.workout_id = w.workout_id 
            JOIN exercise e ON se.exercise_id = e.exercise_id;`)
        return result;
    } catch (error) {
        console.error('Could not fetch workouts', error);
        return [];
    }
}

export const saveReps = async (workoutId, exerciseId, weight, reps) => {
    try {
        await db.runAsync('INSERT INTO set_entry (workout_id, exercise_id, weight, reps) VALUES (?, ?, ?, ?)', Number(workoutId), Number(exerciseId), Number(weight), Number(reps));
    } catch (error) {
        console.error('Could not save reps', error);
    }
}

export const getSetsByWorkoutId = async (workoutId) => {
    try {
        const result = await db.getAllAsync('SELECT * FROM set_entry WHERE workout_id = ?', Number(workoutId));
        return result;
    } catch (error) {
        console.error('Could not fetch sets for workout', error);
        return [];
    }
}

// tarkista onko turha
export const getSetsForExercise = async (workoutId, exerciseId) => {
    try {
        const result = await db.getAllAsync('SELECT * FROM set_entry JOIN exercise ON set_entry.exercise_id = exercise.exercise_id WHERE set_entry.workout_id = ? AND set_entry.exercise_id = ?', Number(workoutId), Number(exerciseId));
        return result;
    } catch (error) {
        console.error('Could not fetch sets', error);
        return [];
    }
}

//mahdollisesti turha
export const getExerciseById = async (exerciseId) => {
    try {
        const result = await db.getAllAsync('SELECT * FROM exercise WHERE exercise_id = ?', Number(exerciseId));
        return result[0];
    } catch (error) {
        console.error('Could not fetch exercise', error);
        return null;
    }
}

