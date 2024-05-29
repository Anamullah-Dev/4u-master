// FullScreenImage.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

const FullScreenImage = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;
 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      padding:10
    },
    fullImage: {
      width: width,
      height: height*0.5,
    },
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} >
        <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="contain"/>
      </View>
    </GestureHandlerRootView>
  );
};



export default FullScreenImage;
