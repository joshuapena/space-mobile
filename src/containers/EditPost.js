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
  //when this.state is updated, the app will render again
  constructor (props) {
      super (props);
      this.state = {
        postId: "",
        thisPost: ""
    };
  }

//this is the code to delete the post from the app and the database when the button is pressed.
deleteButtonPressed(){
  var self = this;
  var currentUser = firebase.auth().currentUser;
  var updateObj = {};
  firebase.database().ref ('users/' + currentUser.uid +'/listing/'+self.state.postId).remove();
  // this deletes the post and go back to the MyListView
  firebase.database().ref('/listings/'+self.state.postId).remove(function(){
    self.props.navigator.replacePreviousAndPop({name: 'MyListView',})
  });
}

//navigate back 
_navigateBack(){
  this.props.navigator.pop();
}

componentDidMount(){

  var mykey = Object.keys(this.props.route.item)[0]
  var myValues = Object.values(this.props.route.item)[0]
    
  //when this.state is updated, the app will render again
  this.setState({
    postId: mykey,
    thisPost: Object.values(this.props.route.item)[0]
  })
}
// this shows the user's posts and have the option to delete the post when the post is clicked on
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
              <Button small danger style={{ backgroundColor: theme.delButton }}
                onPress={()=>{this.deleteButtonPressed()}}
               >Delete this post
               </Button>
            </Content>
          </Container>
      )
  }
}
