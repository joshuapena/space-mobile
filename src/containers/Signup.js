/*
Signup page creates a new account on firebase
Can navigate to MyListView
Can navigate to login
TODO
Some of the error messages crash the app
*/


import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image, Alert} from 'react-native';
import Button from 'react-native-button';
import theme from'./Themes';

const dismissKeyboard = require('dismissKeyboard')
var firebase = require ('firebase');


export default class Signup extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

// this navigate to the MyListView when called.
    _navigateList(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }

// this allows the app to navigate back to the previous page when called
  _navigateBack(){
    this.props.navigator.pop()
  }

// this function allows the user to sign up for the app and stores in firebase
    signUpOnPress(switchPage, destination) {
        dismissKeyboard();
        let email = this.state.email;
        let password = this.state.password;
        let passwordConfirm = this.state.passwordConfirm;
        let username = this.state.username;

    // makes sure there is an email, password, confirmed password, and username
        if(!email || !password || !passwordConfirm || !username) {
          Alert.alert (
            'Error Signing Up',
            'please fill out all fields'
          );
          return;
        }

    // this makes sure the password is the same 
        if(password !== passwordConfirm){
          Alert.alert (
            'Error Signing Up',
            'passwords do not match'
          );
          return;
        }
    //this creates a new account with the email and password
        var user = firebase.auth().createUserWithEmailAndPassword (email, password).catch (function (error) {
            switch (error.code) {

        // this produces an error if the email is already resigstered in firebase
                case "auth/email-already-in-use":
                    Alert.alert (
                      'Error Signing Up',
                      'email already in use'
                    );
                    break;

        // this produces an error if the email isnt valid in firebase
                case "auth/invalid-email":
                    Alert.alert (
                      'Error Signing Up',
                      'please enter a valid email'
                    );
                    break;
        // this produces an error if the account is disabled 
                case "auth/operation-not-allowed":
                    Alert.alert (
                      'Error Signing Up',
                      'your account has been disabled'
                    );
                    break;

        // this produces an error if the password is deemed too weak
                case "auth/weak-password":
                    Alert.alert (
                      'Error Signing Up',
                      'please enter a stronger password'
                    );
                    break;
                default:
                    Alert.alert (
                      'Error Signing Up',
                      'error creating account'
                    );
            }
        // this creates an account if everything is good
        }).then (function() {
            var currentUser = firebase.auth().currentUser;
            firebase.database().ref ('users/' + currentUser.uid).set ({
                email: currentUser.email,
                username : username,
                checkedIn : false,
                checkedSpace : false
            });
            switchPage(destination);
        });
    }

// this creates the style and looks of the screen 'SignUp'
    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <Text style = {styles.welcome}>
                    Signup
                </Text>

            {/* This allows the user to input an email address*/}

                <TextInput
                    placeholder = "email"
                    keyboardType={'email-address'}
                    onChangeText = {(email) => this.setState ({email})}
                    value = {this.state.email}
                />

            {/* This allows the user to input an username*/}

                <TextInput
                    placeholder = "username"
                    onChangeText = {(username) => this.setState ({username})}
                    value = {this.state.username}
                />

            {/* This allows the user to input their own secure password*/}

                <TextInput
                    secureTextEntry = {true}
                    placeholder = "password"
                    onChangeText = {(password) => this.setState ({password})}
                    value = {this.state.password}
                />

            {/* This make sure their password is the same as the one they entered*/}
                <TextInput
                    secureTextEntry = {true}
                    placeholder = "confirm password"
                    onChangeText = {(passwordConfirm) => this.setState ({passwordConfirm})}
                    value = {this.state.passwordConfirm}
                />

            {/* This is a button that sign up the user.*/}
                <Button onPress = {() => this.signUpOnPress(this.props.navigator.push,
                  {name: 'MyListView'})}
                > Sign up
                </Button>

            {/* This goes to the main login page if the user has an account already*/}
                <Button onPress = {() => this._navigateBack()}>
                  Already have an account? Log in
                </Button>
            </View>
        )
    }
}

//styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        marginTop: 100,
    },
});
