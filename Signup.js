import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import Button from 'react-native-button';

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




    signUpOnPress(switchPage) {
        console.log ('button has been pressed');
        let email = this.state.email;
        let password = this.state.password;
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
                email: currentUser.email
            });
            switchPage;
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
                    SPACE : Signup Page (pre-alpha)
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
                <Button onPress = {() => {this.signUpOnPress(this.props.navigator.push(
                  {name: 'MyListView'}
                ))}}>
                    [[sign up]]
                </Button>
                <Button onPress = {() => this.logUserInfoOnPress()}>
                    [[Log user information]]
                </Button>
                <Button onPress = {() => {this.logOutUser(), this._navigateList()}}>
                    [[Log out]]
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
