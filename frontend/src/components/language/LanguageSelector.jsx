import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (HINDI)" },
  { code: "as", label: "অসমীয়া (ASSAMESE)" },
  { code: "bn", label: "বাংলা (BENGALI)" },
  { code: "brx", label: "बड़ो (BODO)" },
  { code: "dgo", label: "डोगरी (DOGRI)" },
  { code: "gu", label: "ગુજરાતી (GUJARATI)" },
  { code: "kn", label: "ಕನ್ನಡ (KANNADA)" },
  { code: "kok", label: "कोंकणी (KONKANI)" },
  { code: "mai", label: "मैथिली (MAITHILI)" },
  { code: "ml", label: "മലയാളം (MALAYALAM)" },
  { code: "mni", label: "মণিপুরি (MANIPURI)" },
  { code: "mr", label: "मराठी (MARATHI)" },
  { code: "ne", label: "नेपाली (NEPALI)" },
  { code: "or", label: "ଓଡ଼ିଆ (ORIYA)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (PUNJABI)" },
  { code: "sa", label: "संस्कृत (SANSKRIT)" },
  { code: "si", label: "සිංහල (SINHALA)" },
  { code: "ta", label: "தமிழ் (TAMIL)" },
  { code: "te", label: "తెలుగు (TELUGU)" }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || i18n.language || "en");

  // Ensure language persists on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== i18n.language) {
      console.log("Applying stored language:", savedLang);
      i18n.changeLanguage(savedLang).then(() => {
        setCurrentLang(savedLang);
      });
    }
  }, []);

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng); // Ensure language is fully applied
    localStorage.setItem("language", lng); // Store it for persistence
    setCurrentLang(lng);
    console.log("Language changed to:", lng);
    setOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-1 md:py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-300 ease-in-out"
          onClick={() => setOpen(!open)}
        >
          <Globe size={20} className="mr-2" />
          {languages.find((lang) => lang.code === currentLang)?.label || "English (ENGLISH)"}
        </button>
        
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`
                    w-full text-left px-4 py-2 flex items-center justify-between 
                    ${currentLang === lang.code 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'hover:bg-gray-100'}
                    transition-colors duration-200 ease-in-out
                  `}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="text-sm">{lang.label}</span>
                  {currentLang === lang.code && <Check size={20} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;