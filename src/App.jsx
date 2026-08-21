import {useState} from 'react'
import './App.css'
import {getTestMessage} from './chatbotapi.js'

function App() {
    const [messages, setMessages] = useState([
        {
            id: crypto.randomUUID(),
            speaker: "ai",
            text: "Hej. Vad kan jag hjälpa dig med?",
        },
    ]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function sendMessage() {
        const text = input.trim();
        if (!text || isLoading) {
            return;
        }
        const userMessage = {
            id: crypto.randomUUID(),
            speaker: "user",
            text,
        };

        setMessages((messages) => [...messages, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const resp = await getTestMessage(text);

            const aiMessage = {
                id: crypto.randomUUID(),
                speaker: "ai",
                text: resp.answer,
            };

            setMessages((messages) => [...messages, aiMessage]);
        } catch (error) {
            setMessages((messages) => [
                ...messages,
                {
                    id: crypto.randomUUID(),
                    speaker: "ai",
                    text: "Svar kunde ej hämtas.",
                },
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


    function handleInputChange(event) {
        const newInput = event.target.value;

        setInput(newInput)


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
                                {message.text}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message ai">
                            <div className="bubble typing">
                                Thinking
                            </div>
                        </div>
                    )}
                </div>

                <div className="input-area">
                    <input
                        type="text"
                        value={input}
                        placeholder="Skriv ett meddelande..."
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                    >
                        Send
                    </button>
                </div>
            </section>
        </main>
    );
}

export default App
