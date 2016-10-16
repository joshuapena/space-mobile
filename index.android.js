'use strict';

import React, {Component} from 'react';
// import {AppRegistry, Text, Image, View, Navigator, TextInput} from 'react-native';
import { View, AppRegistry, Text, Image, Navigator, TextInput} from 'react-native';


import NiceInput from './NiceInput';
import Hostspace from './Hostspace';
import MyListView from './MyListView';
import MyModal from './MyModal';

class ParkingCheckout extends Component {
  render() {
    return (

      <View>
        <Hostspace/>
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
