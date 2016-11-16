import React, {Component} from 'react';
import { Container, Content, Button, Thumbnail, Header, Icon, Title, List, ListItem, Footer, FooterTab } from 'native-base';
import {Navigator, StyleSheet, Text, TextInput, View, Image, Alert} from 'react-native';
// import Button from 'react-native-button';
import Themes from './Themes';

var firebase = require ('firebase');

export default class Settings extends Component {
    constructor (props) {
        super (props);
        this.state = {text : 'this text will be updated by typing'};
    }

    _navigateBack(){
      this.props.navigator.pop();
    }

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

    render() {
        return (
            <Container style={{backgroundColor: 'white'}}>
            <Header style={{backgroundColor: '#e74c3c'}}>
              <Button transparent onPress={() => this._navigateBack()}>
                  <Icon name='ios-arrow-back' />
              </Button>
              <Title>Settings</Title>
            </Header>
              <Content>
                  <View style={{margin:10}}>
                      <TextInput
                        placeholder = "Change your username"
                        onChangeText = {(username) => this.setState ({username})}
                        value = {this.state.username}
                      />
                      <Button large block>
                        Change username
                      </Button>
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
