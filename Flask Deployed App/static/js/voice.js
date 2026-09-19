/**
 * Voice Assistant
 * Uses Web Speech API (SpeechRecognition + SpeechSynthesis)
 * Supports Speech-to-Text in 5 languages (English, Hindi, Kannada, Tamil, Telugu)
 * and Text-to-Speech playback for bot responses.
 */
(function () {
    'use strict';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let currentSpeechLang = 'en-IN';
    let isListening = false;
    let speakEnabled = true;

    // UI elements
    const voiceBtn = document.getElementById('voice-fab-btn');
    const voiceOverlay = document.getElementById('voice-listening-overlay');
    const voiceStatusText = document.getElementById('voice-status-text');
    const voiceTranscriptText = document.getElementById('voice-transcript-text');
    const voiceCloseBtn = document.getElementById('voice-overlay-close');
    const ttsToggleBtn = document.getElementById('chat-tts-toggle');

    // Setup speech synthesis
    const synth = window.speechSynthesis;

    function initRecognition() {
        if (!SpeechRecognition) {
            console.warn('SpeechRecognition is not supported in this browser.');
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = currentSpeechLang;

        recognition.onstart = () => {
            isListening = true;
            updateVoiceUI(true);
            if (voiceStatusText) voiceStatusText.textContent = getListeningPrompt();
            if (voiceTranscriptText) voiceTranscriptText.textContent = '';
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (voiceTranscriptText) {
                voiceTranscriptText.textContent = finalTranscript || interimTranscript;
            }

            if (finalTranscript) {
                setTimeout(() => {
                    stopListening();
                    handleSpokenInput(finalTranscript.trim());
                }, 600);
            }
        };

        recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            isListening = false;
            updateVoiceUI(false);
            if (voiceStatusText) {
                if (event.error === 'not-allowed') {
                    voiceStatusText.textContent = 'Microphone permission denied. Please allow mic access.';
                } else if (event.error === 'no-speech') {
                    voiceStatusText.textContent = 'No speech detected. Try again.';
                } else {
                    voiceStatusText.textContent = 'Voice error: ' + event.error;
                }
            }
            setTimeout(() => {
                if (voiceOverlay) voiceOverlay.classList.remove('active');
            }, 2500);
        };

        recognition.onend = () => {
            isListening = false;
            updateVoiceUI(false);
        };
    }

    function getListeningPrompt() {
        const lang = (window.i18n && window.i18n.getCurrentLang()) || 'en';
        const prompts = {
            en: 'Listening... Speak about any plant or disease',
            hi: 'सुन रहे हैं... किसी पौधे या बीमारी के बारे में बोलें',
            kn: 'ಕೇಳುತ್ತಿದ್ದೇವೆ... ಸಸ್ಯ ಅಥವಾ ರೋಗದ ಬಗ್ಗೆ ಮಾತನಾಡಿ',
            ta: 'கேட்கிறோம்... ஏதேனும் பயிர் அல்லது நோய் பற்றி பேசுங்கள்',
            te: 'వింటున్నాము... ఏదైనా మొక్క లేదా తెగులు గురించి మాట్లాడండి'
        };
        return prompts[lang] || prompts.en;
    }

    function startListening() {
        if (!SpeechRecognition) {
            alert('Speech Recognition is not supported on this browser. Please use Chrome, Edge, or Safari.');
            return;
        }
        if (synth && synth.speaking) {
            synth.cancel();
        }
        if (!recognition) {
            initRecognition();
        }
        if (recognition) {
            try {
                if (window.i18n) {
                    recognition.lang = window.i18n.getSpeechLang();
                } else {
                    recognition.lang = currentSpeechLang;
                }
                recognition.start();
            } catch (err) {
                console.warn('Recognition start error:', err);
            }
        }
    }

    function stopListening() {
        if (recognition && isListening) {
            recognition.stop();
        }
        isListening = false;
        updateVoiceUI(false);
    }

    function toggleListening() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    function updateVoiceUI(listening) {
        if (voiceBtn) {
            voiceBtn.classList.toggle('listening', listening);
        }
        if (voiceOverlay) {
            voiceOverlay.classList.toggle('active', listening);
        }
    }

    function handleSpokenInput(text) {
        if (!text) return;

        // Route query to AI Chat Assistant
        if (window.chatAssistant && typeof window.chatAssistant.sendFromVoice === 'function') {
            window.chatAssistant.sendFromVoice(text);
        } else {
            const chatInput = document.getElementById('chat-input');
            const chatSend = document.getElementById('chat-send');
            const chatWidget = document.getElementById('chat-widget');
            if (chatWidget) chatWidget.classList.add('open');
            if (chatInput && chatSend) {
                chatInput.value = text;
                chatSend.click();
            }
        }
    }

    // Text to Speech
    function speak(text) {
        if (!speakEnabled || !synth) return;

        synth.cancel(); // Stop any ongoing speech
        if (!text || !text.trim()) return;

        const utterance = new SpeechSynthesisUtterance(text);
        const langCode = (window.i18n && window.i18n.getSpeechLang()) || currentSpeechLang;
        utterance.lang = langCode;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to pick a natural voice matching the language
        const voices = synth.getVoices();
        const matchingVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        synth.speak(utterance);
    }

    function toggleSpeak() {
        speakEnabled = !speakEnabled;
        if (!speakEnabled && synth) {
            synth.cancel();
        }
        if (ttsToggleBtn) {
            ttsToggleBtn.classList.toggle('muted', !speakEnabled);
            ttsToggleBtn.title = speakEnabled ? 'Voice responses ON' : 'Voice responses OFF';
            ttsToggleBtn.innerHTML = speakEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        }
        return speakEnabled;
    }

    // Event listeners
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleListening);
    }

    if (voiceCloseBtn) {
        voiceCloseBtn.addEventListener('click', stopListening);
    }

    if (ttsToggleBtn) {
        ttsToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSpeak();
        });
    }

    // Public API
    window.voiceAssistant = {
        start: startListening,
        stop: stopListening,
        toggle: toggleListening,
        speak: speak,
        toggleSpeak: toggleSpeak,
        get speakEnabled() { return speakEnabled; },
        setLanguage: function (code) {
            currentSpeechLang = code;
            if (recognition) recognition.lang = code;
        }
    };
})();
