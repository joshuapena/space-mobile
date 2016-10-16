import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import Button from 'react-native-button';

var firebase = require ('firebase');
var config = {
    apiKey: "AIzaSyAd7nS1dCGQILFxxZ5Jwsla5wy1rnbEI_M",
    authDomain: "space-252ee.firebaseapp.com",
    databaseURL: "https://space-252ee.firebaseio.com",
    storageBucket: "gs://space-252ee.appspot.com",
}
firebase.initializeApp (config);

export default class Login extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

    buttonpress() {
        console.log ('button has been pressed');
        let email = this.state.email;
        let password = this.state.password;
        firebase.auth().createUserWithEmailAndPassword (email, password).catch (function (error) {
            if (error.code) {
                switch (error.code) {
                    case "auth/email-already-in-use": 
                        alert ('email already in use');
                        break;

                    case "auth/invalid-email":
                        alert ('please enter a valid email');
                        break;
                    
                    case "auth/operation-not-allowed":
                        alert ('your account has been disabled');
                        break;

                    case "auth/weak-password":
                        alert ('please enter a stronger password');
                        break;

                    default: alert ('error creating account :/');
                }
            } else {
                alert ('successfully created account');
            }
        });
    }


    render() {
        return (
            <View >
                <Text style = {styles.welcome}>
                    Enter Login Information
                </Text>
                <TextInput
                    placeholder = "email"
                    onChangeText = {(email) => this.setState ({email})}
                    value = {this.state.email}
                />
                <TextInput
                    placeholder = "password"
                    onChangeText = {(password) => this.setState ({password})}
                    value = {this.state.password}
                />
                <Button onPress = {() => {this.buttonpress()}}>
                    sign up
                </Button>
                <View style = {styles.container} >
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 50,
        textAlign: 'center',
        margin: 10,
        marginTop: 100,
    },
});