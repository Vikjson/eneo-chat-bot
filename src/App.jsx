import {useState} from 'react'
import './App.css'
import {getTestMessage} from './chatbotapi.js'

function App() {
    const [messages, setMessages] = useState([
        createMessageObject("ai", "Hej. Vad kan jag hjälpa dig med?")]
    );


    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function sendMessage() {
        const text = input.trim();
        if (!text || isLoading) {
            return;
        }

        const userMessage =  createMessageObject("user", text)
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

    function createMessageObject(speaker, text){
        return {
            id: crypto.randomUUID(),
            speaker: speaker,
            text: text,
            time: parseTime(new Date())
        }
    }

    function parseTime(time) {
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
                            <div className="bubble">
                                {message.text}
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
