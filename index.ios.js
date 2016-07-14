/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  Text,
  View,
  StyleSheet
} from 'react-native';

import SwipeCarousel from './Components/SwipeCarousel';

class Swipe extends Component {

    constructor(props){
        super(props);
    }

    componentWillMount(){


    };

    componentDidMount(){
    };


    render() {

        return (
            <View >
                <SwipeCarousel>
                    <View><Text>1</Text></View>
                    <View><Text>2</Text></View>
                </SwipeCarousel>
            </View>
        );
    }
}


const Styles = StyleSheet.create({
    Page: {
        backgroundColor: '#ffffff'
    }
})



AppRegistry.registerComponent('Swipe', () => Swipe);
