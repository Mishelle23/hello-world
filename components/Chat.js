import React from 'react';
import { View, Text } from 'react-native';
//import { Button } from 'react-native-web';


export default class Chat extends React.Component {

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    const { bgColor } = this.props.route.params;

    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: bgColor ? bgColor : "#fff"
      }}>
        <Text>Hello and Welcome</Text>
      </View>
    );
  }
} 