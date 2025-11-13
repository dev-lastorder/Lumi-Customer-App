import { useEffect, useState } from 'react';

export function useTypingText(text: string, speed = 40) {
    const [typedText, setTypedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setTypedText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [index, text, speed]);

    return typedText;
}
