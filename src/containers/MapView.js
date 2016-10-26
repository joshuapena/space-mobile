import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import Button from 'react-native-button';
import GoogleMap from 'react-native-maps-google';

export default class MapView extends Component {

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
		  <GoogleMap style = {{flex: 1}}/>
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