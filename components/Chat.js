import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';

//import { Button } from 'react-native-web';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }
  //Static messages
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a chat room',
          createdAt: new Date(),
          system: true,
        },
      ]
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          }
        }}
      />
    );
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    const { bgColor } = this.props.route.params;
    return (
      <View style={{
        flex: 1, backgroundColor: bgColor ? bgColor : "#fff"
      }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/*component for Android so that the input field won’t be hidden beneath the keyboard.*/}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  }
}



   // const { bgColor } = this.props.route.params;

   // return (
    //  <View style={{
     //   flex: 1, justifyContent: 'center', alignItems: 'center',
    //    backgroundColor: bgColor ? bgColor : "#fff"
    //  }}>
    //    <Text>Hello and Welcome</Text>
    //  </View>
   // );
//  }
//}