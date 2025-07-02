import { useRef, useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import io from "socket.io-client"
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffIcon from '@mui/icons-material/VideocamOffOutlined'
import CallEndIcon from '@mui/icons-material/CallEnd';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import StopScreenShareOutlinedIcon from '@mui/icons-material/StopScreenShareOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CommentsDisabledOutlinedIcon from '@mui/icons-material/CommentsDisabledOutlined';

import { useNavigate } from "react-router";
import styles from "../styles/videoComponent.module.css"
import Icon from '@mui/material/Icon';
import Badge from '@mui/material/Badge';


const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
    "iceServers" : [
        {
            "urls" : "stun:stun.l.google.com:19302"
        }

    ]  

}

export default function VideoMeet() {

    // let connections = useRef({});
    // connections.current = /......  // actually the correct way to do connections useRef hook is not used here, but can be used if needed in future 



    let socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();
    const messagesEndRef = useRef(null);

    let [videoAvailable, setVideoAvailable ] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screenShare, setScreenShare] = useState();

    let [ showModal, setModal] = useState(true);

    let [screenShareAvailable, setScreenShareAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [message, setMessage] = useState('');

    let [newMessage, setNewMessage] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    let [videos, setVideos] = useState([]);

    const videoRef = useRef([]);

    let routeTo = useNavigate();

    const [error, setError] = useState(false);

    let token = localStorage.getItem("token"); 

  // todo 
  // if (chrome() === false) {
  //   alert("Please use Chrome browser for better experience");
  // } ;

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    }, [])
    
    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
    try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });

      if(videoStream) {
        setVideoAvailable(true);
        console.log('Video permission granted');
      }else {
        setVideoAvailable(false);
        console.log('Video permission denied');
      }

        const audioStream = await navigator.mediaDevices.getUserMedia({ audio : true });

        if(audioStream) {
            setAudioAvailable(true);
            console.log('audio permission granted');
        }else {
            setAudioAvailable(false);
            console.log('audio permission dennied');
        }

        if (navigator.mediaDevices.getDisplayMedia) {
            setScreenShareAvailable(true);
        }else {
            setScreenShareAvailable(false);
        }

        if (audioAvailable || videoAvailable ) {
            const userMediaStream = await navigator.mediaDevices.getUserMedia({video: videoAvailable, audio: audioAvailable});

            if (userMediaStream) {
                // should mention use of this once known
                window.localStream = userMediaStream;
                if (localVideoRef.current) {
                    // to get the video stream and audio stream from the user media stream and display on ui
                    // video component have source (src for reference) in stream we set the user localstream from window in src obj here
                    localVideoRef.current.srcObject = userMediaStream;
                    console.log("p local curr srcobj", localVideoRef.current.srcObject)
                }
            }
        }
    } catch (error) {
      console.error("Error accessing media devices Permissions.", error);
    }
  }

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS",video , audio)
        }
    }, [video, audio]);

    // useEffect(() => {
    //   if (
    //     video !== undefined &&
    //     audio !== undefined
    //   ) {
    //     const waitForRef = () => {
    //       if (localVideoRef.current) {
    //         getUserMedia();
    //       } else {
    //         setTimeout(waitForRef, 50); // retry until ref is mounted
    //       }
    //     };

    //     waitForRef();
    //   }
    // }, [video, audio]);


    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

  let getUserMediaSuccess = (stream) => {
        try {
            if (window.localStream){
                console.log("used now")
                window.localStream.getTracks().forEach(track => track.stop())
            }
        } catch (err) {
            console.error("error in media successs", err)
        }

        window.localStream = stream
        
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
        } else {
            console.warn("localVideoRef not ready — skipped setting srcObject");
        }

        for ( let id in connections ) {

            if ( id === socketIdRef.current ) continue;

            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                .then(() => {
                    socketRef.current.emit('signal', id , JSON.stringify({"sdp": connections[id].localDescription}))
                }).catch (e => console.log("error in media succes while setting local description" , e))
            }).catch( e => console.log("error in media succes while create offer while id !== socektIdRef", e)) 
        }
        stream.getTracks().forEach( track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach( track => track.stop());
            } catch (err) {
                console.log('error in track onended stream' , err)
            }

            let blackSilence = ( ...args ) => new MediaStream([black(...args), silence()]);
            console.log(blackSilence)
            window.localStream = blackSilence();
            console.log("lcl str while call of black silence in MS", window.localStream)
            localVideoRef.current.srcObject = window.localStream;
            console.log("lcl vid ref srcobj while call of black silence in MS", window.localStream)

            getUserMedia();

            //can also be done by this ;
            // for ( let id in connections ) {
            //     connections[id].addStream(window.localStream);
            //     connections[id].createOffer().then((description) => {
            //         connections[id].setLocalDescription(description)
            //         .then (() => {
            //             socketRef.current.emit('signal' , id , JSON.stringify({ 'sdp': connections[id].localDescription}))
            //         }).catch ( e => console.log("on ended for loop emit ", e))
            //     }).catch ( e => console.log('on ended for loop createoffer', e))
            // };
        });
    };

    //   let getUserMediaSuccess = (stream) => {
    //     try {
    //         window.localStream.getTracks().forEach(track => track.stop())
    //     } catch (e) { console.log(e) }

    //     window.localStream = stream
    //     localVideoRef.current.srcObject = stream

    //     for (let id in connections) {
    //         if (id === socketIdRef.current) continue

    //         connections[id].addStream(window.localStream)

    //         connections[id].createOffer().then((description) => {
    //             console.log(description)
    //             connections[id].setLocalDescription(description)
    //                 .then(() => {
    //                     socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
    //                 })
    //                 .catch(e => console.log(e))
    //         })
    //     }

    //     stream.getTracks().forEach(track => track.onended = () => {
    //         setVideo(false);
    //         setAudio(false);

    //         try {
    //             let tracks = localVideoref.current.srcObject.getTracks()
    //             tracks.forEach(track => track.stop())
    //         } catch (e) { console.log(e) }

    //         let blackSilence = (...args) => new MediaStream([black(...args), silence()])
    //         window.localStream = blackSilence()
    //         localVideoRef.current.srcObject = window.localStream

    //         for (let id in connections) {
    //             connections[id].addStream(window.localStream)

    //             connections[id].createOffer().then((description) => {
    //                 connections[id].setLocalDescription(description)
    //                     .then(() => {
    //                         socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
    //                     })
    //                     .catch(e => console.log(e))
    //             })
    //         }
    //     })
    // }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({video: video, audio: audio})
            .then(getUserMediaSuccess)
            .then((stream) => {})
            .catch((err) => {console.error("Error accessing media devices.", err);});
        }else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }catch(err) {
            console.log("Error stopping media tracks: ", err);
        }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreenShare(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })
    }

// phase 2 for handshake 
    let gotMessageFromServern = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log("From server Ice connection", e))
            }
        }
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }


    let connectToSocketServern =  () => {

        socketRef.current = io.connect(server_url, {secure: false});

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect' , () => {

            socketRef.current.emit("join-call", window.location.href)

            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos)=> videos.filter((video)=> video.socketId !== id))
            });

            socketRef.current.on("user-joined",(id, clients) => {
                clients.forEach((socketListId) => {
                    
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    // on icecandidate is an protocol interactive innectivity establishment 
                    // used to establish direct peer connection between event.condidate(me/you) and the other person on server for call
                    connections[socketListId].onicecandidate = function (event)  {
                        if (event.candidate != null) {
                            socketRef.current.emit( 'signal', socketListId, JSON.stringify({'ice': event.candidate }))
                        }
                    }
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExist = videoRef.current.find((video) => video.socketId === socketListId);

                        if ( videoExist ) {
                            console.log("FIND EXISTING ")
                            // in here we are handling the changing of stream change ex. cam to screen share etc 
                            setVideos(videos => {
                                // map the videos and search if nikhil id is eq listid then change before stream(...videostream)
                                // to new stream (event.stream) 
                                const updatedVideos = videos.map(video =>
                                    // nikhl      = nikhil              change to this 
                                    video.socketId === socketListId ? { ...videoStream, stream : event.stream } : video
                                    // nikhil      = sumesh                                            let the same vid stream
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }else {
                            // some one new just joined then get all the details of his and add into the list 
                            console.log("CREATING NEW");
                            let newVideos = {
                                socketId : socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true,
                            };

                            setVideos(videos => {
                                const updatedVideos = [ ...videos, newVideos ];

                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                        if ( window.localStream !== undefined && window.localStream !== null ) {
                            connections[socketListId] = addStream(window.localStream);
                        } else {
                                // when user wants to turn off the vid or audio then we send black screeen
                                // and cosntant null audio 
                                let blackSilence = ( ...args ) => new MediaStream([black(...args), silence()]);
                                window.localStream = blackSilence();
                                connections[socketListId].addStream(window.localStream);
                        }
                });
                // on addstream end mean. adding local video stream 

                    if ( id === socketIdRef.current ) {
                        // because we used id already that why used id2 but its same current user that means you 
                        for ( let id2 in connections ) {
                            if ( id2 === socketIdRef.current) continue
                                try {
                                    connections[id2].addStream(window.localStream)
                                }catch ( e ) {
                                    console.log(e);
                                }

                            connections[id2].createOffer().then((description) => {
                                connections[id2].setLocalDescription(description)
                                .then(() => {

                                    // sdp == sesssion description 
                                    // crutial for peer handshake 

                                    socketRef.current.emit( 'signal', id2, JSON.stringify({"sdp": connections[id2].localDescription}))

                                })
                                .catch (e => console.log( "Offer/SetLocalDescription error:",e))
                        })
                    
                    }
                }           
            });
                
        })

    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }


    let silence = () => {
        let context = new AudioContext();
        let oscillator = context.createOscillator();

        let destination = oscillator.connect(context.createMediaStreamDestination());

        oscillator.start();
        context.resume();
        return Object.assign(destination.stream.getAudioTracks()[0], {  enabled : false})
        
    }

    let black = ( { height = 480 , width = 640} = {}) => {

        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled : false })
    
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => {
            const lastMsg = prevMessages[prevMessages.length - 1];
            if (lastMsg && lastMsg.sender === sender && lastMsg.data === data) {
            return prevMessages; // only blocks repeated last message
            }
            return [...prevMessages, { sender, data }];
        });
        if (socketIdSender !== socketIdRef.current) {
            setNewMessage((prevNewMessages) => prevNewMessages + 1);
        }
    };


  let connect = () => {
    if (username.trim() === '') {
      setError(true);
    } else {
      setError(false);
      console.log('Submitted:', username);
      setAskForUsername(false);
      getMedia();
    }
  }

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  useEffect(() => {
    if (screenShare !== undefined) {
        getDislayMedia();
    }
  }, [screenShare])

  let handleScreen = () => {
    setScreenShare(!screenShare)
  }

  let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        // window.location.href = "/"
        routeTo("/home")

    }

  let sendMessage = () => {
    socketRef.current.emit('chat-message', message, username);
    setMessage("")
  }

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  return (
    <div>

      { askForUsername === true ? 
            <div className={styles.lobby} style={{ height:"100vh", overflow: "hidden", backgroundColor: ' #dfe9f3'}}>
                <div onClick={() => {
                    routeTo("/home")
                }} className={styles.appBrand} >
                    <img src="Brand.png" alt="LOGO" />
                    <h2>PeerMesh</h2>
                </div>
                { token === null ? <h2 style={{textAlign: "center"}} >Welcome Guest User &nbsp; want to  <span style={{color: "#D97500", cursor:"pointer"}} onClick={() => { routeTo("/auth")}}>Login</span> ??</h2> : <></>}
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyUserVideo}>
                        <video ref={localVideoRef} autoPlay muted  ></video>
                    </div>
                    <div className={styles.lobbyInput}>
                        <h2>Enter into the Lobby</h2>
                        <p style={{marginBottom: "1rem"}} >Preview your video and enter a Name</p>
                        <div className={styles.lobbyInputField} >
                            <TextField 
                            id="outlined-basic" 
                            label="Username" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            variant="outlined" 
                            error={error}
                             />
                            <Button variant="contained" color="success" onClick={connect} >Join &nbsp;&#8594;</Button>
                        </div>
                        {error && <p style={{color: "red", marginBottom:".3rem"}}>Username is required</p>}
                    </div>
                </div>
            </div>
        :
            <div className={styles.meetVideoContainer}>

                { showModal && 
                    <div>
                        <div className={`${styles.chatContainer} ${!showModal ? styles.hidden : null}`} >
                            <h1>Chat</h1>
                            <div className={styles.chatDisplay}>
                                {messages.length > 0 && messages.map((item, idx) => {
                                    return (
                                        <div ref={messagesEndRef} key={idx}>
                                            <p style={{
                                                fontSize: "0.8rem",
                                                color: "#ffd700",
                                                fontWeight: 600,
                                                marginBottom: "0.25rem"
                                                }} >
                                                    {item.sender}
                                            </p>
                                            <p style={{
                                                paddingLeft: "1rem",
                                                  background: "rgba(255, 255, 255, 0.1)",
                                                padding: "0.75rem 1rem",
                                                borderRadius: "12px",
                                                color: "#fff",
                                                maxWidth: "95%",
                                                wordWrap: "break-word"
                                                }} >{ item.data }</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={styles.chatInput}>
                                <input label="Message" value={message} onChange={e => setMessage(e.target.value)} type="text" placeholder="Type a message..." id='msgTxt' required />
                                <button onClick={sendMessage} >Send</button>
                            </div>
                        </div>
                     </div>
                    }

                <div className= { styles.buttonContainer}>
                    <IconButton onClick={handleVideo} >
                        { ( video === true ) ? <VideocamIcon /> : <VideocamOffIcon/>}
                    </IconButton>
                    <IconButton onClick={handleAudio} >
                        { ( audio === true ) ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                    <IconButton >
                        { ( true ) ? <VolumeUpOutlinedIcon /> : <VolumeOffOutlinedIcon />}
                    </IconButton>
                    <IconButton onClick={handleEndCall} className={ styles.hangup } >
                        <CallEndIcon  /> 
                    </IconButton>
                    {screenShareAvailable === true ? 
                    <IconButton onClick={handleScreen}>
                        { screen === true ? <ScreenShareOutlinedIcon />: <StopScreenShareOutlinedIcon />}
                    </IconButton>: <></>}   
                    <Badge badgeContent = {newMessage} max={999} color='secondary' >
                        <IconButton onClick={() => setModal((!showModal))}>
                             { showModal === false ?  <CommentsDisabledOutlinedIcon /> : <ChatBubbleOutlineOutlinedIcon /> }
                        </IconButton>
                    </Badge>
                </div>

                
                
                <div className={`${styles.conferenceView} ${ showModal ? styles.mainShrinked : styles.main} ` }>
                    <video className= {styles.meetUserVideo} ref={localVideoRef} autoPlay muted  ></video>
                    { videos.map((video) => (
                        <div key={video.socketId} >

                            <video
                                data-socket = {video.socketId}
                                ref= { ref => {
                                    if ( ref && video.stream) {
                                        ref.srcObject = video.stream;
                                    }
                                }}
                                autoPlay
                            ></video>
                        </div>
                    ))}
                </div>
            </div>
            }
    </div>
  )
}




// the last of connect to socket 
 // try {   // could be done in this manner too modern and with async await
                //     // Modern way to add media: addTrack
                //     window.localStream.getTracks().forEach(track => {
                //         peerConnection.addTrack(track, window.localStream);
                //     });

                //     // Create SDP offer
                //     const offer = await peerConnection.createOffer();
                    
                //     // Set it as your local description
                //     await peerConnection.setLocalDescription(offer);

                //     // Send it to the other peer via socket.io
                //     socketRef.current.emit("signal", id2, JSON.stringify({
                //         sdp: peerConnection.localDescription
                //     }));

                //     } catch (e) {
                //     console.log("WebRTC offer error for peer", id2, e);
                //     }