import React from 'react';
import { Text, View, ImageBackground, StyleSheet } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { ButtonLarge } from '../components/buttons/ButtonLarge';
const OnboardPage = ({navigation}) => {
  return (
    <ImageBackground 
      style={{flex:1}} 
      imageStyle={{opacity:0.67, backgroundColor:'black'}} 
      source={require("../assets/background.png")}
    >
      <View style={styles.container}>
        <StatusBar style='auto' />
        <ButtonLarge isPrimary={true} label={'LOGIN'} navigation={navigation} />
        <ButtonLarge isPrimary={false} label={'SIGNUP'} navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', 
    paddingBottom: 70
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default OnboardPage;
