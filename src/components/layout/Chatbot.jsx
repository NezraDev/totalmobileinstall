import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  X,
  Mail,
} from 'lucide-react';
import {
  chatbotSuggestions,
  chatbotWelcome,
  getChatbotReply,
} from '../../integrations/chatbotKnowledge';

const actionIcons = {
  arrow: ArrowUpRight,
  map: MapPin,
  phone: Phone,
  mail: Mail,
};

function ActionLink({ action }) {
  const Icon = actionIcons[action.icon] || ArrowUpRight;
  const className = 'tmi-chat-action';
  const content = (
    <>
      <span>{action.label}</span>
      <Icon size={15} aria-hidden="true" />
    </>
  );

  if (action.href.startsWith('/'))
    return (
      <Link className={className} to={action.href}>
        {content}
      </Link>
    );

  return (
    <a
      className={className}
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  );
}

function ChatMessage({ message, messageRef }) {
  const assistant = message.role === 'assistant';
  return (
    <article
      ref={messageRef}
      className={`tmi-chat-message ${assistant ? 'is-assistant' : 'is-user'}`}
    >
      {assistant && (
        <span className="tmi-chat-avatar" aria-hidden="true">
          <MessageCircle size={14} />
        </span>
      )}
      <div className="tmi-chat-message-content">
        <p>{message.text}</p>
        {message.actions?.length > 0 && (
          <div className="tmi-chat-actions">
            {message.actions.map((action) => (
              <ActionLink
                key={`${action.label}-${action.href}`}
                action={action}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Chatbot() {
  const panelId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState(() => [
    { id: 'welcome', role: 'assistant', ...chatbotWelcome },
  ]);
  const toggleRef = useRef(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const latestAssistantRef = useRef(null);
  const messageCounter = useRef(0);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const scrollTarget =
      messages.length > 1 ? latestAssistantRef.current : endRef.current;
    scrollTarget?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: messages.length > 1 ? 'start' : 'end',
    });
  }, [messages, open]);

  function sendQuestion(value = question) {
    const text = value.trim();
    if (!text) return;
    messageCounter.current += 1;
    const userMessage = {
      id: `user-${messageCounter.current}`,
      role: 'user',
      text,
    };
    const response = getChatbotReply(text);
    messageCounter.current += 1;
    const assistantMessage = {
      id: `assistant-${messageCounter.current}`,
      role: 'assistant',
      ...response,
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setQuestion('');
  }

  function closeChat() {
    setOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className={`tmi-chatbot ${open ? 'is-open' : ''}`}>
      {open && (
        <section
          className="tmi-chat-panel"
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${panelId}-title`}
        >
          <header className="tmi-chat-header">
            <span className="tmi-chat-brandmark" aria-hidden="true">
              <MessageCircle size={19} />
            </span>
            <div className="tmi-chat-heading">
              <h2 id={`${panelId}-title`}>TMI Quick Answers</h2>
              <p>Automated answers from our service guide</p>
            </div>
            <button
              className="tmi-chat-close"
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
            >
              <X size={19} />
            </button>
          </header>

          <div
            className="tmi-chat-log"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                messageRef={
                  index === messages.length - 1 && message.role === 'assistant'
                    ? latestAssistantRef
                    : undefined
                }
              />
            ))}
            {messages.length === 1 && (
              <div
                className="tmi-chat-suggestions"
                aria-label="Suggested questions"
              >
                {chatbotSuggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => sendQuestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="tmi-chat-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendQuestion();
            }}
          >
            <label className="tmi-chat-sr-only" htmlFor={inputId}>
              Ask a question
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={500}
              placeholder="Type a question…"
              autoComplete="off"
            />
            <button
              className="tmi-chat-send"
              type="submit"
              aria-label="Send question"
              disabled={!question.trim()}
            >
              <Send size={17} />
            </button>
          </form>
          <p className="tmi-chat-note">
            For anything I can’t confirm, call or email the team.
          </p>
        </section>
      )}

      <button
        ref={toggleRef}
        className="tmi-chat-launcher"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close TMI Quick Answers' : 'Open TMI Quick Answers'}
      >
        {open ? <X size={22} /> : <MessageCircle size={23} />}
        {!open && <span>Ask us</span>}
      </button>
    </div>
  );
}
