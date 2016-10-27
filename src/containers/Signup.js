/*
Signup page creates a new account on firebase
Can navigate to MyListView
Can navigate to login


TODO
Some of the error messages crash the app
*/


import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import Button from 'react-native-button';

const dismissKeyboard = require('dismissKeyboard')
var firebase = require ('firebase');


export default class Signup extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

    _navigateList(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }

//   _navigateSignIn(){
//   this.props.navigator.push({
//     name: 'Login', // Matches route.name
//   })
// }

  _navigateBack(){
    this.props.navigator.pop()
  }

    signUpOnPress(switchPage, destination) {
        dismissKeyboard();
        console.log ('button has been pressed');
        let email = this.state.email;
        let password = this.state.password;
        let passwordConfirm = this.state.passwordConfirm;
        let username = this.state.username;

        if(!email || !password || !passwordConfirm || !username) {
          alert ('please fill out all fields');
          return;
        }

        if(password !== passwordConfirm){
          alert ('passwords do not match');
          return;
        }
        var user = firebase.auth().createUserWithEmailAndPassword (email, password).catch (function (error) {
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
            }
        }).then (function() {
            var currentUser = firebase.auth().currentUser;
            firebase.database().ref ('users/' + currentUser.uid).set ({
                email: currentUser.email,
                username : username
            });
            switchPage(destination);
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Text style = {styles.welcome}>
                    Signup
                </Text>
                <TextInput
                    placeholder = "email"
                    keyboardType={'email-address'}
                    onChangeText = {(email) => this.setState ({email})}
                    value = {this.state.email}
                />
                <TextInput
                    placeholder = "username"
                    onChangeText = {(username) => this.setState ({username})}
                    value = {this.state.username}
                />
                <TextInput
                    secureTextEntry = {true}
                    placeholder = "password"
                    onChangeText = {(password) => this.setState ({password})}
                    value = {this.state.password}
                />
                <TextInput
                    secureTextEntry = {true}
                    placeholder = "confirm password"
                    onChangeText = {(passwordConfirm) => this.setState ({passwordConfirm})}
                    value = {this.state.passwordConfirm}
                />
                <Button onPress = {() => this.signUpOnPress(this.props.navigator.push,
                  {name: 'MyListView'})}
                > sign up
                </Button>
                <Button onPress = {() => this._navigateBack()}>
                  Already have an account? Log in
                </Button>
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
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        marginTop: 100,
    },
});
