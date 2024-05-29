import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, 
    TextInput, View, FlatList, TouchableOpacity, 
    Image, SafeAreaView, RefreshControl } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { collection, getFirestore, getDocs, query, where } from "firebase/firestore";

const Search = ({navigation}) => {
  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;
  const [data, setData] = useState([]);
  const [refreshing,setRefreshing] = useState(false)

  const fetchData = async () => {
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

      setData(allAdsData);
    } catch (error) {
      Alert.alert(error.message);
    }
  };


  // Use Effect 
  useEffect(() => {
    fetchData();
  }, []);


  // Refresh indicator 
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:height*0.02

    //   padding: 15,
    },
    searchArea: {
      flexDirection: 'row',
      padding:20
    },
    searchField: {
      height: height * 0.056,
      flex: 1,
      borderWidth: 1,
      borderRadius: 20,
      paddingLeft: 40,
    },
    Searchicon: {
      position: 'absolute',
      top: height * 0.039,
      left: height * 0.036,
    },
    gridItem: {
      flex: 1,
      margin: 10,
    //   borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    borderWidth:0.5
    },
    gridText: {
      fontSize: 16,
      fontWeight:'bold',
      marginTop: 3,
    },
    gridImage: {
      width: '100%',
      height: height*0.12,
    //   borderRadius: 50,
    borderWidth:1,
    resizeMode:'cover'
    },
  });

  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} 
    onPress={() => navigation.navigate('AdDetails', { item })}     >
      <Image source={{ uri: item.image1 }} style={styles.gridImage} />
      <Text>Rs {item.price}</Text>
      <Text style={styles.gridText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchArea}>
          <Ionicons name="search-outline" style={styles.Searchicon} size={20} />
          <TextInput
            style={styles.searchField}
            placeholder="What do you want ....."
          />
        </View>

        <FlatList
          data={data}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['red']}
              tintColor={'red'}
            />
          }
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Search;
