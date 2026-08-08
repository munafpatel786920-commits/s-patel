import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Monitor,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const CallModal: React.FC = () => {
  const { activeCall, endCall, toggleMuteCall, toggleVideoCall } = useChat();

  const [callTimer, setCallTimer] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Live WebRTC/Camera preview
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    if (activeCall && activeCall.status === 'connected' && !activeCall.isVideoOff) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          mediaStream = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log('Camera/Mic permission notice:', err);
        });
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeCall?.status, activeCall?.isVideoOff]);

  // Call Duration Timer
  useEffect(() => {
    let timer: any = null;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCall?.status]);

  if (!activeCall) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-[#111b21]">
        <div className="flex items-center gap-2 bg-white border border-[#e9edef] px-3 py-1.5 rounded-full text-xs font-mono shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#00a884]" />
          <span>HD End-to-End Encrypted {activeCall.type === 'video' ? 'Video' : 'Voice'} Call</span>
        </div>

        <button className="p-2 rounded-xl bg-white border border-[#e9edef] hover:bg-[#f0f2f5] text-[#54656f] shadow-xs">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Call View */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-4">
        {activeCall.type === 'video' && !activeCall.isVideoOff ? (
          <div className="w-full max-w-2xl h-80 md:h-96 rounded-3xl bg-white border border-[#e9edef] overflow-hidden relative shadow-2xl flex items-center justify-center">
            {/* Live Camera Feed */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Remote Overlay Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-[#e9edef] flex items-center gap-2 shadow-sm">
              <img
                src={activeCall.remoteUser.avatar}
                alt={activeCall.remoteUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-[#111b21]">{activeCall.remoteUser.name}</span>
            </div>
          </div>
        ) : (
          /* Voice Call Audio Visualizer & Avatar */
          <div className="flex flex-col items-center text-center bg-white border border-[#e9edef] p-8 rounded-3xl shadow-xl max-w-md w-full">
            <div className="relative mb-6">
              <span className="absolute inset-0 rounded-full bg-[#00a884]/20 animate-ping opacity-75" />
              <img
                src={activeCall.remoteUser.avatar}
                alt={activeCall.remoteUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#00a884] shadow-md relative z-10"
              />
            </div>

            <h3 className="text-2xl font-bold text-[#111b21] mb-1">{activeCall.remoteUser.name}</h3>
            <p className="text-sm text-[#00a884] font-mono font-medium">
              {activeCall.status === 'calling'
                ? 'Ringing...'
                : activeCall.status === 'connected'
                ? formatTimer(callTimer)
                : 'Call Ended'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          onClick={toggleMuteCall}
          className={`p-4 rounded-2xl border transition-all shadow-sm ${
            activeCall.isMuted
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-white text-[#111b21] border-[#e9edef] hover:bg-[#f0f2f5]'
          }`}
          title={activeCall.isMuted ? 'Unmute' : 'Mute'}
        >
          {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleVideoCall}
          className={`p-4 rounded-2xl border transition-all shadow-sm ${
            activeCall.isVideoOff
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-white text-[#111b21] border-[#e9edef] hover:bg-[#f0f2f5]'
          }`}
          title={activeCall.isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        >
          {activeCall.isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        <button
          onClick={endCall}
          className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:scale-105 transition-transform"
          title="End Call"
        >
          <PhoneOff className="w-7 h-7" />
        </button>

        <button
          className="p-4 rounded-2xl bg-white text-[#111b21] border border-[#e9edef] hover:bg-[#f0f2f5] transition-all shadow-sm"
          title="Speaker Toggle"
        >
          {activeCall.isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        <button
          className="p-4 rounded-2xl bg-white text-[#111b21] border border-[#e9edef] hover:bg-[#f0f2f5] transition-all shadow-sm"
          title="Screen Share"
        >
          <Monitor className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
