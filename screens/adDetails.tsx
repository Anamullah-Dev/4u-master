// AdDetails.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { auth } from './firebase';
import { collection, doc, getFirestore, updateDoc, getDoc, arrayUnion, setDoc } from 'firebase/firestore';

const AdDetails = ({ route, navigation }) => {
  const { item } = route.params;  
  const images = [item.image1, item.image2, item.image3, item.image4]; 
  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;

  const handleCart = async () => {
    try {
      const currentUser = auth.currentUser;
      const userId = currentUser.uid;
      const firestore = getFirestore();

      const userDocRef = doc(collection(firestore, 'users'), userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const cart = userData.cart || [];

        const itemExists = cart.some(cartItem => cartItem.id === item.id);

        if (itemExists) {
          Alert.alert('Item already in cart');
        } else {
          await updateDoc(userDocRef, {
            cart: arrayUnion(item)
          });
          Alert.alert('Added to cart');
        }
      } else {
        // If the user document does not exist, create it with the item in the cart
        await setDoc(userDocRef, {
          cart: [item]
        });
        Alert.alert('Added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error adding to cart', error.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    title: {
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      padding: 20,
      height: height * 0.4
    },
    imageContainer: {
      height: height * 0.5, 
      marginBottom: 10,
    },
    image: {
      width: Dimensions.get('window').width,
      height: '100%',
      resizeMode: 'cover',
    },
    details: {
      backgroundColor: 'lightgrey',
      width: width,
      height: height * 0.13,
      justifyContent: 'center',
      paddingLeft: 30,
    },
    cart: {
      position: 'absolute',
      backgroundColor: 'red',
      width: width,
      bottom: 0,
      height: height * 0.05,
      justifyContent: 'center',
      alignItems: 'center'
    },
    cartText: {
      color: 'white'
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false} 
            style={styles.imageContainer}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('FullScreenImage', { imageUri: image })}
              >
                <Image source={{ uri: image }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ padding: 20 }}>
            {/* Price */}
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Rs {item.price}
            </Text>  
          
            {/* Title */}
            <Text style={styles.title}>{item.title}</Text>

            {/* Location */}
            <View style={{ flexDirection: "row" }}>
              <Ionicons name='location-outline' size={18} style={{ top: 3, marginRight: 6 }} />
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                {item.location}
              </Text>
            </View>

            {/* Spacing */}
            <View style={{ height: height * 0.04 }} />
          </View>

          {/* Details */}
          <View style={styles.details}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'left', paddingBottom: 5 }}>
              Details:
            </Text>

            {/* Category */}
            <Text style={{ fontSize: 16, paddingBottom: 10 }}>
              Brand = {item.category}
            </Text>
            {/* Condition */}
            <Text style={{ fontSize: 16 }}>
              Condition = {item.condition}
            </Text>
          </View>

          {/* Spacing */}
          <View style={{ height: height * 0.02 }} />
          
          {/* Description */}
          <View style={styles.description}> 
            <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
              Description
            </Text>
            <Text>
              {item.description}
            </Text>
          </View>

          {/* Add to cart */}
          <TouchableOpacity style={styles.cart} onPress={handleCart}>
            <Text style={styles.cartText}>
              Add to cart 
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default AdDetails;
