import userInfo from "./assets/user-info.json";

const assistantId = userInfo.assistant;
const baseUrl = userInfo.api_base_url;
const token = userInfo.token;
let sessionId = null;

export async function getMessageFromAi(input) {
    return sessionId ? await getMessage(input) : await createNewSession(input);
}

async function getMessage(input) {
    console.log("Session finns redan. Pratar med den");
    if (token.length === 0) {
        throw new Error("Could not find token!");
    }
    if (!sessionId) {
        throw new Error("Could not find session!");
    }

    const resp = await fetch(`${baseUrl}/assistants/${assistantId}/sessions/${sessionId}`,
        {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "question": input,
                    "session_id": "eda38c56-94c7-44e2-84eb-bd0d2ea0ba13",
                    "files": [],
                    "stream": false,
                    "tools": {
                        "assistants": []
                    }

                })
        });

    if (!resp.ok) {
        alert("Kunde inte hämta meddelande");
        throw new Error("Could not fetch message");
    }

    const data = await resp.json();
    return data.answer;
}

// export async function fetchSessionHistory() {
//     const resp = await fetch(`${baseUrl}/assistants/${assistantId}/sessions/${sessionId}`, {
//         method: 'GET',
//         headers: {
//             "Authorization": `Bearer ${token}`,
//             "Accept": "application/json"
//         }
//     })
//
//     if (!resp.ok) {
//         alert("Kunde inte hämta chatthistorik");
//         throw new Error("Couldn't fetch chat history.");
//     }
//
//     const data = await resp.json();
//
//     const messageHistory = []
//
//     for (let interaction of data.messages) {
//         const question = interaction.question;
//         const answer = interaction.answer;
//         const time = new Date(interaction.created_at);
//
//         const userMessage = createTimedMessageObject("user", question, time)
//         const aiMessage = createTimedMessageObject("ai", answer, time)
//
//         messageHistory.push(userMessage)
//         messageHistory.push(aiMessage)
//     }
//
//     return messageHistory;
// }

async function createNewSession(input) {
    console.log("Session finns inte. Skapar ny.");
    const resp = await fetch(`${baseUrl}/conversations/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "question": input,
                    "assistant_id": assistantId,
                    "files": [],
                    "stream": false,
                    "use_web_search": false,
                    "require_tool_approval": false
                }
            )
        }
    )

    if (!resp.ok) {
        alert("Kunde inte hämta meddelande");
        throw new Error("Could not fetch message");
    }

    const data = await resp.json();

    sessionId = data.session_id;
    return data.answer;
}


export function createMessageObject(speaker, text) {
    return {
        id: crypto.randomUUID(),
        speaker: speaker,
        text: text,
        time: parseTime(new Date())
    }
}

// function createTimedMessageObject(speaker, text, time) {
//     return {
//         id: crypto.randomUUID(),
//         speaker: speaker,
//         text: text,
//         time: parseTime(time)
//     }
// }

function parseTime(time) {
    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const day = formatTime(time.getDate());
    const month = formatTime(time.getMonth() + 1);
    const year = time.getFullYear();
    return `${hours}:${minutes} ${day}-${month}-${year}`
}


/**
 * Appends a leading 0 to time units that are only 1 character long.
 * @param {number} time
 */
function formatTime(time) {

    if (time.toString().length === 1) {
        return `0${time}`;
    } else {
        return time.toString();
    }

}