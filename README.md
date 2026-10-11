# Treeniloki

Treeniloki is a mobile workout-tracking application built with React Native and Expo. It helps users log gym sessions, manage an exercise library, and review previous workouts in a simple and fast workflow.

The project is designed as a personal fitness tracking app and serves as a portfolio project demonstrating mobile app development, local data persistence, API integration, and UI design in a real-world use case.

## Features

- Create and manage workout sessions
- Add exercises to a workout
- Log sets with weight and repetitions
- Review previous workouts grouped by date
- Remove workouts, exercises, or individual sets
- Maintain a personal exercise library
  - add exercises
  - edit exercise names
  - delete exercises
- Search and browse exercises via the Workout API by muscle group
- Display exercise illustrations returned by the Workout API
- Persistent local storage using SQLite

## Tech Stack

- Frontend: React Native
- Framework: Expo
- UI library: React Native Paper
- Navigation: React Navigation
- Database: SQLite via expo-sqlite
- Dropdown UI: react-native-dropdown-picker
- SVG rendering: react-native-svg
- API client: Axios

## Project Structure

- `App.js` – application shell and bottom tab navigation
- `Home.js` – workout history view
- `NewWorkout.js` – workout creation and set logging flow
- `Library.js` – exercise library and API-based exercise lookup
- `Database.js` – SQLite setup and CRUD operations
- `AddExercise.js` – supporting logic related to exercise creation (if used in the app flow)
- `sample.env` – template for required environment variables

## Database Schema

The app uses a lightweight SQLite structure for local persistence.

### `workout`
Stores each training session.

- `workout_id` – unique workout identifier
- `date` – workout date

### `exercise`
Stores each exercise in the library.

- `exercise_id` – unique exercise identifier
- `name` – exercise name
- `instruction` – optional exercise instruction/description

### `set_entry`
Stores each logged set for a workout and exercise.

- `set_entry_id` – unique set entry identifier
- `workout_id` – associated workout
- `exercise_id` – associated exercise
- `weight` – weight used
- `reps` – number of repetitions

## API Integration

The app integrates with the Workout API to support exercise discovery and visual reference material.

To use it, create a `.env` file in the project root based on `sample.env` and add your API key:

```bash
EXPO_PUBLIC_API_KEY=your_api_key_here
```

The API is used to:
- search exercises by muscle group
- retrieve exercise data
- display exercise illustrations

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- Android emulator or iOS simulator, or a physical device with Expo Go

### Install dependencies

```bash
npm install
```

### Start the app

```bash
npm start
```

Then run one of the following:

```bash
npm run android
npm run ios
npm run web
```

## Usage

1. Open the app.
2. Create a new workout from the "New Workout" tab.
3. Select an exercise from your library.
4. Enter the weight and repetitions for each set.
5. Save the workout.
6. Review historical workouts on the home screen.
7. Manage exercises via the library tab.

## App Flow

- `Home`: shows previous workouts in a card-based layout
- `NewWorkout`: creates workout sessions and logs sets
- `Library`: manages exercise entries and integrates with the external exercise API

## Current Status

This project is a functional MVP for personal workout logging. It demonstrates a working mobile app with local persistence, exercise management, and basic workout tracking.

## Potential Improvements

The project is already usable and portfolio-appropriate, but there are several areas that would improve its quality and professionalism:

- add user authentication or sync features for cloud backup
- add editing of completed workouts and individual sets
- improve validation and input handling for weight/reps
- add search and filtering to exercise and workout history
- improve empty states and loading indicators
- add automated tests
- enhance styling for a more polished product feel
- add a project README with screenshots and clearer app documentation

## License

This project is currently a personal portfolio project. Add a license file if you plan to publish it publicly or share it with others.

## Notes

This repository is a personal project focused on fitness tracking and learning mobile app development with React Native and Expo. It can be expanded into a more complete workout app with features such as statistics, progress tracking, and user profiles.

