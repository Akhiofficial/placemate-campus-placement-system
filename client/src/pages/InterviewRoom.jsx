import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Monitor, 
  MessageSquare, Copy, Check, ShieldCheck, Users, Sparkles, Send, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

const InterviewRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // WebRTC & Socket refs
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // States
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  const userIdRef = useRef(`user_${Math.floor(Math.random() * 10000)}`);

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // 1. Initialize Socket.io
    const backendUrl = window.location.origin.includes('5173')
      ? 'http://localhost:5000'
      : window.location.origin;

    socketRef.current = io(backendUrl);

    // 2. Access Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Join socket room
        socketRef.current.emit('join-room', roomId, userIdRef.current);
        setIsConnected(true);

        // Socket Event Handling
        socketRef.current.on('user-connected', (remoteUserId) => {
          toast.success('Interview participant joined room!');
          setPeerConnected(true);
          createOffer();
        });

        socketRef.current.on('offer', async (data) => {
          setPeerConnected(true);
          await handleOffer(data.offer);
        });

        socketRef.current.on('answer', async (data) => {
          await handleAnswer(data.answer);
        });

        socketRef.current.on('ice-candidate', async (data) => {
          if (peerRef.current && data.candidate) {
            try {
              await peerRef.current.addIceCandidate(data.candidate);
            } catch (err) {
              console.error('Error adding ICE candidate', err);
            }
          }
        });

        socketRef.current.on('user-disconnected', () => {
          toast.error('Participant left the interview');
          setPeerConnected(false);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        });

        socketRef.current.on('receive-message', (data) => {
          setMessages((prev) => [...prev, data]);
        });
      })
      .catch((err) => {
        console.error('Media stream error:', err);
        toast.error('Could not access camera/microphone. Please allow permissions.');
      });

    return () => {
      // Clean up stream & socket
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  // PeerConnection creation helper
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote tracks
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setPeerConnected(true);
      }
    };

    peerRef.current = pc;
    return pc;
  };

  const createOffer = async () => {
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit('offer', {
      roomId,
      offer,
    });
  };

  const handleOffer = async (offer) => {
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit('answer', {
      roomId,
      answer,
    });
  };

  const handleAnswer = async (answer) => {
    if (peerRef.current) {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  // Toggle Controls
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (peerRef.current) {
          const sender = peerRef.current.getSenders().find((s) => s.track.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
        toast.success('Sharing your screen');
      } catch (err) {
        console.error('Screen sharing error:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (peerRef.current && videoTrack) {
      const sender = peerRef.current.getSenders().find((s) => s.track.kind === 'video');
      if (sender) sender.replaceTrack(videoTrack);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    setIsScreenSharing(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msgObj = {
      sender: 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, msgObj]);
    socketRef.current.emit('send-message', {
      roomId,
      sender: 'Participant',
      text: chatInput.trim(),
      time: msgObj.time,
    });

    setChatInput('');
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Interview room link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    toast.success('Interview ended');
    navigate(-1);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Main Video Stage */}
      <div className="relative flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
        {/* Top Floating Glass Header */}
        <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between px-6 py-3 bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
                PlaceMate Live Interview
                <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                  WebRTC P2P
                </span>
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  Room: {roomId.substring(0, 8)}...
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {formatTime(callDuration)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyRoomLink}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium rounded-xl transition text-slate-200 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Invite Link'}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Encrypted</span>
            </div>
          </div>
        </header>

        {/* Video Display Area */}
        <div className="relative flex-1 flex items-center justify-center p-4 pt-20 pb-24">
          {/* Main Remote Video Stream */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${peerConnected ? 'block' : 'hidden'}`}
            />

            {/* Waiting Placeholder if Peer not connected */}
            {!peerConnected && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-xl">
                    <Users className="w-10 h-10 text-slate-400 animate-bounce" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full animate-ping"></div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-slate-200">Waiting for interviewer / candidate to join</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Share the room link or copy the URL above so the other participant can join your live video session.
                  </p>
                </div>
              </div>
            )}

            {/* Secondary Local Video PIP Overlay */}
            <div className="absolute bottom-6 right-6 w-48 h-36 sm:w-64 sm:h-44 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl z-10 group transition-transform hover:scale-105">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
              />
              {isVideoOff && (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400">
                  <VideoOff className="w-8 h-8 mb-1 text-slate-500" />
                  <span className="text-[11px]">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-[10px] font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                You (Local)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Dock Navigation Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-6 py-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl">
          <button
            onClick={toggleAudio}
            className={`p-3.5 rounded-2xl transition shadow-lg cursor-pointer ${
              isAudioMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
            title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-2xl transition shadow-lg cursor-pointer ${
              isVideoOff
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3.5 rounded-2xl transition shadow-lg cursor-pointer ${
              isScreenSharing
                ? 'bg-blue-600 text-white border border-blue-400'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
            title="Share Screen"
          >
            <Monitor className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3.5 rounded-2xl transition shadow-lg relative cursor-pointer ${
              showChat
                ? 'bg-blue-600 text-white border border-blue-400'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Room Chat"
          >
            <MessageSquare className="w-5 h-5" />
            {messages.length > 0 && !showChat && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900"></span>
            )}
          </button>

          <div className="w-px h-8 bg-slate-800 mx-1"></div>

          <button
            onClick={endCall}
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-2xl transition shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" />
            <span>Leave Call</span>
          </button>
        </div>
      </div>

      {/* Side Chat Drawer */}
      {showChat && (
        <aside className="w-80 sm:w-96 h-full bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800/80 flex flex-col shadow-2xl z-30 animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-slate-200 text-sm">Interview Chat</h2>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center space-y-2">
                <MessageSquare className="w-8 h-8 opacity-40" />
                <p>No messages sent yet. Send notes or links during your interview call.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col space-y-1 ${
                    msg.sender === 'You' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>{msg.sender}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'You'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500/60"
            />
            <button
              type="submit"
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      )}
    </div>
  );
};

export default InterviewRoom;
