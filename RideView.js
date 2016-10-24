import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, Modal, TouchableHighlight, Slider, Picker, TextInput, View, Image} from 'react-native';

import Button from 'react-native-button' ;
var firebase = require ('firebase');

export default class RideView extends Component {
  constructor(props){
    super(props);
    this.state = {text : 'this text will be updated by typing', type : 'Garage', price : 1};
  }

  _navigateBack(){
  this.props.navigator.pop();
}
  _handlePress() {
    console.log('Pressed!');

    let myPrice=this.state.price;
    let myAddress=this.state.address;
    let myType=this.state.type;

    console.log("my price",myPrice);
    console.log("address",myAddress);
    console.log("type", myType);

    var myJson = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: myPrice,
        address: myAddress,
        type : myType

      })
    }


    if (myType != null && myAddress != null && myType != null){ //Checks if no fields empty
      this.getTestData();
      this.postTestData(myJson);
    }
  }

  getTestData() {
   return fetch('https://space-ucsc.herokuapp.com/test',)
     .then((response) => response.json())
     .then((responseJson) => {
       console.log("GET /test : ", responseJson.code)
       return responseJson.code;
     })
     .catch((error) => {
       console.error(error);
     });
 }

 postTestData(myJson) {
  return fetch('https://space-ucsc.herokuapp.com/createSpace', myJson)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("this is the code after POST", responseJson.code);
      if(responseJson.code == 200){
        this.props.navigator.pop();
      }
      console.log("message ", responseJson.message);
      console.log("uid: ", responseJson.theUniqueKey);
      var currentUser = firebase.auth().currentUser;
      var updateObj = {};
      updateObj[responseJson.theUniqueKey] = true;
      alert(currentUser.email);
      firebase.database().ref ('users/' + currentUser.uid +'/listing').update(updateObj);

      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
 }

  render(){
    return(
      <View>

        <Text style={styles.welcome}>
          What type of space?
        </Text>
        <Text style={styles.options}>Type:</Text>

        <Picker style={styles.picker}
          selectedValue={this.state.type}
          onValueChange={(type) => this.setState({type: type})}>
          <Picker.Item label="Garage" value="Garage" />
          <Picker.Item label="Driveway" value="Driveway" />
        </Picker>

        <Text style={styles.options}>Price:</Text>
        <Text style={styles.text} >
          ${this.state.price && +this.state.price.toFixed(3)}/hr
        </Text>
        <Slider
          {...this.props}
          style={styles.slider}
          step={1}
          minimumValue={1}
          maximumValue={20}
          onValueChange={(value) => this.setState({price: value})}/>

        <TextInput style={styles.options}
          placeholder = "address"
          onChangeText={(address) => this.setState({address})}
          value = {this.state.address}/>

        <Button style={styles.options}
          onPress={() => { this._handlePress()}}>
          Submit to Node baby
        </Button>

        <Button style={styles.options}
          onPress={() => { this._navigateBack()}}>
          Cancel
        </Button>

        <View style={styles.container} >
        </View>
      </View>
    )
  }
}
