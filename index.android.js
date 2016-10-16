'use strict';

import React, {Component} from 'react';
// import {AppRegistry, Text, Image, View, Navigator, TextInput} from 'react-native';
import { View, AppRegistry, Text, Image, Navigator, TextInput} from 'react-native';


import NiceInput from './NiceInput';
import Hostspace from './Hostspace';
import MyListView from './MyListView';
import Login from './Login';

class ParkingCheckout extends Component {
  render() {
    return (

  //    <View>
    //    <MyListView/>
    //  </View>
      <View>
        <Text>Welcome to the Facebook SDK for React Native!</Text>
        <Login />
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
