// https://docs.expo.dev/versions/latest/sdk/sqlite/

import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

export const db = SQLite.openDatabaseSync('treenilokidb');

export const initialize = async () => {
    try {
        await db.execAsync('PRAGMA foreign_keys = ON;');
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
                exercise_id INTEGER,
                exercise_name TEXT NOT NULL,
                weight INTEGER, 
                reps INTEGER, 
                FOREIGN KEY(workout_id) REFERENCES workout(workout_id) ON DELETE CASCADE,
                FOREIGN KEY(exercise_id) REFERENCES exercise(exercise_id) ON DELETE SET NULL
            );

    `);

        await migrateSetEntryTable();
    } catch (error) {
        console.error('Could not create tables', error);
    }
}

const migrateSetEntryTable = async () => {
    const columns = await db.getAllAsync('PRAGMA table_info(set_entry)');
    const exerciseIdColumn = columns.find((column) => column.name === 'exercise_id');
    const hasExerciseName = columns.some((column) => column.name === 'exercise_name');
    const foreignKeys = await db.getAllAsync('PRAGMA foreign_key_list(set_entry)');
    const exerciseForeignKey = foreignKeys.find((foreignKey) => foreignKey.from === 'exercise_id');

    if (
        exerciseIdColumn?.notnull === 0 &&
        hasExerciseName &&
        exerciseForeignKey?.on_delete === 'SET NULL'
    ) {
        return;
    }

    const exerciseName = hasExerciseName
        ? "COALESCE(se.exercise_name, e.name, 'Poistettu liike')"
        : "COALESCE(e.name, 'Poistettu liike')";

    await db.withTransactionAsync(async () => {
        await db.execAsync(`
            CREATE TABLE set_entry_new (
                set_entry_id INTEGER PRIMARY KEY NOT NULL,
                workout_id INTEGER NOT NULL,
                exercise_id INTEGER,
                exercise_name TEXT NOT NULL,
                weight INTEGER,
                reps INTEGER,
                FOREIGN KEY(workout_id) REFERENCES workout(workout_id) ON DELETE CASCADE,
                FOREIGN KEY(exercise_id) REFERENCES exercise(exercise_id) ON DELETE SET NULL
            );

            INSERT INTO set_entry_new (set_entry_id, workout_id, exercise_id, exercise_name, weight, reps)
            SELECT se.set_entry_id, se.workout_id,
                CASE WHEN e.exercise_id IS NULL THEN NULL ELSE se.exercise_id END,
                ${exerciseName}, se.weight, se.reps
            FROM set_entry se
            LEFT JOIN exercise e ON se.exercise_id = e.exercise_id;

            DROP TABLE set_entry;
            ALTER TABLE set_entry_new RENAME TO set_entry;
        `);
    });
};

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

export const deleteWorkout = async (workoutId) => {
    try {
        await db.runAsync('DELETE FROM workout WHERE workout_id = ?', Number(workoutId));
    } catch (error) {
        console.error('Could not delete workout', error);
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
        const id = Number(exerciseId);
        await db.withTransactionAsync(async () => {
            await db.runAsync(
                `UPDATE set_entry
                SET exercise_name = COALESCE(
                        (SELECT name FROM exercise WHERE exercise_id = ?),
                        exercise_name
                    ),
                    exercise_id = NULL
                WHERE exercise_id = ?`,
                id,
                id
            );
            await db.runAsync('DELETE FROM exercise WHERE exercise_id = ?', id);
        });
    } catch (error) {
        console.error('Could not delete exercise', error);
        throw error;
    }
}

export const deleteExerciseFromWorkout = async (exerciseId, workoutId) => {
    try {
        await db.runAsync('DELETE FROM set_entry WHERE exercise_id = ? AND workout_id = ?', Number(exerciseId), Number(workoutId));
    } catch (error) {
        console.error('Could not delete exercise from workout', error);
    }
};

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
            se.exercise_id,
            COALESCE(e.name, se.exercise_name) AS name,
            se.weight, 
            se.reps 
            FROM set_entry se 
            JOIN workout w ON se.workout_id = w.workout_id 
            LEFT JOIN exercise e ON se.exercise_id = e.exercise_id;`)
        return result;
    } catch (error) {
        console.error('Could not fetch workouts', error);
        return [];
    }
}

export const saveReps = async (workoutId, exerciseId, weight, reps) => {
    try {
        await db.runAsync(`
            INSERT INTO set_entry (workout_id, exercise_id, exercise_name, weight, reps)
            VALUES (?, ?, (SELECT name FROM exercise WHERE exercise_id = ?), ?, ?)
        `, Number(workoutId), Number(exerciseId), Number(exerciseId), Number(weight), Number(reps));
        const result = await db.getAllAsync('SELECT last_insert_rowid();'); // https://forum.xojo.com/t/sqlite-return-id-of-record-inserted/37896/3
        return result[0]['last_insert_rowid()'];
    } catch (error) {
        console.error('Could not save reps', error);
        return null;
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

export const deleteSetEntry = async (setEntryId) => {
    try {
        await db.runAsync('DELETE FROM set_entry WHERE set_entry_id = ?', Number(setEntryId));
    } catch (error) {
        console.error('Could not delete set', error);
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
