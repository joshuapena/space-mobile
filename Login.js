import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import Button from 'react-native-button';

var firebase = require ('firebase');
var ERROR_FALSE = 1;
var ERROR_TRUE = 0;

export default class Login extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

    buttonpress() {
        console.log ('button has been pressed');
        let email = this.state.email;
        let password = this.state.password;
        var error_ = ERROR_FALSE;
        firebase.auth().signInWithEmailAndPassword (email, password).catch (function (error) {
            if (error.code) {
                error_ = ERROR_TRUE;
                alert ('cannot log in');
            }
        });
        if (!error_ === ERROR_TRUE) {
            alert ('sign in success');
        }
        error_ = ERROR_FALSE;
    }

    render() {
        return (
            <View >
                <Text style = {styles.welcome}>
                    SPACE : Login Page (test
                </Text>
                <TextInput
                    placeholder = "email"
                    onChangeText = {(email) => this.setState ({email})}
                    value = {this.state.email}
                />
                <TextInput secureTextEntry = {true}
                    placeholder = "password"
                    onChangeText = {(password) => this.setState ({password})}
                    value = {this.state.password}
                />
                <Button onPress = {() => {this.buttonpress()}}>
                    Log in
                </Button>
                <Button onPress = {() => this.logOutUser()}>
                    Log out
                </Button>
                <Button onPress = {() => this.logUserInfoOnPress()}>
                    [[Log user information]]
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