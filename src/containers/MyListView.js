/*
View a list of all publicly viewable rides
*/


import React, {Component} from 'react';

import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image, TouchableHighlight, Modal,
        TouchableOpacity,DrawerLayoutAndroid, ToolbarAndroid} from 'react-native';

import {Container, Content, Card, CardItem, Thumbnail, Button, Header, Spinner, Grid, Col,
        Title, List, ListItem, Footer, FooterTab} from 'native-base';

const TimerMixin =  require('react-timer-mixin');
import Icon from 'react-native-vector-icons/FontAwesome';
var firebase = require ('firebase');
// const xIcon = (<Icon name="times" size={30} color="#100" />);
// const navIcon = (<Icon name="navicon" size={30} color="#123123"/>);
// const back = (<Icon name="ios-arrow-back" size={30} color="#fff"/>);

var renderIf = require('render-if');

var DrawerLayout = require('react-native-drawer-layout');


export default class MyListView extends Component {

  constructor(props) {
    super(props);

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        spinnerState : true,
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
    clearInterval(this.timer);
    this.props.navigator.push({
      name: 'MyPosts', // Matches route.name
    })
  }

  _navigatePostInfo(self, item){
    // console.log("the post you clicked", Object.keys.(item[0]));
    // console.log("the post id ", item.keys)
    var lat;
    var lng;
    var ref = firebase.database().ref("listings/" + item.uid);
    ref.once("value").then(function(snapshot){
      lat = snapshot.lat;
      lng = snapshot.lng;
    });
    self.props.navigator.push({
      name: 'PostInfo', // Matches route.name
      item: item,
      lat: lat,
      lng: lng
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
      //  console.log("this is the responseJson", responseJson.spaceListing);
       this.setState({
         spinnerState: false,
         dataSource :  responseJson.spaceListing,
       });
      //  console.log("this is the dataSource", this.state.dataSource);
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
  var navigationView = (
      <View style={{flex: 1, backgroundColor: '#25383C'}}>
        <Text style={{margin: 10, fontSize: 50, textAlign: 'center', color: 'white'}}> SPACE </Text>
          <List>
              <ListItem>
                <Button transparent large color='#3498db' onPress={() => {this._navigateSignUp()}}> Create Space </Button>
              </ListItem>
              <ListItem>
                <Button transparent large color='#3498db'onPress={() => {this._navigateMyPosts()}}> My Postings </Button>
              </ListItem>
              <ListItem>
                <Button transparent large color='#3498db' onPress={() => {this._navigateMyCheckedSpace()}}> My Space </Button>
              </ListItem> 
              <ListItem>
                <Button transparent large color='#3498db' onPress={() => {this._navigateSettings()}}> Settings </Button>
              </ListItem> 
          </List>
      </View>
    );
   return (
      <View style={styles.containerToolbar}>
        <DrawerLayoutAndroid
          drawerWidth={200}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          ref = {'DRAWER'}
          renderNavigationView={() => navigationView}>

          <Header style={{backgroundColor: '#e74c3c'}}>
            <Button transparent onPress={() => this.refs['DRAWER'].openDrawer()}>
              <Icon name="navicon" size={20} color="white"/>
            </Button>
            <Title>SPACE</Title>
            <Button transparent onPress={() => {this._navigateMyMapView()}}> Map View </Button>
          </Header>

        
          <List dataArray={this.state.dataSource}
              renderRow={(item) =>
                <ListItem>
                  <Card>
                    <Card backgroundColor='green'>
                      <Text style={{fontSize: 20, color: 'white'}}> {item.address}</Text>
                    </Card>
                    <CardItem button onPress={() => {this._navigatePostInfo(this, item)}}>

                      <Grid>
                        <Col> 
                          <Text style={{fontSize: 20}}>
                            Price: ${item.price}{"\n"} 
                            Type: {item.type}   {"\n"}  
                          </Text>
                        </Col>

                        <Col alignItems='center'>
                            {item.available ? 
                            <Icon name="sign-in" color= 'green' size={50}/> :
                            <Icon name="car" color='#e74c3c' size= {50}/> }
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


const styles = StyleSheet.create({
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
