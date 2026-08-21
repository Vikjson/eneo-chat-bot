import userInfo from "./assets/user-info.json";

const assistantUrl = userInfo.assistant;
const token = userInfo.token;

export async function getTestMessage(input){

    if(token.length === 0){
        throw new Error("Ingen Token finns");
    }

    const resp = await fetch(assistantUrl,
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

    if (!resp.ok){
        throw new Error("AJ");
    }

    return await resp.json();
}

export async function fetchSessionHistory(){
    const resp = await fetch(assistantUrl,{
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
    })

    if (!resp.ok){
        throw new Error("AJ");
    }

    const data = await resp.json();

    const messageHistory = []

    for (let interaction of data.messages){
        const question = interaction.question;
        const answer = interaction.answer;
        const time = new Date(interaction.created_at);

        const userMessage = createTimedMessageObject("user", question, time)
        const aiMessage = createTimedMessageObject("ai", answer, time)

        messageHistory.push(userMessage)
        messageHistory.push(aiMessage)
    }

    return messageHistory;

}

export function createMessageObject(speaker, text) {
    return {
        id: crypto.randomUUID(),
        speaker: speaker,
        text: text,
        time: parseTime(new Date())
    }
}

function createTimedMessageObject(speaker, text, time) {
    return {
        id: crypto.randomUUID(),
        speaker: speaker,
        text: text,
        time: parseTime(time)
    }
}

function parseTime(time) {
    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const day = formatTime(time.getDate());
    const month = formatTime(time.getMonth() + 1);
    const year = time.getFullYear();
    return `${hours}:${minutes} | ${day}-${month}-${year}`
}


/**
 * Appends a leading 0 to time units that are only 1 character long.
 * @param {number} time
 */
function formatTime(time){

    if(time.toString().length === 1){
        return `0${time}`;
    } else{
        return time.toString();
    }

}