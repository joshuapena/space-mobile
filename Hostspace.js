import React, {Component} from 'react';

import {Navigator, StyleSheet, Text, Modal, TouchableHighlight, Slider, Picker, TextInput, View, Image} from 'react-native';


import Button from 'react-native-button' ;

export default class Hostspace extends Component {
  constructor(props){
    super(props);
    this.state = {text : 'this text will be updated by typing',
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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

    if (myType != null && myAddress != null && myType != null){
      this.postTestData(myJson);
      myPrice="";
      myAddress="";
      myType="";
    } else{
      this.setModalVisible(true);
      return;
    }
  }


 postTestData(myJson) {
  return fetch('https://space-ucsc.herokuapp.com/createSpace', myJson)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("this is the code after POST", responseJson.code);
      console.log("message ", responseJson.message);
      return responseJson.code;
    })
    .catch((error) => {
      console.error(error);
    });
 }

  render(){
    return(
      <View >
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <Text>Errors in Form! Fill out all the fields</Text>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(false)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>
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

      </View>
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
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    marginTop: 50,
    marginBottom: 25,
  },
});
