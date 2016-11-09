/*
The space a user is currently checked into
*/


import React, {Component} from 'react';

import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image, Alert} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Spinner, Title, Grid, Col, Row,
        List, ListItem, Footer, FooterTab, Icon } from 'native-base';


var renderIf = require('render-if');
var firebase = require('firebase');

export default class MyCheckedSpace extends Component {


  constructor(props) {
    super(props);
    this.state = {
        spinnerState : true,
        thisSpace : {},
        dataExists : false
      };
    }

  _navigateListview(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }

  checkOut(){
    console.log(this.state.thisSpace);
    var self = this;
    var postID = self.state.thisSpace.uid;
    var currentUser = firebase.auth().currentUser;

    firebase.database().ref('users/' + currentUser.uid).once("value").then(function(snapshot){
      var checkedIn = snapshot.val().checkedIn;
      // console.log(snapshot.val());
      console.log(checkedIn);
      if(checkedIn){
        firebase.database().ref ('listings/' +postID).update({available : true}, function (){
          firebase.database().ref('users/' + currentUser.uid ).update({
            checkedIn : false, checkedSpace : false
          }, self._navigateBack())
        });
      } else {
        Alert.alert (
          'An error occured',
          'you are not checked into a spot yet'
        );
      }
    });
  }




  _navigateBack(){
    this.props.navigator.pop();
  }

  componentWillMount(){
    var self = this;
    var currentUser = firebase.auth().currentUser;
    firebase.database().ref('users/' + currentUser.uid).once("value").then(function(snapshot){
      let checked = snapshot.val().checkedSpace;
      console.log("checkedSpace", checked);
      firebase.database().ref('listings/'+ checked).once("value").then(function(snapshot){
        if(!snapshot.val()){
          console.log("no data");
          self.setState({
            dataExists: false,
          });
        } else{
          self.setState({
            dataExists: true,
          });
        }
        console.log("checkedSpace", snapshot.val())
        self.setState({thisSpace: snapshot.val()})
      })
  })
}

 render() {
   return (
      <Container style={{backgroundColor: 'white'}}>
      <Header style={{backgroundColor: '#e74c3c'}}>
      <Button transparent onPress={() => this._navigateBack()}>
          <Icon name='ios-arrow-back' />
      </Button>
        <Title>SPACE</Title>
      </Header>
        <Content>

        {renderIf(!this.state.dataExists)(
          <Grid>
            <Col alignItems='center'>
              <Icon name='ios-help-circle-outline' style={{fontSize: 200, color: '#e74c3c'}}/>
              <Text>Looks like you don't have any Checked Out Space.</Text>
            </Col>
          </Grid>
        )}

        {renderIf(this.state.dataExists)(
          <View>
          <Text>{this.state.thisSpace.address}</Text>
          <Text>{this.state.thisSpace.city}</Text>
          <Text>{this.state.thisSpace.state}</Text>
          <Text>{this.state.thisSpace.price}</Text>
          <Text>{this.state.thisSpace.poster}</Text>
          <Button rounded large onPress ={()=> {this.checkOut()}}> Checkout </Button>
          </View>
        )}
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
