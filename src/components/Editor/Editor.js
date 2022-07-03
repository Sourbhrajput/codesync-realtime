import { useRef, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Hamburger from "./Hamburger";
import Logo from "../logo";
import "./Editor.css";
import Avtar from "./avtar";
import CodeEditor from "./CodeEditor";
import { initSocket } from "./socket";
import toast from "react-hot-toast";

const Editor = () => {
  const socket = useRef(null);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { state } = useLocation();
  const user = {};
  const [clients, setClients] = useState([]);
  const [leftSide,setLeftSide]=useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }
    user.roomId = roomId;
    user.userName = state.userName;

    const init = async () => {
      socket.current = await initSocket();
      socket.current.emit("join", { user });
      socket.current.on("joined", ({ user, userConnected }) => {
        setClients(userConnected);
        if (user.userName === state.userName)
        toast.success("You joined");
        else {
          toast.success(`${user.userName} joined`);
        }
      });

      socket.current.on("disconnected", ({ user }) => {
        if (!user.userName) {
          return;
        }
        toast.success(`${user.userName} is left`);
        setClients((clients) => {
          return clients.filter((client) => {
            if (client.socketId != user.socketId) {
              return client;
            }
          });
        });
      });

      socket.current.on('delete',({user})=>
      {
        navigate('/');
        if (user.userName === state.userName)
       toast.error(`Room Delete by ${"you"}`);
        else {
          toast.error(`Room Delete by ${user.userName}`);
        }
        setTimeout(()=>
        {
          window.location.reload();

        },1000)
      
       
  
      })
     
    
    };
    init();
    return () => {
      socket.current.off("joined");
      socket.current.off("disconnected");
    };
  }, []);

  const leaveRoom = () => {
    navigate("/");
    socket.current.emit("leave");
    window.location.reload();
  };
  const deleteRoom = () => {
    
    socket.current.emit("delete");
  
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copyed to Clipboard");
    } catch (err) {
      toast.error("Room ID not copyed to Clipboard");
    }
  };

  return (
   <>
    
    <Hamburger setLeftSide={setLeftSide} />
    <div className={leftSide?"editor_container container editor_grid":" editor_container container  "}>
    
      <div  className={ leftSide ?"left_panel":"left_panel show-icon"}>
        <div className="logo_div">
          <Logo />
        </div>
        <h2 className="connected">Connected</h2>
        <div className="user">
          <div className="user_connected">
            {clients.map(({ socketId, userName }) => (
              <Avtar key={socketId} userName={userName} />
            ))}
          </div>

          <div className="btn_div">
            <div className="btn copy" onClick={copyRoomId}>
              Copy ROOM ID
            </div>
            <div className="btn delete" onClick={deleteRoom}>
              Delete ROOM
            </div>
            <div className="btn leave" onClick={leaveRoom}>
              Leave
            </div>
          </div>
        </div>
      </div>
      <div className="right_panel">
     
     <CodeEditor socket={socket} roomId={roomId} />

      </div>
    
    </div>
    </>
  );
};

export default Editor;
