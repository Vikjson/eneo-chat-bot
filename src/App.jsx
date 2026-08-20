import {useState} from 'react'
import './App.css'
import {getTestMessage} from './chatbotapi.js'

function App() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("");

    function getNewMessage() {
        setMessages(messages => [...messages, {
            speaker: "user",
            text: input
        }]);
        getTestMessage(input).then(resp => {
            const answer = resp.answer;

            setMessages(messages => [...messages, {
                speaker: "AI",
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
                <div key={message.id}>
                    <p key={message.id}>{message.speaker} --- {message.text}</p>
                    <hr/>
                </div>
            ))}

            <input type="text" onChange={event => handleInputChange(event)}/>
            <button onClick={getNewMessage}>New Message</button>
        </>
    )
}

export default App
