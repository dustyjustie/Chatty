import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import Websocket from 'react-websocket';

// var data = {
//   currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
//   messages: [
//     {
//       username: "Bob",
//       content: "Has anyone seen my marbles?",
//       id: 1
//     },
//     {
//       username: "Anonymous",
//       content: "No, I think you lost them. You lost your marbles Bob. You lost them for good.",
//       id: 2
//     }
//   ],
//   connected: false
// };

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: '',
      currentUser: {name: "Bob"},
      messages: [], // messages coming from the server will be stored here as they arrive
      connected: false,
      usersOnline: ''
    };

    this.handleNewMessage = this.handleNewMessage.bind(this)
  }

  nextId()
  {
    return this.state.messages.map(function(x) { return x.id; }).reduce((a,b) => Math.max(a,b), 0) + 1;
  }

  handleTextChange(event) {
    this.setState({value: event})
  };

  componentDidMount () {
    console.log("componentDidMount <App />");

    this.socket = new WebSocket(`ws://${window.location.hostname}:3001`);

    this.socket.onopen = () =>
    {
      var userCount = document.getElementById('user-count');

      console.log('Connected to the server');
      this.setState({connected: true})

      // userCount: function (data) {
      //   console.log(data)
      // userCount.innerHTML = data.usersOnline;
      // }

    };

    this.socket.onclose = () =>
    {
      console.log('Disonnected from the server');
      this.setState({connected: false});
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("HERE IS DATA: ", data)
      if (data.type !== "userCount") {
      this.setState({ messages: this.state.messages.concat([data])});
      } else {
      this.setState({usersOnline: data.usersOnline})
      console.log("HERE IS STATE :", this.state)
    }


      // [...this.state.messages, data];
    };
  }

  handleNewMessage (username, content) {
    if ( username != this.state.currentUser.name) {
      const newMessage = {
        type: "notification",
        id: this.nextId(),
        username: username,
        content: this.state.currentUser.name + " changed their name to " + username
      };
      console.log("HELLO: ", newMessage)
      this.socket.send(JSON.stringify(newMessage));
    }

    const newMessage = {
      type: "message",
      id: this.nextId(),
      username: username,
      content: content
    };
    this.socket.send(JSON.stringify(newMessage));


  }


  //   getInitialState: function() {
  //   var data = {
  //     currentUser: {name: "Bob"},
  //     messages: [] // messages coming from the server will be stored here as they arrive
  //   };
  //   return {data: data};
  // },



  componentWillUnmount()
  {
    this.socket.close();
  }

  render() {
    console.log("Rendering <App/>")
    return (
      <div className="wrapper">
        <nav>
          <h1>ChattR</h1>
          <div> Number of Users Online: {this.state.usersOnline} </div>
        </nav>
        <MessageList msgs = {this.state.messages} />
        <ChatBar username={this.state.currentUser.name} onNewMessage={this.handleNewMessage} />
      </div>
    );
  }
};
export default App;



    // {id:this.state.messages.length + 1, username: username, content: content}
    // const newData = this.state.messages.concat([newMessage]);
    // // const newMessages = [...this.state.messages, newMessage];
    // this.setState({ messages: newData });
    // Create new message object with id and change state here
