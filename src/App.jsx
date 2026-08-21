import {useState} from 'react'
import './App.css'
import {getTestMessage} from './chatbotapi.js'

function App() {
    const [messages, setMessages] = useState([
        {
            id: crypto.randomUUID(),
            speaker: "ai",
            text: "Hej. Vad kan jag hjälpa dig med?",
            time: parseTime(new Date())
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
            text: text,
            time: parseTime(new Date())
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
                time: parseTime(new Date())
            };

            setMessages((messages) => [...messages, aiMessage]);
        } catch (error) {
            setMessages((messages) => [
                ...messages,
                {
                    id: crypto.randomUUID(),
                    speaker: "ai",
                    text: "Svar kunde ej hämtas.",
                    time: parseTime(new Date())
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


    function parseTime(time){
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const day = time.getDate();
        const month = time.getMonth() + 1;
        const year = time.getFullYear();
        return `${hours}:${minutes} | ${day}-${month}-${year}`
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
                            <div className="message-content">
                                <div className="bubble">
                                    {message.text}
                                </div>
                                <span>{message.time}</span>
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
                        Skicka
                    </button>
                </div>
            </section>
        </main>
    );
}

export default App
