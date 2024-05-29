import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import { Image, Text, StyleSheet, Dimensions, View, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "./firebase";
import { collection, getFirestore, getDocs, query, where, doc, getDoc } from "firebase/firestore";

const Home = ({ navigation }) => {
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  const [refreshing, setRefreshing] = useState(false);
  const [seller, setSeller] = useState(false);
  const [row1Data, setRow1Data] = useState([]);
  const [row2Data, setRow2Data] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  const checkSeller = async () => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const firestore = getFirestore();
      const userDocRef = doc(collection(firestore, 'users'), uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const accountType = userData.accountType;
        if (accountType === 'Seller') {
          setSeller(true);
        } else {
          setSeller(false);
        }
      } else {
        console.log('User does not exist');
      }
    } else {
      console.log('User not logged in');
    }
  };

  const fetchAdsData = async () => {
    try {
      const firestore = getFirestore();
      const usersCollRef = collection(firestore, 'users');
      
      const sellersQuery = query(usersCollRef, where('accountType', '==', 'Seller'));
      const sellersSnapshot = await getDocs(sellersQuery);

      let allAdsData = [];

      for (const sellerDoc of sellersSnapshot.docs) {
        const adsCollRef = collection(sellerDoc.ref, 'ads');
        const adsSnapshot = await getDocs(adsCollRef);

        const adsData = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAdsData = [...allAdsData, ...adsData];
      }

      const womenAds = allAdsData.filter(ad => ad.category === 'Women');
      const menAds = allAdsData.filter(ad => ad.category === 'Men');
      const categories = [...new Set(allAdsData.map(ad => ad.category))].map(category => ({
        key: category,
        text: category,
        imageUrl: { uri: allAdsData.find(ad => ad.category === category).image1 }
      }));

      setRow1Data(womenAds);
      setRow2Data(menAds);
      setCategoriesData(categories);

    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    checkSeller();
    fetchAdsData();
  }, []);

  const handleFAB = () => {
    navigation.navigate('AddItem');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAdsData().then(() => {
      setRefreshing(false);
    }).catch(() => {
      setRefreshing(false); 
    });
  }, []);

  const Row1Render = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AdDetails', { item })}>
      <View style={styles.rowItem1}>
        <Image style={styles.imageRow1} source={{ uri: item.image1}} resizeMode="center" />
        <Text style={styles.textR1}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const Row2Render = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AdDetails', { item })}>
      <View style={styles.rowItem2}>
        <Image style={styles.imageRow2} source={{ uri: item.image1 }} resizeMode="center" />
        <Text style={styles.textR2}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  const CategoriesRender = ({ item }) => (
    <TouchableOpacity onPress={() => {
      console.log({item});
      navigation.navigate('Categories', { categoryName: item.text });
    }}>
      <View style={{ marginRight: 10, width: width * 0.3, height: height * 0.35 }}>
        <Image style={styles.cateImage} source={item.imageUrl} resizeMode="cover" />
        <Text style={styles.categoriesItemText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0000ff']}
              tintColor={'#0000ff'}
            />
          }
        >
          <SafeAreaView>
            {/* First Image */}
            <Image style={styles.firstBanner} source={require("../assets/small-banner.png")} />
            <Text style={styles.firstBannerText}>Street Clothes</Text>

            {/* Row 1 */}
            <View style={styles.row1}>
              <Text style={styles.womenText}>
                Women's Collection
              </Text>
              {/* Replaced FlatList with Scroll view and used Mapping to go through items */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {row1Data.map(item => (
                  <Row1Render key={item.id} item={item} />
                ))}
              </ScrollView>
            </View>

            {/* Row 2 */}
            <View style={styles.row2}>
              <Text style={styles.menText}>
                Men's Collection
              </Text>
              {/* Replaced flatList with scroll view */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {row2Data.map(item => (
                  <Row2Render key={item.id} item={item} />
                ))}
              </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.category}>
              <Text style={styles.categoriesText}>
                Categories
              </Text>
              {/* Replace Flatlist with scroll view */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoriesData.map(item => (
                  <CategoriesRender key={item.key} item={item} />
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </ScrollView>
        {seller && (
          <TouchableOpacity style={styles.fab} onPress={handleFAB}>
            <Ionicons name="add" style={styles.fabIcon} />
          </TouchableOpacity>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  firstBanner: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.30,
  },
  firstBannerText: {
    top: Dimensions.get("screen").height * 0.18,
    position: "absolute",
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  row1: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.4,
  },
  rowItem1: {
    width: Dimensions.get("screen").width * 0.3,
    marginHorizontal: 20,
    height: Dimensions.get("screen").height * 0.7,
  },
  textR1: {
    fontSize: 16,
    textAlign: "center",
    top: Dimensions.get("screen").height * 0.34,
    fontWeight: 'bold',
  },
  imageRow1: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.09,
    height: Dimensions.get("screen").height * 0.23,
    width: Dimensions.get("screen").width * 0.4,
    overflow: 'hidden',
  },
  womenText: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.04,
    fontWeight: 'bold',
    fontSize: 30,
    left: 15,
  },
  menText: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.001,
    fontWeight: 'bold',
    fontSize: 30,
    left: 15,
  },
  imageRow2: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.06,
    height: Dimensions.get("screen").height * 0.23,
    width: Dimensions.get("screen").width * 0.4,
    overflow: 'hidden',
  },
  textR2: {
    fontSize: 16,
    textAlign: "center",
    top: Dimensions.get("screen").height * 0.27,
    fontWeight: 'bold',
  },
  row2: {
    width: Dimensions.get("screen").width,
  },
  rowItem2: {
    width: Dimensions.get("screen").width * 0.3,
    marginHorizontal: 20,
    height: Dimensions.get("screen").height * 0.32,
  },
  cateImage: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.12,
    height: 100,
    width: 100,
    overflow: 'hidden',
    borderRadius: 50,
  },
  category: {
    width: Dimensions.get("screen").width,
  },
  categoriesText: {
    top: Dimensions.get("screen").height * 0.045,
    fontWeight: 'bold',
    fontSize: 30,
    marginLeft: 15,
    position: "absolute",
  },
  categoriesItemText: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.24,
    padding: 20,
    fontWeight: 'bold',
    paddingLeft: 40,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: 'red',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  },
});

export default Home;
