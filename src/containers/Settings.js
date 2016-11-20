/*
This shows a new page where the user could change the username or log out.
*/
import React, {Component} from 'react';
import { Container, Content, Button, Thumbnail, Header, Icon, Title, List, ListItem, Footer, FooterTab } from 'native-base';
import {Navigator, StyleSheet, Text, TextInput, View, Image, Alert} from 'react-native';
import theme from'./Themes';

var firebase = require ('firebase');

//the inital state of the app and renders when there is updated/new infomation.
export default class Settings extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

// this allows the app to navigate to MyListView when called.
    _navigateBack(){
      this.props.navigator.replacePreviousAndPop ({name : 'MyListView'})
    }

// this function log out the user of the app and firebase
    logOutUser(switchPage, destination) {
        firebase.auth().signOut().then(function() {

             Alert.alert (
               'logged out'
             );
            // switchPage(destination);
        }, function (error) {
            Alert.alert (
              'error logging out'
            );
        });
    }

// this page produces the style of the Settings screen
    render() {
        return (
            <Container style={{backgroundColor: theme.backgroundColor}}>
            <Header style={{backgroundColor: theme.brandPrimary}}>
              <Button transparent onPress={() => this._navigateBack()}>
                  <Icon name='ios-arrow-back' />
              </Button>
              <Title>Settings</Title>
            </Header>
              <Content>          
                  <View style={{margin:10}}>


            {/* This allows the user to log out when they press the log out button which leads to the login page*/}
                      <Button large block onPress = {() => {this.logOutUser(
                        this.props.navigator.resetTo,{name: 'SpaceBootup'})}}>
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
