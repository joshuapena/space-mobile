import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, List, ListItem, Footer, FooterTab, Icon } from 'native-base';


export default class EditPost extends Component {
  constructor (props) {
      super (props);
      this.state = {text : 'this text will be updated by typing'};
  }

  _navigateBack(){
  this.props.navigator.pop();
  console.log(this.props.route)
}



  render() {
      return (
          <Container style={{backgroundColor: 'white'}}>
          <Header style={{backgroundColor: '#e74c3c'}}>
            <Button transparent onPress={() => this._navigateBack()}>
                <Icon name='ios-arrow-back' />
            </Button>
            <Title>{this.props.route.item.address}</Title>
          </Header> 
            <Content>
           <Button small danger>Delete this post</Button>
            </Content>
          </Container>
      )
  }
}
