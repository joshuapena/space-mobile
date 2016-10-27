
'use strict';

import React, {Component} from 'react';
import { View, AppRegistry, Text, Image, StyleSheet, Modal, TouchableHighlight, Navigator, TextInput} from 'react-native';


import Hostspace from './containers/Hostspace';
import MyListView from './containers/MyListView';
import Signup from './containers/Signup';
import Login from './containers/Login';
import Settings from './containers/Settings';
import MyPosts from './containers/MyPosts';

import PostInfo from './containers/PostInfo';
import EditPost from './containers/EditPost';

var firebase = require ('firebase');
var config = {
    apiKey: "AIzaSyAd7nS1dCGQILFxxZ5Jwsla5wy1rnbEI_M",
    authDomain: "space-252ee.firebaseapp.com",
    databaseURL: "https://space-252ee.firebaseio.com",
    storageBucket: "gs://space-252ee.appspot.com",
}
firebase.initializeApp (config);

export default function native (platform) {
  let ParkingCheckout = React.createClass({
    renderScene (route, navigator){
      if(route.name == 'Hostspace') {
        return <Hostspace navigator={navigator} />
      }
      if(route.name == 'Signup') {
        return <Signup navigator={navigator} />
      }
      if(route.name == 'MyListView') {
        return <MyListView navigator={navigator} />
      }
      if(route.name == 'Login') {
        return <Login navigator={navigator} />
      }
      if(route.name == 'Settings') {
        return <Settings  navigator={navigator} />
      }
      if(route.name == 'MyPosts') {
        return <MyPosts  navigator={navigator} />
      }
      if(route.name == 'PostInfo') {
        return <PostInfo navigator={navigator} route={route} />
      }
      if(route.name == 'EditPost') {
        return <EditPost navigator={navigator} route={route} />
      }
    },
    render(){
      return(
        <View style={{flex: 1}}>
          <Navigator
          initialRoute={{'name' : 'Login'}}
          renderScene={ this.renderScene } />
        </View>
      )
    }
  });
  const styles = StyleSheet.create({
    garage: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    hostspot: {
      fontSize: 25,
      marginLeft: 10,
    },
  });

  AppRegistry.registerComponent('ParkingCheckout', () => ParkingCheckout);
};
