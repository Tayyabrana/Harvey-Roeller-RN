import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import "react-native-gesture-handler"
import Home from './app/screens/Home';
import LoginScreen from './app/screens/LoginScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import Earth from "./app/screens/Earth";


const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    options={{headerShown: false,}}
                    name="Login"
                    component={LoginScreen}/>
                <Stack.Screen
                    options={{headerShown: false,}}
                    name="Signup"
                    component={SignUpScreen}/>
                <Stack.Screen
                    options={{headerShown: false,}}
                    name="Home"
                    component={Home}/>
                <Stack.Screen
                    options={{headerShown: false,}}
                    name="Globe"
                    component={Earth}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
