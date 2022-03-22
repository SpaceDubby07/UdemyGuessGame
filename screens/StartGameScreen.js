import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";

import Card from "../components/Card";
import Input from "../components/Input";
import NumberContainer from "../components/NumberContainer";
import BodyText from "../components/BodyText";
import TitleText from "../components/TitleText";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";

const StartGameScreen = (props) => {
  // set state of enteredValue to an empty string as we start the game
  const [enteredValue, setEnteredValue] = useState("");

  // Did we confirm the game? not yet, starting state is false
  const [confirmed, setConfirmed] = useState(false);

  // Selected a number yet? no, set it to null to start
  const [selectedNumber, setSelectedNumber] = useState();

  // manage button width state
  const [buttonWidth, setButtonWidth] = useState(
    Dimensions.get("window").width / 4
  );

  // Handle the number input using whatever this is
  // only values 0-9 can be entered - i forgot what this is called.
  const numberInputHandler = (inputText) => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ""));
  };

  // Reset the number if you entered it
  // Set entered value to an empty string
  // Set the confirm value to false, if true we started the game
  const resetInputHandler = () => {
    setEnteredValue("");
    setConfirmed(false);
  };

  useEffect(() => {
    // dynamically recalculate dimensional transitions on the button style
    // Dimensions are loaded at the start of opening the app, so if they arent
    // loaded constantly the layouts get stuck, so useEffect to update it constantly.
    const updateLayout = () => {
      setButtonWidth(Dimensions.get("window").width / 4);
    };

    Dimensions.addEventListener("change", updateLayout);
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  // confirm the input
  // parse the chosen number, make it an int, not a string, and set it as the entered value
  const confirmInputHandler = () => {
    const chosenNumber = parseInt(enteredValue);
    // if it is not a number or <=0 or > 99 send an invalid number alert
    // On the alert, set a button to reset the input back to empty string and not confirmed
    if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
      Alert.alert(
        "Invalid number!",
        "Number has to be a number between 1 and 99.",
        [{ text: "Okay", style: "destructive", onPress: resetInputHandler }]
      );
      return;
    }

    // When user hits confirm and the number chosen is valid, everything below here starts to run
    // confirm choice, true
    setConfirmed(true);
    // set the selected number as the user chosen number
    setSelectedNumber(chosenNumber);
    // set the entered value to an empty string
    setEnteredValue("");
    // dismiss the keyboard
    Keyboard.dismiss();
  };

  // Create an empty variable called confirmedOutput
  let confirmedOutput;

  // if true, create the card that shows the user choice, button to start the game
  if (confirmed) {
    confirmedOutput = (
      <Card style={styles.summaryContainer}>
        <BodyText>You selected</BodyText>
        <NumberContainer>{selectedNumber}</NumberContainer>
        <MainButton onPress={() => props.onStartGame(selectedNumber)}>
          START GAME
        </MainButton>
      </Card>
    );
  }

  // This is the start game screen
  // It is automatically run when the app is open
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.screen}>
            <TitleText style={styles.title}>Start a New Game!</TitleText>
            <Card style={styles.inputContainer}>
              <BodyText>Select a Number</BodyText>
              <Input
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={numberInputHandler}
                value={enteredValue}
              />
              <View style={styles.buttonContainer}>
                <View style={{ width: buttonWidth }}>
                  <Button
                    title="Reset"
                    onPress={resetInputHandler}
                    color={Colors.accent}
                  />
                </View>
                <View style={{ width: buttonWidth }}>
                  <Button
                    title="Confirm"
                    onPress={confirmInputHandler}
                    color={Colors.primary}
                  />
                </View>
              </View>
            </Card>
            {/* Show the confirmedOutput if the checks (logic above) passes, then we can start the game */}
            {confirmedOutput}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: "open-sans-bold",
  },
  inputContainer: {
    width: "80%",
    minWidth: 300,
    maxWidth: "95%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  // button: {
  //   //width 100
  //   width: Dimensions.get("window").width / 4,
  // },
  input: {
    width: 50,
    textAlign: "center",
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default StartGameScreen;
