import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Header from "./components/Header";
import StartGameScreen from "./screens/StartGameScreen";
import GameScreen from "./screens/GameScreen";
import GameOverScreen from "./screens/GameOverScreen";
// To load fonts we use Font and AppLoading
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  // userNumber is set to nothing as starting state
  const [userNumber, setUserNumber] = useState();

  // guessRounds is set to 0 to start in state
  const [guessRounds, setGuessRounds] = useState(0);

  // used for loading fonts, load them once data is loaded
  const [dataLoaded, setDataLoaded] = useState(false);

  // Data not loaded, then fetch fonts, when finished load data
  // otherwise log an error to console
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  // New Game Handler
  // rounds is set to 0
  // starting user number is null, on restart nothing is selected yet
  const configureNewGameHandler = () => {
    setGuessRounds(0);
    setUserNumber(null);
  };

  // Start the game, the number selected is set in state
  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
  };

  // When the game ends set the number of rounds as a function
  // We set the guess rounds to number of rounds, it is the # of guesses
  const gameOverHandler = (numOfRounds) => {
    setGuessRounds(numOfRounds);
  };

  // Content starts as defined
  // We use the StartGameScreen screen
  // onStartGame we load the start game handler
  let content = <StartGameScreen onStartGame={startGameHandler} />;

  // Change to GameScreen if statement is true
  // userChoice prop is the userNumber - set in state
  // onGameOver prop we use the game over handler
  // gameover prop takes the excluded number, meaning we complete the game
  if (userNumber && guessRounds <= 0) {
    content = (
      <GameScreen userChoice={userNumber} onGameOver={gameOverHandler} />
    );
  
    // Otherwise, load gameOverScreen once guessRonds > 0 is true
    // We display the # of rounds, user #, and a restart button
    // Handled in the new game handler, basically just restarts the game
  } else if (guessRounds > 0) {
    content = (
      <GameOverScreen
        roundsNumber={guessRounds}
        userNumber={userNumber}
        onRestart={configureNewGameHandler}
      />
    );
  }

  // This is the main screen header
  // {content} is loaded based on above statements ^^
  return (
    <View style={styles.screen}>
      <Header title="Guess a Number" />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
