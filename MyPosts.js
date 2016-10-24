import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';

import Button from 'react-native-button' ;
const Dimensions = require('Dimensions');

var firebase = require ('firebase');

import Icon from 'react-native-vector-icons/FontAwesome';
const myIcon = (<Icon name="rocket" size={30} color="#900" />);
const xIcon = (<Icon name="times" size={30} color="#100" />);
const windowDims = Dimensions.get('window');

const customTextButton = (
  <Icon.Button name="facebook" backgroundColor="#3b5998">
    <Text style={{fontFamily: 'Arial', fontSize: 15}}>Login with Facebook</Text>
  </Icon.Button>
);

export default class MyPosts extends Component {

  constructor(props) {
    super(props);

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        arrOfData : []
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

  getTestData() {
    var currentUser = firebase.auth().currentUser;
    //var arrOfData = [];
    //alert(currentUser.email);
      firebase.database().ref('/users/' + currentUser.uid + "/listing/").once('value').then(function(snapshot) {
        //console.log(snapshot);
        snapshot.forEach(function(childSnapshot){
          console.log("the user id is: "+ childSnapshot.key);
          firebase.database().ref('/listings/' + childSnapshot.key).once('value').then(function(postSnapshot){
            console.log("the rides posted are " + postSnapshot.key);
            console.log("post and data "+ JSON.stringify (postSnapshot.val()));

            this.setState({
              arrOfData : this.state.arrOfData.push(postSnapshot.val())
            });

            // this.setState({
            //   myFbData : this.state.dataSource.cloneWithRows(responseJson.spaceListing)
            // });
          });
        });
      });
      console.log("this is array of data " + this.state.arrOfData);
      // this.setState({
      //   dataSource : this.state.dataSource.cloneWithRows(this.state.arrOfData)
      // });
      console.log("dataSource was updated");
    }

  //  fetch('https://space-ucsc.herokuapp.com/viewList')
  //    .then((response) => response.json())
  //    .then((responseJson) => {
  //      console.log("GET /test : ", responseJson.code);
  //      this.setState({
  //        dataSource : this.state.dataSource.cloneWithRows(responseJson.spaceListing)
  //      });
   //
  //      responseJson.code;
  //    })
  //    .catch((error) => {
  //      console.error(error);
  //    });


  componentDidMount(){
    this.getTestData();
    setInterval( () => {
      this.getTestData();
    }, 3000)
  }

 render() {
   return (
     <View >
      <Text> List of Spaces</Text>
       <ListView
         enableEmptySections={true} // this line mutes a warning message that applys to
         //cloneWithRowsAndSections, however, we use cloneWithRows so it is irrelevant to us
         dataSource={this.state.dataSource}
         renderRow={(rowData) => <Text> {xIcon}My price is {rowData.price}, for a {rowData.type}. {"\n"}It is at {rowData.address} </Text>}/>
         <Button onPress={() => {this._navigateSignUp()}}> Create New Space</Button>
         <Button onPress={() => {this._navigateSettings()}}> User Settings</Button>
     </View>
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
