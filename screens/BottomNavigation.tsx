import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyProfile from './MyProfile';
import Home from './Home';
import { Ionicons } from '@expo/vector-icons';
import AddItem from './addNewItem';
import Cart from './cart';
import Search from './search';

const Tab = createBottomTabNavigator();

const BottomNavigation = ()=> {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
          "tabBarActiveTintColor": "red",
          "tabBarInactiveTintColor": "gray",
          "tabBarStyle": [
            {
              "display": "flex"
            },
            null
          ],
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'Cart'){
            iconName = 'cart-outline'
          } else if (route.name === 'Search'){
            iconName = 'search-outline'
          }
        
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
     
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search}/>
      <Tab.Screen name="Cart" component={Cart} 
      options={{
        tabBarIconStyle:{backgroundColor:'red'}
      }}
      />
      <Tab.Screen name="Profile" component={MyProfile}/>

    </Tab.Navigator>
  );
}

export default BottomNavigation;
