import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TouchableHighlight, Slider, Picker, TextInput, View, Image} from 'react-native';
import {Container, Content, Button, Thumbnail, Header, Icon, Title, List, ListItem, Footer, FooterTab } from 'native-base';

var firebase = require ('firebase');

export default class Hostspace extends Component {
  constructor(props){
    super(props);
    this.state = {text : 'this text will be updated by typing',
    type : 'Garage',
    price : 1,
    hideButton: false
  };
  }

  _navigateBack(){
  this.props.navigator.pop();
}


enableButton(){
  console.log("edit text");
  let myPrice=this.state.price;
  let myAddress=this.state.address;
  let myType=this.state.type;
  let myCity = this.state.city;
  let myState = this.state.state;
  //let mLat = this.state.lat;
  //let mLong = this.state.long;
  let myUsername = "";
  if (myType && myAddress && myPrice && myCity && myState){ //Checks if no fields empty
    this.setState({fieldsEmpty : false});
  } else{
    this.setState({fieldsEmpty : true});
  }
}


  _handlePress() {
    var self = this;
    this.setState({hideButton : true});
    var self = this;
    console.log('Pressed!');

    let myPrice=this.state.price;
    let myAddress=this.state.address;
    let myType=this.state.type;
    let myCity = this.state.city;
    let myState = this.state.state;
    //let mLat = this.state.lat;
    //let mLong = this.state.long;
    let myUsername = "";

    let currentUser = firebase.auth().currentUser;
    let updateObj = {};

    // to get username
    var ref = firebase.database().ref("users/" + currentUser.uid+ "/username");
    ref.once("value")
    .then(function(snapshot) {
      var key = snapshot.val(); // "ada"
      myUsername = key;
      // console.log("this is a key", key);

      var myJson = {
        price: myPrice,
        address: myAddress,
        city: myCity,
        state: myState,
        type : myType,
        poster: myUsername,
        available : true
      }

      var regex = new RegExp ('\\s+', 'g');
      var googleAddress = myAddress.replace (regex, "+") + ',+' + myCity.replace (regex, '+') + ',+' + myState;
      var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + googleAddress + '&key=AIzaSyB57uuwSaQA6dFY65Xj8tRAmubfAa27hYg';
      console.log (googleURL);
      /////////////////////////
      fetch (googleURL).then (function (response) {
        if (response.status !== 200) {
          alert ('error with fetch call, code : ' + response.status);
          return;
        }
        response.json().then (function (data) {
          if (data.status == 'OK') {
            if (data.results[0].geometry.location_type != 'ROOFTOP') {
              alert ('Invalid Address -- somewhat bogus address');
            } else {
              if (myType && myAddress && myPrice && myCity && myState) { //Checks if no fields empty
                console.log(myJson.body);
                self.postTestData(myJson, data);
              } else {
                console.log("not saved to node");
                self.setState({hideButton : false});
              }
            }
          } else {
            alert ('Invalid Address -- completely bogus address');
          }

        })
      }).catch (function (err) {
        console.log ('fetch error');
      });
      /////////////////////////
    });
  }

  /*
    getPostLocation() {
    var address = this.props.route.item.address;
    var city = this.props.route.item.city;
    var state = this.props.route.item.state;
    var regex = new RegExp ('\\s+', 'g');
    var googleAddress = address.replace (regex, "+") + ',+' + city.replace (regex, '+') + ',+' + state;
    var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + googleAddress + '&key=AIzaSyB57uuwSaQA6dFY65Xj8tRAmubfAa27hYg';
    console.log (googleURL);
    fetch (googleURL).then (function (response) {
      if (response.status !== 200) {
        console.log ('error with fetch call, code : ' + response.status);
        return;
      }
      response.json().then (function (data) {
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
      })
    }).catch (function (err) {
      console.log ('fetch error');
    });
  }
  */
  postTestData(myPost, locationData) {
    var self = this;
    console.log("posting data");
    var currentUser = firebase.auth().currentUser;
    var newPost = firebase.database().ref ('listings/').push(myPost,
    function(){
      console.log("posted this", newPost.key);
      var updateObj = {};
      updateObj[newPost.key] = true;
      firebase.database().ref ('users/' + currentUser.uid +'/listing').update(updateObj);
      var lat_ = locationData.results[0].geometry.location.lat;
      var lng_ = locationData.results[0].geometry.location.lng;
      firebase.database().ref ('listings/' + newPost.key).update({lat : lat_, lng : lng_});
      firebase.database().ref ('listings/' + newPost.key).update({uid : newPost.key}, function (){
        self._navigateBack();
      });
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
                  onChangeText={(address) => {
                    this.setState({address});
                    }
                  }
                  value = {this.state.address}/>

                <TextInput style={styles.options}
                  placeholder = "City"
                  onChangeText={(city) => {
                    this.setState({city})
                }}
                  value = {this.state.city}/>

                <TextInput style={styles.options}
                  placeholder = "State"
                  onChangeText={(state) =>
                    {this.setState({state: state})
                  }}
                    value = {this.state.state}/>

                <Button  style={styles.options}
                  onPress={() => { this._handlePress(); }}>

                  Submit New Space
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
