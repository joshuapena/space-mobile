/*
List of all the rides you have posted
Can navigate to EditPost to Delete
Can navigate back to MyListViews
*/

import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Icon, Grid, Col, Row, Header, Spinner, Title, List, ListItem, Footer, FooterTab} from 'native-base';
import theme from'./Themes';

var renderIf = require('render-if');


const Dimensions = require('Dimensions');
const TimerMixin =  require('react-timer-mixin');

var firebase = require ('firebase');

export default class MyPosts extends Component {

  constructor(props) {
    super(props);

//defines/shows the initial state of the page 'MyPosts' 
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        spinnerState: true,
        dataSource: {},
        dataArray : [],
        dataExists : true
      };
    }

// this shows the spinner
  mixins: [TimerMixin]

//this navigate to the Hostspace when called
  _navigateHostspace(){
    this.props.navigator.push({
      name: 'Hostspace', // Matches route.name
    })
  }

//this navigate to settings when called upon
  _navigateSettings(){
    this.props.navigator.push({
      name: 'Settings', // Matches route.name
    })
  }

//this navigate to 'EditPost' when called to edit the post
  _navigateEditPost(self, item){
    console.log(item)
    self.props.navigator.push({
      name: 'EditPost', // Matches route.name
      item: item,

    })
  }

//navigate back to 'MyListView' when called
  _navigateBack(){
    this.props.navigator.replacePreviousAndPop ({name : 'MyListView'});
  }

  getData() {
    var currentUser = firebase.auth().currentUser;
    var myState = this.state;
    var self = this;
    var myStateObj = this.state.dataSource;
    var myStateArr = [];

//load the posts and listings for the current user.
    if (currentUser) {
      firebase.database().ref('/users/' + currentUser.uid + "/listing/").once('value').then(function(snapshot) {

        if(!snapshot.val()){
          console.log("no data");
          self.setState({
            dataExists: false,
            spinnerState: false
          });
        }
        snapshot.forEach(function(childSnapshot){
          console.log("the id of posts is: "+ childSnapshot.key);
          firebase.database().ref('/listings/' + childSnapshot.key).once('value').then(function(postSnapshot){
            var postKey = postSnapshot.key;
            var postData = postSnapshot.val();
            
            myStateObj[postKey] = postData;
            var obj = {[postKey] : postData}
            myStateArr.push(obj);


            self.setState({spinnerState: false});

            console.log("myArrWithData " + JSON.stringify(myStateArr));
            self.setState({
              dataSource : myStateObj,
              dataArray: myStateArr
            });

          });

        });
      });
    }
  }

  componentDidMount(){
    this.getData();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  //list data takes in an array of Posts
  //each post has a uid as the key, and an object of fields as a values
  //item is returned by list. represents an index of the array (aka one post)
 render() {
   return (
      <Container style={{backgroundColor: theme.backgroundColor}}>
      <Header style={{backgroundColor: theme.brandPrimary}}>
        <Button transparent onPress={() => this. _navigateBack()}>
          <Icon name='ios-arrow-back' />
        </Button>
        <Title>My Posts</Title>
      </Header>

      <Content theme={theme}>
      {renderIf(this.state.spinnerState)(
        <Spinner color={theme.postSpinner} />
      )}

{/*This screen will appear when there is no data of the user posts*/}
      {renderIf(!this.state.dataExists)(
        <Grid>
          <Col alignItems='center'>
            <Icon name='ios-help-circle-outline' style={{fontSize: 200, color: theme.brandPrimary}}/>
            <Text>Looks like you don't have any postings.</Text>
            <Text>Want to Create a Space?</Text> 
            <Button large block transparent color= {theme.checkSpace} onPress={() => {this._navigateHostspace()}}>
             Create a Space </Button>
          </Col>
        </Grid>
      )}
{/*This screen appears when there is a post and it will list it out*/}

        <List dataArray={this.state.dataArray}
            renderRow={(item) =>
              <ListItem button onPress={() => {this._navigateEditPost(this, item)}}>
              <Text>My price is {Object.values(item)[0].price}, for a {Object.values(item)[0].type}. {"\n"}It is at {Object.values(item)[0].address} </Text>
              </ListItem>
              }>
        </List>
  </Content>
    </Container>
   );
 }
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    marginTop: 100,
  },
});
