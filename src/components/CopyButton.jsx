import {useState} from "react";

export default function CopyButton({text}) {
    const [isCopied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);

            setTimeout(() =>
                    setCopied(false),
                2000);

        } catch (error) {
            console.error("Kunde inte kopiera text.", error);
        }
    };

    return (<button onClick={handleCopy}>
            {isCopied ? "✅ Kopierat!" : "📋 Kopiera svar"}
        </button>
    );
}