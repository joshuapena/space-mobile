import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import Button from 'react-native-button';


var firebase = require ('firebase');
/*var config = {
    apiKey: "AIzaSyAd7nS1dCGQILFxxZ5Jwsla5wy1rnbEI_M",
    authDomain: "space-252ee.firebaseapp.com",
    databaseURL: "https://space-252ee.firebaseio.com",
    storageBucket: "gs://space-252ee.appspot.com",
}
firebase.initializeApp (config);*/

//var db = firebase.database();
//var users = db.ref("users");
export default class Signup extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }


    buttonpress() {
        console.log ('button has been pressed');
        let email = this.state.email;
        let password = this.state.password;
        var user = firebase.auth().createUserWithEmailAndPassword (email, password).catch (function (error) {
            alert('button has error');
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

                default: 
                    alert ('error creating account :/');
                    alert(error)
            }   
        }).then(function(resp) {
            alert ('account successfully created');
            var curr = firebase.auth().currentUser;
            alert("user email"+curr.email);
        });
    }

   /* userInfoToDb() {
        var currentUser = firebase.auth().currentUser;
       // var uidRef = db.child("users").set(currentUser.uid);
    } */
    postUserData(myJson) {
        return fetch('https://space-ucsc.herokuapp.com/createUser', myJson)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("id1: ", responseJson.testid1);
          console.log("id2: ", responseJson.testid2);
          console.log("code: ", responseJson.code)
          return responseJson.code;
        })
        .catch((error) => {
        console.error(error);
        });
 }

    logUserInfoOnPress() {
        var currentUser = firebase.auth().currentUser;
        if (currentUser) {
            console.log ('user email is ' + currentUser.email);
            console.log ('user name is ' + currentUser.displayName);
        } else {
            console.log ("user is null");
        }
    }

    logOutUser() {
        var currentUserName = firebase.auth().currentUser;
        firebase.auth().signOut().then(function() {
            alert (currentUserName + ' logged out');
            currentUserName = null;
        }, function (error) {
            alert ('error logging out');
        });
    }

    render() {
        return (
            <View >
                <Text style = {styles.welcome}>
                    Enter Signup Information
                </Text>
                <TextInput
                    placeholder = "email"
                    onChangeText = {(email) => this.setState ({email})}
                    value = {this.state.email}
                />
                <TextInput
                    secureTextEntry = {true}
                    placeholder = "password"
                    onChangeText = {(password) => this.setState ({password})}
                    value = {this.state.password}
                />
                <Button onPress = {() => {this.buttonpress()}}>
                    sign up
                </Button>
                <Button onPress = {() => this.logUserInfoOnPress()}>
                    Log user information
                </Button>
                <Button onPress = {() => this.logOutUser()}>
                    Log out Button
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