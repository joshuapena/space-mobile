/*
This shows the infomation of the posts in the list view and map view.
*/  
import React, {Component} from 'react';
import {Navigator, Modal, TouchableHighlight, ListView, StyleSheet, Text, TextInput, View, Image, BackAndroid, Alert} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, Grid, Col, Row, Card, CardItem, List, ListItem, Footer, FooterTab, Icon } from 'native-base';
import MapView from 'react-native-maps';
import theme from'./Themes';

var firebase = require('firebase');

export default class PostInfo extends Component {
  constructor (props) {
      super (props);
      this.state = {text : 'this text will be updated by typing', lat : 0, lng : 0, modalVisible: false};
  }

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }

  _navigateBack(){
    this.props.navigator.replacePreviousAndPop ({name : 'MyListView'});
  }

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

  componentDidMount(){
    console.log(this.props.route);
  }

  checkSpace(){
    var self = this;
    var postId = self.props.route.item.uid;
    var currentUser = firebase.auth().currentUser;
    firebase.database().ref ('users/' + currentUser.uid).once ('value').then (function (snapshot) {
      if (!snapshot.val().checkedIn) {
        firebase.database().ref('listings/' + postId+ '/' + currentUser.uid).update({checkinTime: firebase.database.ServerValue.TIMESTAMP });
        firebase.database().ref ('listings/' + postId).update ({available : false, checkedUser : currentUser.email}, function() {
          firebase.database().ref ('users/' + currentUser.uid).update ({
            checkedIn : true, checkedSpace : postId
          }, self._navigateBack());
        });
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
                    pinColor = {this.props.route.item.available ? '#00ff00' : '#ff0000'}
                  />
                </MapView>
            </CardItem>
            <CardItem>
            <Grid>
              <Row justifyContent='center'>
                  <Button large block disabled={!this.props.route.item.available || (firebase.auth().currentUser.email === this.props.route.item.poster)} 
                    onPress={() => firebase.auth().currentUser.uid === this.props.route.item.uid ? alert ('Cannot check in to your own space') : this.setModalVisible(true)}>
                    <Text style={styles.buttonText}> Check In </Text>
                  </Button>
              </Row>
            </Grid>
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
