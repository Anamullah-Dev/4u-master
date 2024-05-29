import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, StyleSheet, Dimensions, Alert, Image, ActivityIndicator } from "react-native"
import { GestureHandlerRootView, ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownComponent from "../components/dropDownMenu/DropDownMenu";
import * as ImagePicker from 'expo-image-picker';
import { doc, getFirestore, addDoc, collection } from "firebase/firestore";
import { auth } from "./firebase";



const AddItem = ({navigation}) =>{

    const height = Dimensions.get('screen').height;
    const width = Dimensions.get('screen').width;
    const [cate, setCate] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [limit, setLimit] = useState(false);
    const [condition, setCondition] = useState(null);
    const [loading,setLoading] = useState(false);


    const handleSubmit= async ()=>{
        if (!cate) {
            Alert.alert("Category required");
            return;
          }
          if (!price) {
            Alert.alert("Price can not be empty");
            return;
          }
          if (!location) {
            Alert.alert("Location required");
            return;
          }
          if (!title) {
            Alert.alert("Title required");
            return;
          }
          if (!description) {
            Alert.alert("Description required");
            return;
          }
          if (!condition) {
            Alert.alert("Condition required");
            return;
          }
          if(!image && !image2 && !image3 && !image4 ){
            Alert.alert(
                "No image selected",
                "Are you sure you want to continue? ",
                [
                    {
                        text : "No",
                        onPress: ()=> console.log("NO")
                    },
                    {
                        text:"Yes",
                        onPress: async ()=>{
                            setLoading(true)
                            await uploadAd()
                            setLoading(false)
                        }
                    }
                ]
            )
          } else {
            setLoading(true);
            await uploadAd()
            setLoading(false);
          }
        
        
    }

    const uploadAd = async()=>{
        try {
        // setLoading(true)
            const user = auth.currentUser;
            const userId = user.uid;
            const firestore = getFirestore();
            const userDocRef = doc(firestore,'users',userId)
    
            const adsCollectionRef = collection(userDocRef, 'ads');
           
            await addDoc(adsCollectionRef,{
            title:title,
            category:cate,
            price:price,
            condition:condition,
            location:location,
            description:description,
            image1:image,
            image2:image2,
            image3:image3,
            image4:image4

            })  
            // console.log('End')
            navigation.navigate("BottomNavigation")
        } catch (error) {
            Alert.alert(error.message)
        }
    }


    const handleImage = async () => {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access the image library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [6, 6],
            quality: 1,
        });

        if (!result.canceled) {
            if (image == null) {
                setImage(result.assets[0].uri);
            } else if (image2 == null) {
                setImage2(result.assets[0].uri);
            } else if (image3 == null) {
                setImage3(result.assets[0].uri);
            } else if (image4 == null) {
                setImage4(result.assets[0].uri);
                setLimit(true);

            } else {
                Alert.alert("Maximum of 4 images can be selected");
            }
        
    }
        
    };



    const styles = StyleSheet.create({
        container:{
            flex:1
        },
        safeArea:{
            flex:1,
            paddingLeft:15,
            paddingRight:15
        },
        imageContainer:{
            height:height*0.2,
            // backgroundColor:'lightgrey',
            alignItems:'center', 
            justifyContent:'center',
            marginTop:10,
            borderColor:'black',
            borderWidth:1
        },
        catogries:{
            // flexDirection:'row',
            // width:width 
        },
        cateRow:{
            flexDirection:'row',
        },
        cateField:{
            borderColor:'black',
            borderWidth:1,
            height:height*0.06,
            width:width*0.9,
            paddingLeft:35,
            marginTop:15,
            borderRadius:10
        },
        cateIcon:{
            marginTop:18,
            position:'absolute',
            left: 8,
            top:13
        },
        condition:{
            position:'absolute',
            top:height*0.04,
            width:width*0.93,
            left:-15
            // top: 100
        },
        descField:{
            borderColor:'black',
            borderWidth:1,
            width:width*0.9,
            paddingLeft:20,
            paddingRight:20,
            marginTop:15,
            borderRadius:10
        },

        submitBtn:{
            shadowOpacity: 1,
            backgroundColor:'red', 
            borderRadius:20, 
            padding:15, 
            alignItems:'center',
            justifyContent:'center'
        },
        cancelBtn:{
            shadowOpacity: 1,
            backgroundColor:'lightgrey', 
            borderRadius:20, 
            padding:15, 
            alignItems:'center',
            justifyContent:'center'
        },
        image:{
            flex:1,
        
        },
        imagesSelected:{
            flexDirection:"row",
            // backgroundColor:'red',
            height:height*0.1,
            // alignItems:
        }

    });

    return(
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.safeArea} >
            <ScrollView style={styles.container} >
                {/* Image  */}
                <Text style={{fontWeight:'bold', fontSize:30}} >
                    Add Images
                </Text>
                <TouchableOpacity onPress={handleImage} >
                <View style={styles.imageContainer}>
                   {limit ? <Text>Limit reached</Text>
                   :
                    <Ionicons name="add" size={32} />}
                </View>
                </TouchableOpacity>

                {/* spacing  */}
                <View style={{height:height*0.02}} />
                <View style={styles.imagesSelected} >
                <Image source={{ uri: image }} style={styles.image} resizeMode="center" />
                <Image source={{ uri: image2 }} style={styles.image} resizeMode="center" />
                <Image source={{ uri: image3 }} style={styles.image} resizeMode="center" />
                <Image source={{ uri: image4 }} style={styles.image} resizeMode="center" />

                </View>

                {/* spacing  */}
                <View style={{height:height*0.05}} />

                {/* Title  */}
                <View style={styles.catogries} >
                    <Text style={{fontWeight:'bold',fontSize:30}} >
                        Title 
                    </Text>
                    <View style={styles.cateRow} >
                    <Ionicons name="text-outline" style={styles.cateIcon} size={22} />
                    <TextInput 
                    style={styles.cateField}
                    placeholder="Title"
                    value={title}
                    onChangeText={(value)=>{setTitle(value)}}
                    />
                    </View>
                </View>

                 {/* spacing  */}
                 <View style={{height:height*0.05}} />
                
                {/* Category  */}
                <View style={styles.catogries} >
                    <Text style={{fontWeight:'bold',fontSize:30}} >
                        Brand 
                    </Text>
                    <View style={styles.cateRow} >
                    <Ionicons name="menu" style={styles.cateIcon} size={22} />
                    <TextInput 
                    style={styles.cateField}
                    placeholder="Brand"
                    value={cate}
                    onChangeText={(value)=>{setCate(value)}}
                    />
                    </View>
                </View>

                {/* spacing  */}
                <View style={{height:height*0.05}} />

                {/* Price  */}
                <View style={styles.catogries} >
                    <Text style={{fontWeight:'bold',fontSize:30}} >
                        Price
                    </Text>
                    <View style={styles.cateRow} >
                    <Ionicons name="cash-outline" style={styles.cateIcon} size={22} />
                    <TextInput 
                    style={styles.cateField}
                    placeholder="Price"
                    value={price}
                    onChangeText={(value)=>{setPrice(value)}}
                    keyboardType="numeric"
                    />
                    </View>
                </View>

                {/* spacing  */}
                <View style={{height:height*0.05}} />

                {/* Condition  */}
                <View style={{height:height*0.08}} >
                    <Text style={{fontWeight:'bold',fontSize:30}} >
                        Condition 
                    </Text>
                    <View style={styles.condition}  >
                <DropdownComponent placeholder={'Select'} isSignup={false} label={""} value={condition} setValue={setCondition} />
                    </View>
                </View>

                 {/* spacing  */}
                 <View style={{height:height*0.05}} />

                {/* Location  */}

                <View style={styles.catogries} >
                    <Text style={{fontWeight:'bold',fontSize:30}} >
                        Location
                    </Text>
                    <View style={styles.cateRow} >
                    <Ionicons name="location-outline" style={styles.cateIcon} size={22} />
                    <TextInput 
                    style={styles.cateField}
                    placeholder="Location"
                    value={location}
                    onChangeText={(value)=>{setLocation(value)}}
                    />
                    </View>
                </View>   

                {/* spacing  */}
                <View style={{height:height*0.05}} />

                {/* Description  */}
                <View style={styles.catogries} >
                    <Text style={{fontWeight:'bold',fontSize:30}} >
                       Description
                    </Text>
                    <View style={styles.cateRow} >
                    {/* <Ionicons name="book" style={styles.cateIcon} size={22} /> */}
                    <TextInput 
                    style={styles.descField}
                    placeholder="Description"
                    value={description}
                    onChangeText={(value)=>{setDescription(value)}}
                    multiline= {true}
                    numberOfLines={8}
                    />
                    </View>
                </View>   

               {/* spacing  */}
                <View style={{height:height*0.05}} />

                {/* submit button */}
                <TouchableOpacity onPress={handleSubmit} >
                <View style={styles.submitBtn} >
                {loading? (<ActivityIndicator size={'small'} color={'white'} />)
                :
                ( <Text style={{color:'white', fontSize:17}} >
                        Publish
                    </Text>)
                }
                   
                </View>
                </TouchableOpacity>

                {/* spacing  */}
                <View style={{height:height*0.02}} />

                {/* cancel button 
                <TouchableOpacity onPress={handleCancel} >
                <View style={styles.cancelBtn} >
                    <Text style={{color:'white'}} >
                        Cancel
                    </Text>
                </View>
                </TouchableOpacity> */}


            </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default AddItem;