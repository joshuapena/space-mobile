'use strict';

import React, {Component} from 'react';
import { View, AppRegistry, Text, Image, StyleSheet, Modal, TouchableHighlight, Navigator, TextInput} from 'react-native';


import NiceInput from './NiceInput';
import Hostspace from './Hostspace';
import MyListView from './MyListView';
import MyModal from './MyModal';
import Signup from './Signup';
import Login from './Login';
import Settings from './Settings';
import MyPosts from './MyPosts';

var firebase = require ('firebase');
var config = {
    apiKey: "AIzaSyAd7nS1dCGQILFxxZ5Jwsla5wy1rnbEI_M",
    authDomain: "space-252ee.firebaseapp.com",
    databaseURL: "https://space-252ee.firebaseio.com",
    storageBucket: "gs://space-252ee.appspot.com",
}
firebase.initializeApp (config);


// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     console.log("user is signed in");
//     this.props.navigator.push({
//       name: 'MyListView', // Matches route.name
//     });
//   } else {
//     console.log("no one is signed in");
//   }
//   });


class ParkingCheckout extends Component {

  constructor (props) {
      super (props);
      this.state = {
        text : 'this text will be updated by typing',
        logStatus: {name:'Login'}
      }
  }



  // componentWillMount()
    // checkLogIn()
    // {
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     console.log("user is signed in when app starts");
    //     console.log(user.email);
    //     this.setState({
    //       logStatus: {name:'MyListView'}
    //     });
    //      return {name: "MyListView"}
    //     this.props.navigator.push({name: "MyListView"});
    //   } else {
    //     console.log("no one is signed in");
    //     return {name: "Login"};
    //   }
    // });

    // var currentUser = firebase.auth().currentUser;
    // if(currentUser){
    //   this.props.navigator.push({name: "MyListView"});
    //   console.log("user was already logged in");
    // } else{
    //   console.log("no one was logged in");
    // }
    //}

  renderScene (route, navigator){
    if(route.name == 'NiceInput') {
      return <NiceInput navigator={navigator} />
    }
    if(route.name == 'Hostspace') {
      return <Hostspace navigator={navigator} />
    }
    if(route.name == 'Signup') {
      return <Signup navigator={navigator} />
    }
    if(route.name == 'MyListView') {
      return <MyListView navigator={navigator} />
    }

    if(route.name == 'Login') {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          return <MyListView navigator={navigator} />
          console.log("user is signed in, skip log in page");
          console.log(user.email);
          // this.setState({
          //   logStatus: {name:'MyListView'}
          // });

          // this.props.navigator.push({name: "MyListView"});
        } else {
          console.log("no one is signed in");
          // return {name: "Login"};
          return <Login navigator={navigator} />
        }
      });
    }
    if(route.name == 'Settings') {
      return <Settings  navigator={navigator} />
    }
    if(route.name == 'MyPosts') {
      return <MyPosts  navigator={navigator} />
    }
  }



render(){
  // var userLogIn = {name: 'Login'};
  //
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     userLogIn = {name: 'MyListView'};
  //     console.log("user is signed in when app starts");
  //     console.log(user.email);
  //     this.setState({
  //       logStatus: {name:'MyListView' }
  //     });
  //     this.props.navigator.push({name: "MyListView"});
  //
  //   } else {
  //     console.log("no one is signed in");
  //     return;
  //   }
  // });


  return(
      <View style={{flex: 1}}>
      <Navigator
      initialRoute={{'name' : 'Login'}}
      renderScene={ this.renderScene } />
    </View>
)}
  // render() {
  //   return (
  //     <View style={{marginTop: 22}}>
  //
  //       <Modal
  //         animationType={"slide"}
  //         transparent={false}
  //         visible={this.state.modalVisible}
  //         onRequestClose={() => {alert("Modal has been closed.")}}
  //         >
  //
  //         <TouchableHighlight onPress={() => {
  //           this.setModalVisible(!this.state.modalVisible)
  //         }}>
  //           <Text>Hide Modal</Text>
  //         </TouchableHighlight>
  //           <Hostspace/>
  //       </Modal>
  //
  //       <TouchableHighlight onPress={() => {
  //         this.setModalVisible(true)
  //       }}>
  //       <View style={styles.garage}>
  //         <Image
  //           style={{width: 50, height: 50}}
  //           source={require('./garage.png')}/>
  //         <Text style={styles.hostspot}>Host Spot</Text>
  //       </View>
  //       </TouchableHighlight>
  //
  //     <View>
  //     </View>
  //   </View>
  //   );
  // }
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
