/*
This shows the map and the marker for parking space nearby and the user position.
*/
import MapView from 'react-native-maps';
import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image, TouchableHighlight, Modal,
        TouchableOpacity,DrawerLayoutAndroid, ToolbarAndroid, Alert} from 'react-native';
import {Container, Content, Card, CardItem, Thumbnail, Button, Header, Spinner, Title, List, Icon,
        ListItem, Footer, FooterTab, InputGroup, Input} from 'native-base';
import theme from'./Themes';

var DrawerLayout = require('react-native-drawer-layout');
var firebase = require('firebase');

var markerList = null;

export default class MyMapView extends Component {

  /*
  <MapView.Marker
  coordinate = {{latitude: this.props.route.item.lat, longitude: this.props.route.item.lng}}
  title = {this.props.route.item.address}
  description = {this.props.route.item.type}
  />
  */

  state = {
    initialPosition: {
      coords: {
        latitude: 36.9914,
        longitude: -122.0609
      }
    },
    lastPosition: 'unknown',
  };

  watchID: ?number = null;

  componentWillMount() {
    markerList = [];
    var ref = firebase.database().ref ('listings');
    ref.orderByKey().on ('child_added', function (snapshot) {
      markerList.push (snapshot.val());
    });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = position;
        this.setState({initialPosition});
      },
      (error) => {
        Alert.alert (
          'Error mounting',
          JSON.stringify(error)
        );
      },
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


  componentWillUpdate() {

  }

	_navigateBack(){
      this.props.navigator.pop();
    }

  _navigateListView(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }

  getLat(){
    return this.state.initialPosition.coords.latitude;
  }
  getLong(){
    return this.state.initialPosition.coords.longitude;
  }

	render(){
    var navigationView = (
      <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <Text style={{margin: 10, fontSize: 20, textAlign: 'center'}}> SPACE </Text>

      </View>
    );
		return (
      <View style={styles.containerToolbar}>
        <DrawerLayoutAndroid
          drawerWidth={200}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          ref = {'DRAWER'}
          renderNavigationView={() => navigationView}>

          <Header style={{backgroundColor: theme.brandPrimary}}>
            <Button transparent onPress={() => this._navigateBack()}>
              <Icon name='ios-arrow-back' />
            </Button>
            <Title> SPACE MAP</Title>
          </Header>

          <InputGroup borderType='regular' >
            <Input placeholder='Type your location here'/>
          </InputGroup>

          <MapView
            initialRegion={{
              latitude: this.getLat(),
              longitude: this.getLong(),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            style = {{flex : 1}}
          >
          {markerList.map (marker => (
          <MapView.Marker
            key = {marker.uid}
            coordinate = {{latitude: marker.lat, longitude: marker.lng}}
            title = {marker.type}
            description = {marker.address + '\n' + marker.city + '\n' + marker.state}
            pinColor = {marker.available ? theme.brandPrimary : '#d35400'}
            onPress = {() => this.props.navigator.push({
            name: 'PostInfo',
            item: marker,
            lat: marker.lat,
            lng: marker.lng
            })}
            />
          ))}
          <MapView.Marker
            key = {"your location"}
            coordinate = {{latitude: this.getLat(), longitude: this.getLong()}}
            title = {"You are here"}
            pinColor = {"#6600ff"}
            />
          </MapView>

        </DrawerLayoutAndroid>
     </View>
			);
	}
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    marginTop: 100,
  },
  containerToolbar: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
});
