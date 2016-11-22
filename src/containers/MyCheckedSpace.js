/*
The space a user is currently checked into
*/

import React, {Component} from 'react';

import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image, Alert} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Card, CardItem, Spinner, Title, Grid, Col, Row,
        List, ListItem, Footer, FooterTab, Icon } from 'native-base';
import theme from'./Themes';

var renderIf = require('render-if');
var firebase = require('firebase');

export default class MyCheckedSpace extends Component {

// this is the inital state which will have a spinner and render when there is new infomation
  constructor(props) {
    super(props);
    this.state = {
        spinnerState : true,
        thisSpace : {},
        dataExists : false,
        checkingOut : false
      };
    }

//this navigate to the List View when called
  _navigateListview(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }

// this allows a user to checkout a parking space and updates the firebase
  checkOut(){
    this.setState ({checkingOut: true});
    console.log(this.state.thisSpace);
    var self = this;
    var postID = self.state.thisSpace.uid;
    var poster = self.state.thisSpace.poster;
    var price = self.state.thisSpace.price;
    var currentUser = firebase.auth().currentUser;
    var checkIn;
    var checkOut;

//firebase 
    firebase.database().ref('users/' + currentUser.uid).once("value").then(function(snapshot){
      var checkedIn = snapshot.val().checkedIn;
      console.log(checkedIn);

//this stores the data of the checkedIn into the firebase.
      if(checkedIn){
        self.setState ({dataExists: false});
        checkOut = firebase.database.ServerValue.TIMESTAMP;
        firebase.database().ref('listings/' + postID+ '/' + currentUser.uid).update({checkoutTime: checkOut });
        var ref = firebase.database().ref("listings/" + postID+ '/' + currentUser.uid);
        ref.once("value").then(function(snapshot){
          checkIn = snapshot.val().checkinTime;
          checkOut = snapshot.val().checkoutTime;
          alert("You owe " + poster + " $" + ((Math.ceil((checkOut - checkIn)/3600000)) * price));
        });

        firebase.database().ref ('listings/' +postID).update({available : true}, function (){
          firebase.database().ref('users/' + currentUser.uid ).update({
            checkedIn : false, checkedSpace : false
          }, self._navigateBack())
        });
      } else {

        //error message when an error occur
        Alert.alert (
          'An error occured',
          'you are not checked into a spot yet'
        );
      }
    });
  }

  _navigateBack(){
    this.props.navigator.replacePreviousAndPop ({name : 'MyListView'})
  }

//make sure the checked out data is in firebase
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

//This shows the address, city, state, and price when there is data of a user checked out space
  render() {
    if (this.state.dataExists) {
      return (
        <Container style={{backgroundColor: theme.backgroundColor}}>
        <Header style={{backgroundColor: theme.brandPrimary}}>
        <Button transparent onPress={() => this._navigateBack()}>
            <Icon name='ios-arrow-back' />
        </Button>
          <Title>SPACE</Title>
        </Header>
          <Content>
          {renderIf(this.state.dataExists)(
            <View style={{margin:10}}>
            <Card>
            <Row>
              <Col size={1}>
                <Icon name="ios-pin-outline" style={{color: theme.brandPrimary, margin: 10, paddingLeft:3}} />
              </Col>
              <Col size={5}>
              <Text style={styles.info}>{this.state.thisSpace.address}</Text>
              </Col>
            </Row>
            <Row>
              <Col size={1}>
                <Icon name="ios-globe-outline" style={styles.icons} />
              </Col>
              <Col size={5}>
                <Text style={styles.info}>{this.state.thisSpace.city}, {this.state.thisSpace.state}</Text>
              </Col>
            </Row>
            <Row>
              <Col size={1}>
                <Icon name="ios-contact-outline" style={styles.icons} />
              </Col>
              <Col size={5}>
                <Text style={styles.info}>Posted by {this.state.thisSpace.poster}.</Text>
              </Col>
            </Row>
            <Row>
              <Col size={1}>
                <Icon name="ios-cash-outline" style={styles.icons} />
              </Col>
              <Col size={5}>
                <Text style={styles.info}>${this.state.thisSpace.price}</Text>
              </Col>
            </Row>
            <Card>
            <CardItem>
            <Button block large 
              style={{ backgroundColor: theme.submitButton }} 
              onPress ={()=> {this.checkOut()}}> Checkout </Button>
            </CardItem>
            </Card>
            </Card>
            </View>
          )}
          </Content>
        </Container>
      );
    } 
    else if (this.state.checkingOut) {        {/*If the user checkout a space, it would appear.*/}
        return (
          <Container style={{backgroundColor: 'white'}}>
          <Header style={{backgroundColor: theme.brandPrimary}}>
          <Button transparent onPress={() => this._navigateBack()}>
              <Icon name='ios-arrow-back' />
          </Button>
            <Title>SPACE</Title>
          </Header>
            <Content>
            <Spinner color={theme.brandPrimary}/>
            </Content>
        </Container>
      );
    }
    else {
{/*This shows the toolbar and the back arrow*/}
      return (
        <Container style={{backgroundColor: theme.backgroundColor}}>
        <Header style={{backgroundColor: theme.brandPrimary}}>
        <Button transparent onPress={() => this._navigateBack()}>
            <Icon name='ios-arrow-back' />
        </Button>
          <Title>SPACE</Title>
        </Header>
          <Content>

{/*This appears when the checked out space doesn't exists*/}
          {renderIf(!this.state.dataExists)(
            <Grid>
              <Col alignItems='center'>
                <Icon name='ios-help-circle-outline' style={{fontSize: 200, color: theme.helpIcon}}/>
                <Text>Looks like you don't have any Checked Out Space.</Text>
              </Col>
            </Grid>
          )}
          </Content>
        </Container>
      );
    }
  }
}



const styles = StyleSheet.create({
  icons: {
    color: theme.brandPrimary,
    margin: 10,
  },
  info: {
    fontSize: 20,
    paddingTop: 10,
  },
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
