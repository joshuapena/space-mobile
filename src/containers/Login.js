/*
Login page will be the first page a user will see
Can navigate to MyListView
Can navigate to Signup
*/

import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image, BackAndroid, Alert} from 'react-native';
import Button from 'react-native-button';
import theme from'./Themes';

//dismiss the keyboard
const dismissKeyboard = require('dismissKeyboard')

var firebase = require ('firebase');


export default class Login extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

//this navigate to 'SignUp' when called
    _navigateCreate(){
      this.props.navigator.push({name: "Signup"});
    }

    //this log in with the email and password provided
    logInOnPress(switchPage, destination) {
        dismissKeyboard();
        let email = this.state.email;
        let password = this.state.password;

        // this is the error message when there is no email, password, or both
        if( !email || !password){
          Alert.alert (
            'Fill out all fields'
          );
          return;
        }
        //checks with firebase with the email and password
        firebase.auth().signInWithEmailAndPassword (email, password).then (function() {
            
        }, function (error) {
            Alert.alert (
              'sign in process',
              'error'
            );
        });
    }

    //
    render() {
        return (
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <Text style = {styles.welcome}>
                    Login
                </Text>
            {/*This takes the email and log in when the password is entered and correct*/}
                <TextInput
                    placeholder = "email"
                    keyboardType={'email-address'}
                    onSubmitEditing={() => {this.logInOnPress(
                      this.props.navigator.replace, {name: 'MyListView'}
                    )}}
                    onChangeText = {(email) => this.setState ({email})}
                    value = {this.state.email}
                />
                
            {/*This takes the password and log in when the email is correct*/}
                <TextInput secureTextEntry = {true}
                    placeholder = "password"
                    onChangeText = {(password) => this.setState ({password})}
                    value = {this.state.password}
                    onSubmitEditing={() => {this.logInOnPress(
                      this.props.navigator.replace, {name: 'MyListView'}
                    )}}
                />
            {/*This logs in the user*/}
                <Button onPress = {() => {this.logInOnPress(
                  this.props.navigator.replace, {name: 'MyListView'}
                )}}>
                    Log in
                </Button>

            {/*This navigate to 'SignUp' when "Create an Account" is pressed on*/}
                <Button onPress = {() => this._navigateCreate() }>
                    Create an account
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
