import React, { use, useRef, useState } from 'react'

const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
    iceServers : [
        {
            urls : "stun:stun.l.google.com:19302"
        }

    ]

}

export default function VideoMeet() {

    // let connections = useRef({});
    // connections.current = /......  // actually the correct way to do connections useRef hook is not used here, but can be used if needed in future 



    let socketRef = useRef();
    let socketId = useRef();
    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable ] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState();
    let [audio, setAudio] = useState();
    let [screenShare, setScreenShare] = useState();
    let [screenShareAvailable, setScreenShareAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState();
    let [newMessage, setNewMessage] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState();
    let [videos, setVideos] = useState([]);

    const videoRef = useRef([]);



  return (
    <div>
      { askForUsername === true ? 
            <div>
                
            </div>
        :
            <></>}
    </div>
  )
}
