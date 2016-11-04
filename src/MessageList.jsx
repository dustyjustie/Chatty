import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    console.log("Rendering <MessageList/>")
    return (

      <div id="message-list">
        {this.props.msgs.map(function(message){
          if (message.type == "message") {
            return <Message key={message.id} username={message.username} content={message.content} />
          } else if (message.type == "notification") {
            return (
              <div key={message.id} className="message system">
                  {message.content}
              </div>
            )
          }
        })
      }

      </div>
    );
  }
}
export default MessageList;


