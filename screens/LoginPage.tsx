import * as React from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { CommonActions } from "@react-navigation/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontFamily, FontSize, Color, Border } from "../GlobalStyles";

interface LoginPageProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
    dispatch: (action: any) => void;
  };
}

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
  const [email, setEmail] = React.useState<string>("");
  const [pass, setPass] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleLoginPress = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, pass).then(
        (userCredential) => {
          const user = userCredential.user;
          AsyncStorage.setItem("user", JSON.stringify(user.uid));
          console.log(JSON.stringify(user.uid));
          setLoading(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "BottomNavigation" }],
            })
          );
        }
      );
    } catch (error: any) {
      setLoading(false);
      Alert.alert(error.message);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#1B1B1B" }}>
      {/* Lottie */}
      <View
        style={{
          height: "40%",
          borderStyle: "solid",
          width: "100%",
          overflow: "hidden",
          borderBottomLeftRadius: 70,
          borderBottomRightRadius: 70,
          alignSelf: "center",
          // zIndex:30
        }}
      >
        <LottieView
          source={require("../assets/lottie/login.json")}
          style={{ height: "100%", backgroundColor: "#FE5A1D", width: "100%" }}
          autoPlay
          loop
        />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.loginPage}>
          {/* Email Text field */}
          <View style={[styles.textFieldordinaryactivated, styles.textLayout]}>
            <View style={styles.textChildShadowBox} />
            <Ionicons
              name="mail-open-outline"
              size={25}
              style={{ marginLeft: 35, marginTop: 18 }}
            />
            <TextInput
              style={styles.emailField}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              placeholderTextColor={"black"}
            />

            {/* Password text field */}
          </View>
          <View style={[styles.textFieldordinaryinactive, styles.textLayout]}>
            <View style={styles.textChildShadowBox} />
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={"black"}
              style={{ marginTop: 20, marginLeft: 34 }}
            />
            <TextInput
              style={{ marginLeft: 15, width: "100%" }}
              value={pass}
              onChangeText={(text) => setPass(text)}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor={"black"}
            />
          </View>

          {/* Login Button  */}
          <TouchableOpacity
            style={styles.buttonprimaryinactivebig}
            onPress={handleLoginPress}
          >
            <View style={styles.rectangle} />
            {loading ? (
              <ActivityIndicator
                size={"large"}
                color={"white"}
                style={{ top: 5, left: 20 }}
              />
            ) : (
              <Text style={[styles.login, styles.loginTypo]}>LOGIN</Text>
            )}
          </TouchableOpacity>

          {/* Google Button  */}
          <Image
            style={[styles.buttonsocialinactivegoogleIcon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/buttonsocialinactivegoogle.png")}
          />

          {/* Forget Password */}
          <Text style={[styles.forgotYourPassword, styles.headlineClr]}>
            Forgot your password?
          </Text>

          {/* Facebook Button  */}
          <Image
            style={[styles.buttonsocialinactivefacebooIcon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/buttonsocialinactivefacebook.png")}
          />
          <Image
            style={styles.roundArrowRightAlt24pxIcon}
            contentFit="cover"
            source={require("../assets/roundarrow-right-alt24px.png")}
          />
          <View
            style={[
              styles.navigationBarbigHeadline,
              styles.navigationPosition,
            ]}
          >
            {/* Login Text */}
            <Text style={[styles.headline, styles.headlineClr]}>Login</Text>

            <View style={[styles.navigationBar, styles.navigationPosition]}>
              <View
                style={[
                  styles.statusBarOnLight,
                  styles.leftActionIconPosition,
                ]}
              ></View>

              {/* For back button */}

              {/* <Image
            style={[styles.leftActionIcon, styles.leftActionIconPosition]}
            contentFit="cover"
            source={require("../assets/left-action.png")}
          /> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  navigationPosition: {
    width: 375,
    left: 0,
    position: "absolute",
  },
  textLayout: {
    height: 64,
    width: 343,
    left: 16,
    position: "absolute",
  },
  loginTypo: {
    fontFamily: FontFamily.description,
    fontWeight: "500",
    lineHeight: 20,
    fontSize: FontSize.description_size,
    position: "absolute",
  },
  emailField: {
    marginLeft: 10,
    width: "100%",
  },
  iconLayout1: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  iconLayout: {
    width: 92,
    top: 501,
    height: 64,
    position: "absolute",
  },
  headlineClr: {
    color: "white",
    fontFamily: FontFamily.description,
    position: "absolute",
    textAlign: "center",
    alignSelf: "center",
  },
  leftActionIconPosition: {
    height: 44,
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  homeIndicatorOnLight: {
    top: 778,
    height: 34,
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
  muffinsweetgmailcom: {
    top: "45.31%",
    color: Color.colorDarkslategray,
    textAlign: "left",
    left: "5.83%",
    fontFamily: FontFamily.description,
  },
  email: {
    top: "21.88%",
    fontSize: FontSize.font_size,
  },
  outlineCheck24pxIcon: {
    height: "37.5%",
    width: "7%",
    top: "31.25%",
    right: "6.12%",
    bottom: "31.25%",
    left: "86.88%",
  },
  textFieldordinaryactivated: {
    top: 131,
    flexDirection: "row",
  },
  textFieldordinaryinactive: {
    top: 205,
    flexDirection: "row",
  },
  rectangle: {
    shadowColor: "rgba(211, 38, 38, 0.25)",
    borderRadius: Border.br_6xl,
    backgroundColor: "#FE5A1D",
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
  login: {
    top: "29.17%",
    left: "50%",
    color: Color.white,
    textAlign: "center",
  },
  buttonprimaryinactivebig: {
    top: 417,
    height: 48,
    width: 343,
    left: 16,
    position: "absolute",
  },
  buttonsocialinactivegoogleIcon: {
    left: 88,
  },
  orLoginWith: {
    top: 659,
    left: 95,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: FontSize.description_size,
  },
  forgotYourPassword: {
    top: 365,
    left: 200,
    textAlign: "right",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: FontSize.description_size,
  },
  buttonsocialinactivefacebooIcon: {
    left: 196,
  },
  roundArrowRightAlt24pxIcon: {
    top: 363,
    left: 350,
    width: 24,
    height: 24,
    position: "absolute",
    overflow: "hidden",
  },
  headline: {
    top: 25,
    left: 14,
    fontWeight: "700",
    textAlign: "left",
    fontSize: 50,
  },
  statusBarOnLight: {
    top: 0,
  },
  leftActionIcon: {
    top: 44,
    maxWidth: "100%",
    height: 44,
    overflow: "hidden",
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
  loginPage: {
    backgroundColor: "#1B1B1B",
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
});

export default LoginPage;
