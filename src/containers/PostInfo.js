import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image, BackAndroid} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, Grid, Col, Row, Card, CardItem, List, ListItem, Footer, FooterTab, Icon } from 'native-base';
import MapView from 'react-native-maps';

var firebase = require('firebase');


export default class PostInfo extends Component {
  constructor (props) {
      super (props);
      this.state = {text : 'this text will be updated by typing', lat : 0, lng : 0};
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
    console.log(this.props.route.item);
  }

  checkSpace(){
    var self = this;
    var postId = self.props.route.item.uid;
    var currentUser = firebase.auth().currentUser;
    firebase.database().ref ('users/' + currentUser.uid).once ('value').then (function (snapshot) {
      if (!snapshot.val().checkedIn) {
        firebase.database().ref ('listings/' + postId).update ({available : false, checkedUser : currentUser.email}, function() {
          firebase.database().ref ('users/' + currentUser.uid).update ({
            checkedIn : true, checkedSpace : postId
          }, self._navigateBack());
        });
      } else {
        firebase.database().ref ('listings/' + postId + '/checkedUser').once ('value').then (function (posterSnapshot) {
          const posterEmail = posterSnapshot.val();
          if (posterEmail != currentUser.email) {
            alert ('Error: you are not checked into this space\n' + posterEmail);
          } else {
            firebase.database().ref ('listings/' + postId).update ({available : true, checkedUser: false}, function() {
              firebase.database().ref ('users/' + currentUser.uid).update ({
                checkedIn : false, checkedSpace : false
              }, self._navigateBack());
            });
          }
        });
      }
    });
  }

  render(){
    return(
      <Container style={{backgroundColor: 'white'}}>
      <Header style={{backgroundColor: '#e74c3c'}}>
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
                  <Button large rounded disabled={!this.props.route.item.available} onPress={() => this.checkSpace()}>
                    <Text style={styles.buttonText}> Check In </Text>
                  </Button>
                  <Button large rounded disabled={this.props.route.item.available} onPress={() => this.checkSpace()}>
                    <Text style={styles.buttonText}> Check Out </Text>
                  </Button> 
                  <Button large rounded onPress={() => this.forceUpdate()}>
                    <Text style={styles.buttonText}> Refresh </Text>
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
});
