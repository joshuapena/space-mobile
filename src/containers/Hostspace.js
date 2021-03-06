/*
This is the framework/page where the user creates a post by inputting the address, state, and price.
*/
import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TouchableHighlight, Slider, Picker, TextInput, View, Image, Alert} from 'react-native';
import {Container, Content, Button, Thumbnail, Header,Spinner, Icon, Title, List, ListItem, Footer, FooterTab } from 'native-base';
import theme from'./Themes';

var firebase = require ('firebase');

export default class Hostspace extends Component {
  constructor(props){
    super(props);
    // default values which will be updated when user inputs
    this.state = {
    type : 'Garage',
    us_state : 'Alabama',
    price : 1,
    hideButton : false,
    fieldsEmpty : true,
  };
  }

  // navigate back to the MyListView
  _navigateBack(){
    this.props.navigator.replacePreviousAndPop ({name : 'MyListView'});
  }


 // checks if the fields are filled
enableButton(){
  let myPrice = this.state.price;
  let myAddress = this.state.address;
  let myType = this.state.type;
  let myCity = this.state.city;
  let myState = this.state.us_state;
  //let mLat = this.state.lat;
  //let mLong = this.state.long;
  let myUsername = "";
  if (myType && myAddress && myPrice && myCity && myState){ //Checks if no fields empty
    this._handlePress();
  } else{
    Alert.alert (
      'Cannot Submit yet',
      'please fill out all fields'
    );
  }
}

  // only gets called when everything is filled in
  _handlePress() {
    this.setState({hideButton : true}); //Set submit to spinner

    var self = this;

    let myPrice=this.state.price;
    let myAddress=this.state.address;
    let myType=this.state.type;
    let myCity = this.state.city;
    let myState = this.state.us_state;
    let myUsername = "";

    let currentUser = firebase.auth().currentUser;
    let myEmail = currentUser.email;

    let updateObj = {};

    // to get username
    var ref = firebase.database().ref("users/" + currentUser.uid+ "/username");
    ref.once("value")
    .then(function(snapshot) {
      var key = snapshot.val(); // "ada"
      myUsername = key;

      //stores the data into firebase
      var myJson = {
        price: myPrice,
        address: myAddress,
        city: 'null',
        us_state: 'null',
        type : myType,
        email: myEmail,
        poster: myUsername,
        available : true
      }

      //gets the address and then convert it to lat in google maps
      // it calls google maps
      var regex = new RegExp ('\\s+', 'g');
      var googleAddress = myAddress.replace (regex, "+") + ',+' + myCity.replace (regex, '+') + ',+' + myState;
      var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + googleAddress + '&key=AIzaSyB57uuwSaQA6dFY65Xj8tRAmubfAa27hYg';
      console.log (googleURL);
      fetch (googleURL).then (function (response) {
        if (response.status !== 200) {
          Alert.alert (
            'error with fetch call',
            'code: '+ response.status
          );
          self.setState({hideButton : false});
          return;
        }
        //makes sure that it is a valid address in the world
        response.json().then (function (data) {
          if (data.status == 'OK') {
            if (data.results[0].geometry.location_type != 'ROOFTOP') {
              Alert.alert (
                'Invalid Address',
                'Please enter a valid address'
              );
              self.setState({hideButton : false});
            } else {

              //everything is good with the address aka valid address
              if (myType && myAddress && myPrice && myCity && myState) { //Checks if no fields empty
                myJson.city = data.results[0].address_components[2].long_name;
                myJson.us_state = data.results[0].address_components[4].long_name;
                self.postData(myJson, data);
              } else {
                self.setState({hideButton : false});
              }
            }
          } else {
            //totally false address
            Alert.alert (
              'Invalid Address',
              'completely bogus address'
            );
            self.setState({hideButton : false});
          }

        })
      }).catch (function (err) {
      });
    });
  }

  // creates the post
  postData(myPost, locationData) {
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
    // this creates the style, color, and post.
    return(
      <Container style={{backgroundColor: theme.backgroundColor}}>
        <Header style={{backgroundColor: theme.brandPrimary}}>
          <Button transparent onPress={() => this. _navigateBack()}>
              <Icon name='ios-arrow-back' />
          </Button>
          <Title>Host A Space</Title>
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

      {/*This provides an option for garage or driveway*/}
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

      {/*This lists out the address*/}
                <TextInput style={styles.options}
                  placeholder = "address"
                  onChangeText={(address) => {
                    this.setState({address});
                    }
                  }
                  value = {this.state.address}/>

      {/*This lists out the city*/}
                <TextInput style={styles.options}
                  placeholder = "City"
                  onChangeText={(city) => {
                    this.setState({city})
                }}
                  value = {this.state.city}/>
      {/*This provides an option to choose the states*/}
                <Text style={styles.options}>State:</Text>
                <Picker style={styles.picker}
                  selectedValue={this.state.us_state}
                  onValueChange={(us_state) => this.setState({us_state: us_state})}>
                  <Picker.Item label="Alabama"        value="Alabama" />
                  <Picker.Item label="Alaska"         value="Alaska" />
                  <Picker.Item label="Arizona"        value="Arizona" />
                  <Picker.Item label="Arkansas"       value="Arkansas" />
                  <Picker.Item label="California"     value="California" />
                  <Picker.Item label="Colorado"       value="Colorado" />
                  <Picker.Item label="Connecticut"    value="Connecticut" />
                  <Picker.Item label="Delaware"       value="Delaware" />
                  <Picker.Item label="Florida"        value="Florida" />
                  <Picker.Item label="Georgia "       value="Georgia " />
                  <Picker.Item label="Hawaii"         value="Hawaii" />
                  <Picker.Item label="Idaho"          value="Idaho" />
                  <Picker.Item label="Illinois"       value="Illinois" />
                  <Picker.Item label="Indiana"        value="Indiana" />
                  <Picker.Item label="Iowa"           value="Iowa" />
                  <Picker.Item label="Kansas"         value="Kansas" />
                  <Picker.Item label="Kentucky"       value="Kentucky" />
                  <Picker.Item label="Louisiana"      value="Louisiana" />
                  <Picker.Item label="Maine"          value="Maine" />
                  <Picker.Item label="Maryland"       value="Maryland" />
                  <Picker.Item label="Massachusetts"  value="Massachusetts" />
                  <Picker.Item label="Michigan"       value="Michigan" />
                  <Picker.Item label="Minnesota "     value="Minnesota " />
                  <Picker.Item label="Mississippi "   value="Mississippi " />
                  <Picker.Item label="Missouri"       value="Missouri" />
                  <Picker.Item label="Montana"        value="Montana" />
                  <Picker.Item label="Nebraska"       value="Nebraska" />
                  <Picker.Item label="Nevada"         value="Nevada" />
                  <Picker.Item label="New Hampshire"  value="New Hampshire" />
                  <Picker.Item label="New Jersey"     value="New Jersey" />
                  <Picker.Item label="New Mexico"     value="New Mexico" />
                  <Picker.Item label="New York"       value="New York" />
                  <Picker.Item label="North Carolina" value="North Carolina" />
                  <Picker.Item label="North Dakota"   value="North Dakota" />
                  <Picker.Item label="Ohio"           value="Ohio" />
                  <Picker.Item label="Oklahoma"       value="Oklahoma" />
                  <Picker.Item label="Oregon"         value="Oregon" />
                  <Picker.Item label="Pennsylvania"   value="Pennsylvania" />
                  <Picker.Item label="Rhode Island"   value="Rhode Island" />
                  <Picker.Item label="South Carolina" value="South Carolina" />
                  <Picker.Item label="South Dakota"   value="South Dakota" />
                  <Picker.Item label="Tennessee"      value="Tennessee" />
                  <Picker.Item label="Texas"          value="Texas" />
                  <Picker.Item label="Utah"           value="Utah" />
                  <Picker.Item label="Vermont"        value="Vermont" />
                  <Picker.Item label="Virginia"       value="Virginia" />
                  <Picker.Item label="Washington"     value="Washington" />
                  <Picker.Item label="West Virginia"  value="West Virginia" />
                  <Picker.Item label="Wisconsin"      value="Wisconsin" />
                  <Picker.Item label="Wyoming"        value="Wyoming" />
                </Picker>

            {/*This allows to submit the post with the price, address, and state*/}
                  {this.state.hideButton ?
                     <Spinner color={theme.hostSpinner}/> :
                     <Button large block style={{ backgroundColor: theme.submitButton }}
                       onPress={() => {this.enableButton(); }}> Submit New Space </Button>}

              </View>
          </Content>
      </Container>
    )
  }
}

// styles
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
