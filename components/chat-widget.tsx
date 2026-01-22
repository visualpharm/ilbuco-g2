'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import ReactMarkdown from 'react-markdown';

interface DevInfo {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  responseTimeMs: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  devInfo?: DevInfo;
  detectedLanguage?: 'en' | 'es' | 'pt' | 'ru';
}

interface RoomCard {
  name: string;
  status: 'available' | 'booked';
  price: number;
  bookingUrl: string;
  roomUrl: string;
  checkIn?: string;
  checkOut?: string;
}

const chatTranslations = {
  placeholder: {
    en: 'Ask about availability, rooms, amenities...',
    es: 'Preguntá sobre disponibilidad, habitaciones, servicios...',
    pt: 'Pergunte sobre disponibilidade, quartos, comodidades...',
    ru: 'Спросите о наличии мест, номерах, удобствах...',
  },
  greeting: {
    en: '👋 Hi! I\'m your **Il Buco** assistant. Ask me about:\n\n🛏️ *Room availability & prices*\n🏠 *Property amenities*\n📍 *Things to do in Cariló*',
    es: '👋 ¡Hola! Soy tu asistente de **Il Buco**. Preguntame sobre:\n\n🛏️ *Disponibilidad y precios*\n🏠 *Comodidades de la casa*\n📍 *Qué hacer en Cariló*',
    pt: '👋 Oi! Sou seu assistente do **Il Buco**. Me pergunte sobre:\n\n🛏️ *Disponibilidade e preços*\n🏠 *Comodidades da casa*\n📍 *O que fazer em Cariló*',
    ru: '👋 Привет! Я ассистент **Il Buco**. Спрашивайте о:\n\n🛏️ *Наличии номеров и ценах*\n🏠 *Удобствах дома*\n📍 *Чем заняться в Карило*',
  },
  title: {
    en: 'Chat with us',
    es: 'Chateá con nosotros',
    pt: 'Fale conosco',
    ru: 'Напишите нам',
  },
  viewRoom: {
    en: 'View',
    es: 'Ver',
    pt: 'Ver',
    ru: 'Смотреть',
  },
  bookNow: {
    en: 'Book',
    es: 'Reservar',
    pt: 'Reservar',
    ru: 'Бронь',
  },
  perNight: {
    en: '/night',
    es: '/noche',
    pt: '/noite',
    ru: '/ночь',
  },
  currency: {
    en: '$',
    es: 'US$',
    pt: 'US$',
    ru: '$',
  },
  booked: {
    en: 'Booked',
    es: 'Reservado',
    pt: 'Reservado',
    ru: 'Занято',
  },
  error: {
    en: '😔 Sorry, something went wrong. Please try again.',
    es: '😔 Perdón, algo salió mal. Por favor intentá de nuevo.',
    pt: '😔 Desculpe, algo deu errado. Por favor tente novamente.',
    ru: '😔 Извините, что-то пошло не так. Попробуйте ещё раз.',
  },
};

// Parse room cards from message content
function parseRoomCards(content: string): { text: string; cards: RoomCard[] } {
  const cards: RoomCard[] = [];

  // More robust regex that handles newlines between fields, with optional checkIn/checkOut
  const cardRegex = /---ROOM_CARD---[\s\n]*name:\s*([^\n]+)[\s\n]*status:\s*(available|booked)[\s\n]*price:\s*(\d+)[\s\n]*(?:checkIn:\s*(\S+)[\s\n]*)?(?:checkOut:\s*(\S+)[\s\n]*)?bookingUrl:\s*(\S+)[\s\n]*roomUrl:\s*(\S+)[\s\n]*---END_CARD---/gi;

  let match;
  while ((match = cardRegex.exec(content)) !== null) {
    cards.push({
      name: match[1].trim(),
      status: match[2].trim().toLowerCase() as 'available' | 'booked',
      price: parseInt(match[3].trim()),
      checkIn: match[4]?.trim(),
      checkOut: match[5]?.trim(),
      bookingUrl: match[6].trim(),
      roomUrl: match[7].trim(),
    });
  }

  // Remove card markup from text
  const text = content.replace(/---ROOM_CARD---[\s\S]*?---END_CARD---/g, '').trim();

  return { text, cards };
}

// Localized month names
const monthNames: Record<string, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
};

// Format date for display (YYYY-MM-DD -> Mon DD)
function formatShortDate(dateStr: string, lang: string): string {
  const months = monthNames[lang] || monthNames.en;
  const d = new Date(dateStr + 'T00:00:00');
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

// Room Card Component - Compact horizontal layout
function RoomCardWidget({ card, langCode }: { card: RoomCard; langCode: 'en' | 'es' | 'pt' | 'ru' }) {
  const isAvailable = card.status === 'available';

  // Format dates for display
  const dateRange = card.checkIn && card.checkOut
    ? `${formatShortDate(card.checkIn, langCode)} – ${formatShortDate(card.checkOut, langCode)}`
    : null;

  return (
    <div className={`rounded-lg border ${isAvailable ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'} p-3 mb-2`}>
      {/* Single row: Status dot + Room name + Dates + Price + Book button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
          <a
            href={card.roomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 underline hover:text-blue-600"
          >
            {card.name}
          </a>
          {dateRange && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {dateRange}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAvailable && (
            <span className="text-green-700 font-bold text-sm whitespace-nowrap">
              {chatTranslations.currency[langCode]}{card.price}<span className="font-normal text-gray-500">{chatTranslations.perNight[langCode]}</span>
            </span>
          )}
          {isAvailable ? (
            <a
              href={card.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 px-3 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              {chatTranslations.bookNow[langCode]}
            </a>
          ) : (
            <span className="text-red-500 text-sm">{chatTranslations.booked[langCode]}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Dev Info Button Component - only shown in development
function DevInfoButton({ devInfo }: { devInfo: DevInfo }) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate cost based on gpt-5.2-chat-latest pricing: $1.75/1M input, $14.00/1M output
  const inputCost = (devInfo.promptTokens / 1_000_000) * 1.75;
  const outputCost = (devInfo.completionTokens / 1_000_000) * 14.00;
  const totalCost = inputCost + outputCost;
  const costDisplay = totalCost < 0.01 ? `$${(totalCost * 100).toFixed(2)}¢` : `$${totalCost.toFixed(3)}`;

  return (
    <div className="relative inline-block ml-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
        title="Dev Info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-1 bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg z-10 whitespace-nowrap">
          <div className="space-y-0.5">
            <div><span className="text-gray-400">Model:</span> {devInfo.model}</div>
            <div><span className="text-gray-400">Tokens:</span> {devInfo.promptTokens}+{devInfo.completionTokens}={devInfo.totalTokens}</div>
            <div><span className="text-gray-400">Cost:</span> {costDisplay}</div>
            <div><span className="text-gray-400">Time:</span> {devInfo.responseTimeMs}ms</div>
          </div>
          <div className="absolute bottom-[-4px] right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Message Content Component
function MessageContent({ content, langCode, detectedLanguage }: { content: string; langCode: 'en' | 'es' | 'pt' | 'ru'; detectedLanguage?: 'en' | 'es' | 'pt' | 'ru' }) {
  const { text, cards } = parseRoomCards(content);
  // Use detected language for room cards (button text), fall back to website language
  const cardLang = detectedLanguage || langCode;

  return (
    <>
      {text && (
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
            li: ({ children }) => <li>{children}</li>,
            a: ({ href, children }) => {
              const isInternal = href?.startsWith('/');
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      )}
      {cards.length > 0 && (
        <div className="mt-3">
          {cards.map((card, idx) => (
            <RoomCardWidget key={idx} card={card} langCode={cardLang} />
          ))}
        </div>
      )}
    </>
  );
}

function ChatWidgetInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const langCode = language.code as 'en' | 'es' | 'pt' | 'ru';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([{
        role: 'assistant',
        content: chatTranslations.greeting[langCode] || chatTranslations.greeting.es
      }]);
      setHasGreeted(true);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasGreeted, langCode]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.filter(m => m.role !== 'assistant' || newMessages.indexOf(m) > 0),
          language: langCode
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages([...newMessages, {
        role: 'assistant',
        content: data.message,
        devInfo: data.devInfo,
        detectedLanguage: data.language as 'en' | 'es' | 'pt' | 'ru'
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: chatTranslations.error[langCode] || chatTranslations.error.es
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center z-50"
        aria-label={chatTranslations.title[langCode]}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Il Buco</h3>
                <p className="text-xs text-white/70">{chatTranslations.title[langCode]}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-black text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <>
                      <MessageContent content={message.content} langCode={langCode} detectedLanguage={message.detectedLanguage} />
                      {isDev && message.devInfo && (
                        <div className="mt-1 flex justify-end">
                          <DevInfoButton devInfo={message.devInfo} />
                        </div>
                      )}
                    </>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-bl-md text-sm border border-gray-200 shadow-sm">
                  <span className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={chatTranslations.placeholder[langCode]}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper component that handles the context safely
export function ChatWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ChatWidgetInner />;
}
