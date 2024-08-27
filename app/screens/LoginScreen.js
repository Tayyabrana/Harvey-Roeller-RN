import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFonts} from 'expo-font';
import authentication from "../api/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from 'expo-local-authentication';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Unexpected error occurred!");
    const [biometricAvailable, setBiometricAvailable] = useState(false);

    useEffect(() => {
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isBiometricSupported = await LocalAuthentication.isEnrolledAsync();
        if (hasHardware && isBiometricSupported) {
            const isLogged = await AsyncStorage.getItem("LOGGED");
            if (isLogged === "YES") {
                setBiometricAvailable(hasHardware && isBiometricSupported);
                handleBiometricAuth();
            }
        }
    };

    const handleBiometricAuth = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate',
                fallbackLabel: 'Enter Password'
            });
            if (result.success) {
                navigation.replace('Home');
            } else {
                // setError(true);
                // setErrorMessage("Authentication failed");
            }
        } catch (error) {
            console.log("Biometric auth error: ", error);
        }
    };

    const Login = async () => {
        setError(false);
        if (email.length >= 1) {
            if (password.length >= 1) {
                try {
                    await authentication.login({email, password}).then(async res => {
                        await AsyncStorage.setItem("LOGGED", "YES");
                        await AsyncStorage.setItem("USER", JSON.stringify(res.user));
                        navigation.replace('Home');
                    });
                } catch (e) {
                    setError(true);
                    setErrorMessage("Email or Password is Incorrect!");
                }
            } else {
                setError(true);
                setErrorMessage("Please Enter the Password");
            }
        } else {
            setError(true);
            setErrorMessage("Please Enter the Email");
        }
    };

    const handleEmailChange = (v) => {
        setEmail(v);
        setError(false);
    };

    const handlePasswordChange = (v) => {
        setPassword(v);
        setError(false);
    };

    let [fontLoad] = useFonts({
        PoppinsThin: require('../../assets/fonts/poppins_thin.ttf'),
        PoppinsLight: require('../../assets/fonts/poppins_light.ttf'),
        PoppinsBlack: require('../../assets/fonts/poppins_black.ttf'),
        PoppinsMedium: require('../../assets/fonts/poppins_medium.ttf'),
        PoppinsBold: require('../../assets/fonts/poppins_bold.ttf'),
        PoppinsExtraBold: require('../../assets/fonts/poppins_extra_bold.ttf')
    });

    if (!fontLoad) {
        return null;
    }

    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <StatusBar backgroundColor={"#13A3E1"}/>
            <View style={styles.textView}>
                <Text style={styles.text1}>Welcome Back!</Text>
                <Image style={styles.image} source={require('../../assets/login_icon.png')}/>
            </View>
            <View style={{...styles.error, opacity: error ? 100 : 0}}>
                <Text style={styles.text3}>{errorMessage}</Text>
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.input} placeholder='Enter Email Address' onChangeText={v => handleEmailChange(v)}/>
            </View>
            <View style={styles.inputView}>
                <TextInput secureTextEntry={true} style={styles.input} placeholder='Enter Your Password' onChangeText={v => handlePasswordChange(v)}/>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => Login()}>
                <Text style={styles.text3}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{...styles.biometricButton, opacity: biometricAvailable ? 100 : 0}} onPress={() => handleBiometricAuth()}>
                <Text style={styles.text3}>Log In with Biometrics</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.text4}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.text5}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default LoginScreen;

const {height, width} = Dimensions.get('screen')

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#F0A51E",
        height: "100%",
        width: "100%",
        paddingHorizontal: 30,
        paddingVertical: 30
    },
    button: {
        backgroundColor: "#13A3E1",
        width: "25%",
        alignItems: "center",
        alignSelf: 'flex-end',
        borderRadius: 25,
        paddingVertical: 12,
    },
    error: {
        backgroundColor: "#9d0000",
        width: "100%",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15
    },
    btnText: {
        color: "white",
        fontFamily: 'PoppinsMedium',
    },
    textView: {
        width: "100%",
        marginTop: height * 0.05,
    },
    text1: {
        fontFamily: 'PoppinsBold',
        color: "black",
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center"
    },
    text2: {
        width: '40%',
        fontFamily: 'PoppinsThin',
        color: "black",
        fontSize: 15,
        textAlign: "center",
        alignSelf: "center"
    },
    image: {
        height: height * 0.2,
        alignSelf: "center",
        resizeMode: 'contain',
        marginTop: height * 0.02,
        marginBottom: height * 0.05
    },
    inputView: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginBottom: height * 0.02,
        elevation: 5
    },
    input: {
        width: '100%',
        height: height * 0.04
    },
    forgotText: {
        alignSelf: "flex-end",
    },
    loginButton: {
        backgroundColor: "#13A3E1",
        width: "100%",
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: 14,
        marginTop: height * 0.03,
        marginBottom: height * 0.02,
    },
    biometricButton: {
        backgroundColor: "#000",
        width: "100%",
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: 14,
        marginTop: height * 0.01,
        marginBottom: height * 0.03,
    },
    text3: {
        color: "white",
        fontFamily: 'PoppinsExtraBold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: height * 0.01,
        marginBottom: height * 0.04,
    },
    text4: {
        color: 'white',
        fontFamily: 'PoppinsBold',
        fontSize: 15,
    },
    text5: {
        color: 'black',
        fontFamily: 'PoppinsBold',
        fontSize: 15,
    }
})
