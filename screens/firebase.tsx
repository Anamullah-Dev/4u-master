import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCbNlZI-n3ZO6bEybmKx7lMlyi-lWXGxPs",
  authDomain: "you-154d7.firebaseapp.com",
  projectId: "you-154d7",
  storageBucket: "you-154d7.appspot.com",
  messagingSenderId: "441920354494",
  appId: "1:441920354494:web:40e218010f06cee1d706ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app);

// Manually manage persistence using AsyncStorage
const setPersistence = async () => {
  try {
    await AsyncStorage.setItem('@myApp:authPersistence', 'LOCAL');
  } catch (error) {
    console.error('Error setting auth persistence:', error);
  }
};

setPersistence();

export { auth };
