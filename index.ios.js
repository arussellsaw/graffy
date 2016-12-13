import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Root from './src/Root';

class graffy extends Component {
  render() {
    return (
      <Root/>
    );
  }
}

AppRegistry.registerComponent('graffy', () => graffy);
