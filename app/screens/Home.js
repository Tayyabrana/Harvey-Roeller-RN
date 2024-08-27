import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import { useFonts } from 'expo-font';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {

    const [user, setUser] = useState({})

    let [fontsLoaded] = useFonts({
        PoppinsLight: require('../../assets/fonts/poppins_light.ttf'),
        PoppinsBlack: require('../../assets/fonts/poppins_black.ttf'),
        PoppinsMedium: require('../../assets/fonts/poppins_medium.ttf'),
        PoppinsBold: require('../../assets/fonts/poppins_bold.ttf'),
        PoppinsExtraBold: require('../../assets/fonts/poppins_extra_bold.ttf')
    });

    if (!fontsLoaded) {
        return null;
    }

    useEffect( () => {
        const getData = async () => {
            let u = await AsyncStorage.getItem("USER")
            setUser(JSON.parse(u))
        }
        getData()
    }, []);

    return (
        <View style={styles.main}>
            <ImageBackground source={require('../../assets/globe_splash.png')} style={{width: '100%', height: '100%', alignItems: 'center'}}>
                <Text style={{ color: 'white', marginTop: height*0.10, fontWeight: 600, fontSize: 20, fontFamily: 'PoppinsBlack' }}>Welcome Back {user?.name}!</Text>
                <TouchableOpacity style={{ backgroundColor: 'white', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, marginTop: height*0.5 }} onPress={()=> navigation.navigate("Globe")}>
                    <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16, color: 'black' }}>Show Globe</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

export default Home;

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
    },
});
