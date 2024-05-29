import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';

interface AdItem {
  id: string;
  text: string;
  image1: string;
  category: string;
}

interface CategoriesProps {
  route: {
    params: {
      categoryName: string;
    };
  };
}

const Categories: React.FC<CategoriesProps> = ({ route,navigation }) => {
  const { categoryName } = route.params;
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const navigation = useNavigation();

  const fetchAdsByCategory = async () => {
    try {
      setLoading(true);
      const firestore = getFirestore();
      const usersCollRef = collection(firestore, 'users');
      const sellersQuery = query(usersCollRef, where('accountType', '==', 'Seller'));
      const sellersSnapshot = await getDocs(sellersQuery);

      let categoryAds: AdItem[] = [];

      for (const sellerDoc of sellersSnapshot.docs) {
        const adsCollRef = collection(sellerDoc.ref, 'ads');
        const adsSnapshot = await getDocs(adsCollRef);
        const adsData = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdItem));
        const filteredAds = adsData.filter(ad => ad.category === categoryName);
        categoryAds = [...categoryAds, ...filteredAds];
      }

      setAds(categoryAds);
      setLoading(false);
    } catch (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdsByCategory();
  }, [categoryName]);

  const renderAdItem = ({ item }: { item: AdItem }) => (
<TouchableOpacity onPress={() => navigation.navigate('AdDetails', { item: item })}>
      <View style={styles.adItem}>
        <Image source={{ uri: item.image1 }} style={styles.adImage} />
        <Text style={styles.adText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={ads}
          renderItem={renderAdItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  adItem: {
    marginBottom: 20,
  },
  adImage: {
    width: '100%',
    height: 200,
  },
  adText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default Categories;
