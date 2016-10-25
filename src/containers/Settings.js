import React, {Component} from 'react';
import { Container, Content, Button, Thumbnail, Header, Icon, Title, List, ListItem, Footer, FooterTab } from 'native-base';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
// import Button from 'react-native-button';

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

    logOutUser(switchPage, destination) {
        firebase.auth().signOut().then(function() {
            alert ('logged out');
            switchPage(destination);
        }, function (error) {
            alert ('error logging out');
        });
    }

    render() {
        return (
            <Container style={{backgroundColor: 'white'}}>
            <Header style={{backgroundColor: '#e74c3c'}}>
              <Button transparent onPress={() => this. _navigateBack()}>
                  <Icon name='ios-arrow-back' />
              </Button>
              <Title>Settings</Title>
            </Header> 
              <Content>
                  <View >
                      <Button onPress = {() => {this.logOutUser(
                        this.props.navigator.resetTo,{name: 'Login'})}}>
                          Log out
                      </Button>
                  </View>
              </Content>
            </Container>
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
