/*
List of all the rides you have posted
Can navigate to EditPost to Delete
Can navigate back to MyListViews
*/

import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Grid, Card, CardItem, Col, Row, Header, Spinner, Title, List, ListItem, Footer, FooterTab} from 'native-base';
import theme from'./Themes';

var renderIf = require('render-if');

import IconFont from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

const Dimensions = require('Dimensions');
const TimerMixin =  require('react-timer-mixin');

// firebase database
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
          <Icon name='ios-arrow-back' style={{fontSize: 30, color: 'white'}}/>
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
            <Text>Looks like you dont have any postings.</Text>
            <Text>Want to Create a Space?</Text> 
            <Button large block transparent color= {theme.checkSpace} onPress={() => {this._navigateHostspace()}}>
             Create a Space </Button>
          </Col>
        </Grid>
      )}
{/*This screen appears when there is a post and it will list it out*/}
          <List dataArray={this.state.dataArray}
              renderRow={(item) =>
                <ListItem style={{margin: 10}}>
                  <Card>
                    {Object.values(item)[0].available ?
                      <Card backgroundColor= {theme.brandPrimary}>
                      <Text style={{fontSize: 20, color: 'white'}}> {Object.values(item)[0].address}</Text>
                      </Card> :
                      <Card backgroundColor= {theme.checkOutButton}>
                      <Text style={{fontSize: 20, color: 'white'}}> {Object.values(item)[0].address}</Text>
                      </Card>}
                    <CardItem button onPress={() => {this._navigateEditPost(this, item)}}>

      {/*This shows the price, type, and if the item is available.*/}
                      <Grid style={{margin: 10}}>
                        <Col>
                          <Text style={{fontSize: 20}}>
                            Price: ${Object.values(item)[0].price}{"\n"}
                            Type: {Object.values(item)[0].type}   {"\n"}
                            Status: {Object.values(item)[0].available ?
                              <Text>Open</Text> :
                              <Text>Occupied</Text>}
                          </Text>
                        </Col>
      {/*This shows the check-in button*/}
                        <Col alignItems='center'>
                            {Object.values(item)[0].available ?
                            <IconFont name="sign-in" color= {theme.brandPrimary} size={50}/> :
                            <IconFont name="car" color={theme.checkOutButton} size= {50}/> }
                        </Col>
                      </Grid>
                    </CardItem>
                  </Card>
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
  containerListView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
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
