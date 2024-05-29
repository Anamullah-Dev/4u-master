import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import { auth } from './firebase';
import { getFirestore, doc, getDoc, collection, updateDoc } from 'firebase/firestore';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

class Cart extends Component {
  // Initialize state in the constructor
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      refreshing: false,
    };
  }

  // Lifecycle method to fetch cart items when component mounts
  componentDidMount() {
    this.fetchCartItems();
  }

  // Function to fetch cart items from Firestore
  fetchCartItems = async () => {
    try {
      const currentUser = auth.currentUser; // Get current authenticated user
      const userId = currentUser.uid; // Get user ID
      const firestore = getFirestore();

      const userDocRef = doc(collection(firestore, 'users'), userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.setState({ cartItems: userData.cart || [] }); // Update state with cart items
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Could not fetch cart items'); // Display alert if error occurs
    }
  };

  // Function to handle pull-to-refresh action
  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchCartItems();
    this.setState({ refreshing: false });
  };

  // Function to delete an item from the cart
  deleteItemFromCart = async (itemToDelete) => {
  try {
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;
    const firestore = getFirestore();
    
    const userDocRef = doc(collection(firestore, 'users'), userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      // Find the index of the item to delete in the cart array
      const cartIndex = userData.cart.findIndex(item => item.id === itemToDelete.id);
      
      if (cartIndex !== -1) {
        // Remove the item from the cart array
        userData.cart.splice(cartIndex, 1);
        
        // Update the user document with the modified cart array
        await updateDoc(userDocRef, { cart: userData.cart });
        
        // Update the component state with the modified cart array
        this.setState({ cartItems: userData.cart });
        
        Alert.alert('Removed item from cart');
      } else {
        Alert.alert('Error', 'Item not found in cart');
      }
    }
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    Alert.alert('Error', 'Could not delete item from cart');
  }
};

  // Function to handle delete button press, shows a confirmation alert
  handleDeletePress = (item) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => this.deleteItemFromCart(item) }
      ]
    );
  };

  render() {
    const { navigation } = this.props;
    const { cartItems, refreshing } = this.state;

    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.onRefresh}
            colors={['red']}
            tintColor={'red'}
          />
        }
      >
        <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>Your Cart</Text>
        {/* Render cart items or a message if the cart is empty */}
        {cartItems.length > 0 ? (
          cartItems.map((cartItem, index) => (
            <View key={index} style={styles.cartItem}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => navigation.navigate('AdDetails', { item: cartItem })}
              >
                <Image source={{ uri: cartItem.image1 }} style={styles.cartImage} />
                <View>
                  <Text style={styles.cartTitle}>{cartItem.title}</Text>
                  <Text style={styles.cartPrice}>Rs {cartItem.price}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleDeletePress(cartItem)}>
                <Ionicons name="close-circle" size={24} color="red" style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', margin: 20 }}>Your cart is empty</Text>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingTop: height * 0.06,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartPrice: {
    fontSize: 14,
    color: '#888',
  },
  deleteIcon: {
    padding: 10,
  },
});

export default Cart;
