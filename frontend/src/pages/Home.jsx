import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useTranslation } from "react-i18next";
import { translateText } from "../components/language/translateService";  
import LanguageSelector from "../components/language/LanguageSelector";  
import axios from 'axios';

const Home = () => {
    const { t, i18n } = useTranslation();
    const { user } = useUser();
    const [translatedName, setTranslatedName] = useState(t("Explorer")); // Default to translated "Explorer"

    async function load_flask() {
        try {
            const response = await axios.post("http://127.0.0.1:5004/recommendations/load-projects", 
                { "user_id": user?._id }, { withCredentials: true });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            load_flask();
        }
    }, [user]);

    useEffect(() => {
        const translateName = async () => {
            const nameToTranslate = user?.name || t("Explorer"); // Use translated "Explorer" if no user
            console.log("Translating:", nameToTranslate, "to", i18n.language);

            try {
                const translated = await translateText(nameToTranslate, i18n.language);
                console.log("Translated Name:", translated);
                setTranslatedName(translated);
            } catch (error) {
                console.error("Translation error:", error);
            }
        };

        translateName();
    }, [i18n.language, user?.name]);

    return (
        <div className="flex min-h-max bg-gradient-to-br from-gray-50 to-gray-100 relative">
            <LanguageSelector />

            <main className="flex-1 p-8 transition-all duration-300">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            {t("Welcome")}, {translatedName}!
                        </h1>
                        <p className="text-gray-600">{t("Discover the power of AI with OdesseyAI")}</p>
                    </header>
                </div>
            </main>
        </div>
    );
};

export default Home;
