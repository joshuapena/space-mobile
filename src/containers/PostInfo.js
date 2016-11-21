/*
This shows the infomation of the posts in the list view and map view.
*/
import React, {Component} from 'react';
import {Navigator, Modal, TouchableHighlight, ListView, StyleSheet, Text, TextInput, View, Image, BackAndroid, Alert} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, Grid, Col, Row, Card, CardItem, List, ListItem, Footer, FooterTab, Icon } from 'native-base';
import MapView from 'react-native-maps';
import theme from'./Themes';

var firebase = require('firebase');

// this states the current state of the screen and renders when updated
export default class PostInfo extends Component {
  constructor (props) {
      super (props);

      this.state = {text : 'this text will be updated by typing', lat : 0, lng : 0, modalVisible: false};
  }

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }

// navigate back to MyListView
  _navigateBack(){
    this.props.navigator.replacePreviousAndPop ({name : 'MyListView'});
  }

// allows the phone back button to go back
  componentWillMount(){
    var nav = this.props.navigator;
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (nav.getCurrentRoutes().length === 1) {
         return false;
      }
      nav.pop();
      return true;
    });
  }

  componentWillUnmount(){
    // Remove all callbacks of any type
    var curItem = this.props.route.item;
    firebase.database().ref('listings/' + curItem.uid + '/available' ).off();
    console.log('component did unmount');
  }

  componentDidMount(){

    var currentUser = firebase.auth().currentUser;
    var ref = firebase.database().ref("users/" + currentUser.uid+ "/username");
    ref.once("value")
    .then(function(snapshot) {
      var key = snapshot.val(); // "ada"
      myUsername = key;
      self.setState({"username" : myUsername});
    });


    console.log(this.props.route);
    var self = this;
    var curItem = this.props.route.item;
    firebase.database().ref('listings/' + curItem.uid + '/available' ).on('value', function(snapshot){
      self.setState({
        available : snapshot.val()
      })
      console.log('I am here:');
      //console.log(snapshot.val());
    });
  }

//a fucntion to check the parking space through the post id, user, and listings from firebase.
  checkSpace(){
    var self = this;
    var postId = self.props.route.item.uid;
    var currentUser = firebase.auth().currentUser;


    firebase.database().ref ('users/' + currentUser.uid).once('value', function (snapshot) {
      //check if you are already checked in somewhere
      if (!snapshot.val().checkedIn) {

        //update the time in the app and firebase when checked into a space
        firebase.database().ref('listings/' + postId+ '/' + currentUser.uid).update({checkinTime: firebase.database.ServerValue.TIMESTAMP });
        // check if the parking space is open
        firebase.database().ref ('listings/' + postId).update ({available : false, checkedUser : currentUser.email}, function() {
          firebase.database().ref ('users/' + currentUser.uid).update ({
            checkedIn : true, checkedSpace : postId
          }, self._navigateBack());
        });
    // any alert that prevents you from checking into multiple parking spaces.
      } else {
        alert ('Error: you are already checked into a space');
      }
    });
  }

  render(){
    return(
      <Container style={{backgroundColor: theme.backgroundColor}}>
      <Header style={{backgroundColor: theme.brandPrimary}}>
        <Button transparent onPress={() => this._navigateBack()}>
            <Icon name='ios-arrow-back' />
        </Button>
        <Title>{this.props.route.item.address}</Title>
      </Header>
    {/* This make sure the user wants to check into the space by stating the price and question*/}
        <Content>
            <View style={{margin:10}}>
            <Card style={{paddingBottom:10}}>
              <Text style={styles.info}> Posted by {this.props.route.item.poster}.</Text>
              <Text> {this.props.route.item.poster} is asking ${this.props.route.item.price}.</Text>
              <Text> Do you want a {this.props.route.item.type}?</Text>
            </Card>
            <Card>
              <CardItem>
              <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <Text>
            Are you sure you want to check in to this spot?
            You will be charged at least for 1 hour of service

            </Text>

    {/* This allows the user to confirm that they want to check out the space*/}
            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.checkSpace();
            }}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableHighlight>
            <Text>


            </Text>
            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableHighlight>
          </View>
         </View>
        </Modal>

            {/* This shows the map view (small map) of the parking space on the map via a marker.*/}
                <MapView
                  initialRegion={{
                    latitude: this.props.route.item.lat,
                    longitude: this.props.route.item.lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  style = {{height : 300}}
                  >
                  <MapView.Marker
                    coordinate = {{latitude: this.props.route.item.lat, longitude: this.props.route.item.lng}}
                    title = {this.props.route.item.address}
                    description = {this.props.route.item.type}
                    pinColor = {this.state.available ? theme.brandPrimary : theme.checkOutButton}
                  />
                </MapView>
            </CardItem>
            <CardItem>

                  <Button large block disabled={!this.state.available  || (firebase.auth().currentUser.email === this.props.route.item.email)}
                    onPress={() => firebase.auth().currentUser.uid === this.props.route.item.uid ? alert ('Cannot check in to your own space') : this.setModalVisible(true)}>
                    {firebase.auth().currentUser.email === this.props.route.item.email?
                    <Text style={styles.buttonText}> This is your Space </Text> :
                    <Text style={styles.buttonText}> Check In</Text>
                    }
                  </Button>


            </CardItem>
            </Card>
          </View>
        </Content>
      </Container>
      )
  }
}

const styles = StyleSheet.create({
  info: {
    color:'#3498db',
    fontSize: 25,
  },
  buttonText: {
    color:'white',
    fontSize:20,
  },
  confirmText: {
    color:'blue',
    fontSize:50,
    textAlign:'center',
    fontWeight:'bold',
  },
  declineText: {
    color:'red',
    fontSize:50,
    textAlign:'center',
    fontWeight:'bold',
  },
});
