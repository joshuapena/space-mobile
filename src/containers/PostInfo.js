import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image, BackAndroid} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, List, ListItem, Footer, FooterTab, Icon } from 'native-base';
import MapView from 'react-native-maps';

var firebase = require('firebase');

var lat = 0;
var lng = 0;


export default class PostInfo extends Component {
  constructor (props) {
      super (props);
      this.getPostLocation (function (data) {
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng; 
      });
      this.state = {text : 'this text will be updated by typing', lat : 0, lng : 0};
  }

  _navigateBack(){
  this.props.navigator.pop();
}

  componentWillMount(){
    var nav = this.props.navigator;
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (nav.getCurrentRoutes().length === 1) {
         return false;
      }
      nav.pop();
      return true;
    });
  }

  getPostLocation (fn) {
    var address = this.props.route.item.address;
    var city = this.props.route.item.city;
    var state = this.props.route.item.state;
    var regex = new RegExp ('\\s+', 'g');
    var googleAddress = address.replace (regex, "+") + ',+' + city.replace (regex, '+') + ',+' + state;
    var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + googleAddress + '&key=AIzaSyB57uuwSaQA6dFY65Xj8tRAmubfAa27hYg';
    console.log (googleURL);
    fetch (googleURL).then (function (response) {
      if (response.status !== 200) {
        console.log ('error with fetch call, code : ' + response.status);
        return;
      }
      response.json().then (function (data) {
        console.log (data.status);
        console.log (data.results[0].formatted_address);
        console.log ('LAT : ' + data.results[0].geometry.location.lat);
        console.log ('LNG : ' + data.results[0].geometry.location.lng);
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
        return fn (data);
      })
    }).catch (function (err) {
      console.log ('fetch error');
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
    alert (lat + "      " + lng);
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
                <Button onPress = {() => this.forceUpdate()}>
                Refresh map
                </Button>
                <MapView
                initialRegion={{
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style = {{height : 500}}
                />
                </View>
            </Content>
          </Container>
      )
  }
}
