'use strict';

import React, {Component} from 'react';
import { View, AppRegistry, Text, Image, StyleSheet, Modal, TouchableHighlight, Navigator, TextInput} from 'react-native';


import NiceInput from './NiceInput';
import Hostspace from './Hostspace';
import MyListView from './MyListView';
import MyModal from './MyModal';
import Signup from './Signup';

var firebase = require ('firebase');
var config = {
    apiKey: "AIzaSyAd7nS1dCGQILFxxZ5Jwsla5wy1rnbEI_M",
    authDomain: "space-252ee.firebaseapp.com",
    databaseURL: "https://space-252ee.firebaseio.com",
    storageBucket: "gs://space-252ee.appspot.com",
}
firebase.initializeApp (config);

class ParkingCheckout extends Component {

  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{marginTop: 22}}>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >

          <TouchableHighlight onPress={() => {
            this.setModalVisible(!this.state.modalVisible)
          }}>
            <Text>Hide Modal</Text>
          </TouchableHighlight>
            <Hostspace/>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
        <View style={styles.garage}>
          <Image
            style={{width: 50, height: 50}}
            source={require('./garage.png')}/>
          <Text style={styles.hostspot}>Host Spot</Text>
        </View>
        </TouchableHighlight>
      
      <View>
        <MyListView/>
      </View>
    </View>
    );
  }
}


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
