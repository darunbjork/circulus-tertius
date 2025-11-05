const MessagesDetails = ({ messages }) => {
  return (
    <>
      {messages.map((m) => (
        <div className="msg">
          <div className="msg-header">
            <p className="usr-name">{m.sender}</p>
            <p className="msg-date">{m.date}</p>
          </div>
          <div className="msg-content-holder">
            <p className="msg-content">{m.message}</p>
          </div>
          <div className="msg-footer">
            <p className="msg-id"><strong>ID: </strong>{m.id}</p>
            <p className="msg-chatroom"><strong>Room: </strong>{m.room}</p>
          </div>
        </div>
      ))}
    </>
  );
};
export default MessagesDetails;
