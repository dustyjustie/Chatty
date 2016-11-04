import React, {Component} from 'react';

class ChatBar extends Component {
  constructor (props) {
    super(props);
    console.info('ChatBar props', this.props)

    this.state = {
      name: this.props.username,
      content: ''
    };

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleContentChange(event) {
    this.setState({ content: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
    console.log("INSIDE NAME:", event.target.value)
  }


  handleKeyPress(event) {

    if (event.keyCode === 13) {
      this.props.onNewMessage(this.state.name, this.state.content);
      this.setState({ content: '' });
    }
  }

  render() {
    console.log("Rendering <ChatBar/>")
    return (
      <footer>
        <input value = {this.state.name} onChange={this.handleNameChange} id="username" type="text" placeholder="Your Name (Optional)" />
        <input onKeyUp={this.handleKeyPress} onChange={this.handleContentChange} id="new-message" type="text" placeholder="Type a message and hit ENTER" value={this.state.content} />
      </footer>
    );
  }
}
export default ChatBar;
