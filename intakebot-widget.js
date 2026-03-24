/**
 * IntakeBot Widget v0.1.0
 * Embeddable conversational AI intake — drop on any website
 * Usage: <script src="intakebot-widget.js" data-intakebot="YOUR_BOT_ID"></script>
 * 
 * Configuration via data attributes:
 *   data-intakebot="botId"          - Your bot ID (required)
 *   data-theme="light|dark"         - Widget theme (default: light)
 *   data-position="right|left"      - Widget position (default: right)
 *   data-accent="#6366f1"           - Accent color (default: indigo)
 *   data-greeting="Hi there!"      - Custom greeting
 *   data-template="law|freelance|agency|coaching|therapy|custom"
 *   data-name="Your Company"       - Business name shown in header
 *   data-avatar=""                  - Avatar URL for the bot
 *   data-webhook=""                 - Webhook URL to POST completed intakes
 * 
 * Size: <12KB minified
 * Dependencies: None
 * Browser support: All modern browsers
 */
(function() {
  'use strict';

  // Prevent double-init
  if (window.__intakebot_loaded) return;
  window.__intakebot_loaded = true;

  // ─── Configuration ───────────────────────────────────────
  const script = document.currentScript || document.querySelector('script[data-intakebot]');
  const config = {
    botId: script?.getAttribute('data-intakebot') || 'demo',
    theme: script?.getAttribute('data-theme') || 'light',
    position: script?.getAttribute('data-position') || 'right',
    accent: script?.getAttribute('data-accent') || '#6366f1',
    greeting: script?.getAttribute('data-greeting') || '',
    template: script?.getAttribute('data-template') || 'law',
    name: script?.getAttribute('data-name') || 'IntakeBot',
    avatar: script?.getAttribute('data-avatar') || '',
    webhook: script?.getAttribute('data-webhook') || '',
  };

  // ─── Templates ───────────────────────────────────────────
  const templates = {
    law: {
      name: 'Legal Intake',
      icon: '⚖️',
      greeting: "Hi! I'm here to help you get started with your legal matter. What type of issue can I help with?",
      steps: [
        { id: 'type', question: "What type of legal matter is this?", options: ["Employment", "Immigration", "Personal Injury", "Family Law", "Criminal Defense", "Business/Contract", "Other"] },
        { id: 'urgency', question: "How urgent is this? Do you have any upcoming court dates or deadlines?", options: ["Very urgent (deadline < 1 week)", "Somewhat urgent (within a month)", "Not urgent — exploring options"] },
        { id: 'details', question: "Can you briefly describe your situation? (A few sentences is fine.)", freeform: true },
        { id: 'prior', question: "Have you consulted with another attorney about this?", options: ["Yes", "No", "Currently have an attorney but looking to switch"] },
        { id: 'name', question: "What's your name?", freeform: true, field: 'name' },
        { id: 'contact', question: "And the best email or phone to reach you?", freeform: true, field: 'contact' },
      ]
    },
    freelance: {
      name: 'Project Inquiry',
      icon: '💻',
      greeting: "Hey there! 👋 Thanks for your interest. I'd love to learn about your project. What are you looking for?",
      steps: [
        { id: 'service', question: "What type of work do you need?", options: ["Brand / Logo Design", "Website Design", "App UI/UX", "Development", "Copywriting", "Consulting", "Other"] },
        { id: 'timeline', question: "What's your timeline?", options: ["ASAP (within 2 weeks)", "1-2 months", "3+ months", "Flexible / no rush"] },
        { id: 'budget', question: "What's your approximate budget range?", options: ["Under $1,000", "$1,000 - $5,000", "$5,000 - $15,000", "$15,000+", "Not sure yet"] },
        { id: 'details', question: "Tell me a bit more about the project — what's the goal? Any examples you love?", freeform: true },
        { id: 'name', question: "Awesome! What's your name?", freeform: true, field: 'name' },
        { id: 'contact', question: "And how should we reach you? (Email or phone)", freeform: true, field: 'contact' },
      ]
    },
    agency: {
      name: 'Agency Inquiry',
      icon: '🏢',
      greeting: "Welcome! We're excited you're here. What can our team help you with?",
      steps: [
        { id: 'service', question: "What service are you interested in?", options: ["Paid Ads / PPC", "SEO & Content", "Social Media", "Web Development", "Branding", "Full Strategy", "Other"] },
        { id: 'size', question: "How big is your company?", options: ["Just me / Solo", "2-10 employees", "11-50 employees", "51-200 employees", "200+"] },
        { id: 'budget', question: "What's your monthly marketing budget?", options: ["Under $2,000/mo", "$2,000 - $5,000/mo", "$5,000 - $15,000/mo", "$15,000+/mo", "Not established yet"] },
        { id: 'goals', question: "What does success look like for you in the next 90 days?", freeform: true },
        { id: 'name', question: "Great! What's your name and company?", freeform: true, field: 'name' },
        { id: 'contact', question: "Best email to reach you?", freeform: true, field: 'contact' },
      ]
    },
    coaching: {
      name: 'Coaching Discovery',
      icon: '🧠',
      greeting: "Hi! I'm glad you're taking this step. Let's see how coaching can help you. What's your biggest challenge right now?",
      steps: [
        { id: 'area', question: "What area would you like coaching in?", options: ["Career Transition", "Leadership & Management", "Work-Life Balance", "Starting a Business", "Confidence & Mindset", "Relationships", "Other"] },
        { id: 'experience', question: "Have you worked with a coach before?", options: ["Yes, loved it", "Yes, but it wasn't great", "No, this is my first time"] },
        { id: 'commitment', question: "How much time can you commit weekly to coaching work?", options: ["1-2 hours/week", "3-5 hours/week", "Whatever it takes", "Not sure yet"] },
        { id: 'vision', question: "What would a breakthrough look like for you in the next 3 months?", freeform: true },
        { id: 'name', question: "I'd love to match you with the right coach. What's your name?", freeform: true, field: 'name' },
        { id: 'contact', question: "And the best way to reach you?", freeform: true, field: 'contact' },
      ]
    },
    therapy: {
      name: 'Intake Form',
      icon: '💆',
      greeting: "Welcome. I'm here to make the intake process comfortable and easy. Everything you share is confidential. What brings you in today?",
      steps: [
        { id: 'concern', question: "What's your primary concern?", options: ["Anxiety / Stress", "Depression", "Relationships", "Trauma / PTSD", "Life Transition", "Grief / Loss", "Other"] },
        { id: 'prior', question: "Have you seen a therapist before?", options: ["Yes, currently seeing one", "Yes, in the past", "No, first time"] },
        { id: 'preference', question: "Do you have a preference for session type?", options: ["In-person", "Video / Telehealth", "Either is fine"] },
        { id: 'insurance', question: "Will you be using insurance?", options: ["Yes", "No / Self-pay", "Not sure — need help checking"] },
        { id: 'name', question: "What name should we use for you?", freeform: true, field: 'name' },
        { id: 'contact', question: "And the best way to reach you for scheduling?", freeform: true, field: 'contact' },
      ]
    }
  };

  const tpl = templates[config.template] || templates.law;

  // ─── Styles ──────────────────────────────────────────────
  const isDark = config.theme === 'dark';
  const isLeft = config.position === 'left';
  const accent = config.accent;

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }
  const accentRgb = hexToRgb(accent);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    #ib-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    
    #ib-trigger {
      position: fixed; bottom: 24px; ${isLeft ? 'left' : 'right'}: 24px;
      width: 60px; height: 60px; border-radius: 50%;
      background: ${accent}; color: white; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(${accentRgb}, 0.4);
      z-index: 999998; display: flex; align-items: center; justify-content: center;
      transition: all 0.3s ease; font-size: 24px;
    }
    #ib-trigger:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(${accentRgb}, 0.5); }
    #ib-trigger.ib-open { transform: rotate(180deg) scale(0.9); }
    
    #ib-badge {
      position: absolute; top: -2px; right: -2px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #ef4444; border: 2px solid white;
      animation: ib-pulse 2s infinite;
    }
    @keyframes ib-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
    
    #ib-window {
      position: fixed; bottom: 96px; ${isLeft ? 'left' : 'right'}: 24px;
      width: 380px; max-width: calc(100vw - 48px);
      height: 540px; max-height: calc(100vh - 120px);
      background: ${isDark ? '#111827' : '#ffffff'};
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,${isDark ? '0.5' : '0.15'}), 0 0 0 1px rgba(${isDark ? '255,255,255' : '0,0,0'},0.05);
      z-index: 999999; display: none; flex-direction: column;
      animation: ib-slide-up 0.3s ease;
    }
    @keyframes ib-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    #ib-window.ib-visible { display: flex; }
    
    .ib-header {
      background: ${accent}; color: white;
      padding: 16px 20px; display: flex; align-items: center; gap: 12px;
    }
    .ib-header-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .ib-header-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .ib-header-info h4 { font-size: 14px; font-weight: 600; }
    .ib-header-info p { font-size: 11px; opacity: 0.8; }
    .ib-header-close {
      margin-left: auto; background: none; border: none; color: white;
      cursor: pointer; font-size: 18px; opacity: 0.7; transition: opacity 0.2s;
    }
    .ib-header-close:hover { opacity: 1; }
    
    .ib-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px;
      background: ${isDark ? '#0f172a' : '#f8fafc'};
    }
    .ib-messages::-webkit-scrollbar { width: 4px; }
    .ib-messages::-webkit-scrollbar-thumb { background: ${isDark ? '#374151' : '#cbd5e1'}; border-radius: 4px; }
    
    .ib-msg {
      max-width: 85%; padding: 10px 14px; font-size: 13px; line-height: 1.5;
      animation: ib-fade-in 0.3s ease;
      word-wrap: break-word;
    }
    @keyframes ib-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    
    .ib-msg-bot {
      align-self: flex-start;
      background: ${isDark ? '#1e293b' : '#ffffff'};
      color: ${isDark ? '#e2e8f0' : '#1e293b'};
      border-radius: 4px 16px 16px 16px;
      border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
    }
    .ib-msg-user {
      align-self: flex-end;
      background: ${accent}; color: white;
      border-radius: 16px 4px 16px 16px;
    }
    
    .ib-options {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0;
      align-self: flex-start; max-width: 90%;
      animation: ib-fade-in 0.3s ease;
    }
    .ib-option {
      padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 500;
      background: ${isDark ? '#1e293b' : '#ffffff'};
      color: ${accent}; border: 1px solid rgba(${accentRgb}, 0.3);
      cursor: pointer; transition: all 0.2s;
    }
    .ib-option:hover {
      background: rgba(${accentRgb}, 0.1);
      border-color: ${accent};
    }
    
    .ib-typing {
      align-self: flex-start; padding: 12px 18px;
      background: ${isDark ? '#1e293b' : '#ffffff'};
      border-radius: 4px 16px 16px 16px;
      border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
      display: flex; gap: 4px;
    }
    .ib-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: ${isDark ? '#64748b' : '#94a3b8'};
      animation: ib-blink 1.4s infinite both;
    }
    .ib-dot:nth-child(2) { animation-delay: 0.2s; }
    .ib-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ib-blink { 0%,80%,100% { opacity: 0.3; } 40% { opacity: 1; } }
    
    .ib-input-area {
      padding: 12px 16px;
      border-top: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'};
      background: ${isDark ? '#111827' : '#ffffff'};
      display: flex; gap: 8px;
    }
    .ib-input {
      flex: 1; padding: 10px 14px; border-radius: 24px; font-size: 13px;
      background: ${isDark ? '#1e293b' : '#f1f5f9'};
      color: ${isDark ? '#e2e8f0' : '#1e293b'};
      border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
      outline: none; transition: border-color 0.2s;
    }
    .ib-input:focus { border-color: ${accent}; }
    .ib-input::placeholder { color: ${isDark ? '#64748b' : '#94a3b8'}; }
    .ib-input:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .ib-send {
      width: 40px; height: 40px; border-radius: 50%;
      background: ${accent}; color: white; border: none;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    .ib-send:hover { filter: brightness(1.1); }
    .ib-send:disabled { opacity: 0.4; cursor: not-allowed; }
    
    .ib-powered {
      text-align: center; padding: 6px; font-size: 10px;
      color: ${isDark ? '#475569' : '#94a3b8'};
      background: ${isDark ? '#111827' : '#ffffff'};
    }
    .ib-powered a { color: ${accent}; text-decoration: none; }
    .ib-powered a:hover { text-decoration: underline; }
    
    .ib-summary {
      margin: 8px 0; padding: 12px; border-radius: 12px;
      background: rgba(${accentRgb}, 0.08);
      border: 1px solid rgba(${accentRgb}, 0.2);
      font-size: 12px; line-height: 1.6;
      color: ${isDark ? '#e2e8f0' : '#1e293b'};
      align-self: flex-start; max-width: 90%;
      animation: ib-fade-in 0.3s ease;
    }
    .ib-summary h5 {
      font-size: 12px; font-weight: 600; margin-bottom: 6px;
      color: ${accent};
    }
    
    @media (max-width: 480px) {
      #ib-window {
        bottom: 0; ${isLeft ? 'left' : 'right'}: 0;
        width: 100%; max-width: 100%;
        height: 100vh; max-height: 100vh;
        border-radius: 0;
      }
      #ib-trigger { bottom: 16px; ${isLeft ? 'left' : 'right'}: 16px; }
    }
  `;

  // ─── DOM ─────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'ib-widget';
  container.innerHTML = `
    <button id="ib-trigger" aria-label="Open chat">
      💬
      <div id="ib-badge"></div>
    </button>
    <div id="ib-window">
      <div class="ib-header">
        <div class="ib-header-avatar">
          ${config.avatar ? `<img src="${config.avatar}" alt="">` : tpl.icon}
        </div>
        <div class="ib-header-info">
          <h4>${config.name}</h4>
          <p>Typically replies instantly</p>
        </div>
        <button class="ib-header-close" id="ib-close" aria-label="Close">✕</button>
      </div>
      <div class="ib-messages" id="ib-messages"></div>
      <div class="ib-input-area">
        <input class="ib-input" id="ib-input" placeholder="Type a message..." autocomplete="off">
        <button class="ib-send" id="ib-send" aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
      <div class="ib-powered">Powered by <a href="https://atalovesyou.github.io/intakebot/" target="_blank">IntakeBot</a></div>
    </div>
  `;
  document.body.appendChild(container);

  // ─── State ───────────────────────────────────────────────
  let isOpen = false;
  let currentStep = 0;
  let responses = {};
  let completed = false;

  const trigger = document.getElementById('ib-trigger');
  const badge = document.getElementById('ib-badge');
  const win = document.getElementById('ib-window');
  const closeBtn = document.getElementById('ib-close');
  const messagesEl = document.getElementById('ib-messages');
  const input = document.getElementById('ib-input');
  const sendBtn = document.getElementById('ib-send');

  // ─── Functions ───────────────────────────────────────────
  function toggle() {
    isOpen = !isOpen;
    win.classList.toggle('ib-visible', isOpen);
    trigger.classList.toggle('ib-open', isOpen);
    trigger.textContent = isOpen ? '✕' : '💬';
    if (!isOpen) trigger.appendChild(badge);
    badge.style.display = isOpen ? 'none' : 'block';
    if (isOpen && messagesEl.children.length === 0) startConversation();
    if (isOpen) input.focus();
  }

  function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'ib-msg ib-msg-bot';
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollBottom();
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'ib-msg ib-msg-user';
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollBottom();
  }

  function addOptions(options) {
    const wrap = document.createElement('div');
    wrap.className = 'ib-options';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'ib-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleResponse(opt));
      wrap.appendChild(btn);
    });
    messagesEl.appendChild(wrap);
    scrollBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ib-typing';
    div.id = 'ib-typing';
    div.innerHTML = '<div class="ib-dot"></div><div class="ib-dot"></div><div class="ib-dot"></div>';
    messagesEl.appendChild(div);
    scrollBottom();
  }

  function hideTyping() {
    const t = document.getElementById('ib-typing');
    if (t) t.remove();
  }

  function scrollBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function disableInput(disabled) {
    input.disabled = disabled;
    sendBtn.disabled = disabled;
  }

  function removeOptions() {
    const opts = messagesEl.querySelectorAll('.ib-options');
    opts.forEach(o => o.remove());
  }

  function startConversation() {
    const greeting = config.greeting || tpl.greeting;
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBotMessage(greeting);
      const step = tpl.steps[0];
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
          askStep(step);
        }, 600);
      }, 400);
    }, 800);
  }

  function askStep(step) {
    addBotMessage(step.question);
    if (step.options) {
      setTimeout(() => addOptions(step.options), 200);
      disableInput(true);
      input.placeholder = 'Or type your own answer...';
      disableInput(false);
    } else {
      disableInput(false);
      input.placeholder = 'Type your answer...';
      input.focus();
    }
  }

  function handleResponse(text) {
    removeOptions();
    addUserMessage(text);
    
    const step = tpl.steps[currentStep];
    responses[step.id] = text;
    if (step.field) responses[step.field] = text;
    
    currentStep++;
    disableInput(true);

    if (currentStep >= tpl.steps.length) {
      finishConversation();
    } else {
      showTyping();
      const delay = 600 + Math.random() * 600;
      setTimeout(() => {
        hideTyping();
        // Add a contextual acknowledgment sometimes
        const acks = ["Got it!", "Thanks!", "Perfect.", "Noted!", "Great, thanks!"];
        if (Math.random() > 0.4 && !tpl.steps[currentStep].freeform) {
          addBotMessage(acks[Math.floor(Math.random() * acks.length)]);
          setTimeout(() => askStep(tpl.steps[currentStep]), 400);
        } else {
          askStep(tpl.steps[currentStep]);
        }
      }, delay);
    }
  }

  function finishConversation() {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBotMessage("That's everything I need! Here's a summary of what you shared:");

      // Build summary
      const summary = document.createElement('div');
      summary.className = 'ib-summary';
      let html = '<h5>📋 Intake Summary</h5>';
      tpl.steps.forEach(step => {
        if (responses[step.id]) {
          const label = step.field === 'name' ? '👤 Name' :
                        step.field === 'contact' ? '📧 Contact' :
                        step.id === 'type' || step.id === 'service' || step.id === 'area' || step.id === 'concern' ? '📝 Type' :
                        step.id === 'urgency' ? '⏰ Urgency' :
                        step.id === 'budget' ? '💰 Budget' :
                        step.id === 'timeline' ? '📅 Timeline' :
                        step.id === 'details' || step.id === 'goals' || step.id === 'vision' ? '📄 Details' :
                        '•';
          html += `<div>${label}: ${responses[step.id]}</div>`;
        }
      });
      summary.innerHTML = html;
      messagesEl.appendChild(summary);
      scrollBottom();

      setTimeout(() => {
        addBotMessage("I've sent this to the team — you'll hear back shortly! 🚀");
        disableInput(true);
        input.placeholder = 'Conversation complete ✓';
        completed = true;

        // Fire webhook if configured
        if (config.webhook) {
          fetch(config.webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              botId: config.botId,
              template: config.template,
              responses: responses,
              timestamp: new Date().toISOString(),
              url: window.location.href,
              userAgent: navigator.userAgent,
            })
          }).catch(() => {}); // Silent fail
        }

        // Store locally as backup
        try {
          const intakes = JSON.parse(localStorage.getItem('intakebot_data') || '[]');
          intakes.push({
            botId: config.botId,
            template: config.template,
            responses: responses,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem('intakebot_data', JSON.stringify(intakes));
        } catch(e) {}

      }, 1000);
    }, 1200);
  }

  // ─── Event Listeners ────────────────────────────────────
  trigger.addEventListener('click', toggle);
  closeBtn.addEventListener('click', toggle);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !input.disabled) {
      const text = input.value.trim();
      if (text) {
        input.value = '';
        handleResponse(text);
      }
    }
  });

  sendBtn.addEventListener('click', () => {
    if (!input.disabled) {
      const text = input.value.trim();
      if (text) {
        input.value = '';
        handleResponse(text);
      }
    }
  });

  // Auto-open after delay (if not on mobile)
  if (window.innerWidth > 768) {
    setTimeout(() => {
      if (!isOpen) {
        // Subtle pulse animation to draw attention
        trigger.style.animation = 'ib-pulse 1s ease 3';
        setTimeout(() => { trigger.style.animation = ''; }, 3000);
      }
    }, 5000);
  }

  // ─── Public API ──────────────────────────────────────────
  window.IntakeBot = {
    open: () => { if (!isOpen) toggle(); },
    close: () => { if (isOpen) toggle(); },
    getData: () => ({ ...responses }),
    reset: () => {
      currentStep = 0;
      responses = {};
      completed = false;
      messagesEl.innerHTML = '';
      disableInput(false);
      input.placeholder = 'Type a message...';
      startConversation();
    },
    config: config,
  };

})();
