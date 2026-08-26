// =========================================================
// ELEMENTS
// =========================================================

const inputText =
    document.getElementById("inputText");

const translatedText =
    document.getElementById("translatedText");

const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const translateButton =
    document.getElementById("translateButton");

const swapButton =
    document.getElementById("swapButton");

const copyButton =
    document.getElementById("copyButton");

const speakButton =
    document.getElementById("speakButton");

const clearButton =
    document.getElementById("clearButton");

const status =
    document.getElementById("status");

const pronunciationContainer =
    document.getElementById(
        "pronunciationContainer"
    );

const pronunciation =
    document.getElementById(
        "pronunciation"
    );

const pronunciationTitle =
    document.getElementById(
        "pronunciationTitle"
    );


// =========================================================
// LANGUAGE NAMES
// =========================================================

const languageNames = {

    en: "English",
    hi: "Hindi",
    mr: "Marathi",
    gu: "Gujarati",
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    kn: "Kannada",
    ml: "Malayalam",
    pa: "Punjabi",
    ur: "Urdu",

    fr: "French",
    es: "Spanish",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    nl: "Dutch",

    ru: "Russian",
    uk: "Ukrainian",
    pl: "Polish",
    cs: "Czech",
    sk: "Slovak",
    ro: "Romanian",
    hu: "Hungarian",
    bg: "Bulgarian",
    el: "Greek",

    sv: "Swedish",
    da: "Danish",
    no: "Norwegian",
    fi: "Finnish",
    is: "Icelandic",
    ga: "Irish",

    ar: "Arabic",
    he: "Hebrew",
    fa: "Persian",
    tr: "Turkish",

    "zh-CN": "Chinese",
    "zh-TW": "Chinese",

    ja: "Japanese",
    ko: "Korean",
    th: "Thai",
    vi: "Vietnamese",

    id: "Indonesian",
    ms: "Malay",
    fil: "Filipino",

    sw: "Swahili",
    af: "Afrikaans",
    sq: "Albanian",
    hy: "Armenian",
    az: "Azerbaijani",
    eu: "Basque",
    be: "Belarusian",
    bs: "Bosnian",
    ca: "Catalan",
    hr: "Croatian",
    et: "Estonian",
    ka: "Georgian",
    kk: "Kazakh",
    km: "Khmer",
    lo: "Lao",
    lv: "Latvian",
    lt: "Lithuanian",
    mk: "Macedonian",
    mn: "Mongolian",
    ne: "Nepali",
    sr: "Serbian",
    sl: "Slovenian",
    cy: "Welsh"

};


// =========================================================
// TRANSLATE
// =========================================================

translateButton.addEventListener(
    "click",
    async () => {

        const text =
            inputText.value.trim();

        const source =
            sourceLanguage.value;

        const target =
            targetLanguage.value;


        if (!text) {

            status.textContent =
                "Please enter some text.";

            return;
        }


        status.textContent =
            "Translating...";


        translateButton.disabled =
            true;


        try {

            const response =
                await fetch(
                    "/translate",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            text: text,

                            source_language:
                                source,

                            target_language:
                                target

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Translation failed."
                );
            }


            translatedText.value =
                data.translation;


            // =================================================
            // PRONUNCIATION
            // =================================================

            if (
                data.pronunciation &&
                data.pronunciation.trim()
            ) {

                pronunciation.textContent =
                    data.pronunciation;


                if (target === "ja") {

                    pronunciationTitle.textContent =
                        "Romaji:";

                }

                else if (target === "ko") {

                    pronunciationTitle.textContent =
                        "Romanization:";

                }

                else if (
                    target === "zh-CN" ||
                    target === "zh-TW"
                ) {

                    pronunciationTitle.textContent =
                        "Pinyin:";

                }

                else {

                    pronunciationTitle.textContent =
                        "Pronunciation:";

                }


                pronunciationContainer.style.display =
                    "block";

            }


            status.textContent =
                "Translation completed successfully!";

        }

        catch (error) {

            translatedText.value =
                "";

            status.textContent =
                error.message;

        }

        finally {

            translateButton.disabled =
                false;

        }

    }
);


// =========================================================
// SWAP
// =========================================================

swapButton.addEventListener(
    "click",
    () => {

        if (
            sourceLanguage.value === "auto"
        ) {

            status.textContent =
                "Select a source language before swapping.";

            return;
        }


        const oldSource =
            sourceLanguage.value;

        const oldTarget =
            targetLanguage.value;


        sourceLanguage.value =
            oldTarget;

        targetLanguage.value =
            oldSource;


        const oldInput =
            inputText.value;

        const oldOutput =
            translatedText.value;


        inputText.value =
            oldOutput;

        translatedText.value =
            oldInput;


        status.textContent =
            "Languages swapped.";

    }
);


// =========================================================
// COPY
// =========================================================

copyButton.addEventListener(
    "click",
    async () => {

        const text =
            translatedText.value.trim();


        if (!text) {

            status.textContent =
                "There is no translation to copy.";

            return;
        }


        try {

            await navigator.clipboard.writeText(
                text
            );

            status.textContent =
                "Translation copied!";

        }

        catch {

            status.textContent =
                "Could not copy the translation.";

        }

    }
);


// =========================================================
// CLEAR
// =========================================================

clearButton.addEventListener(
    "click",
    () => {

        inputText.value =
            "";

        translatedText.value =
            "";

        pronunciation.textContent =
            "";

        pronunciationContainer.style.display =
            "none";

        status.textContent =
            "";

    }
);


// =========================================================
// SPEAK
// =========================================================

speakButton.addEventListener(
    "click",
    async () => {

        const text =
            translatedText.value.trim();


        if (!text) {

            status.textContent =
                "There is no translation to speak.";

            return;
        }


        const language =
            targetLanguage.value;


        if (!language || language === "auto") {

            status.textContent =
                "Please select a target language.";

            return;
        }


        status.textContent =
            `🔊 Preparing ${languageNames[language] || language} speech...`;


        speakButton.disabled =
            true;


        try {

            const response =
                await fetch(
                    "/speak",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            text: text,

                            language: language

                        })
                    }
                );


            if (!response.ok) {

                let errorMessage =
                    "Speech generation failed.";

                try {

                    const errorData =
                        await response.json();

                    errorMessage =
                        errorData.error ||
                        errorMessage;

                }

                catch {

                }

                throw new Error(
                    errorMessage
                );
            }


            const audioBlob =
                await response.blob();


            const audioUrl =
                URL.createObjectURL(
                    audioBlob
                );


            const audio =
                new Audio(
                    audioUrl
                );


            audio.onplay =
                () => {

                    status.textContent =
                        `🔊 Speaking in ${languageNames[language] || language}...`;

                };


            audio.onended =
                () => {

                    status.textContent =
                        "Speech completed.";

                    URL.revokeObjectURL(
                        audioUrl
                    );

                    speakButton.disabled =
                        false;

                };


            audio.onerror =
                () => {

                    status.textContent =
                        "Could not play the speech.";

                    URL.revokeObjectURL(
                        audioUrl
                    );

                    speakButton.disabled =
                        false;

                };


            await audio.play();

        }

        catch (error) {

            console.error(
                "Speech error:",
                error
            );

            status.textContent =
                error.message;

            speakButton.disabled =
                false;

        }

    }
);