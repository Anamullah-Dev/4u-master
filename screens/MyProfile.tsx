import * as React from "react";
import { Text, StyleSheet, View, Alert } from "react-native";
import { Image } from "expo-image";
import { FontFamily, FontSize, Color, Border } from "../GlobalStyles";
import { Query, doc, collection, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "./firebase";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/routers";

const MyProfile = ({navigation}) => {

  const [image,setImage] = React.useState(null);
  const [name,setName] = React.useState('Loading....');
  const [email,setEmail] = React.useState('Loading....');


  const getImage = async () => {
    try {
      // Get the current user
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        // console.log(userId)
        // console.log(userId)
        // Get a reference to the Firestore database
        const firestore = getFirestore();
  
        // Get a reference to the user's document
        const userDocRef = doc(collection(firestore, 'users'), userId);
  
        // Fetch the user's document
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          // Get the user data
          const userData = userDoc.data();
          
          // Set the image URL in the state
          setImage(userData.image);
          setName(userData.name);
          setEmail(userData.email);
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  React.useEffect(()=>{
   getImage()
  },[])

  const handleLogout = ()=>{
    Alert.alert('Logout', "Sure want to logout?",
        [
          {
            text:'No',
          
          },
          {
            text:"Yes",
            onPress:()=>{
              logout()
            }
          }
        ]
    )
    
  }

  const logout = ()=>{
    navigation.dispatch(
      CommonActions.reset({
        index:0,
        routes: [{name:'OnBoardPage'}]
      })
    )
  }
  return (
    <GestureHandlerRootView style={{flex:1}} >
    <View style={styles.myProfile}>
      <View style={[styles.navigationBarbigHeadline, styles.barPosition]}>
        <Text style={[styles.headline, styles.labelTypo2]}>Your profile</Text>
       
      </View>
      
      <View style={[styles.tabBar, styles.barPosition]}>
       
      </View>
      <Image
        style={[styles.avaIcon, styles.avaIconPosition]}
        contentFit="cover"
        source={{uri:image}}
      />
      <Text style={[styles.matildaBrown, styles.avaIconPosition]}>
        {name}
      </Text>
      <Image
        style={[styles.baselineLocalShipping24pxIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("../assets/baselinelocal-shipping24px.png")}
      />
      <Text style={[styles.matildabrownmailcom, styles.labelTypo]}>
        {email}
      </Text>
      <View style={[styles.parent, styles.groupParentLayout]}>
        <View style={styles.view}>
          <Text style={[styles.shippingAddresses, styles.labelTypo2]}>
            Shipping addresses
          </Text>
          <Text style={[styles.ddresses, styles.haveTypo]}>3 ddresses</Text>
        </View>
        <View style={[styles.divider, styles.barPosition]} />
        <Image
          style={[styles.chevronRightIcon, styles.reviewsFor4Position]}
          contentFit="cover"
          source={require("../assets/chevron-right.png")}
        />
      </View>
      <View style={[styles.group, styles.groupParentLayout]}>
        <View style={[styles.view1, styles.viewPosition]}>
          <Text style={[styles.shippingAddresses, styles.labelTypo2]}>
            Promocodes
          </Text>
         
        </View>
        <View style={[styles.divider, styles.barPosition]} />
        <Image
          style={[styles.chevronRightIcon, styles.reviewsFor4Position]}
          contentFit="cover"
          source={require("../assets/chevron-right.png")}
        />
      </View>
      <TouchableOpacity onPress={handleLogout}>
      <View style={[styles.container, styles.groupParentLayout]}>
        <View style={[styles.view2, styles.viewPosition]}>
          <Text style={[styles.shippingAddresses, styles.labelTypo2]}>
            Logout
          </Text>
        </View>
        <Image
          style={[styles.chevronRightIcon, styles.reviewsFor4Position]}
          contentFit="cover"
          source={require("../assets/chevron-right.png")}
        />
      </View>
      </TouchableOpacity>
      <View style={[styles.lineView, styles.groupParentLayout]}>
        <View style={[styles.view3, styles.viewPosition]}>
          <Text style={[styles.shippingAddresses, styles.labelTypo2]}>
            My reviews
          </Text>
          <Text style={[styles.reviewsFor4, styles.reviewsFor4Position]}>
            Reviews for 4 items
          </Text>
        </View>
        <View style={[styles.divider, styles.barPosition]} />
        <Image
          style={[styles.chevronRightIcon, styles.reviewsFor4Position]}
          contentFit="cover"
          source={require("../assets/chevron-right.png")}
        />
      </View>
      <View style={[styles.dividerParent, styles.groupParentLayout]}>
        <View style={[styles.divider, styles.barPosition]} />
        <View style={[styles.view4, styles.viewPosition]}>
          <Text style={[styles.shippingAddresses, styles.labelTypo2]}>
            Payment methods
          </Text>
          <Text style={[styles.youHaveSpecial, styles.reviewsFor4Position]}>
            Visa **34
          </Text>
        </View>
        <Image
          style={[styles.chevronRightIcon, styles.reviewsFor4Position]}
          contentFit="cover"
          source={require("../assets/chevron-right.png")}
        />
      </View>
      <View style={[styles.dividerGroup, styles.groupParentLayout]}>
        <View style={[styles.divider, styles.barPosition]} />
        <View style={styles.view5}>
          <Text style={[styles.shippingAddresses, styles.labelTypo2]}>
            My orders
          </Text>
          <Text style={[styles.alreadyHave12, styles.haveTypo]}>
            Already have 12 orders
          </Text>
        </View>
        <Image
          style={[styles.chevronRightIcon, styles.reviewsFor4Position]}
          contentFit="cover"
          source={require("../assets/chevron-right.png")}
        />
      </View>
    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  barPosition: {
    width: 375,
    left: 0,
    position: "absolute",
  },
  labelTypo2: {
    textAlign: "left",
    fontFamily: FontFamily.description,
  },
  batteryIconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  textPosition: {
    left: "0%",
    position: "absolute",
    width: "100%",
  },
  iconLayout: {
    height: 24,
    width: 24,
  },
  tabbarPosition: {
    top: "0%",
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  tabsLayout: {
    height: 42,
    position: "absolute",
  },
  profilePosition: {
    height: 30,
    width: 30,
    left: 0,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  labelTypo1: {
    fontSize: FontSize.size_3xs,
    top: 32,
  },
  labelTypo: {
    color: Color.gray,
    textAlign: "left",
    fontFamily: FontFamily.description,
    position: "absolute",
  },
  heartPosition: {
    left: 7,
    height: 30,
    width: 30,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  tab3BagLayout: {
    width: 30,
    height: 42,
    top: 0,
    position: "absolute",
  },
  avaIconPosition: {
    top: 164,
    position: "absolute",
    borderRadius:100
  },
  groupParentLayout: {
    height: 72,
    width: 375,
    left: 0,
    position: "absolute",
    overflow: "hidden",
  },
  haveTypo: {
    fontSize: FontSize.font_size,
    color: Color.gray,
    textAlign: "left",
    fontFamily: FontFamily.description,
  },
  reviewsFor4Position: {
    top: 24,
    position: "absolute",
  },
  viewPosition: {
    height: 35,
    top: 19,
    left: 15,
    position: "absolute",
  },
  headline: {
    top: 106,
    left: 14,
    fontSize: FontSize.headline_size,
    fontWeight: "700",
    color: Color.black,
    textAlign: "left",
    fontFamily: FontFamily.description,
    position: "absolute",
    
  },
  batteryIcon: {
    height: "25.68%",
    width: "6.48%",
    top: "39.32%",
    right: "3.92%",
    bottom: "35%",
    left: "89.6%",
    position: "absolute",
  },
  wifiIcon: {
    width: 15,
    height: 11,
  },
  mobileSignalIcon: {
    width: 17,
    height: 11,
  },
  text: {
    height: "85.71%",
    top: "9.52%",
    fontSize: FontSize.size_mini,
    letterSpacing: -0.3,
    fontFamily: FontFamily.sFProText,
    color: Color.colorBlack,
    textAlign: "center",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    fontWeight: "600",
  },
  timeStyle: {
    height: "47.73%",
    width: "14.4%",
    top: "27.27%",
    right: "80%",
    bottom: "25%",
    left: "5.6%",
    position: "absolute",
  },
  statusBarOnLight: {
    height: 44,
    left: "0%",
    right: "0%",
    top: 0,
    position: "absolute",
    width: "100%",
  },
  leftActionIcon: {
    top: 44,
    maxWidth: "100%",
    height: 44,
    left: "0%",
    right: "0%",
    position: "absolute",
    overflow: "hidden",
    width: "100%",
  },
  navigationBar: {
    height: 88,
    top: 0,
    overflow: "hidden",
  },
  navigationBarbigHeadline: {
    height: 160,
    top: 0,
    overflow: "hidden",
  },
  baselineSearch24pxIcon: {
    top: 52,
    left: 340,
    position: "absolute",
    overflow: "hidden",
  },
  tabbar: {
    height: "100%",
    borderTopLeftRadius: Border.br_xs,
    borderTopRightRadius: Border.br_xs,
    backgroundColor: Color.white,
    bottom: "0%",
  },
  profileIconinactive: {
    display: "none",
  },
  label: {
    color: Color.primary,
    fontWeight: "600",
    textAlign: "left",
    fontFamily: FontFamily.description,
    fontSize: FontSize.size_3xs,
    top: 32,
    left: 0,
    position: "absolute",
  },
  tab5MyProfile: {
    left: 291,
    width: 32,
    top: 0,
  },
  label1: {
    fontSize: FontSize.size_3xs,
    top: 32,
    left: 0,
  },
  heartIconactivated: {
    display: "none",
  },
  tab4Favorite: {
    left: 213,
    width: 45,
    top: 0,
  },
  label2: {
    left: 5,
    fontSize: FontSize.size_3xs,
    top: 32,
  },
  shoppingBagIconinactive: {
    height: "71.43%",
    bottom: "28.57%",
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  tab3Bag: {
    left: 147,
  },
  label3: {
    left: 2,
    fontSize: FontSize.size_3xs,
    top: 32,
  },
  tab2Shop: {
    left: 75,
  },
  label4: {
    left: 1,
    fontSize: FontSize.size_3xs,
    top: 32,
  },
  tab1Main: {
    left: 0,
  },
  tabs: {
    top: 8,
    left: 26,
    width: 323,
  },
  homeIndicatorOnLight: {
    top: 49,
    height: 34,
  },
  tabBar1: {
    height: "75.45%",
    top: "24.55%",
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
    bottom: "0%",
    right: "0%",
    left: "0%",
  },
  tabBar: {
    top: 702,
    height: 110,
    overflow: "hidden",
  },
  avaIcon: {
    left: 17,
    width: 64,
    height: 64,
  },
  matildaBrown: {
    left: 99,
    fontSize: FontSize.headline3_size,
    lineHeight: 22,
    fontWeight: "600",
    textAlign: "left",
    fontFamily: FontFamily.description,
    color: Color.black,
  },
  baselineLocalShipping24pxIcon: {
    top: 398,
    left: 236,
    position: "absolute",
    overflow: "hidden",
  },
  matildabrownmailcom: {
    top: 186,
    left: 100,
    fontSize: FontSize.description_size,
    lineHeight: 20,
    fontWeight: "500",
  },
  shippingAddresses: {
    fontSize: FontSize.pxRegular_size,
    fontWeight: "600",
    color: Color.black,
    textAlign: "left",
    fontFamily: FontFamily.description,
    left: 0,
    top: 0,
    position: "absolute",
  },
  ddresses: {
    top: 25,
    fontSize: FontSize.font_size,
    position: "absolute",
    left: 0,
  },
  view: {
    left: 16,
    width: 153,
    height: 36,
    top: 18,
    position: "absolute",
  },
  divider: {
    top: 71,
    backgroundColor: Color.gray,
    height: 1,
    opacity: 0.05,
  },
  chevronRightIcon: {
    left: 343,
    height: 24,
    width: 24,
  },
  parent: {
    top: 328,
  },
  youHaveSpecial: {
    fontSize: FontSize.font_size,
    color: Color.gray,
    textAlign: "left",
    fontFamily: FontFamily.description,
    left: 0,
  },
  view1: {
    width: 158,
  },
  group: {
    top: 472,
  },
  view2: {
    width: 124,
  },
  container: {
    top: 616,
  },
  reviewsFor4: {
    fontSize: FontSize.font_size,
    color: Color.gray,
    textAlign: "left",
    fontFamily: FontFamily.description,
    left: 1,
  },
  view3: {
    width: 105,
  },
  lineView: {
    top: 544,
  },
  view4: {
    width: 143,
  },
  dividerParent: {
    top: 400,
  },
  alreadyHave12: {
    top: 25,
    fontSize: FontSize.font_size,
    position: "absolute",
    left: 1,
  },
  view5: {
    width: 122,
    left: 15,
    height: 36,
    top: 18,
    position: "absolute",
  },
  dividerGroup: {
    top: 256,
  },
  myProfile: {
    backgroundColor: Color.background,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
});

export default MyProfile;
