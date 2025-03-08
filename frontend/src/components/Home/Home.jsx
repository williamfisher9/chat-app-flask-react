import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";

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
  const [owningUser, setOwningUser] = useState("");

  useEffect(() => {

    axios.get(`http://localhost:5000/api/v1/users/chat/${params.source_user}/${params.dest_user}`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    })
    .then((res) => {
      console.log(res)
      setIsPrivateSession(true)
      setPrivateToUser(params.dest_user)
      setChatHistory([...res.data.contents]);
    })
    .catch(err => {
      console.log(err)
      if(err.status == 401 || err.status == 403 || err.status == 422)
        navigate("/login")
    })

  }, [params])



  useEffect(() => {
    bottomOfChatPanel.current.scrollIntoView();
  }, [chatHistory]);


  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      autoConnect: true,
      extraHeaders: {
        authorization: `bearer ${Cookies.get("token")}`,
        username: Cookies.get("user_id"),
      },
    });

    setSocket(socketInstance);

    setOwningUser(Cookies.get("user_id"));

    socketInstance.on("connect", () => {
      setOwningUser(Cookies.get("user_id"));
    });

    const addMessageToChatHistory = (msg) =>
      setChatHistory((prevMessages) => [...prevMessages, msg]);

    if (!socketInstance.hasListeners("new_message")) {
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
        setOwningUser("");
        socketInstance.disconnect();
      }
    };
  
  }, []);

  

  const handleKeyDown = (event) => {
    if (event.key == "Enter") sendMessage();
  };

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("send_message", {
        username: Cookies.get("user_id"),
        message: message,
        sid: socket.id,
        from_user: owningUser,
        to_user: isPrivateSession ? privateToUser : "all"
        //"token": Cookies.get("token")
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
    navigate("/login");
  };

  const [showRoomsMenu, setShowRoomsMenu] = useState(false)

  const showRooms = () => {
    setShowRoomsMenu(true)
  }

  const [isPrivateSession, setIsPrivateSession] = useState(false)
  const [privateToUser, setPrivateToUser] = useState("")

  return (
    <div className="w-full">
      {/*<div className="mt-24 flex gap-4 justify-center items-center">
          <button className='btn' onClick={handleConnect}>RECONNECT</button>
        </div>*/}

      <div className="flex h-svh relative">
        <div className="w-[15%] h-full py-4 px-2 flex flex-col justify-between gap-4 border-r-2 border-[var(--global-color)]">
          <div className="flex justify-center items-center">
            <Link to={"/home"}>
              <img
                src="logo_chat.png"
                alt="logo"
                className="h-6 cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-2 justify-start items-center h-[85%]">


          <div
                  key="global"
                  className={`cursor-pointer bg-yellow-500/10 rounded-md w-[90%] px-2 py-2 flex justify-center items-center gap-2 ${params.dest_user == "global" ? "border-2 border-[var(--global-color)]" : "border-2 border-transparent"}`}
                  onClick={() => navigate(`/home/${owningUser}/global`)}
                >
                  
                  <p className="text-[var(--global-color)] text-sm">
                    GLOBAL
                  </p>
                </div>
          

{
            !showRoomsMenu &&

            Object.keys(connectedUsers).map((key) => {
              return (
                <div
                  key={connectedUsers[key].id}
                  className={`cursor-pointer bg-yellow-500/10 rounded-md w-[90%] px-2 py-2 flex justify-start items-center gap-2 ${params.dest_user == connectedUsers[key].username ? "border-2 border-[var(--global-color)]" : "border-2 border-transparent"}`}
                  onClick={() => navigate(`/home/${owningUser}/${connectedUsers[key].username}`)}
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

          {
            /*
            <div className="flex flex-col gap-2 justify-start h-[85%] scrollbar-style">
            {Object.keys(connectedUsers).map((key) => {
              return (
                <div
                  key={connectedUsers[key].id}
                  className="cursor-pointer bg-yellow-500/10 rounded-md w-[90%] h-[70px] px-2 flex justify-start items-center gap-2"
                >
                  <img
                    src={connectedUsers[key].avatar}
                    className="size-14 rounded-full"
                    alt="img"
                  />
                  <p className="text-[var(--global-color)] text-sm">
                    {connectedUsers[key].full_name}
                  </p>
                </div>
              );
            })}
          </div>
            
            */
          }

          <div className="flex justify-center items-center flex-col gap-2">
            {
              showRoomsMenu ? 

              <div className="flex gap-1 w-full">
<button className="btn w-full h-8 flex justify-center items-center gap-1" onClick={() => {setShowRoomsMenu(false)}}>
              <span className="material-symbols-rounded">
arrow_back
</span>BACK
            </button>
<button className="btn w-full h-8 text-center flex justify-center items-center gap-1">
            <span className="material-symbols-rounded">
add_circle
</span>NEW
</button>
            
              

              </div>
            : <button className="btn w-full h-10 flex justify-center items-center gap-1" onClick={showRooms}>
            <span className="material-symbols-rounded">
meeting_room
</span>ROOMS
            </button>
            }
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

        <div className="relative flex flex-col justify-center items-center w-[85%] h-full px-4">
          <div className="w-full h-[80%] px-4 bottom-16 scrollbar-style">
            {chatHistory.map((msg) => {
              if (msg.username == owningUser) {
                return (
                  <div className="w-full flex justify-start pl-10" key={uuidv4()}>
                    <div
                      className="relative w-[30%] border-2 border-[var(--global-color)] rounded-md p-3 my-2 bg-[var(--global-color)]"
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
                      className="relative w-[30%] border-2 border-[var(--global-color)] rounded-md p-3 my-2 bg-gray-800"
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
