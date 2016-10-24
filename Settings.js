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

export default class Settings extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

    _navigateBack(){
      this.props.navigator.pop()
    }

    logOutUser(switchPage) {
        var currentUserName = firebase.auth().currentUser;
        firebase.auth().signOut().then(function() {
            alert (currentUserName + ' logged out');
            currentUserName = null;
            switchPage();
        }, function (error) {
            alert ('error logging out');
        });
    }

    render() {


        return (
            <View >
                <Text style = {styles.welcome}>
                    Settings
                </Text>

                <Button onPress = {() => {this.logOutUser(
                  this.props.navigator.popToTop )}}>
                    [[Log out]]
                </Button>

                <Button onPress = { () => this. _navigateBack()
                }>
                    [[Cancel]]
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
