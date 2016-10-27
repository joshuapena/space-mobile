import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TouchableHighlight, Slider, Picker, TextInput, View, Image} from 'react-native';
import {Container, Content, Button, Thumbnail, Header, Icon, Title, List, ListItem, Footer, FooterTab } from 'native-base';

var firebase = require ('firebase');

export default class Hostspace extends Component {
  constructor(props){
    super(props);
    this.state = {text : 'this text will be updated by typing', type : 'Garage', price : 1};
  }

  _navigateBack(){
  this.props.navigator.pop();
}
  _handlePress() {
    var self = this;
    console.log('Pressed!');

    let myPrice=this.state.price;
    let myAddress=this.state.address;
    let myType=this.state.type;
    let myUsername = "";

    console.log("my price",myPrice);
    console.log("address",myAddress);
    console.log("type", myType);

    let currentUser = firebase.auth().currentUser;
    let updateObj = {};

    var ref = firebase.database().ref("users/" + currentUser.uid+ "/username");
    ref.once("value")
    .then(function(snapshot) {
      var key = snapshot.val(); // "ada"
      myUsername = key;
      console.log("this is a key", key);



      var myJson = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: myPrice,
          address: myAddress,
          type : myType,
          poster: myUsername,
        })
      }
      if (myType != null && myAddress != null && myType != null){ //Checks if no fields empty
        console.log(myJson.body);
        self.postTestData(myJson);
      }
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
      // alert(currentUser.email);
      firebase.database().ref ('users/' + currentUser.uid +'/listing').update(updateObj);

      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
 }


  render(){
    return(
      <Container style={{backgroundColor: 'white'}}>
        <Header style={{backgroundColor: '#e74c3c'}}>
          <Button transparent onPress={() => this. _navigateBack()}>
              <Icon name='ios-arrow-back' />
          </Button>
          <Title>Host a space</Title>
        </Header>
          <Content>
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

                <TextInput style={styles.options}
                  placeholder = "City"
                  onChangeText={(city) => this.setState({city})}
                  value = {this.state.city}/>

                <TextInput style={styles.options}
                  placeholder = "State"
                  onChangeText={(state) => this.setState({state})}
                    value = {this.state.state}/>

                  <TextInput style={styles.options}
                    placeholder = "zip"
                    keyboardType="numeric"
                    onChangeText={(zip) => this.setState({zip})}
                    value = {this.state.zip}/>

                <Button style={styles.options}
                  onPress={() => { this._handlePress(); {this.props.myPropFunction}}}>
                  Submit to Node baby
                </Button>

              </View>
          </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    marginRight: 100,
    marginLeft: 100,
  },
  slider: {
    marginLeft: 15,
    marginRight:15,
  },
  options: {
    marginTop: 20,
    marginLeft: 20,
    marginRight:20,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 25,
  },
});
