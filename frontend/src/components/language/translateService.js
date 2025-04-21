import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_TRANSLATION_API;
const TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

export const translateText = async (text, targetLanguage) => {
    if (!API_KEY) {
        console.error('Missing Google Cloud API Key');
        return text;
    }

    try {
        const response = await axios.post(
            `${TRANSLATE_URL}?key=${API_KEY}`,
            {
                q: text,
                target: targetLanguage,
                format: 'text',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Translation error:', error.response?.data || error.message);
        return text; // Fallback to original text
    }
};
