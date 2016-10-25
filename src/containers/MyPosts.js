import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';

import Button from 'react-native-button' ;
const Dimensions = require('Dimensions');

const TimerMixin =  require('react-timer-mixin');

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
      //console.log("this is array of data " + this.state.arrOfData);
      // this.setState({
      //   dataSource : this.state.dataSource.cloneWithRows(this.state.arrOfData)
      // });
      //console.log("dataSource was updated");
    }
    //  console.log("myArrWithData " + myStateArr.toString());
    console.log("myArrWithData " + JSON.stringify(myStateObj));
    this.setState({
      dataSource : this.state.dataSource.cloneWithRows(myStateObj)
    })
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
    this.timer = setInterval( () => {
      this.getTestData();
    }, 3000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

 render() {
   return (
     <View style={styles.container}>
      <Text> List of Spaces</Text>
       <ListView
         enableEmptySections={true} // this line mutes a warning message that applys to
         //cloneWithRowsAndSections, however, we use cloneWithRows so it is irrelevant to us
         dataSource={this.state.dataSource}
         renderRow={(rowData) => <Text> {xIcon}My price is {rowData.price}, for a {rowData.type}. {"\n"}It is at {rowData.address} </Text>}
         />
         <Button onPress={() => {this._navigateBack()}}> Cancel </Button>
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
