'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';

// Vapi Configuration
const VAPI_PUBLIC_KEY = '2cbf0b35-03ca-43ea-8a7e-7197d3e7b290';
const DEFAULT_ASSISTANT_ID = '20b94c7f-c293-4c22-9d1a-2a9a2fcd22a2';

interface TranscriptEntry {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

export default function VoiceTestPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'assistant' | null>(null);
  const [assistantId, setAssistantId] = useState(DEFAULT_ASSISTANT_ID);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const vapiRef = useRef<Vapi | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const addTranscriptEntry = useCallback((role: 'user' | 'assistant' | 'system', text: string) => {
    setTranscript(prev => [...prev, { role, text, timestamp: new Date() }]);
  }, []);

  // Initialize Vapi SDK
  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    // Set up event listeners
    vapi.on('call-start', () => {
      console.log('Call started');
      setIsConnected(true);
      setIsConnecting(false);
      addTranscriptEntry('system', 'Call connected');
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsConnecting(false);
      setCurrentSpeaker(null);
      addTranscriptEntry('system', 'Call ended');
    });

    vapi.on('speech-start', () => {
      setCurrentSpeaker('assistant');
    });

    vapi.on('speech-end', () => {
      setCurrentSpeaker(null);
    });

    vapi.on('message', (message) => {
      console.log('Vapi message:', message);

      if (message.type === 'transcript') {
        if (message.transcriptType === 'final' && message.transcript) {
          addTranscriptEntry(message.role || 'user', message.transcript);
        }
      }

      if (message.type === 'function-call' && message.functionCall) {
        addTranscriptEntry('system', `Checking availability: ${JSON.stringify(message.functionCall.parameters)}`);
      }
    });

    vapi.on('error', (error) => {
      console.error('Vapi error:', error);
      setError(typeof error === 'string' ? error : 'An error occurred');
      setIsConnected(false);
      setIsConnecting(false);
    });

    setSdkReady(true);

    return () => {
      vapi.stop();
    };
  }, [addTranscriptEntry]);

  const startCall = async () => {
    if (!assistantId) {
      setError('Please enter an Assistant ID.');
      return;
    }

    if (!vapiRef.current) {
      setError('Vapi SDK not initialized. Please refresh the page.');
      return;
    }

    setError(null);
    setIsConnecting(true);
    setTranscript([]);

    try {
      await vapiRef.current.start(assistantId);
    } catch (err) {
      console.error('Error starting call:', err);
      setError(err instanceof Error ? err.message : 'Failed to start call');
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setIsConnected(false);
    setCurrentSpeaker(null);
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Il Buco Voice Assistant</h1>
          <p className="text-gray-400">
            Test the Vapi.ai voice interface for Il Buco
          </p>
          {sdkReady && (
            <p className="text-green-500 text-sm mt-2">SDK Ready</p>
          )}
        </div>

        {/* Assistant ID Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Assistant ID
          </label>
          <input
            type="text"
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
            placeholder="Enter the Assistant ID"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!isConnected ? (
            <button
              onClick={startCall}
              disabled={isConnecting || !sdkReady}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all ${
                isConnecting || !sdkReady
                  ? 'bg-gray-600 cursor-wait'
                  : 'bg-green-600 hover:bg-green-500 active:scale-95'
              }`}
            >
              <Phone className="w-6 h-6" />
              {isConnecting ? 'Connecting...' : 'Start Call'}
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`flex items-center gap-2 px-6 py-4 rounded-full font-semibold transition-all ${
                  isMuted
                    ? 'bg-yellow-600 hover:bg-yellow-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={endCall}
                className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 rounded-full font-semibold transition-all active:scale-95"
              >
                <PhoneOff className="w-6 h-6" />
                End Call
              </button>
            </>
          )}
        </div>

        {/* Speaking Indicator */}
        {isConnected && (
          <div className="flex justify-center mb-8">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${
              currentSpeaker === 'assistant'
                ? 'bg-blue-600/50 border border-blue-500'
                : 'bg-gray-800 border border-gray-700'
            }`}>
              <Volume2 className={`w-5 h-5 ${currentSpeaker === 'assistant' ? 'animate-pulse' : ''}`} />
              <span className="text-sm">
                {currentSpeaker === 'assistant' ? 'Assistant speaking...' : 'Listening...'}
              </span>
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700 bg-gray-800">
            <h2 className="font-semibold">Conversation Transcript</h2>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {transcript.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Start a call to see the transcript here
              </p>
            ) : (
              transcript.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${
                    entry.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      entry.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : entry.role === 'assistant'
                        ? 'bg-gray-700 text-white rounded-bl-none'
                        : 'bg-gray-900 text-gray-400 text-sm italic w-full text-center'
                    }`}
                  >
                    {entry.role !== 'system' && (
                      <span className="text-xs opacity-60 block mb-1">
                        {entry.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                    )}
                    <p>{entry.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
          <h3 className="font-semibold mb-4">How to Test</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
            <li>Click &quot;Start Call&quot; and allow microphone access</li>
            <li>Speak naturally - try asking about room availability!</li>
            <li>The assistant will respond in your language</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800">
            <p className="text-blue-200 text-sm">
              <strong>Tip:</strong> Try saying &quot;Hola, quiero saber qué habitaciones hay disponibles&quot; or &quot;What rooms do you have available?&quot;
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Assistant ID: {assistantId.substring(0, 8)}...</p>
        </div>
      </div>
    </div>
  );
}
