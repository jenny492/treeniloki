// https://docs.expo.dev/versions/latest/sdk/sqlite/

import * as SQLite from 'expo-sqlite';

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
            DROP TABLE IF EXISTS set_entry;
            DROP TABLE IF EXISTS workout_exercise;
            DROP TABLE IF EXISTS workout;
            DROP TABLE IF EXISTS exercise;

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

            INSERT INTO exercise (name, instruction) VALUES
                ('Kyykky', ''),
                ('Penkkipunnerrus', ''),
                ('Maastaveto', ''),
                ('Pystypunnerrus', ''),
                ('Leuanveto', ''),
                ('Kulmasoutu', '');
    `);
    
    } catch (error) {
        console.error('Could not create tables', error);
    }
}

export const createWorkout = async () => {
    try {
        await db.runAsync('INSERT INTO workout (date) VALUES (date(\'now\'))');
        const result = await db.getAllAsync('SELECT last_insert_rowid();'); // https://forum.xojo.com/t/sqlite-return-id-of-record-inserted/37896/3
        console.log('Created workout with id', result);
        return result[0]['last_insert_rowid()'];
    } catch (error) {
        console.error('Could not create workout', error);
    }  
}

export const getAllExercises = async () => {
    try {
        const result = await db.getAllAsync('SELECT * FROM exercise');  
        return result;
    } catch (error) {
        console.error('Could not fetch exercises', error);
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

