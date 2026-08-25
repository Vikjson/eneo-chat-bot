import userInfo from "./assets/user-info.json";

const assistantId = userInfo.assistant;
const baseUrl = userInfo.api_base_url;
const token = userInfo.token;
let sessionId = null;

console.log("[API] Initialized", {
    assistantId,
    baseUrl,
    hasToken: Boolean(token),
});

export async function getMessageFromAi(input) {
    console.log("[API] getMessageFromAi called", {
        hasSession: Boolean(sessionId),
        inputLength: input?.length,
    });

    return sessionId
        ? await getMessage(input)
        : await createNewSession(input);
}

async function getMessage(input) {
    console.log("[API] Session exists. Sending message to existing session.", {
        sessionId,
    });

    if (token.length === 0) {
        console.error("[API] Token is missing!");
        throw new Error("Could not find token!");
    }

    if (!sessionId) {
        console.error("[API] Session ID is missing!");
        throw new Error("Could not find session!");
    }

    const url = `${baseUrl}/assistants/${assistantId}/sessions/${sessionId}/`;

    console.log("[API] POST existing session", {
        url,
        sessionId,
        assistantId,
    });

    const resp = await fetch(url, {
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
            }
        )
    });

    console.log("[API] Existing session response", {
        status: resp.status,
        ok: resp.ok,
    });

    if (!resp.ok) {
        console.error("[API] Failed to fetch message", {
            status: resp.status,
            statusText: resp.statusText,
        });

        alert("Kunde inte hämta meddelande");
        throw new Error("Could not fetch message");
    }

    const data = await resp.json();

    console.log("[API] AI response received", {
        hasAnswer: Boolean(data.answer),
        answerLength: data.answer?.length,
    });

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
    console.log("[API] No session exists. Creating new session.");

    const url = `${baseUrl}/conversations/`;

    console.log("[API] POST create session", {
        url,
        assistantId,
        inputLength: input?.length,
    });

    const resp = await fetch(url, {
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
    });

    console.log("[API] Create session response", {
        status: resp.status,
        ok: resp.ok,
    });

    if (!resp.ok) {
        console.error("[API] Failed to create session", {
            status: resp.status,
            statusText: resp.statusText,
        });

        alert("Kunde inte hämta meddelande");
        throw new Error("Could not fetch message");
    }

    const data = await resp.json();

    console.log("[API] New session created", {
        sessionId: data.session_id,
        hasAnswer: Boolean(data.answer),
        answerLength: data.answer?.length,
    });

    sessionId = data.session_id;

    console.log("[API] sessionId stored:", sessionId);

    return data.answer;
}


export function createMessageObject(speaker, text) {
    const message = {
        id: generateRandomUUID(),
        speaker: speaker,
        text: text,
        time: parseTime(new Date())
    };

    console.log("[Message] Created message", {
        id: message.id,
        speaker,
        textLength: text?.length,
        time: message.time,
    });

    return message;
}

function generateRandomUUID(){
    if (crypto.randomUUID){
        console.log("[Generating random UUID]");
        return crypto.randomUUID()
    } else {
        console.log("crypto.randomUUID not available. Using fallback");
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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

    const formattedTime = `${hours}:${minutes} ${day}-${month}-${year}`;

    console.log("[Time] Parsed time:", formattedTime);

    return formattedTime;
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