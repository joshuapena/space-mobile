
'use strict';

import React, {Component} from 'react';
// import {AppRegistry, Text, Image, View, Navigator, TextInput} from 'react-native';
import { View, AppRegistry, Text, Image, Navigator, TextInput} from 'react-native';


import NiceInput from './NiceInput';
import Hostspace from './Hostspace';
import MyListView from './MyListView';
import Signup from './Signup';
import Login from './Login';

var firebase = require ('firebase');
var config = {
    apiKey: "AIzaSyAd7nS1dCGQILFxxZ5Jwsla5wy1rnbEI_M",
    authDomain: "space-252ee.firebaseapp.com",
    databaseURL: "https://space-252ee.firebaseio.com",
    storageBucket: "gs://space-252ee.appspot.com",
}
firebase.initializeApp (config);

class ParkingCheckout extends Component {
  render() {

    return (
      <View>
        <Signup/>
      </View>
    )
  }
}

class Greeting extends Component{
	render(){
		return(
  			< Text > Hello {this.props.name} !  < /Text >
		)
	}
}


AppRegistry.registerComponent('ParkingCheckout', () => ParkingCheckout);

