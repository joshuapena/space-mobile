
/* 'use strict';

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
*/
'use strict';
import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  Navigator,
  AsyncStorage
} from 'react-native';

import Signup from './src/pages/signup';
import Account from './src/pages/account';

import Header from './src/components/header';

import Firebase from 'firebase';

import styles from './src/styles/common-styles.js';

let firebase = require ("firebase");

var config = {
  apiKey: "AIzaSyAd7nS1dCGQILFxxZ5Jwsla5wy1rnbEI_M",
  authDomain: "space-252ee.firebaseapp.com",
  databaseURL: "https://space-252ee.firebaseio.com/",
  storageBucket: "gs://space-252ee.appspot.com",
};

firebase.initializeApp (config);
var rootRef = firebase.database().ref();

class ParkingCheckout extends Component {    

  constructor(props){
    super(props);
    this.state = {
      component: null,
      loaded: false
    };
  }

  componentWillMount(){

    AsyncStorage.getItem('user_data').then((user_data_json) => {

      let user_data = JSON.parse(user_data_json);
      let component = {component: Signup};
      if(user_data != null){

        /*
        app.authWithCustomToken(user_data.token, (error, authData) => {
          if(error){
            this.setState(component);
          }else{
            this.setState({component: Account});
          }
        });
        */

        firebase.auth().signInWithCustomToken (user_data.token).catch(function (error, authData) {
          if(error){
            this.setState(component);
          }else{
            this.setState({component: Account});
          }
        });

      }else{
        this.setState(component);
      }
    });

  }

  render(){

    if(this.state.component){
      return (
        <Navigator
          initialRoute={{component: this.state.component}}
          configureScene={() => {
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          renderScene={(route, navigator) => {
            if(route.component){
              return React.createElement(route.component, { navigator });
            }
          }}
        />
      );
    }else{
      return (
        <View style={styles.container}>
          <Header text="React Native Firebase Auth" loaded={this.state.loaded} />  
          <View style={styles.body}></View>
        </View>
      );
    }

  }

}

AppRegistry.registerComponent('ParkingCheckout', () => ParkingCheckout);
