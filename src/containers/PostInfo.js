import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, List, ListItem, Footer, FooterTab, Icon } from 'native-base';


export default class PostInfo extends Component {
  constructor (props) {
      super (props);
      this.state = {text : 'this text will be updated by typing'};
  }

  _navigateBack(){
  this.props.navigator.pop();
  console.log(this.props.route)
}

checkIntoSpot(){
  var currentUser = firebase.auth().currentUser;
  // firebase.database().ref ('users/' + currentUser.uid).set ({
  //     email: currentUser.email,
  //     username : username
  // });

  var currentUser = firebase.auth().currentUser;
  firebase.database().ref('listings')
}

  render() {
      return (
          <Container style={{backgroundColor: 'white'}}>
          <Header style={{backgroundColor: '#e74c3c'}}>
            <Button transparent onPress={() => this._navigateBack()}>
                <Icon name='ios-arrow-back' />
            </Button>
            <Title>{this.props.route.item.address}</Title>
          </Header>
            <Content>
                <View >
                <Text> Posted by {this.props.route.item.poster}.</Text>
                <Text> They are charging ${this.props.route.item.price}.</Text>
                <Text> Do you want a {this.props.route.item.type}?</Text>
                <Text> Do you want a {this.props.route.item.key}?</Text>
                <Button> Check into this parking space</Button>
                </View>
            </Content>
          </Container>
      )
  }
}
