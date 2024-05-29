import { useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';


const Authentication =({navigation})=>{

    const checkAuthStatus = async () => {
        try {
          const userData = await AsyncStorage.getItem('user');
  
          if (userData) {
            // User data found in AsyncStorage 
            // const user = JSON.parse(userData);
            // console.log('User found in AsyncStorage:', user);
            navigation.navigate('BottomNavigation');
          } else {
            // No user data in AsyncStorage
            navigation.navigate('OnBoardPage');
          }
        } catch (error) {
          console.error('Error checking AsyncStorage:', error);
          navigation.navigate('OnBoardPage');
        } 
      };

    return(
        useEffect(()=>{
            checkAuthStatus()
        },[])
    )
}

export default Authentication;