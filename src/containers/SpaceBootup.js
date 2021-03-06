/*
This help to show a spinner when sign in and going to list view. It happens while the app loads the data.
*/

import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TouchableHighlight, Slider, Picker, TextInput, View, Image, BackAndroid} from 'react-native';
import {Container, Content, Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from'./Themes';

var firebase = require('firebase');

//inital state and renders when there is new infomation 
export default class SpaceBootup extends Component {
  constructor(props){
    super(props);
    this.state = {text : 'this text will be updated by typing',
    };
  }

// this allows the phone's back button to go back to previous page
  componentDidMount(){
    var nav = this.props.navigator;
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (nav.getCurrentRoutes().length === 1  ) {
         return false;
      }
      nav.pop();
      return true;
    });
    var self = this;

    //Checks if user is already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      //goes to the list view page if the user is already logged in
      if (user) {

        self.props.navigator.immediatelyResetRouteStack([{name: 'MyListView'}]);

      } else {
        // goes to login page when the user isn't logged in
        self.props.navigator.popToTop();


        self.props.navigator.immediatelyResetRouteStack([{name: 'Login'}]);
        return;
      }
    });
  }

// style of the spinner and title after opening the application
  render(){
    return(
      <Container style={{backgroundColor: theme.bootColor}}>
          <Content>
              <View>
              <Text style={styles.welcome}>
                Sp<Icon name="rocket" size={30} color= {theme.rocketColor}/>ce
              </Text>
              <Spinner color= {theme.bootSpinner}/>
              </View>
          </Content>
      </Container>
    )
  }
}

//styles
const styles = StyleSheet.create({
  picker: {
    flex: 1,
    marginRight: 100,
    marginLeft: 100,
  },
  slider: {
    marginLeft: 15,
    marginRight:15,
  },
  options: {
    marginTop: 20,
    marginLeft: 20,
    marginRight:20,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 25,
    color: '#2c3e50'
  },
});
