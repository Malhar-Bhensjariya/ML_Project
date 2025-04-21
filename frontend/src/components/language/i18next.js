import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../locales/en.json";
import hi from "../../locales/hi.json";
import as from "../../locales/as.json";
import bn from "../../locales/bn.json";
import brx from "../../locales/brx.json";
import dgo from "../../locales/dgo.json";
import gu from "../../locales/gu.json";
import kn from "../../locales/kn.json";
import kok from "../../locales/kok.json";
import mai from "../../locales/mai.json";
import ml from "../../locales/ml.json";
import mni from "../../locales/mni.json";
import mr from "../../locales/mr.json";
import ne from "../../locales/ne.json";
import or from "../../locales/or.json";
import pa from "../../locales/pa.json";
import sa from "../../locales/sa.json";
import si from "../../locales/si.json";
import ta from "../../locales/ta.json";
import te from "../../locales/te.json";

// Get saved language or default to English
const savedLang = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      as: { translation: as },
      bn: { translation: bn },
      brx: { translation: brx },
      dgo: { translation: dgo },
      gu: { translation: gu },
      kn: { translation: kn },
      kok: { translation: kok },
      mai: { translation: mai },
      ml: { translation: ml },
      mni: { translation: mni },
      mr: { translation: mr },
      ne: { translation: ne },
      or: { translation: or },
      pa: { translation: pa },
      sa: { translation: sa },
      si: { translation: si },
      ta: { translation: ta },
      te: { translation: te }
    },
    lng: savedLang, // Use saved language if available
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

// Ensure language is stored correctly
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
