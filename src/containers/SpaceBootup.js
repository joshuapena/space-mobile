import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TouchableHighlight, Slider, Picker, TextInput, View, Image, BackAndroid} from 'react-native';
import {Container, Content, Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from'./Themes';

var firebase = require('firebase');

export default class SpaceBootup extends Component {
  constructor(props){
    super(props);
    this.state = {text : 'this text will be updated by typing',
    };
  }

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
      // goToPage(user)
      if (user) {
        console.log("user is signed in at login screen");
        console.log(user.email);

        self.props.navigator.immediatelyResetRouteStack([{name: 'MyListView'}]);

        // setTimeout(()=>{self.props.navigator.push({name: "MyListView"})}, 1000);
      } else {
        self.props.navigator.popToTop();
        console.log("no one is signed in");


        self.props.navigator.immediatelyResetRouteStack([{name: 'Login'}]);        // setTimeout(()=>{self.props.navigator.push({name: "Login"})}, 1000);

        return;
      }
    });
  }


  render(){
    return(
      <Container style={{backgroundColor: '#ecf0f1'}}>
          <Content>
              <View>
              <Text style={styles.welcome}>
                Sp<Icon name="rocket" size={30} color="#e74c3c"/>ce
              </Text>
              <Spinner color='#e74c3c'/>
              </View>
          </Content>
      </Container>
    )
  }
}

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
