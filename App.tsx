const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";

import LoginPage from "./screens/LoginPage";
import SignUpPage from "./screens/SignUpPage";
import BottomNavigation from "./screens/BottomNavigation";
import Home from "./screens/Home";
import MyProfile from "./screens/MyProfile";
import OnboardPage from "./screens/onboard_page";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddItem from "./screens/addNewItem";
import Cart from "./screens/cart";
import Search from "./screens/search";
import AdDetails from "./screens/adDetails";
import Authentication from "./screens/authenticate";
import FullScreenImage from "./screens/fullScreenImage"
import Categories from "./screens/categories";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
             <Stack.Screen
              name="Authenticate"
              component={Authentication}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OnBoardPage"
              component={OnboardPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginPage"
              component={LoginPage}
              options={{ headerShown: false }}
            />
         
            <Stack.Screen
              name="SignUpPage"
              component={SignUpPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BottomNavigation"
              component={BottomNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="Search"
              component={Search}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Categories"
              component={Categories}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdDetails"
              component={AdDetails}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="FullScreenImage"
              component={FullScreenImage}
              options={{ headerShown: false }}
            />
            
            <Stack.Screen
              name="MyProfile"
              component={MyProfile}
              options={{ headerShown: false }}
            />

             <Stack.Screen
              name="AddItem"
              component={AddItem}
              options={{ headerShown: false }}
            />

          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};
export default App;
