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
        const result = await db.execAsync(`
            INSERT INTO workout (date) VALUES (date('now')) RETURNING workout_id;
        `);
        return result;
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

