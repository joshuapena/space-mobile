/*
Login page will be the first page a user will see
Can navigate to MyListView
Can navigate to Signup
*/

import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image, BackAndroid} from 'react-native';
import Button from 'react-native-button';
const dismissKeyboard = require('dismissKeyboard')

var firebase = require ('firebase');


export default class Login extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

    _navigateCreate(){
      this.props.navigator.push({name: "Signup"});
    }


    componentWillMount(){


      var nav = this.props.navigator;
      BackAndroid.addEventListener('hardwareBackPress', () => {
        if (nav.getCurrentRoutes().length === 1  ) {
           return false;
        }
        nav.pop();
        return true;
      });
      var self = this;

      //Checks if user is already logged in
      firebase.auth().onAuthStateChanged(function(user) {
        // goToPage(user)
        if (user) {
          console.log("user is signed in at login screen");
          console.log(user.email);
          self.props.navigator.push({name: "MyListView"});
          change = true;
        } else {
          console.log("no one is signed in");
          return;
        }
      });
    }


    logInOnPress(switchPage, destination) {
        dismissKeyboard();
        let email = this.state.email;
        let password = this.state.password;



        if( !email || !password){
          alert ("Fill out all fields");
          return;
        }
        firebase.auth().signInWithEmailAndPassword (email, password).then (function() {
            //alert ('successfully signed in');
            // switchPage(destination);
        }, function (error) {
            alert (error);
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Text style = {styles.welcome}>
                    Login
                </Text>
                <TextInput
                    placeholder = "email"
                    keyboardType={'email-address'}
                    onSubmitEditing={() => {this.logInOnPress(
                      this.props.navigator.replace, {name: 'MyListView'}
                    )}}
                    onChangeText = {(email) => this.setState ({email})}
                    value = {this.state.email}
                />
                <TextInput secureTextEntry = {true}
                    placeholder = "password"
                    onChangeText = {(password) => this.setState ({password})}
                    value = {this.state.password}
                    onSubmitEditing={() => {this.logInOnPress(
                      this.props.navigator.replace, {name: 'MyListView'}
                    )}}
                />
                <Button onPress = {() => {this.logInOnPress(
                  this.props.navigator.replace, {name: 'MyListView'}
                )}}>
                    Log in
                </Button>
                <Button onPress = {() => this._navigateCreate() }>
                    Create an account instead
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
