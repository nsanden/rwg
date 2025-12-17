import { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

// Generate a simple math problem
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { question: `${a} + ${b}`, answer: a + b };
}

const DISMISSED_KEY = 'feedbackWidgetDismissed';

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(true); // Start hidden, show after check
    const [message, setMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'other'>('bug');

    // Spam protection
    const [honeypot, setHoneypot] = useState(''); // Should stay empty
    const [captcha, setCaptcha] = useState(generateCaptcha);
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [error, setError] = useState('');

    // Check localStorage on mount
    useEffect(() => {
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        setIsDismissed(dismissed === 'true');
    }, []);

    // Regenerate captcha when form opens
    useEffect(() => {
        if (isOpen) {
            setCaptcha(generateCaptcha());
            setCaptchaAnswer('');
            setError('');
        }
    }, [isOpen]);

    const handleDismiss = () => {
        localStorage.setItem(DISMISSED_KEY, 'true');
        setIsDismissed(true);
    };

    if (isDismissed) return null;

    const handleSubmit = () => {
        setError('');

        // Honeypot check - if filled, silently "succeed" (it's a bot)
        if (honeypot) {
            setMessage('');
            setIsOpen(false);
            return;
        }

        // Captcha check
        if (parseInt(captchaAnswer) !== captcha.answer) {
            setError('Incorrect answer, please try again');
            setCaptcha(generateCaptcha());
            setCaptchaAnswer('');
            return;
        }

        if (!message.trim()) return;

        const currentUrl = window.location.href;
        const subject = encodeURIComponent(`[${feedbackType.toUpperCase()}] Feedback from ${currentUrl}`);
        const body = encodeURIComponent(
            `Type: ${feedbackType}\n` +
            `Page: ${currentUrl}\n` +
            `Browser: ${navigator.userAgent}\n\n` +
            `Message:\n${message}`
        );

        window.location.href = `mailto:info@1s0s.com?subject=${subject}&body=${body}`;

        // Reset form
        setMessage('');
        setCaptchaAnswer('');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {isOpen ? (
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 overflow-hidden">
                    {/* Header */}
                    <div className="bg-brand-teal-800 text-white px-4 py-3 flex justify-between items-center">
                        <span className="font-medium">Send Feedback</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded p-1 transition-colors"
                            aria-label="Close feedback form"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                        {/* Honeypot - hidden from humans, bots will fill it */}
                        <input
                            type="text"
                            name="website"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            className="absolute -left-[9999px] opacity-0 h-0 w-0"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                        />

                        {/* Feedback type */}
                        <div className="flex gap-2">
                            {(['bug', 'suggestion', 'other'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFeedbackType(type)}
                                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                        feedbackType === type
                                            ? 'bg-brand-teal-800 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {type === 'bug' ? 'Bug' : type === 'suggestion' ? 'Idea' : 'Other'}
                                </button>
                            ))}
                        </div>

                        {/* Message */}
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={
                                feedbackType === 'bug'
                                    ? "What went wrong? What were you trying to do?"
                                    : feedbackType === 'suggestion'
                                    ? "What would make this better?"
                                    : "What's on your mind?"
                            }
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal-600 focus:border-transparent text-sm"
                        />

                        {/* Simple math captcha */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                What is {captcha.question}?
                            </label>
                            <input
                                type="number"
                                value={captchaAnswer}
                                onChange={(e) => setCaptchaAnswer(e.target.value)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal-600 focus:border-transparent text-sm"
                                placeholder="?"
                            />
                            {error && (
                                <p className="text-red-500 text-xs mt-1">{error}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!message.trim() || !captchaAnswer}
                            className="w-full bg-brand-teal-800 hover:bg-brand-teal-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send Feedback
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                            Opens your email app to send
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-brand-teal-800 hover:bg-brand-teal-900 text-white rounded-full p-3 shadow-lg transition-all hover:scale-105"
                        aria-label="Send feedback"
                        title="Report an issue or send feedback"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>
                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-1 shadow-md transition-colors border border-white"
                        aria-label="Dismiss feedback button"
                        title="Hide feedback button"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
