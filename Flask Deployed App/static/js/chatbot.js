/**
 * AI Plant Assistant — Chatbot Widget
 * A floating chat widget for plant disease Q&A.
 */
(function () {
    'use strict';

    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    if (!chatWidget || !chatToggle) return;

    // Toggle open / close
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) {
            chatInput.focus();
            // Show welcome message if first open
            if (chatMessages.children.length === 0) {
                addBotMessage(
                    "Hello! 🌿 I'm your **AI Plant Assistant**.\n\nAsk me about plant diseases, prevention steps, or supplement recommendations!",
                    ['What diseases affect tomato?', 'Show all crops', 'Help']
                );
            }
        }
    });

    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('open');
    });

    // Send message
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addUserMessage(text);
        chatInput.value = '';
        showTyping();

        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        })
            .then(res => res.json())
            .then(data => {
                hideTyping();
                addBotMessage(data.reply, data.suggestions || []);
                
                // If voice read-aloud is enabled, speak the response
                if (window.voiceAssistant && window.voiceAssistant.speakEnabled) {
                    window.voiceAssistant.speak(data.reply.replace(/\*\*/g, '').replace(/[🌿🤖🔍💊🛡️🌱🍂🤔•]/g, ''));
                }
            })
            .catch(() => {
                hideTyping();
                addBotMessage("Sorry, something went wrong. Please try again.", []);
            });
    }

    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.innerHTML = `<div class="chat-bubble user">${escapeHtml(text)}</div>`;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function addBotMessage(text, suggestions) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';

        // Simple markdown-like formatting
        let html = escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #2ecc71;">$1</a>');

        let bubbleHtml = `<div class="chat-bubble bot">${html}</div>`;

        if (suggestions && suggestions.length > 0) {
            bubbleHtml += '<div class="chat-suggestions">';
            suggestions.forEach(s => {
                bubbleHtml += `<button class="chat-suggestion-chip" onclick="window.chatSendSuggestion('${escapeHtml(s)}')">${escapeHtml(s)}</button>`;
            });
            bubbleHtml += '</div>';
        }

        div.innerHTML = bubbleHtml;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function showTyping() {
        let typing = document.getElementById('typing-indicator');
        if (!typing) {
            typing = document.createElement('div');
            typing.id = 'typing-indicator';
            typing.className = 'chat-msg bot';
            typing.innerHTML = `<div class="chat-bubble bot typing-dots"><span></span><span></span><span></span></div>`;
            chatMessages.appendChild(typing);
        }
        scrollToBottom();
    }

    function hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Global function so suggestion chips can call it
    window.chatSendSuggestion = function (text) {
        chatInput.value = text;
        sendMessage();
    };

    // Public API for voice assistant integration
    window.chatAssistant = {
        sendFromVoice: function (text) {
            chatWidget.classList.add('open');
            chatInput.value = text;
            sendMessage();
        }
    };
})();
