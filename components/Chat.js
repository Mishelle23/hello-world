import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import { View, Platform, KeyboardAvoidingView } from 'react-native';
import firebase from "firebase";
import "firebase/firestore";


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      }
    };

    const firebaseConfig = {
      apiKey: "AIzaSyCLuX0zBvJmYXXP4RcHPP3bHUBMB7PiXoI",
      authDomain: "helloworld-551f2.firebaseapp.com",
      projectId: "helloworld-551f2",
      storageBucket: "helloworld-551f2.appspot.com",
      messagingSenderId: "321729915524",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }


  //Static messages
  componentDidMount() {
    const name = this.props.route.name;
    this.props.navigation.setOptions({ title: name });

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any"
        }
      });

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages: messages,
    });
  };

  // unsubscribing from collection updates
  componentWillUnmount() {
    if (this.state.isConnected) {
      this.authUnsubscribe();
      this.unsubscribe();
    }
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: this.state.user
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    })
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