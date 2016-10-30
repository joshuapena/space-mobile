import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image, BackAndroid} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, List, ListItem, Footer, FooterTab, Icon } from 'native-base';

var firebase = require('firebase');


export default class PostInfo extends Component {
  constructor (props) {
      super (props);
      this.state = {text : 'this text will be updated by typing'};
  }

  _navigateBack(){
  this.props.navigator.pop();
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
  }


  componentDidMount(){
    console.log(this.props.route.item);

  }

  checkIn(){
    var self = this;
    var postID = self.props.route.item.uid;
    var currentUser = firebase.auth().currentUser;

    firebase.database().ref('users/' + currentUser.uid).once("value").then(function(snapshot){
      var checkedIn = snapshot.val().checkedIn;
      // console.log(snapshot.val());
      console.log(checkedIn);
      if(!checkedIn){
        firebase.database().ref ('listings/' +postID).update({available : false}, function (){
          firebase.database().ref('users/' + currentUser.uid ).update({
            checkedIn : true, checkedSpace : postID
          }, self._navigateBack())
        });
      } else {
        alert("you are checked into a spot already");
      }
    });
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
                <Button disabled={!this.props.route.item.available} onPress={() => this.checkIn()}>
                Check into this parking space
                </Button>

                </View>
            </Content>
          </Container>
      )
  }
}
