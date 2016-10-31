import MapView from 'react-native-maps';
import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';

export default class MyMapView extends Component {

  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  };

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        console.log(this.state.initialPosition);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

	_navigateBack(){
      this.props.navigator.pop()
    }

  _navigateListView(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }

  getLat(){
    return this.state.initialPosition.coords.latitude;
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