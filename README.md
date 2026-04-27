# Treeniloki

Treeniloki on mobiilisovellus kuntosalitreenien kirjaamiseen. 

### Ominaisuudet:
- Uusien harjoitusten luominen
  - liikkeiden lisääminen harjoitukseen
  - sarjojen lisääminen liikkeelle (painot ja toistot)
  - liikkeiden ja sarjojen poisto
- Näyttää edelliset harjoitukset kortteina
- Oma liikepankki, jossa liikkeitä voi lisätä, muokata ja poistaa
- Harjoitusten hakeminen Workout API -rajapinnasta lihasryhmän perusteella
- Workout API -rajapinnasta haetun harjoituksen kuvan näyttäminen

Sovellus on toteutettu React Nativella JavaScript-ohjelmointikielellä Expo-kehitysympäristössä.

### Muut teknologiat
- Käyttöliittymä: React Native Paper
- Navigointi: React Navigation
- Tietokanta: SQLite
- Valikkokomponentti: react-native-dropdown-picker
- SVG-kuvien käsittely: react-native-svg

### Tietokanta
Tietokannassa on seuraavat taulut ja niihin tallennetut tiedot: 

#### Workout (treenikerta)
- workout_id
- date	

#### Exercise (liike)
- exercise_id
- name	
- instructions	

#### Set (setti)
- set_entry_id
- workout_id	
- exercise_id	
- reps	
- weight	
