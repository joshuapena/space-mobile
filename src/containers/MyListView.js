/*
View a list of all publicly viewable rides
*/


import React, {Component} from 'react';

import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, List, ListItem, Footer, FooterTab } from 'native-base';

const TimerMixin =  require('react-timer-mixin');
import Icon from 'react-native-vector-icons/FontAwesome';
const xIcon = (<Icon name="times" size={30} color="#100" />);



export default class MyListView extends Component {

  constructor(props) {
    super(props);

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
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
    this.props.navigator.push({
      name: 'MyPosts', // Matches route.name
    })
  }

  _navigatePostInfo(self, item){
    console.log(item)
    self.props.navigator.push({
      name: 'PostInfo', // Matches route.name
      item: item
    })
  }

  getTestData() {
   fetch('https://space-ucsc.herokuapp.com/viewList',)
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log("GET /test : ", responseJson.code);
       //console.log(JSON.stringify(responseJson.spaceListing, null, 3));
       this.setState({
         dataSource : responseJson.spaceListing
       });

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
   return (

      <Container style={{backgroundColor: 'white'}}>
      <Header style={{backgroundColor: '#e74c3c'}}>
        <Button transparent>
          <Icon name='navicon' size={20} color='white'/>
        </Button>
        <Title>SPACE</Title>
      </Header>
        <Content>
          <List dataArray={this.state.dataSource}

              renderRow={(item) =>
                <ListItem button onPress={() => {this._navigatePostInfo(this, item)}}>
                <Text>My price is ${item.price} for a {item.type}. {"\n"}It is at {item.address} </Text>
                </ListItem>

                }>
          </List>
        </Content>

        <View>
          <Button small onPress={() => {this._navigateSignUp()}}> Create New Space</Button>
          <Button small onPress={() => {this._navigateSettings()}}> User Settings</Button>
          <Button small onPress={() => {this._navigateMyPosts()}}> My Postings</Button>
        </View>
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
