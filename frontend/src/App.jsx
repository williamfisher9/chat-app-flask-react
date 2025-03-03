import { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';


const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {
      autoConnect: false
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on("error", (error) => {
      console.log("error occured")
      console.log(error)
    });

    socketInstance.on("ping", () => {
      console.log("ping packet received from the server")
    });

    socketInstance.on("reconnect", (attempt) => {
      console.log("trying to reconnect " + attempt)
    });

    // received a message from the server
    socketInstance.on("new_message", (data) => {
      console.log(data)
    })

    return () => {
      if (socketInstance) {
        console.log("disconnecting from the server")
        socketInstance.disconnect();
      }
    };
  }, [])


  const sendMessage = (message) => {
    if (socket && message) {
      socket.emit('send_message', {
        "username": "user_1928",
        "avatar": "test",
        "message": "test123",
        "sid": socket.id
      });
    }

  }

  const handleConnect = () => {
    socket.connect()
      
  }

  const handleDisconnect = () => {
    socket.disconnect();
  }

  return (
    <div style={{display: "flex", gap: "10px", flexDirection: "column"}}>

      <button onClick={() => sendMessage("test message")}>send message</button>

      <button onClick={handleConnect}>connect</button>
      
      <button onClick={handleDisconnect}>disconnect</button>

    </div>
  );
}

export default App