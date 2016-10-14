'use strict';

import React, {Component} from 'react';
// import {AppRegistry, Text, Image, View, Navigator, TextInput} from 'react-native';
import { View, AppRegistry, Text, Image, Navigator, TextInput} from 'react-native';


import NiceInput from './NiceInput';
import Hostspace from './Hostspace';
import MyListView from './MyListView';

class ParkingCheckout extends Component {
  render() {
    return (

      <View>
        <MyListView/>
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
