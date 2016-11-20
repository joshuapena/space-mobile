/*
View a list of all publicly viewable rides
*/


import React, {Component} from 'react';

import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image, TouchableHighlight, Modal,
        TouchableOpacity,DrawerLayoutAndroid, ToolbarAndroid} from 'react-native';

import {Container, Content, Card, CardItem, Thumbnail, Button, Header, Spinner, Grid, Col, Row,
        Title, List, ListItem, Footer, FooterTab} from 'native-base';

import theme from './Themes';

const TimerMixin =  require('react-timer-mixin');
import Icon from 'react-native-vector-icons/FontAwesome';
var firebase = require ('firebase');
// const xIcon = (<Icon name="times" size={30} color="#100" />);
// const navIcon = (<Icon name="navicon" size={30} color="#123123"/>);
// const back = (<Icon name="ios-arrow-back" size={30} color="#fff"/>);

var renderIf = require('render-if');

var DrawerLayout = require('react-native-drawer-layout');

/* this listArray element queries firebase and appends all
 * latitude and longitude pairs into it. It is used in this
 * fashion because currently there exists no other options
 * to retrieve that data :(
 */

export default class MyListView extends Component {

  constructor(props) {
    super(props);

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        spinnerState : true,
        stateShouldUpdate : true
      };
    }

  //this provides a function to navigate to Hostspace via the drawer
  _navigateHostspace(){
    this.props.navigator.push({
      name: 'Hostspace', // Matches route.name
    })
  }

  //this provides a function to navigate to Settings via the drawer
  _navigateSettings(){
    this.props.navigator.push({
      name: 'Settings', // Matches route.name
    })
  }

  //this provides a function to navigate to MyPosts via the drawer
  _navigateMyPosts(){
    clearInterval(this.timer);
    this.props.navigator.push({
      name: 'MyPosts', // Matches route.name
    })
  }

  // this provides a function to navigate to the map view and checked space
  // when the post is clicked on
  _navigatePostInfo(self, item){
    // console.log("the post you clicked", Object.keys.(item[0]));
    // console.log("the post id ", item.keys)
    var lat = 0;
    var lng = 0;
    //info from the firebase database
    var ref = firebase.database().ref("listings/" + item.uid);
    ref.once("value").then(function(snapshot){
      lat = snapshot.lat;
      lng = snapshot.lng;
    });
    //post info
    self.props.navigator.push({
      name: 'PostInfo', // Matches route.name
      item: item,
    })
  }

  //navigate to the map view
  _navigateMyMapView(self){
    self.props.navigator.push({
      name: 'MyMapView', // Matches route.name
    })
  }

  //navigate to the checked space
  _navigateMyCheckedSpace(){
    this.props.navigator.push({
      name: 'MyCheckedSpace', // Matches route.name
    })
  }

  componentWillMount() {
    var ref = firebase.database().ref ('listings');

    ref.orderByKey().on ('child_added', function (snapshot) {});

  }

  // mixins: [TimerMixin]
  componentDidMount(){
    var self = this;
    let currentUser = firebase.auth().currentUser;

    // to get username
    var ref = firebase.database().ref("users/" + currentUser.uid+ "/username");
    ref.once("value")
    .then(function(snapshot) {
      var key = snapshot.val(); // "ada"
      myUsername = key;
      self.setState({"username" : myUsername});

    });
      // console.log("this is a key", key);


    // this.getFirebaseData();
    firebase.database().ref('listings/').on("value", function(snapshot){
      if(self.state.stateShouldUpdate){
        self.setState({
          spinnerState: false,
          dataSource :  snapshot.val(),
          stateShouldUpdate : false
        });
      }
      console.log(snapshot.val());
    });
    
  }

 render() {
  //this is the data inside the drawer when opened via button clicked or swipe.
  var navigationView = (
      //list out the button that will navigate to 'Create Space', 'My Postings', 'My Space', and 'Settings' {/* */}

      <View style={{flex: 1, backgroundColor: theme.navColor}}>
        <Text style={{margin: 10, fontSize: 50, textAlign: 'center', color: 'white'}}> SPACE </Text>
        <View style={{alignItems:'center', paddingBottom:15}}>
          <Icon name='user' color= {theme.sIconColor} style={{fontSize: 50}}/>
          <Text style={{fontSize: 20, color: theme.sIconColor}}> {this.state.username} </Text>
        </View>
          <Grid>
              <Row style={{paddingTop:15}} size={1}>
                <Col style={{paddingLeft:15}} size={1}>
                  <Icon name="plus-circle" size={30} color={theme.sIconColor}/>
                </Col>
                <Col size={4}>
                  <Button transparent color={theme.sButtonColor} onPress={() => {this._navigateHostspace()}}>
                  <Text style={{fontSize: 20, color: theme.brandPrimary}}> Create Space </Text></Button>
                </Col>
              </Row>

              <Row style={{paddingTop:15}} size={1}>
                <Col style={{paddingLeft:15}} size={1}>
                  <Icon name="sign-out" size={30} color={theme.sIconColor}/>
                </Col>
                <Col size={4}>
                  <Button transparent color={theme.sButtonColor} onPress={() => {this._navigateMyPosts()}}>
                  <Text style={{fontSize: 20, color: theme.brandPrimary}}> My Postings </Text></Button>
                </Col>
              </Row>

              <Row style={{paddingTop:15}} size={1}>
                <Col style={{paddingLeft:15}} size={1}>
                  <Icon name="car" size={30} color={theme.sIconColor}/>
                </Col>
                <Col size={4}>
                  <Button transparent color={theme.sButtonColor} onPress={() => {this._navigateMyCheckedSpace()}}>
                  <Text style={{fontSize: 20, color: theme.brandPrimary}}> My Space </Text></Button>
                </Col>
              </Row>

              <Row style={{paddingTop:15}} size={3}>
                <Col style={{paddingLeft:15}} size={1}>
                  <Icon name="cog" size={30} color={theme.sIconColor}/>
                </Col>
                <Col size={4}>
                  <Button transparent color={theme.sButtonColor} onPress={() => {this._navigateSettings()}}>
                  <Text style={{fontSize: 20, color: theme.brandPrimary}}> Settings </Text></Button>
                </Col>
              </Row>
          </Grid>
      </View>
    );

  // this shows the spinner when loading and shows the drawer, title, and the toolbar with the button
  if (this.state.spinnerState) {
  return (
        <View style={styles.containerToolbar}>

          <DrawerLayoutAndroid
            drawerWidth={200}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            ref = {'DRAWER'}
            renderNavigationView={() => navigationView}>

            <Header style={{backgroundColor: theme.brandPrimary}}>
              //open the drawer via the 'hamburger' burger
              <Button transparent onPress={() => this.refs['DRAWER'].openDrawer()}>
                <Icon name="navicon" size={20} color={theme.tIconColor}/>
              </Button>

              <Title>SPACE</Title>

              <Button transparent onPress={() => {this._navigateMyMapView(this)}}>
                <Icon name="map-o" size={25} color={theme.tIconColor}/>
              </Button>
            </Header>

            <View>
            <Spinner color={theme.brandPrimary}/>
            </View>
          </DrawerLayoutAndroid>
       </View>
    );
  }
  //this is the drawer layout where it is positioned on the left and navigate to the 'drawer' when 
        // the button pressed or swipe. It also creates the toolbar when it contains the 'hamburger icon' to go
        // to the drawer and a 'map-o' to go to the map view.
  else {
   return (
      <View style={styles.containerToolbar}>
        <DrawerLayoutAndroid
          drawerWidth={200}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          ref = {'DRAWER'}
          renderNavigationView={() => navigationView}>

      {/*this creates a toolbar where it contains the drawer icon and map icon*/}
          <Header style={{backgroundColor: theme.brandPrimary}}>
            <Button transparent onPress={() => this.refs['DRAWER'].openDrawer()}>
              <Icon name="navicon" size={20} color={theme.tIconColor}/>
            </Button>
            <Title>SPACE</Title>
            <Button transparent onPress={() => {this._navigateMyMapView(this)}}>
              <Icon name="map-o" size={25} color={theme.tIconColor}/>
            </Button>
          </Header>

      {/*list out the posts with its address, type of space, status, and the price.*/}
          <List dataArray={this.state.dataSource}
              renderRow={(item) =>
                <ListItem>
                  <Card>
                    {item.available ?
                      <Card backgroundColor= {theme.brandPrimary}>
                      <Text style={{fontSize: 20, color: 'white'}}> {item.address}</Text>
                      </Card> :
                      <Card backgroundColor= {theme.checkOutButton}>
                      <Text style={{fontSize: 20, color: 'white'}}> {item.address}</Text>
                      </Card>}
                    <CardItem button onPress={() => {this._navigatePostInfo(this, item)}}>

      {/*This shows the price, type, and if the item is available.*/}
                      <Grid>
                        <Col>
                          <Text style={{fontSize: 20}}>
                            Price: ${item.price}{"\n"}
                            Type: {item.type}   {"\n"}
                            Status: {item.available ?
                              <Text>Open</Text> :
                              <Text>Occupied</Text>}
                          </Text>
                        </Col>
      {/*This shows the check-in button*/}
                        <Col alignItems='center'>
                            {item.available ?
                            <Icon name="sign-in" color= {theme.brandPrimary} size={50}/> :
                            <Icon name="car" color={theme.checkOutButton} size= {50}/> }
                        </Col>
                      </Grid>

                    </CardItem>
                  </Card>
                </ListItem>
                }>
          </List>
        </DrawerLayoutAndroid>
     </View>
   );
  }
 }
}

const styles = StyleSheet.create({
  drawerOption: {
    color:'#3498db',
    fontSize: 25,
    margin: 20,
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    marginTop: 100,
  },
  containerToolbar: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
});
