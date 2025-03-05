import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Menu from '../Menu/Menu';

const Home = () => {
  const navigate = useNavigate(null)
  const [socket, setSocket] = useState(null);

  const [connectedUsers, setConnectedUsers] = useState({});

  const [message, setMessage] = useState("")

  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {

    axios.get("http://localhost:5000/api/v1/users/validate-jwt-token", 
    {headers: {"Authorization": `Bearer ${Cookies.get("token")}`}})
    .then((res) => {

    })
    .catch((err) => {
      navigate("/login")
    })

    const socketInstance = io('http://localhost:5000', {
      autoConnect: true,
        extraHeaders: {
          authorization: `bearer ${Cookies.get("token")}`,
          username: Cookies.get('user_id')
        }
      ,
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
    if (!socketInstance.hasListeners('new_message')) {

      socketInstance.on('new_message', (message) => {
        setChatHistory([...chatHistory, message])
          console.log(message);
      });
  
  }

  if (!socketInstance.hasListeners('user_joined')) {

    socketInstance.on('user_joined', (message) => {
        console.log('list of users:', message);
        setConnectedUsers(message.users)
    });

}


if (!socketInstance.hasListeners('user_left')) {

  socketInstance.on('user_left', (message) => {
      console.log('list of users:', message);
  });

}

    return () => {
      if (socketInstance) {
        console.log("disconnecting from the server")
        socketInstance.disconnect();
      }
    };
  }, [])

  const authenticateUser = () => {

    socket.emit("authenticate", {
      "user_id": Cookies.get("user_id"),
      "token": Cookies.get("token")
  });
  }


  const sendMessage = () => {
    if (socket && message) {
      socket.emit('send_message', {
        "username": Cookies.get("user_id"),
        "message": message,
        "sid": socket.id,
        //"token": Cookies.get("token")
      });
    }

  }

    /*const sendMessage = () => {
      axios.post("http://localhost:5000/api/v1/users/send", {msg: {message: "test123"}}, {headers: {"Authorization": `Bearer ${Cookies.get("token")}`}})
      .then(res => {
        console.log(res)
      })
    }*/

  const handleConnect = () => {
    socket.connect()
      
  }

  const handleDisconnect = () => {
    console.log("-------------")
    socket.disconnect();
  }

  

  return (
    <div className='w-full min-h-screen'>
      <Menu handleDisconnect={handleDisconnect}/>

      <div className="mt-24 flex gap-4 justify-center items-center">

        <button className='btn' onClick={handleConnect}>RECONNECT</button>

        

    </div>

      <div className='mt-5 flex min-h-screen'>
        <div className='w-[20%] h-full px-2 py-2 flex flex-col gap-2 border-r-2 border-[var(--global-color)]'>
          {
            Object.keys(connectedUsers).map(
              (key) =>  {
                return <div key={connectedUsers[key].id} className='border-2 border-zinc-400 rounded-md w-[90%] h-12 px-1 flex justify-start items-center gap-2'>
            <img src={connectedUsers[key].avatar} className='size-8' alt='img' />
            <p className='text-white text-sm'>{connectedUsers[key].full_name}</p>
          </div>
              }
          )
          }
        </div>
        <div className='flex flex-col justify-center items-center w-[80%] h-full px-4'>

        {
            chatHistory.map((msg) => {
              return <div className='w-full border border-zinc-500 rounded-md p-3 my-2'>
                <div className='flex gap-3 justify-start items-center'>
                <img src={msg.avatar} className='size-10' alt="img" />
                <p className='text-white'>{msg.full_name}</p>
                </div>
                <p className='px-[54px] text-white' >{msg.message}</p>
              </div>
            }
            )
          }



          <div className='w-full flex justify-center'>
            <div className='w-[70%] rounded-md h-12 border-2 border-[var(--global-color)] relative'>
              <input type='text' className='absolute w-full h-full pl-[20px] top-0 left-0 bg-transparent text-white outline-none border-none' onChange={(event) => setMessage(event.target.value)} />
              <button className='btn absolute right-0 top-0 h-full flex justify-center items-center' onClick={sendMessage}><span className="material-symbols-rounded text-3xl">send</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>   
  );
}

export default Home

/**/