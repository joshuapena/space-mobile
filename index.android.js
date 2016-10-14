/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Platform, AppRegistry, StyleSheet, Text, View} from 'react-native';
var icon = require ('react-native-vector-icons/FontAwesome');
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');
var LoginBehavior = {
  'android': FBLoginManager.LoginBehaviors.Native
}

class FBLoginView extends Component {

}

class ParkingCheckout extends Component {
  /*
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
  */
  static contextTypes = {
    isLoggedIn: React.PropTypes.bool,
    login: React.PropTypes.func,
    logout: React.PropTypes.func,
    props: React.PropTypes.object
  };

  constructor (props) {
    super (props);
  }

  render() {
    return (<FBLogin loginBehavior={LoginBehavior[Platform.OS]}/>);
  }
};
module.exports = ParkingCheckout;

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
*/

AppRegistry.registerComponent('ParkingCheckout', () => ParkingCheckout);

/*
<FBLogin
    buttonView={<ParkingCheckout />}
    ref={(fbLogin) => { this.fbLogin = fbLogin }}
    loginBehavior={FBLoginManager.LoginBehaviors.Native}
    permissions={["email","user_friends"]}
    onLogin={function(e){console.log(e)}}
    onLoginFound={function(e){console.log(e)}}
    onLoginNotFound={function(e){console.log(e)}}
    onLogout={function(e){console.log(e)}}
    onCancel={function(e){console.log(e)}}
    onPermissionsMissing={function(e){console.log(e)}}
/>
*/