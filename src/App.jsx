import {useState} from 'react'
import './App.css'
import {getTestMessage} from './chatbotapi.js'

function App() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("");

    function getNewMessage(event) {
        event.preventDefault()

        setMessages(messages => [...messages, {
            isAI: false,
            text: input
        }]);
        getTestMessage(input).then(resp => {
            const answer = resp.answer;

            setMessages(messages => [...messages, {
                isAI: true,
                text: answer
            }]);


        })
    }

    function handleInputChange(event) {
        const newInput = event.target.value;

        setInput(newInput)


    }


    return (
        <>
            {messages.map(message => (
                <div className={"speech-bubble " + (message.isAI ? "speech-bubble-ai" : "speech-bubble-user")} key={message.id}>
                    <p key={message.id}>{message.isAI ? "AI" : "You"} --- {message.text}</p>
                </div>
            ))}

            <form onSubmit={event => getNewMessage(event)}>
                <input type="text" onChange={event => handleInputChange(event)}/>
                <button onClick={getNewMessage}>New Message</button>
            </form>
        </>
    )
}

export default App
