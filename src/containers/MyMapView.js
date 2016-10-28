import MapView from 'react-native-maps';
import React, {Component} from 'react';
import {Navigator, StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Container, Content, Thumbnail, Button, Header, Title, Icon, List, ListItem} from 'native-base';

export default class MyMapView extends Component {

	_navigateBack(){
      this.props.navigator.pop()
    }

  _navigateListView(){
    this.props.navigator.push({
      name: 'MyListView', // Matches route.name
    })
  }


	render(){
		return (
      <Container style={{backgroundColor: 'white'}}>
        <Header style={{backgroundColor: '#e74c3c'}}>
          <Button transparent onPress={() => this. _navigateBack()}>
              <Icon name='ios-arrow-back' />
          </Button>
        <Title>Map</Title>
      </Header>
        <Content>
      <MapView 
         initialRegion={{
           latitude: 37.78825,
           longitude: -122.4324,
           latitudeDelta: 0.0922,
           longitudeDelta: 0.0421,
         }}
         style = {{height: 200, margin: 1}}
          />
        </Content>
    </Container>
			)
	}
}