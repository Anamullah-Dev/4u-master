import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { FontFamily, FontSize, Color, Border } from "../GlobalStyles";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DropdownComponent from "../components/dropDownMenu/DropDownMenu";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "./firebase";
import {
  getFirestore,
  collection,
  doc,
  setDoc
} from "firebase/firestore";

const SignUpPage = ({ navigation }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [repass, setrePass] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [accountType, setAccountType] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    if (!accountType) {
      Alert.alert("Account type required");
      return;
    }
    if (!name) {
      Alert.alert("Name required");
      return;
    }
    if (!pass) {
      Alert.alert("Password required");
      return;
    }
    if (!email) {
      Alert.alert("Email required");
      return;
    }
    if (pass !== repass) {
      Alert.alert("Passwords do not match!");
      return;
    }

    if (!image) {
      Alert.alert(
        "No Image Selected",
        "Do you want to continue without an image?",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              setLoading(true);
              await createUserAccount();
              setLoading(false);
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      setLoading(true);
      await createUserAccount();
      setLoading(false);
    }
  };

  const createUserAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', user.uid);

    // Set the user data in Firestore
    await setDoc(userDocRef, {
      name: name,
      email: email,
      password: pass,
      accountType: accountType,
      image: image
    });

      navigation.navigate("LoginPage");
    } catch (error) {
      Alert.alert(error.message);
      console.log(error.message);
    }
  };

  const handleImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access the image library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.signUpPage}>
          <View >
            {/* Image */}
            <TouchableOpacity style={styles.imgContainer} onPress={handleImage} activeOpacity={0.7}>
              {image ? (
                <Image source={{ uri: image }} contentFit="cover" style={styles.imageStyle} />
              ) : (
                <Ionicons name="person-outline" size={100} style={styles.icon} />
              )}
            </TouchableOpacity>

            {/* Name field */}
            <View style={[styles.textFieldordinaryactivated, styles.textLayout]}>
              <View style={styles.textChildShadowBox} />
              <TextInput
                placeholder="Name"
                style={styles.textInput}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email field */}
            <View style={[styles.textFieldordinaryfocused, styles.textLayout]}>
              <View style={styles.textChildShadowBox} />
              <TextInput
                placeholder="Email"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password field */}
            <View style={[styles.textFieldordinaryinactive, styles.textLayout]}>
              <View style={styles.textChildShadowBox} />
              <TextInput
                placeholder="Password"
                style={styles.textInput}
                value={pass}
                onChangeText={setPass}
                secureTextEntry
              />
            </View>

            {/* Re-enter password */}
            <View style={[styles.reEnter, styles.textLayout]}>
              <View style={styles.textChildShadowBox} />
              <TextInput
                placeholder="Re-Enter Password"
                style={styles.textInput}
                value={repass}
                onChangeText={setrePass}
                secureTextEntry
              />
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity onPress={handlePress} style={styles.buttonprimaryinactivebig}>
            <View style={styles.rectangle} />
            {loading ? (
              <ActivityIndicator size={'large'} color={'white'} style={{left:13,top:5}} /> 
            )
            :
            (<Text style={[styles.signUp, styles.signUpTypo]}>
              SIGN UP
              </Text>)}
          </TouchableOpacity>

          {/* Signup Text */}
          <View style={[styles.navigationBarbigHeadline, styles.navigationPosition]}>
            <Text style={[styles.headline]}>Sign up</Text>
            <View style={[styles.navigationBar, styles.navigationPosition]} />
          </View>

          {/* Drop down menu */}
          <View style={styles.dropdownContainer}>
            <DropdownComponent placeholder={"Account type"} isSignup={true} label={"Account"} value={accountType} setValue={setAccountType} />
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    position: 'absolute',
    left: '50%',
    top: 150,
    height: 130,
    width: 130,
    marginLeft: -65,
    borderRadius: 65,
    borderWidth: 0.1,
    zIndex: 10,
  },
  imageStyle: {
    flex: 1,
    borderRadius: 65,
  },
  icon: {
    color: 'darkgrey',
    left: 13,
    top: 10
  },
  navigationPosition: {
    width: 375,
    left: 0,
    position: "absolute",
    height: 500,
  },
  textLayout: {
    height: 64,
    width: 343,
    left: 16,
    justifyContent: 'center',
  },
  signUpTypo: {
    fontFamily: FontFamily.description,
    fontWeight: "500",
    lineHeight: 20,
    fontSize: FontSize.description_size,
    position: "absolute",
  },
  textInput: {
    marginLeft: 25,
  },
  textChildShadowBox: {
    backgroundColor: Color.white,
    borderRadius: Border.br_9xs,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOpacity: 1,
    elevation: 8,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    left: "5%",
    bottom: "0%",
    right: "0%",
    top: "0%",
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  textFieldordinaryactivated: {
    top: 300,
  },
  textFieldordinaryfocused: {
    top: 317,
    justifyContent: "center",
  },
  textFieldordinaryinactive: {
    top: 337,
  },
  reEnter: {
    top: 357,
  },
  rectangle: {
    shadowColor: "rgba(211, 38, 38, 0.25)",
    borderRadius: Border.br_6xl,
    backgroundColor: Color.primary,
    shadowOpacity: 1,
    elevation: 8,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    bottom: "0%",
    right: "0%",
    top: "0%",
    height: "100%",
    left: "5%",
    position: "absolute",
    width: "100%",
  },
  signUp: {
    top: "29.17%",
    left: "46.11%",
    color: Color.white,
    textAlign: "center",
  },
  buttonprimaryinactivebig: {
    top: 715,
    height: 48,
    width: 343,
    left: 16,
    position: "absolute",
    // alignItems:'center',
    // justifyContent:'center'
  },
  orSignUp: {
    top: 659,
    left: 86,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: FontSize.description_size,
  },
  alreadyHaveAn: {
    top: 787,
    left: 155,
    textAlign: "right",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: FontSize.description_size,
  },
  roundArrowRightAlt24pxIcon: {
    top: 786,
    left: 325,
    width: 24,
    height: 24,
    position: "absolute",
    overflow: "hidden",
  },
  headline: {
    top: 106,
    left: 14,
    fontSize: FontSize.headline_size,
    fontWeight: "700",
    textAlign: "left",
  },
  navigationBar: {
    height: 88,
    top: 0,
    overflow: "hidden",
  },
  navigationBarbigHeadline: {
    height: 140,
    top: 0,
    overflow: "hidden",
  },
  signUpPage: {
    backgroundColor: Color.background,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
  dropdownContainer: {
    top: 380,
    width: 180,
    left: "5%",
    backgroundColor: 'white',
    marginLeft: 18,
  },
});

export default SignUpPage;
