import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import { Container, Content, Thumbnail, Button, Icon, Header, Title, List, ListItem, Footer, FooterTab } from 'native-base';

const Dimensions = require('Dimensions');
const TimerMixin =  require('react-timer-mixin');

var firebase = require ('firebase');

export default class MyPosts extends Component {

  constructor(props) {
    super(props);

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        arrOfData : [],
        objOfData : {}
      };
    }

  mixins: [TimerMixin]

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
    _navigateEditPost(self, item){
    console.log(item)
    self.props.navigator.push({
      name: 'EditPost', // Matches route.name
      item: item
    })
  }

  _navigateBack(){
    this.props.navigator.pop()
  }

  getTestData() {
    var currentUser = firebase.auth().currentUser;
    var myState = this.state;
    var self = this;
    var myStateArr = this.state.arrOfData;
    var myStateObj = this.state.objOfData;
    // var objWithData = {};
    // var myArrWithData = [];
    //alert(currentUser.email);
    if (currentUser) {
      firebase.database().ref('/users/' + currentUser.uid + "/listing/").once('value').then(function(snapshot) {
        //console.log(snapshot);
        snapshot.forEach(function(childSnapshot){
          console.log("the id of posts is: "+ childSnapshot.key);
          firebase.database().ref('/listings/' + childSnapshot.key).once('value').then(function(postSnapshot){
            var postKey = postSnapshot.key;
            var postData = postSnapshot.val();
            console.log("the rides posted are " + postKey);
            console.log("post and data "+ JSON.stringify (postData));
            myStateArr.push({postKey : postData});
            myStateObj[postKey] = postData;
          });
        });
      });
    }
    console.log("myArrWithData " + JSON.stringify(myStateObj));
    this.setState({
      dataSource : myStateObj
    })
  }


  componentDidMount(){
    this.getTestData();
    this.timer = setInterval( () => {
      this.getTestData();
    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }


 render() {
   return (
      <Container style={{backgroundColor: 'white'}}>
      <Header style={{backgroundColor: '#e74c3c'}}>
        <Button transparent onPress={() => this. _navigateBack()}>
          <Icon name='ios-arrow-back' />
        </Button>
        <Title>My Posts</Title>
      </Header>

      <Content>
        <List dataArray={this.state.dataSource}
            renderRow={(item) =>
              <ListItem button onPress={() => {this._navigateEditPost(this, item)}}>
              <Text> My price is {item.price}, for a {item.type}. {"\n"}It is at {item.address} </Text>
              </ListItem>
              }>
        </List>
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
