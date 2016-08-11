# React Native Swipe Carousel

This is a simple Swipe Carousel Component to use in your React Native applications.

For IOS

### Version
0.1.7

### Installation

Swipe Carousel requires [React](https://facebook.github.io/react/) v15.2.1+ and [React Native](https://facebook.github.io/react-native/) v.0.29+

How to install using [NPM Repository](https://www.npmjs.com/package/react-native-swipe-carousel):

```sh
$ npm install react-native-swipe-carousel --save-dev
```

### Import

```js
import SwipeCarousel from 'react-native-swipe-carousel';
```

### Using


```js

class Main extends Component {

    render() {
        return (
          <View>
                <SwipeCarousel>
                    <View></View>{ /*Page 1*/ }
                    <View></View>{ /*Page 2*/ }
                    <View></View>{ /*Page 3*/ }
                    { /*...*/ }
                </SwipeCarousel>
          </View>
        );
    }
}
````



License
----

MIT
