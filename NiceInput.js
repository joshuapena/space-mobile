import React, {Component} from 'react';
import {TextInput, View, Image} from 'react-native';

import Button from 'react-native-button' ;



export default class NiceInput extends Component {
  constructor(props){
    super(props);
    this.state = { text : 'this text will be updated by typing'}
  }

  _handlePress() {
    console.log('Pressed!');

    let myUserName=this.state.username;
    let myPassword=this.state.password;

    console.log(myUserName);
    console.log(myPassword);

    var myJson = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: myUserName,
        password: myPassword,
      })
    }

    if (myUserName != null || myPassword != null){
      this.getTestData();
      this.postTestData(myJson);
    }
  }



   getTestData() {
    return fetch('https://space-ucsc.herokuapp.com/test',)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.code)
        return responseJson.code;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  postTestData(myJson) {
   return fetch('https://space-ucsc.herokuapp.com/login', myJson)
     .then((response) => response.json())
     .then((responseJson) => {
       console.log("this is the code", responseJson.code);
       console.log("message ", responseJson.message);
       return responseJson.code;
     })
     .catch((error) => {
       console.error(error);
     });
  }

  render(){
    return(
      <View>
        <TextInput
          placeholder = "email"
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}/>
        <TextInput
          placeholder = "password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />



        <Button onPress={() => { this._handlePress()}}>
        Press me
        </Button>

        <Image
          style={{width: 50, height: 50}}
          source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
        />
      </View>
    )
  }
}
