/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Easing,
  Dimensions
} from 'react-native';

import Styles from './Style/SwipeCarousel';

const window = Dimensions.get('window');
const menuWidth = window.width * 0.5;

const animationConfig = {
  duration: 200, // milliseconds
  delay: 0, // milliseconds
  easing: Easing.out(Easing.ease)
};

class SwipeCarousel extends Component {


    constructor(props){

        super(props);

        this.state = {
            current: 1, //Current Page
            pan: new Animated.ValueXY() //Animated started in x:0 y:0
        }

        //Number of pages
        this._pages = (this.props.children) ? this.props.children.length : 0;
        //Position Limit Left
        this._limitLeft = (window.width * (this._pages - 1) ) * -1;
        //Position Limit Right
        this._limitRight = 0;
        //Size of drag to change page
        this._drag = this.props.drag || window.width / 2;
        //Save the previous position
        this._previousPosition = 0;
        //Pan Responser for touch
        this._panResonder = null;

    }


    componentWillMount(){

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.handleStart.bind(this),
            onMoveShouldSetPanResponder: this.handleMoveShould.bind(this),
            onPanResponderGrant: () => true,
            onPanResponderMove: (this._pages > 1) ? this.handleMove.bind(this) : () => true,
            onPanResponderRelease: (this._pages > 1) ? this.handleEnd.bind(this) : () => true,
            onPanResponderTerminate: (this._pages > 1) ? this.handleEnd.bind(this) : () => true
        });
    };

    componentDidMount(){
        this.setPosition();
    };

    /**
     * Update the position with animation
     * @param {[type]} position = 0 [description]
     */
    setPositionAnimated(position = 0){
        Animated.timing(this.state.pan, {
          ...animationConfig,
          toValue: {
            x: position,
            y: 0
          },
        }).start();
    }

    /**
     * Update the position without animation
     * @param {[type]} position = 0 [description]
     */
    setPosition(position = 0){

        Animated.timing(this.state.pan, {
          duration: 0,// milliseconds
          toValue: {
            x: position,
            y: 0
          }
      }).start();

     };

     /**
      * Callback move should handle
      * @param  {[type]} e:       Object        [description]
      * @param  {[type]} gesture: Object        [description]
      * @return {[type]}          [description]
      */
     handleMoveShould(e: Object, gesture: Object){
        return true
     };

    /**
     * Callback when star handle touch
     * @param  {[type]} e       [description]
     * @param  {[type]} gesture [description]
     * @return {[type]}         [description]
     */
     handleStart(e, gesture){
       return true;
     };

    /**
     * Callback when end handle touch
     * @param  {[type]} e       [description]
     * @param  {[type]} gesture [description]
     * @return {[type]}         [description]
     */
     handleEnd(e, gesture){

        this._previousPosition = gesture.dx + this._previousPosition;

        let pageChanged = false, //Page was changed?
            thisPage = Math.floor((this._previousPosition + this._drag) / window.width),
            previousPage = this.state.current - 1;

        if(thisPage === previousPage){
            if(gesture.dx > this._drag){
                pageChanged = true;
                thisPage++;
            }
            if(gesture.dx < (this._drag * -1)){
                pageChanged = true;
                thisPage--;
            }
        }

        //Now this page is previous page
        previousPage = thisPage;

        //New Current Page
        let currentPage = (thisPage * -1) + 1;

        //Keep in first page
        if(currentPage < 1){
          currentPage = 1;
        }
        //Keep in last Page
        if(currentPage > this._pages){
            currentPage = this._pages;
        }

        this.setState({
            current: currentPage
        });

        if(!pageChanged){
            this.setPositionAnimated(this._previousPosition);
        }

        this._previousPosition = ((currentPage * window.width) - window.width) * -1;

        this.setPositionAnimated(this._previousPosition);

    }

     /**
     * Callback when move touch
     * @param  {[type]} e       [description]
     * @param  {[type]} gesture [description]
     * @return {[type]}         [description]
     */
     handleMove(e, gesture){
        let thisPosition = gesture.dx + this._previousPosition;
        //If exceed the limit left
        if(thisPosition < this._limitLeft ){
            this._previousPosition = this._limitLeft - gesture.dx;
        }
        //If exceed the limit right
        if(thisPosition > 0){
            this._previousPosition =  this._limitRight - gesture.dx;
        }
        //Update position
        this.setPosition(gesture.dx + this._previousPosition);
     };

     setTranslateX(page){

        let translateX = Math.abs(page ? window.width * (page - 1) : window.width);

        return {
            transform:[{
                translateX: translateX
            }],
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#777',
            width: window.width,
            height: window.height,
            borderColor: '#444',
            borderLeftWidth: 1,
            position: 'absolute'
        }
     }


     renderPage(page, index){
         return (
             <View key={index} style={this.setTranslateX(index+1)}>
                 {page}
             </View>
        )
     }

     render() {

        let Pages;

        if(this.props.children && this.props.children.length){
             Pages = this.props.children.map( (page, i) => {
                return this.renderPage(page, i);
            });
        }
        else if( this.props.children ){
            Pages = this.renderPage(this.props.children, 0);
        }

        return (
            <View {...this._panResponder.panHandlers} >
                <Animated.View ref="Swipe" style={{transform:this.state.pan.getTranslateTransform()}} >
                    { Pages }
                </Animated.View>
            </View>
        );
     }
}


//TODO: aplicar a validacao da prop children
SwipeCarousel.propTypes = {
    animationConfig: React.PropTypes.object,
    drag: React.PropTypes.number
}

export default SwipeCarousel;
