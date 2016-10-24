import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import Button from 'react-native-button';

var firebase = require ('firebase');

/*
auth/invalid-email
    Thrown if the email address is not valid.
auth/user-disabled
    Thrown if the user corresponding to the given email has been disabled.
auth/user-not-found
    Thrown if there is no user corresponding to the given email.
auth/wrong-password
*/

export default class Login extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

    _navigateCreate(){
      this.props.navigator.pop()
    }

    logInOnPress(switchPage, destination) {
        let email = this.state.email;
        let password = this.state.password;
        firebase.auth().signInWithEmailAndPassword (email, password).then (function() {
            //alert ('successfully signed in');
            switchPage(destination);
        }, function (error) {
            alert (error);
        });
    }

    render() {
        return (
            <View >
                <Text style = {styles.welcome}>
                    SPACE : Login Page (pre-alpha)
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
                <Button onPress = {() => {this.logInOnPress(
                  this.props.navigator.push, {name: 'MyListView'}
                )}}>
                    [[Log in]]
                </Button>
                <Button onPress = {() => this._navigateCreate() }>
                    [[Create an account instead]]
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
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        marginTop: 100,
    },
});
