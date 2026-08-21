import {useEffect, useRef, useState} from 'react'
import './App.css'
import {createMessageObject, fetchSessionHistory, getTestMessage} from './chatbotapi.js'
import ReactMarkdown from "react-markdown";
import CopyButton from "./components/CopyButton.jsx";

function App() {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function loadHistory() {
            const response = await fetchSessionHistory();
            if (response.length > 0) {
                setMessages(response);
            } else {
                setMessages([createMessageObject("ai", "Hej! Hur kan jag hjälpa dig?")])
            }
        }

        loadHistory();
    }, []);

    // This section is for automatic scrolling down whenever a new message is created.

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    // ------------------------------------------------------------------------------

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    async function sendMessage() {
        const text = input.trim();
        if (!text || isLoading) {
            return;
        }

        const userMessage = createMessageObject("user", text)
        setMessages((messages) => [...messages, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const resp = await getTestMessage(text);

            const aiMessage = createMessageObject("ai", resp.answer)

            setMessages((messages) => [...messages, aiMessage]);
        } catch (error) {
            setMessages((messages) => [
                ...messages,
                createMessageObject("ai", "Kunde inte hämta svar."),
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }


    return (
        <main className="app">
            <section className="chat">
                <header className="chat-header">
                    <div>
                        <h1>Eneo Chatbot</h1>
                    </div>
                </header>

                <div className="messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.speaker}`}
                        >
                            <div className="bubble">
                                <ReactMarkdown>
                                    {message.text}
                                </ReactMarkdown>

                                {message.speaker === "ai" && (
                                    <CopyButton text={message.text}/>
                                )}

                                <div className="date-display">
                                    {message.time}
                                </div>
                            </div>

                        </div>
                    ))}

                    {isLoading && (
                        <div className="message ai">
                            <div className="bubble typing">
                                Tänker...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}/>
                </div>

                <div className="input-area">
                    <textarea
                        type="text"
                        value={input}
                        placeholder="Ställ en fråga..."
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <div className="input-actions">
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                        >
                            Skicka
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default App
