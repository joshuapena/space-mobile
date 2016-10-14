import React, {Component} from 'react';
import {Navigator, ListView, StyleSheet, Text, TextInput, View, Image} from 'react-native';

import Button from 'react-native-button' ;

import Icon from 'react-native-vector-icons/FontAwesome';
const myIcon = (<Icon name="rocket" size={30} color="#900" />);
const xIcon = (<Icon name="times" size={30} color="#100" />);


const customTextButton = (
  <Icon.Button name="facebook" backgroundColor="#3b5998">
    <Text style={{fontFamily: 'Arial', fontSize: 15}}>Login with Facebook</Text>
  </Icon.Button>
);

export default class MyListView extends Component {

  // myArr = [
  //   'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
  // ];
  constructor(props) {
    super(props);

    var myJsonArr = [
      {'price' : 'raul', 'type' : '3'},
      {'price' : 'tyler', 'type' : '21'},
      {'price' : 'joshua', 'type' : '12'},
      {'price' : 'david', 'type' : '42'},
      {'price' : 'Matt', 'type' : '34'},
      {'price' : 'colin', 'type' : '1'}
    ];
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows(myJsonArr),
      };
    }

  _handlePress() {
    console.log('Pressed! Triggered async call');
    var coolArray  = [
      {'price' : 'bob', 'type' : '3'},
      {'price' : 'billy', 'type' : '21'},
      {'price' : 'kevin', 'type' : '12'},
       {'price' : 'jacob', 'type' : '42'},
       {'price' : 'Matt', 'type' : '34'},
       {'price' : 'andrew', 'type' : '1'}
      ];
    // this.setState({
    //   dataSource : this.state.dataSource.cloneWithRows(coolArray)
    // })

    let myPrice=this.state.price;
    let myAddress=this.state.address;
    let myType=this.state.type;

    console.log("my price",myPrice);
    console.log("address",myAddress);
    console.log("type", myType);
    this.getTestData();

  }

  getTestData() {
   return fetch('https://space-ucsc.herokuapp.com/viewList',)
     .then((response) => response.json())
     .then((responseJson) => {
       console.log("GET /test : ", responseJson.code);
       this.setState({
         dataSource : this.state.dataSource.cloneWithRows(responseJson.spaceListing)
       });

       return responseJson.code;
     })
     .catch((error) => {
       console.error(error);
     });
 }

 render() {
   return (
     <View style={{paddingTop: 22}}>
       <ListView
         dataSource={this.state.dataSource}
         renderRow={(rowData) => <Text> {xIcon}My price is {rowData.price}, for a {rowData.type}.  </Text>}
       />
       <Icon name="rocket" size={20} color="#900" />
       {myIcon}

       <Icon.Button name="cloud-download" backgroundColor="#3b5998" onPress={ () => this._handlePress() }>
         Download data from heroku server
       </Icon.Button>

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
