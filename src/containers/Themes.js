/*
This is a page to declare variables for colors in the app.
*/

import Color from 'color';

import {Platform} from 'react-native';

var mainColor = '#3498db';

export default {


	//color variables 
	
	//primary color
	brandPrimary: mainColor,
	backgroundColor: 'white',
	
	//MylistView.js
	//sidebar icon
	sIconColor: mainColor,
	//sidebar button
	sButtonColor: mainColor,
	//toolbar icon color
	tIconColor: 'white',
	//checkin icon color
	checkInButton: mainColor,
	//checkout icon color
	checkOutButton: '#d35400',
	//listView Text color
	checkText: 'white',
	//nav background color
	navColor: '#25383C',

	//Editpost.js
	//delete button color
	delButton: '#d35400',

	//Hostspace.js
	submitButton: mainColor,
	hostSpinner:  mainColor,
	//Login.js

	//MyCheckedSpace.js
	helpIcon: mainColor,

	//MyPosts.js
	checkSpace: mainColor,
	postSpinner: mainColor,

	//SpaceBootup.js
	bootColor: '#ecf0f1',
	rocketColor: mainColor,
	bootSpinner: mainColor
}