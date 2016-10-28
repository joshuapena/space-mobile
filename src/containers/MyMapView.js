import MapView from 'react-native-maps';
import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';

export default class MyMapView extends Component {

	_navigateBack(){
      this.props.navigator.pop()
    }

  _navigateListView(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }

	render(){
		return (
		  <MapView 
         initialRegion={{
           latitude: 37.78825,
           longitude: -122.4324,
           latitudeDelta: 0.0922,
           longitudeDelta: 0.0421,
         }}
         style = {{flex : 1}}
       	  />
			)
	}
}