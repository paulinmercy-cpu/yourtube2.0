"use client";

export class WebRTCManager {
  peer: RTCPeerConnection;

  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
      ],
    });
  }

  //--------------------------------------------------
  // Add Local Stream
  //--------------------------------------------------

  addStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      this.peer.addTrack(track, stream);
    });
  }

  //--------------------------------------------------
  // Create Offer
  //--------------------------------------------------

  async createOffer() {
    const offer = await this.peer.createOffer();

    await this.peer.setLocalDescription(offer);

    return offer;
  }

  //--------------------------------------------------
  // Create Answer
  //--------------------------------------------------

  async createAnswer(
    offer: RTCSessionDescriptionInit
  ) {
    await this.peer.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await this.peer.createAnswer();

    await this.peer.setLocalDescription(answer);

    return answer;
  }

  //--------------------------------------------------
  // Receive Answer
  //--------------------------------------------------

  async receiveAnswer(
    answer: RTCSessionDescriptionInit
  ) {
    await this.peer.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  //--------------------------------------------------
  // Receive ICE Candidate
  //--------------------------------------------------

  async addIceCandidate(
    candidate: RTCIceCandidateInit
  ) {
    try {
      await this.peer.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("ICE Error:", error);
    }
  }

  //--------------------------------------------------
  // Send ICE Candidate
  //--------------------------------------------------

  onIceCandidate(
    callback: (candidate: RTCIceCandidate) => void
  ) {
    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        callback(event.candidate);
      }
    };
  }

  //--------------------------------------------------
  // Remote Stream
  //--------------------------------------------------

  onRemoteStream(
    callback: (stream: MediaStream) => void
  ) {
    this.peer.ontrack = (event) => {
      if (event.streams.length > 0) {
        callback(event.streams[0]);
      }
    };
  }

  //--------------------------------------------------
  // Connection State
  //--------------------------------------------------

  onConnectionStateChange(
    callback: (state: RTCPeerConnectionState) => void
  ) {
    this.peer.onconnectionstatechange = () => {
      callback(this.peer.connectionState);
    };
  }

  //--------------------------------------------------
  // Get Senders
  //--------------------------------------------------

  getSenders() {
    return this.peer.getSenders();
  }

  //--------------------------------------------------
  // Replace Video Track
  //--------------------------------------------------

  replaceVideoTrack(track: MediaStreamTrack) {
    const sender = this.peer
      .getSenders()
      .find((s) => s.track?.kind === "video");

    sender?.replaceTrack(track);
  }

  //--------------------------------------------------
  // Close Connection
  //--------------------------------------------------

  close() {
    if (this.peer.signalingState !== "closed") {
      this.peer.close();
    }
  }
}