// components/VoiceAssistant/SampadaVoiceButton.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SampadaVoice.module.css';

const SampadaVoiceButton = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    const recognitionRef = useRef(null);
    const synthesisRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthesisRef.current = window.speechSynthesis;

            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-IN'; // Indian English

                recognition.onresult = (event) => {
                    const text = event.results[0][0].transcript;
                    setTranscript(text);
                    handleVoiceInput(text);
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            } else {
                setIsSupported(false);
            }
        }
    }, []);

    // Handle voice input - send to backend
    const handleVoiceInput = useCallback(async (text) => {
        try {
            setResponse('Thinking...');

            const res = await fetch('/api/sampada/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    context: {
                        currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
                    }
                })
            });

            const data = await res.json();

            // Display and speak the response
            setResponse(data.response || data.text || "I'm here to help!");
            speakResponse(data.response || data.text || "I'm here to help!");

            // Execute any actions
            if (data.action && data.action.type) {
                executeAction(data.action);
            }

        } catch (error) {
            console.error('Error processing voice input:', error);
            const errorMsg = "I'm sorry, I couldn't process that. Could you try again?";
            setResponse(errorMsg);
            speakResponse(errorMsg);
        }
    }, []);

    // Text-to-Speech with female voice
    const speakResponse = useCallback((text) => {
        if (!synthesisRef.current) return;

        setIsSpeaking(true);

        // Cancel any ongoing speech
        synthesisRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Configure voice (select female voice)
        const voices = synthesisRef.current.getVoices();
        const femaleVoice = voices.find(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.includes('Zira') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Google') && voice.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.1; // Slightly higher for feminine sound
        utterance.volume = 1.0;

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        synthesisRef.current.speak(utterance);
    }, []);

    // Execute actions based on AI response
    const executeAction = useCallback((action) => {
        if (!action) return;

        switch (action.type) {
            case 'NAVIGATE':
                if (action.url) {
                    window.location.href = action.url;
                }
                break;
            case 'SEARCH':
                if (action.query) {
                    window.location.href = `/search?q=${encodeURIComponent(action.query)}`;
                }
                break;
            default:
                console.log('Action received:', action);
        }
    }, []);

    // Start listening
    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            setIsListening(true);
            setTranscript('');
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error('Recognition start error:', e);
                setIsListening(false);
            }
        }
    }, []);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    // Quick action buttons
    const handleQuickAction = useCallback((text) => {
        setTranscript(text);
        handleVoiceInput(text);
    }, [handleVoiceInput]);

    if (!isSupported) {
        return null; // Don't render if speech recognition not supported
    }

    return (
        <>
            {/* Floating Button */}
            <div className={`${styles.sampadaVoiceButton} ${isOpen ? styles.open : ''}`}>
                <button
                    className={styles.voiceTrigger}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close voice assistant' : 'Open voice assistant'}
                >
                    {isOpen ? (
                        <span className={styles.closeIcon}>✕</span>
                    ) : (
                        <>
                            <span className={styles.sampadaIcon}>🎙️</span>
                            <span className={styles.pulseRing}></span>
                        </>
                    )}
                </button>

                {/* Voice Interface Panel */}
                {isOpen && (
                    <div className={styles.voicePanel}>
                        <div className={styles.voiceHeader}>
                            <div className={styles.sampadaAvatar}>
                                <span className={styles.avatarEmoji}>👩‍💼</span>
                            </div>
                            <div className={styles.headerText}>
                                <h3>Sampada</h3>
                                <p>Your AI Shopping Assistant</p>
                            </div>
                        </div>

                        <div className={styles.voiceContent}>
                            {/* Status Indicator */}
                            <div className={styles.statusIndicator}>
                                {isListening && (
                                    <div className={styles.listeningAnimation}>
                                        <div className={styles.wave}></div>
                                        <div className={styles.wave}></div>
                                        <div className={styles.wave}></div>
                                        <p>Listening...</p>
                                    </div>
                                )}

                                {isSpeaking && (
                                    <div className={styles.speakingAnimation}>
                                        <div className={styles.soundWave}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <p>Speaking...</p>
                                    </div>
                                )}

                                {!isListening && !isSpeaking && (
                                    <p className={styles.idleText}>👋 Hi! How can I help you today?</p>
                                )}
                            </div>

                            {/* Transcript Display */}
                            {transcript && (
                                <div className={styles.transcript}>
                                    <strong>You:</strong> {transcript}
                                </div>
                            )}

                            {/* Response Display */}
                            {response && (
                                <div className={styles.response}>
                                    <strong>Sampada:</strong> {response}
                                </div>
                            )}

                            {/* Voice Control Button */}
                            <button
                                className={`${styles.voiceControlBtn} ${isListening ? styles.listening : ''}`}
                                onClick={isListening ? stopListening : startListening}
                                disabled={isSpeaking}
                            >
                                {isListening ? (
                                    <>
                                        <span className={`${styles.micIcon} ${styles.active}`}>🎤</span>
                                        <span>Tap to stop</span>
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.micIcon}>🎤</span>
                                        <span>Tap to speak</span>
                                    </>
                                )}
                            </button>

                            {/* Quick Actions */}
                            <div className={styles.quickActions}>
                                <p>Try saying:</p>
                                <div className={styles.suggestionChips}>
                                    <button onClick={() => handleQuickAction("Show me men's t-shirts")}>
                                        "Show me men's t-shirts"
                                    </button>
                                    <button onClick={() => handleQuickAction("What's on sale?")}>
                                        "What's on sale?"
                                    </button>
                                    <button onClick={() => handleQuickAction("Track my order")}>
                                        "Track my order"
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SampadaVoiceButton;
