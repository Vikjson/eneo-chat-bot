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