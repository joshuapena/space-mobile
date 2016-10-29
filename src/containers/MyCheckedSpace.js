/*
The space a user is currently checked into
*/


import React, {Component} from 'react';

import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Spinner, Title, List, ListItem, Footer, FooterTab } from 'native-base';

const TimerMixin =  require('react-timer-mixin');
import Icon from 'react-native-vector-icons/FontAwesome';
const xIcon = (<Icon name="times" size={30} color="#100" />);
var renderIf = require('render-if');


export default class MyCheckedSpace extends Component {


  constructor(props) {
    super(props);
    this.state = {
        spinnerState : true
      };
    }

  _navigateSignUp(){
    this.props.navigator.push({
      name: 'Hostspace', // Matches route.name
    })
  }

  _navigateSettings(){
    this.props.navigator.push({
      name: 'Settings', // Matches route.name
    })
  }

  _navigateMyPosts(){
    this.props.navigator.push({
      name: 'MyPosts', // Matches route.name
    })
  }

  _navigatePostInfo(self, item){
    console.log(item)
    self.props.navigator.push({
      name: 'PostInfo', // Matches route.name
      item: item
    })
  }

  _navigateMyMapView(){
    this.props.navigator.push({
      name: 'MyMapView', // Matches route.name
    })
  }

  _navigateMyCheckedSpace(){
    this.props.navigator.push({
      name: 'MyCheckedSpace', // Matches route.name
    })
  }


  getTestData() {
   fetch('https://space-ucsc.herokuapp.com/viewList',)
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log("GET /test : ", responseJson.code);
       //console.log(JSON.stringify(responseJson.spaceListing, null, 3));
       this.setState({
         spinnerState: false,
         dataSource : responseJson.spaceListing,
       });
       responseJson.code;
     })
     .catch((error) => {
       console.error(error);
     });
 }


  mixins: [TimerMixin]
  componentDidMount(){
    this.getTestData();
    this.timer = setInterval( () => {
      this.getTestData();
    }, 3000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }


 render() {
   return (

      <Container style={{backgroundColor: 'white'}}>
      <Header style={{backgroundColor: '#e74c3c'}}>
        <Button transparent>
          <Icon name='navicon' size={20} color='white'/>
        </Button>
        <Title>SPACE</Title>
      </Header>
        <Content>
         </Content>


    </Container>

   );
 }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    marginTop: 100,
  },
});
