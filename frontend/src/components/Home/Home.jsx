import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";

import logoImg from '../../assets/logo_chat.png'

import "./Home.css";

import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const navigate = useNavigate(null);
  // for auto scrolling
  const bottomOfChatPanel = useRef();
  // for message field focus
  const inputMessageField = useRef();

  const params = useParams()


  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState({});
  const [message, setMessage] = useState("");
  //const [owningUser, setOwningUser] = useState("");
  const [windowSize, setWindowSize] = useState(window.innerWidth)
  const [showSmallMenu, setShowSmallMenu] = useState(false)

  useEffect(() => {

    axios.get(`https://willtechbooth.dev/chatter/api/v1/users/chat/${params.source_user}/${params.dest_user}`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    })
    .then((res) => {
      //console.log(res)
      setChatHistory([...res.data.contents]);
    })
    .catch(err => {
      console.log(err)
      if(err.status == 401 || err.status == 403 || err.status == 422)
        navigate("/chatter/login")
    })

  }, [params])

  

  useEffect(() => {
    bottomOfChatPanel.current.scrollIntoView();
  }, [chatHistory]);


  useEffect(() => {

    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth)
    })

    const socketInstance = io("https://willtechbooth.dev/chatter/socket", {
      autoConnect: true,
      query: { token: `${Cookies.get("token")}` },
      path: "/socket",
      extraHeaders: {
        authorization: `bearer ${Cookies.get("token")}`,
        username: Cookies.get("user_id"),
      },
    });

    setSocket(socketInstance);

    //setOwningUser(Cookies.get("user_id"));

    socketInstance.on("connect", () => {
      //setOwningUser(Cookies.get("user_id"));
    });

    const addMessageToChatHistory = (msg) =>
      setChatHistory((prevMessages) => [...prevMessages, msg]);

    if (!socketInstance.hasListeners("new_message")) {
      console.log("received a message")
      socketInstance.on("new_message", addMessageToChatHistory);
    }

    if (!socketInstance.hasListeners("user_joined")) {
      socketInstance.on("user_joined", (message) => {
        setConnectedUsers(message.users);
      });
    }

    if (!socketInstance.hasListeners("user_left")) {
      socketInstance.on("user_left", (message) => {
        setConnectedUsers(message.users);
      });
    }

    return () => {
      if (socketInstance) {
        //setOwningUser("");
        socketInstance.disconnect();
      }

      window.removeEventListener("resize", () => {
        setWindowSize(window.innerWidth)
      })
    };
  
  }, []);

  

  const handleKeyDown = (event) => {
    if (event.key == "Enter") sendMessage();
  };

  const sendMessage = () => {
    console.log("sent a message")
    if (socket && message) {
      socket.emit("send_message", {
        username: Cookies.get("user_id"),
        message: message,
        sid: socket.id,
        from_user: params.source_user,
        to_user: params.dest_user
      });
    }

    setMessage("");
    inputMessageField.current.focus();
  };

  const handleDisconnect = () => {
    socket.disconnect();
  };

  const signUserOut = () => {
    Cookies.remove("token");
    Cookies.remove("user_id");
    Cookies.remove("email_address");
    handleDisconnect();
    navigate("/chatter/login");
  };

  const changePassword = () => {
    navigate(`/chatter/change-password/${params.source_user}`);
  }

  const toggleSmallMenu = () => {
    setShowSmallMenu((prev) => !prev)
  }
  
  return (
    <div className="w-full">
      {/*<div className="mt-24 flex gap-4 justify-center items-center">
          <button className='btn' onClick={handleConnect}>RECONNECT</button>
        </div>*/}

      <div className="flex h-svh relative">


        {
          windowSize > 800 ? 
          
  <div className="max-[1000px]:w-[40%] min-[1000px]:w-[20%] h-full py-4 px-2 flex flex-col justify-between gap-4 border-r-2 border-[var(--global-color)]">
          <div className="flex justify-center items-center">
            <Link to={`/chatter/home/${params.source_user}/global`}>
              <img
                src={logoImg}
                alt="logo"
                className="h-6 cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-2 justify-start items-center h-[85%]">


          <div
                  key="global"
                  className={`cursor-pointer bg-yellow-500/10 rounded-md w-[90%] px-2 py-2 flex justify-center items-center gap-2 ${params.dest_user == "global" ? "border-2 border-[var(--global-color)]" : "border-2 border-transparent"}`}
                  onClick={() => navigate(`/chatter/home/${params.source_user}/global`)}
                >
                  
                  <p className="text-[var(--global-color)] text-sm">
                    GLOBAL
                  </p>
                </div>
          

{
            

            Object.keys(connectedUsers).map((key) => {
              return (
                <div
                  key={connectedUsers[key].id}
                  className={`cursor-pointer bg-yellow-500/10 rounded-md w-[90%] px-2 py-2 flex justify-start items-center gap-2 ${params.dest_user == connectedUsers[key].username ? "border-2 border-[var(--global-color)]" : "border-2 border-transparent"}`}
                  onClick={() => navigate(`/chatter/home/${params.source_user}/${connectedUsers[key].username}`)}
                >
                  <img
                    src={connectedUsers[key].avatar}
                    className="size-10 rounded-full"
                    alt="img"
                  />
                  <p className="text-[var(--global-color)] text-sm">
                    {connectedUsers[key].full_name}
                  </p>
                </div>
              );
            })
          }       
          </div>

          

          <div className="flex justify-center items-center flex-col gap-2">
          <button className="btn w-full h-12 flex justify-start items-center gap-1" onClick={changePassword}>
            <span className="material-symbols-rounded">
keyboard_lock
</span>CHANGE PASSWORD
            </button>
            <button className="btn w-full h-12 flex justify-start items-center gap-1" onClick={signUserOut}>
            <span className="material-symbols-rounded">
logout
</span> SIGN OUT
            </button>
            {socket != null ? (
              <p className="text-[var(--global-color)] text-[10px]">
                {socket.id}
              </p>
            ) : null}
          </div>
        </div>

          :

        <div className="absolute w-full h-[50px] flex justify-between items-center px-10 py-7 z-50 select-none">
        <img
                        src={logoImg}
                        alt="logo"
                        className="h-6 cursor-pointer"
                      />
        <span className="material-symbols-rounded text-[var(--global-color)] text-3xl cursor-pointer p-1 bg-gray-900 hover:bg-gray-950 rounded-md" 
        onClick={toggleSmallMenu}>
        menu
        </span>
        </div>

        }





      {

        showSmallMenu && <div className="absolute z-50 bg-gray-800 top-0 left-0 w-full h-full flex flex-col justify-between gap-4 px-10">
          <div className="relative flex justify-center items-center">
          <span className="absolute top-[5px] right-[5px] material-symbols-rounded text-[var(--global-color)] text-3xl cursor-pointer bg-gray-900 hover:bg-gray-950 rounded-md" 
        onClick={toggleSmallMenu}>
        close
        </span>
          </div>




          <div className="flex flex-col gap-2 justify-start items-center h-[85%] pt-10">


          <div
                  key="global"
                  className={`cursor-pointer bg-yellow-500/10 rounded-md w-[90%] px-2 py-2 flex justify-center items-center gap-2 ${params.dest_user == "global" ? "border-2 border-[var(--global-color)]" : "border-2 border-transparent"}`}
                  onClick={() => {navigate(`/chatter/home/${params.source_user}/global`); setShowSmallMenu(prev => !prev)}}
                >
                  
                  <p className="text-[var(--global-color)] text-sm">
                    GLOBAL
                  </p>
                </div>

                {
            

            Object.keys(connectedUsers).map((key) => {
              return (
                <div
                  key={connectedUsers[key].id}
                  className={`cursor-pointer bg-yellow-500/10 rounded-md w-[90%] px-2 py-2 flex justify-start items-center gap-2 ${params.dest_user == connectedUsers[key].username ? "border-2 border-[var(--global-color)]" : "border-2 border-transparent"}`}
                  onClick={() => {navigate(`/chatter/home/${params.source_user}/${connectedUsers[key].username}`); setShowSmallMenu(prev => !prev)}}
                >
                  <img
                    src={connectedUsers[key].avatar}
                    className="size-10 rounded-full"
                    alt="img"
                  />
                  <p className="text-[var(--global-color)] text-sm">
                    {connectedUsers[key].full_name}
                  </p>
                </div>
              );
            })
          } 
          

      
          </div>







          <div className="flex justify-center items-center flex-col gap-2 px-2">

          <button className="btn w-full h-12 flex justify-center items-center gap-1" onClick={changePassword}>
            <span className="material-symbols-rounded">
            keyboard_lock
</span>CHANGE PASSWORD
            </button>

            
            <button className="btn w-full h-12 flex justify-center items-center gap-1" onClick={signUserOut}>
            <span className="material-symbols-rounded">
logout
</span> SIGN OUT
            </button>
            {socket != null ? (
              <p className="text-[var(--global-color)] text-[10px]">
                {socket.id}
              </p>
            ) : null}
          </div>










      </div>

        

      }









        <div className="relative flex flex-col justify-center items-center  h-full px-4 max-[1000px]:w-full min-[1000px]:w-[85%]">
          <div className="w-full h-[80%] px-4 bottom-16 scrollbar-style">
            {chatHistory.map((msg) => {
              //console.log(msg.from_user == params.source_user,  msg.to_user == params.dest_user)
              if ((msg.to_user == "global" && params.dest_user == "global") ||
                (msg.from_user == params.source_user && msg.to_user == params.dest_user) || 
              (msg.to_user != "global" && msg.from_user == params.dest_user && msg.to_user == params.source_user)) {

                


                  if(msg.from_user == params.source_user)
                {
                  return (
                    <div className="w-full flex justify-start min-[500px]:pl-10" key={uuidv4()}>
                      <div
                        className=" relative min-[500px]:w-[45%] max-[500px]:scale-75 border-2 border-[var(--global-color)] rounded-md p-3 my-2 bg-[var(--global-color)]"
                      >
                        <img
                          src={msg.avatar}
                          className="absolute left-[-50px] size-10"
                          alt="img"
                        />
  
                        <div className="absolute bg-[var(--global-color)] top-1 left-[-5px] w-6 h-6 rotate-45 -z-10"></div>
  
                        <div className="flex gap-3 justify-start items-center">
                          <p className="text-gray-800 font-extrabold">
                            {msg.full_name}
                          </p>
                        </div>
                        <p className="text-gray-800">{msg.message}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="w-full flex justify-end">
                      <div
                        key={uuidv4()}
                        className="relative w-[45%] border-2 border-[var(--global-color)] rounded-md p-3 my-2 bg-gray-800"
                      >
                        <img
                          src={msg.avatar}
                          className="absolute left-[-50px] size-10"
                          alt="img"
                        />
  
                        <div className="absolute bg-[var(--global-color)] top-1 left-[-5px] w-6 h-6 rotate-45 -z-10"></div>
  
                        <div className="flex gap-3 justify-start items-center">
                          <p className="text-[var(--global-color)] font-extrabold">
                            {msg.full_name}
                          </p>
                        </div>
                        <p className="text-[var(--global-color)]">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                }




              }
            })}

            {
              //for auto scrolling
            }
            <div ref={bottomOfChatPanel}></div>
          </div>

          <div className="absolute bottom-5 left-[50%] translate-x-[-50%] w-full flex justify-center">
            <div className="w-[70%] rounded-md h-12 border-2 border-[var(--global-color)] relative">
              <input
                type="text"
                className="absolute w-full h-full pl-[20px] top-0 left-0 bg-transparent text-white outline-none border-none"
                onKeyDown={handleKeyDown}
                value={message}
                ref={inputMessageField}
                onChange={(event) => setMessage(event.target.value)}
              />

              <button
                className="btn absolute right-0 top-0 h-full flex justify-center items-center"
                onClick={() => sendMessage()}
              >
                <span className="material-symbols-rounded text-3xl">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
