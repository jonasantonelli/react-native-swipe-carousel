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
  TouchableHighlight,
  PanResponder,
  Animated,
  Easing,
  Dimensions
} from 'react-native';

const window = Dimensions.get('window');



/**
 * Styles
 */
const IndicatorsStyle = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 14,
        paddingTop: 20,
        paddingBottom: 20
    },
    Item: {
        borderWidth:5,
        borderColor: '#333',
        borderRadius: 5,
        marginRight: 6,
        marginLeft: 6
    },
    Selected: {
        width: 10,
        height: 10,
        borderWidth: 2,
        borderRadius: 10
    }
});



class SwipeCarousel extends Component {

    constructor(props){

        super(props);

        this.state = {
            current: 1, //Current Page
            pan: new Animated.ValueXY(), //Animated started in x:0 y:0
            width: 0, //this is width size of swipe element
            height: 0 //this is height size of swipe element
        }

        //Number of pages
        this._pages = (this.props.children) ? this.props.children.length : 0;
        //Position Limit Left
        this._limitLeft = (window.width * (this._pages - 1) ) * -1;
        //Position Limit Right
        this._limitRight = 0;
        //Size of drag to change page
        this._drag = window.width / 2;
        //Save the previous position
        this._previousPosition = 0;
        //Pan Responser for touch
        this._panResonder = null;

        //Options of animation
        this._animation = Object.assign({
          duration: 200, // milliseconds
          delay: 0, // milliseconds
          easing: Easing.out(Easing.ease)
        }, this.props.animation);

        this._style = Object.assign({
            flex: 1,
            overflow: 'visible'
        }, this.props.style);

        //Indicators true/false
        this._indicators = (typeof this.props.indicators === 'undefined') ? true : this.props.indicators;
        this._indicatorsHeight = 40; //Indicators height size

        //This is object to render
        this._Build = {
            Pages: null,
            Indicators: null
        };

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
          ...this._animation,
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
      * Move to current page and update previous position
      * @param  {[type]} current = this.state.current [description]
      */
     moveTo(current = this.state.current){
         this._previousPosition = ((current * window.width) - window.width) * -1;
         this.setPositionAnimated(this._previousPosition);
     }

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

        //If don't change of page yet
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

        this.moveTo(currentPage);

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


     /**
      * get style for each page
      * @param {[type]} page [description]
      */
     getPageStyle(page){

        let translateX = Math.abs(page ? this.state.width * (page - 1) : this.state.width);

        let _height = (this._indicators) ? this.state.height - this._indicatorsHeight : this.state.height;

        return {
            transform:[{
                translateX: translateX
            }],
            flex: 1,
            position: 'absolute',
            left:0,
            top: 0,
            width: this.state.width,
            height: _height,
        }
     }


     /**
      * Select some page, apply current page
      * @param  {[type]} index [description]
      * @return {[type]}       [description]
      */
     selectPage(index){

         if(index === this.state.current){
             return;
         }

         this.setState({
            current: index
         });

         this.moveTo(index);
     }


     /**
      * Render page <View/>
      * @param  {[type]} page  [description]
      * @param  {[type]} index = 1 [description]
      * @return <View/>
      */
     renderPage(page, index = 1){
         return (
             <View key={index} style={this.getPageStyle(index)}>
                 {page}
             </View>
        )
     }

     /**
      * Render Indicator
      * @param  {[type]} index = 1 [description]
      * @return <TouchableHighlight/>
      */
     renderIndicator(index = 1){

        let styles = [
            IndicatorsStyle.Item
        ];

        if(this.state.current === index){
            styles.push(IndicatorsStyle.Selected);
        }

         return (
             <TouchableHighlight style={styles} key={index} onPress={this.selectPage.bind(this, index)}>
                 <Text></Text>
            </TouchableHighlight>
         )
     }


     indicatorComponent(Indicators){
         //Get width of container
         //let getWidth = this.props.children > 0 ? this.props.children * 10
         return (<View style={[IndicatorsStyle.Container]}>{ Indicators }</View>);
     }

     /**
      * Build pages and indicators
      * @return {Pages, Indicators}
      */
     buildPagesAndIndicators(){
         let Pages = [],
             Indicators = [];

         if(this.props.children && this.props.children.length){
             this.props.children.forEach( (page, i) => {
                 let index = i + 1;
                 Pages.push(this.renderPage(page, index));
                 Indicators.push(this.renderIndicator(index));
             });
         }
         else if( this.props.children ){
              Pages = this.renderPage(this.props.children);
              Indicators = this.renderIndicator();
         }
         return {
             Pages,
             Indicators
         };
     }

     /**
      * Get size of SwipeCarousel component
      * It is used to refer others Views
      * @param  {[type]} event [description]
      * @return {[type]}       [description]
      */
     getComponentSize(event){
        if(!event || !event.nativeEvent || !event.nativeEvent.layout){
             return;
        }
        this.setState({
            width: Math.abs(event.nativeEvent.layout.width),
            height: Math.abs(event.nativeEvent.layout.height)
        });
    }

    /**
     * Get size of View that will be used to Swipe Carousel
     * @return {[type]} [description]
     */



    render() {

        this._Build = this.buildPagesAndIndicators();

        //Get size of View that will be used to Swipe Carousel
        let Style = StyleSheet.create({
            Swipe: {
                width: this.state.width,
                height: (this._indicators) ? this.state.height - this._indicatorsHeight : this.state.height
            }
        });

        let transformPosition = this.state.pan.getTranslateTransform();

        return (
            <View onLayout={this.getComponentSize.bind(this)} style={this._style}>
                <View {...this._panResponder.panHandlers} style={Style.Swipe}>
                    <Animated.View ref="Swipe" style={[{transform:transformPosition}, Style.Swipe]} >
                        { this._Build.Pages }
                    </Animated.View>
                </View>
                { (this._indicators) ? this.indicatorComponent(this._Build.Indicators) : null }
            </View>
        );
     }
}

SwipeCarousel.propTypes = {
    animation: React.PropTypes.object,
    style: React.PropTypes.object,
    indicators: React.PropTypes.bool
}

export default SwipeCarousel;
