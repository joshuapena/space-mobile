/*
Only poster of ride can see this page
Delete and edit ride from this page

*/

import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, List, ListItem, Footer, FooterTab, Icon } from 'native-base';
import theme from'./Themes';

var firebase = require ('firebase');

export default class EditPost extends Component {
  constructor (props) {
      super (props);
      this.state = {
        text : 'this text will be updated by typing',
        postId: "",
        thisPost: ""
    };
  }


deleteButtonPressed(){
  var self = this;
  var currentUser = firebase.auth().currentUser;
  var updateObj = {};
  firebase.database().ref ('users/' + currentUser.uid +'/listing/'+self.state.postId).remove();
  firebase.database().ref('/listings/'+self.state.postId).remove(function(){
    self.props.navigator.pop();
  });
}


_navigateBack(){
  this.props.navigator.pop();
}

componentDidMount(){

  var mykey = Object.keys(this.props.route.item)[0]
  var myValues = Object.values(this.props.route.item)[0]
  console.log(mykey);
  console.log(myValues);
  console.log(this.props.route.item[mykey]);
  this.setState({
    postId: mykey,
    thisPost: Object.values(this.props.route.item)[0]
  })
}

  render() {
      return (
          <Container style={{backgroundColor: theme.backgroundColor}}>
            <Header style={{backgroundColor: theme.brandPrimary}}>
              <Button transparent onPress={() => this._navigateBack()}>
                  <Icon name='ios-arrow-back' />
              </Button>
              <Title>{this.state.thisPost.address}</Title>
            </Header>
            <Content>
              <Text>{this.state.postId}</Text>
              <Button small danger style={{ backgroundColor: theme.delButton }}
                onPress={()=>{this.deleteButtonPressed()}}
               >Delete this post
               </Button>
            </Content>
          </Container>
      )
  }
}
