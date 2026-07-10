"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { WebRTCManager } from "@/hooks/useWebRTC";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Monitor,
  Circle,
} from "lucide-react";
import CallSidebar from "./call/CallSidebar";
import VideoArea from "./call/VideoArea";
import ControlBar from "./call/ControlBar";
import CallTimer from "./call/CallTimer";

const socket: Socket = io("http://localhost:5000");

export default function VideoCall() {
  //--------------------------------------------------
  // Video Elements
  //--------------------------------------------------

  const localVideo = useRef<HTMLVideoElement>(null);

  const remoteVideo = useRef<HTMLVideoElement>(null);


  //--------------------------------------------------
  // Recorder
  //--------------------------------------------------

  const mediaRecorder =
    useRef<MediaRecorder | null>(null);

  const recordedChunks =
    useRef<Blob[]>([]);

  //--------------------------------------------------
  // WebRTC
  //--------------------------------------------------

  const rtc =
    useRef<WebRTCManager | null>(null);

  //--------------------------------------------------
  // Streams
  //--------------------------------------------------

  const [localStream, setLocalStream] =
    useState<MediaStream | null>(null);

  const [remoteStream, setRemoteStream] =
    useState<MediaStream | null>(null);

  //--------------------------------------------------
  // IDs
  //--------------------------------------------------

  const [myId, setMyId] =
    useState("");
  useEffect(() => {
  console.log("myId changed:", myId);
}, [myId]);

  const [friendId, setFriendId] =
    useState("");

  //--------------------------------------------------
  // Incoming Call
  //--------------------------------------------------

  const [incomingOffer, setIncomingOffer] =
    useState<any>(null);

  const [callerId, setCallerId] =
    useState("");

  //--------------------------------------------------
  // UI States
  //--------------------------------------------------

  const [micOn, setMicOn] =
    useState(true);

  const [cameraOn, setCameraOn] =
    useState(true);

  const [recording, setRecording] =
    useState(false);

  const [callConnected, setCallConnected] =
    useState(false);

  //--------------------------------------------------
  // Online Users
  //--------------------------------------------------

  const [onlineUsers, setOnlineUsers] =
    useState<Record<string, string>>({});

  //--------------------------------------------------
  // Timer
  //--------------------------------------------------

  const [seconds, setSeconds] =
    useState(0);

  const timerRef =
    useRef<NodeJS.Timeout | null>(null);


  //--------------------------------------------------
  // Component Start
  //--------------------------------------------------

  useEffect(() => {
    rtc.current = new WebRTCManager();

    startCamera();

    setupSocket();

    setupPeerEvents();

    return () => {
      rtc.current?.close();

      socket.disconnect();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  //--------------------------------------------------
// Camera
//--------------------------------------------------

async function startCamera() {

  try {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

    setLocalStream(stream);

    if (localVideo.current) {
      localVideo.current.srcObject = stream;
    }

    rtc.current?.addStream(stream);

  } catch (err) {
    console.log(err);
  }

}
//--------------------------------------------------
// Socket
//--------------------------------------------------

function setupSocket() {

  socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);

  const savedUser = localStorage.getItem("user");

  console.log("Saved User:", savedUser);

  if (!savedUser) {
    console.log("No user in localStorage");
    return;
  }

  const user = JSON.parse(savedUser);

  console.log("User:", user);
  console.log("User ID:", user._id);

  setMyId(user._id);

  socket.emit("join", user._id);

  console.log("Joined Socket with:", user._id);
}) 

  socket.on("online-users", (users) => {

    setOnlineUsers(users);

  });

  socket.on("incoming-call", (data) => {

    setCallerId(data.from);

    setIncomingOffer(data.offer);

    alert("Incoming Call");

  });

  socket.on("call-answered", async (data) => {

    await rtc.current?.receiveAnswer(
      data.answer
    );

    startTimer();

  });

  socket.on("ice-candidate", async (data) => {

    await rtc.current?.addIceCandidate(
      data.candidate
    );

  });

}
//--------------------------------------------------
// Peer Events
//--------------------------------------------------

function setupPeerEvents() {
  if (!rtc.current) return;
  rtc.current.onConnectionStateChange((state) => {
  console.log("Connection State:", state);

  if (state === "connected") {
    setCallConnected(true);
  }

  if (
    state === "failed" ||
    state === "closed" ||
    state === "disconnected"
  ) {
    setCallConnected(false);
  }
});

  rtc.current.onIceCandidate((candidate) => {
  socket.emit("ice-candidate", {
    to: friendId || callerId,
    candidate,
  });
});

  rtc.current.onRemoteStream((stream) => {
    setRemoteStream(stream);

    if (remoteVideo.current) {
      remoteVideo.current.srcObject = stream;
    }

    setCallConnected(true);
    setFriendId(callerId);
    
  });
}

//--------------------------------------------------
// Timer
//--------------------------------------------------

function startTimer() {
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  timerRef.current = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);
}

function formatTime() {
  const hrs = Math.floor(seconds / 3600);

  const mins = Math.floor((seconds % 3600) / 60);

  const secs = seconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
//--------------------------------------------------
// Call Friend
//--------------------------------------------------

async function callFriend() {
  try {
    console.log("========== CALL START ==========");
    console.log("My ID:", myId);
    console.log("Friend ID:", friendId);
    console.log("Socket Connected:", socket.connected);

    if (!socket.connected) {
      alert("Socket is not connected to the server.");
      return;
    }

    if (!myId) {
      alert("Your ID is missing.");
      return;
    }

    if (!friendId.trim()) {
      alert("Please enter your friend's ID.");
      return;
    }

    if (friendId === myId) {
      alert("You cannot call yourself.");
      return;
    }

    if (!rtc.current) {
      alert("WebRTC is not initialized.");
      return;
    }

    // Create WebRTC Offer
    const offer = await rtc.current.createOffer();

    console.log("Offer Created:", offer);

    // Send offer to server
    socket.emit("call-user", {
      from: myId,
      to: friendId,
      offer,
    });

    console.log("Call request sent to:", friendId);

    alert("Calling " + friendId);
  } catch (error) {
    console.error("Call Error:", error);
    alert("Failed to start the call.");
  }
}

//--------------------------------------------------
// Answer Call
//--------------------------------------------------

async function answerCall() {
  if (!incomingOffer) {
    alert("No incoming call");
    return;
  }
  setFriendId(callerId);

  const answer =
    await rtc.current?.createAnswer(incomingOffer);

  socket.emit("answer-call", {
    to: callerId,
    answer,
  });

  setCallConnected(true);
  setFriendId(callerId);

  startTimer();

  console.log("Answered");
}

//--------------------------------------------------
// End Call
//--------------------------------------------------

function endCall() {
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  setSeconds(0);

  setCallConnected(false);

  setIncomingOffer(null);

  setCallerId("");

  rtc.current?.close();

  rtc.current = new WebRTCManager();

  localStream?.getTracks().forEach((track) => {
    track.stop();
  });

  remoteStream?.getTracks().forEach((track) => {
    track.stop();
  });

  startCamera();

  setupPeerEvents();

  console.log("Call Ended");
}

//--------------------------------------------------
// Toggle Mic
//--------------------------------------------------

function toggleMic() {
  if (!localStream) return;

  localStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  });
}

//--------------------------------------------------
// Toggle Camera
//--------------------------------------------------

function toggleCamera() {
  if (!localStream) return;

  localStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  });
}
//--------------------------------------------------
// Screen Share
//--------------------------------------------------

async function shareScreen() {
  try {
    const screenStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

    const screenTrack =
      screenStream.getVideoTracks()[0];

    const sender = rtc.current?.peer
      .getSenders()
      .find((s) => s.track?.kind === "video");

    if (sender) {
      sender.replaceTrack(screenTrack);
    }

    if (localVideo.current) {
      localVideo.current.srcObject = screenStream;
    }

    screenTrack.onended = () => {
      if (!localStream) return;

      const cameraTrack =
        localStream.getVideoTracks()[0];

      sender?.replaceTrack(cameraTrack);

      if (localVideo.current) {
        localVideo.current.srcObject = localStream;
      }
    };
  } catch (err) {
    console.log(err);
  }
}

//--------------------------------------------------
// Start Recording
//--------------------------------------------------

function startRecording() {
  if (!localStream) return;

  recordedChunks.current = [];

  const recorder = new MediaRecorder(localStream, {
    mimeType: "video/webm",
  });

  mediaRecorder.current = recorder;

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.current.push(event.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(recordedChunks.current, {
      type: "video/webm",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `Call-${Date.now()}.webm`;

    a.click();

    URL.revokeObjectURL(url);
  };

  recorder.start();

  setRecording(true);
}

//--------------------------------------------------
// Stop Recording
//--------------------------------------------------

function stopRecording() {
  mediaRecorder.current?.stop();

  setRecording(false);

}

return (
  <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">

    {/* Sidebar */}
    <CallSidebar
      myId={myId}
      friendId={friendId}
      setFriendId={setFriendId}
      onlineUsers={onlineUsers}
      callFriend={callFriend}
      answerCall={answerCall}
    />

    {/* Video Section */}
    <div className="flex-1 relative">

      {/* Timer */}
      <CallTimer
        callConnected={callConnected}
        seconds={seconds}
      />

      {/* Videos */}
      <VideoArea
        localVideo={localVideo}
        remoteVideo={remoteVideo}
        callConnected={callConnected}
      />

      {/* Bottom Controls */}
      <ControlBar
        micOn={micOn}
        cameraOn={cameraOn}
        recording={recording}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        shareScreen={shareScreen}
        startRecording={startRecording}
        stopRecording={stopRecording}
        endCall={endCall}
      />

    </div>

  </div>
);}