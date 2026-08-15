// =========================================================
// GET ELEMENTS
// =========================================================

const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const inputText =
    document.getElementById("inputText");

const translatedText =
    document.getElementById("translatedText");

const pronunciation =
    document.getElementById("pronunciation");

const pronunciationContainer =
    document.getElementById("pronunciationContainer");

const translateButton =
    document.getElementById("translateButton");

const speakButton =
    document.getElementById("speakButton");

const copyButton =
    document.getElementById("copyButton");

const clearButton =
    document.getElementById("clearButton");

const swapButton =
    document.getElementById("swapButton");

const status =
    document.getElementById("status");


// =========================================================
// SPEECH VARIABLES
// =========================================================

let availableVoices = [];


// =========================================================
// LANGUAGE → SPEECH LOCALE
// =========================================================

const speechLanguages = {

    // -----------------------------------------------------
    // INDIAN LANGUAGES
    // -----------------------------------------------------

    "en": "en-US",

    "hi": "hi-IN",

    "mr": "mr-IN",

    "gu": "gu-IN",

    "bn": "bn-IN",

    "ta": "ta-IN",

    "te": "te-IN",

    "kn": "kn-IN",

    "ml": "ml-IN",

    "pa": "pa-IN",

    "ur": "ur-IN",

    "ne": "ne-NP",


    // -----------------------------------------------------
    // EUROPEAN
    // -----------------------------------------------------

    "fr": "fr-FR",

    "es": "es-ES",

    "de": "de-DE",

    "it": "it-IT",

    "pt": "pt-PT",

    "nl": "nl-NL",

    "ru": "ru-RU",

    "uk": "uk-UA",

    "pl": "pl-PL",

    "cs": "cs-CZ",

    "sk": "sk-SK",

    "ro": "ro-RO",

    "hu": "hu-HU",

    "bg": "bg-BG",

    "el": "el-GR",

    "sv": "sv-SE",

    "da": "da-DK",

    "no": "no-NO",

    "fi": "fi-FI",

    "is": "is-IS",

    "ga": "ga-IE",

    "cy": "cy-GB",

    "ca": "ca-ES",

    "hr": "hr-HR",

    "sr": "sr-RS",

    "sl": "sl-SI",

    "et": "et-EE",

    "lv": "lv-LV",

    "lt": "lt-LT",

    "mk": "mk-MK",

    "sq": "sq-AL",

    "bs": "bs-BA",

    "be": "be-BY",


    // -----------------------------------------------------
    // MIDDLE EAST
    // -----------------------------------------------------

    "ar": "ar-SA",

    "he": "he-IL",

    "fa": "fa-IR",

    "tr": "tr-TR",


    // -----------------------------------------------------
    // EAST ASIA
    // -----------------------------------------------------

    "ja": "ja-JP",

    "ko": "ko-KR",

    "zh-CN": "zh-CN",

    "zh-TW": "zh-TW",

    "th": "th-TH",

    "vi": "vi-VN",


    // -----------------------------------------------------
    // SOUTH EAST ASIA
    // -----------------------------------------------------

    "id": "id-ID",

    "ms": "ms-MY",

    "fil": "fil-PH",


    // -----------------------------------------------------
    // AFRICA
    // -----------------------------------------------------

    "sw": "sw-KE",

    "af": "af-ZA",


    // -----------------------------------------------------
    // OTHER
    // -----------------------------------------------------

    "hy": "hy-AM",

    "az": "az-AZ",

    "eu": "eu-ES",

    "ka": "ka-GE",

    "kk": "kk-KZ",

    "km": "km-KH",

    "lo": "lo-LA",

    "mn": "mn-MN"
};


// =========================================================
// LOAD BROWSER VOICES
// =========================================================

function loadVoices() {

    availableVoices =
        window.speechSynthesis.getVoices();

    console.log(
        "Available speech voices:",
        availableVoices
    );
}


// Chrome/Edge sometimes loads voices asynchronously
loadVoices();

if (
    "speechSynthesis" in window &&
    "onvoiceschanged" in window.speechSynthesis
) {

    window.speechSynthesis.onvoiceschanged =
        loadVoices;
}


// =========================================================
// GET SPEECH LANGUAGE
// =========================================================

function getSpeechLanguage(language) {

    return (
        speechLanguages[language] ||
        language ||
        "en-US"
    );
}


// =========================================================
// FIND BEST VOICE
// =========================================================

function findBestVoice(language) {

    const wantedLanguage =
        getSpeechLanguage(language)
            .toLowerCase();


    // -----------------------------------------------------
    // Exact match
    // -----------------------------------------------------

    let voice =
        availableVoices.find(
            function (voice) {

                return (
                    voice.lang &&
                    voice.lang.toLowerCase() ===
                    wantedLanguage
                );

            }
        );


    if (voice) {

        return voice;
    }


    // -----------------------------------------------------
    // Language prefix match
    //
    // Example:
    // wanted = hi-in
    // voice = hi
    // -----------------------------------------------------

    const languageCode =
        wantedLanguage.split("-")[0];


    voice =
        availableVoices.find(
            function (voice) {

                if (!voice.lang) {

                    return false;
                }


                return (
                    voice.lang
                        .toLowerCase()
                        .startsWith(
                            languageCode
                        )
                );

            }
        );


    if (voice) {

        return voice;
    }


    // -----------------------------------------------------
    // Search by language name
    // -----------------------------------------------------

    voice =
        availableVoices.find(
            function (voice) {

                if (!voice.lang) {

                    return false;
                }


                return (
                    voice.lang
                        .toLowerCase()
                        .includes(
                            languageCode
                        )
                );

            }
        );


    return voice || null;
}


// =========================================================
// SPEAK TEXT
// =========================================================

function speakText(text, language) {

    return new Promise(
        function (resolve, reject) {

            // -------------------------------------------------
            // Browser support
            // -------------------------------------------------

            if (
                !(
                    "speechSynthesis" in
                    window
                )
            ) {

                reject(
                    new Error(
                        "Speech synthesis is not supported by this browser."
                    )
                );

                return;
            }


            // -------------------------------------------------
            // Validate text
            // -------------------------------------------------

            if (!text || !text.trim()) {

                reject(
                    new Error(
                        "There is no text to speak."
                    )
                );

                return;
            }


            // -------------------------------------------------
            // Stop previous speech
            // -------------------------------------------------

            window.speechSynthesis.cancel();


            // -------------------------------------------------
            // Create speech
            // -------------------------------------------------

            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );


            // -------------------------------------------------
            // Set language
            // -------------------------------------------------

            utterance.lang =
                getSpeechLanguage(
                    language
                );


            // -------------------------------------------------
            // Find voice
            // -------------------------------------------------

            const voice =
                findBestVoice(
                    language
                );


            if (voice) {

                utterance.voice =
                    voice;

                console.log(
                    "Using voice:",
                    voice.name,
                    voice.lang
                );

            } else {

                console.warn(
                    "No exact voice found for:",
                    language,
                    utterance.lang
                );

                console.warn(
                    "Browser will try its default voice for this language."
                );
            }


            // -------------------------------------------------
            // Speech speed
            // -------------------------------------------------

            utterance.rate = 0.9;

            utterance.pitch = 1;

            utterance.volume = 1;


            // -------------------------------------------------
            // Speech started
            // -------------------------------------------------

            utterance.onstart =
                function () {

                    status.textContent =
                        "🔊 Speaking...";

                    speakButton.disabled =
                        false;
                };


            // -------------------------------------------------
            // Speech completed
            // -------------------------------------------------

            utterance.onend =
                function () {

                    status.textContent =
                        "✓ Speech completed.";

                    speakButton.disabled =
                        false;

                    resolve();
                };


            // -------------------------------------------------
            // Speech error
            // -------------------------------------------------

            utterance.onerror =
                function (event) {

                    console.error(
                        "Speech synthesis error:",
                        event
                    );


                    speakButton.disabled =
                        false;


                    reject(
                        new Error(
                            "The browser could not speak this language. Try installing a suitable Windows voice."
                        )
                    );
                };


            // -------------------------------------------------
            // Start speech
            // -------------------------------------------------

            window.speechSynthesis.speak(
                utterance
            );

        }
    );
}


// =========================================================
// TRANSLATE
// =========================================================

translateButton.addEventListener(
    "click",
    async function () {

        const text =
            inputText.value.trim();

        const source =
            sourceLanguage.value;

        const target =
            targetLanguage.value;


        // -----------------------------------------------------
        // Validate input
        // -----------------------------------------------------

        if (!text) {

            status.textContent =
                "Please enter some text.";

            return;
        }


        // -----------------------------------------------------
        // Stop any current speech
        // -----------------------------------------------------

        if (
            "speechSynthesis" in
            window
        ) {

            window.speechSynthesis.cancel();
        }


        // -----------------------------------------------------
        // Loading
        // -----------------------------------------------------

        translateButton.disabled =
            true;

        translateButton.textContent =
            "Translating...";

        status.textContent =
            "Translating...";


        try {

            // -------------------------------------------------
            // Send request
            // -------------------------------------------------

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


            // -------------------------------------------------
            // Read response
            // -------------------------------------------------

            const data =
                await response.json();


            // -------------------------------------------------
            // Error
            // -------------------------------------------------

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Translation failed."
                );
            }


            // -------------------------------------------------
            // Display translation
            // -------------------------------------------------

            translatedText.value =
                data.translation || "";


            // -------------------------------------------------
            // Display pronunciation
            // -------------------------------------------------

            if (
                data.pronunciation &&
                data.pronunciation.trim()
            ) {

                pronunciation.textContent =
                    data.pronunciation;

                pronunciationContainer.style.display =
                    "block";

            } else {

                pronunciation.textContent =
                    "";

                pronunciationContainer.style.display =
                    "none";
            }


            // -------------------------------------------------
            // Show detected language
            // -------------------------------------------------

            if (
                source === "auto" &&
                data.detected_language
            ) {

                console.log(
                    "Detected language:",
                    data.detected_language
                );
            }


            // -------------------------------------------------
            // Completed
            // -------------------------------------------------

            status.textContent =
                "✓ Translation completed.";


        } catch (error) {

            console.error(
                "Translation error:",
                error
            );


            status.textContent =
                error.message ||
                "Something went wrong.";

        } finally {

            translateButton.disabled =
                false;

            translateButton.textContent =
                "Translate";
        }

    }
);


// =========================================================
// SPEAK BUTTON
// =========================================================

speakButton.addEventListener(
    "click",
    async function () {

        const text =
            translatedText.value.trim();


        // -----------------------------------------------------
        // Check text
        // -----------------------------------------------------

        if (!text) {

            status.textContent =
                "Please translate something first.";

            return;
        }


        // -----------------------------------------------------
        // Get target language
        // -----------------------------------------------------

        const language =
            targetLanguage.value;


        // -----------------------------------------------------
        // Stop existing speech
        // -----------------------------------------------------

        if (
            "speechSynthesis" in
            window
        ) {

            window.speechSynthesis.cancel();
        }


        try {

            status.textContent =
                "Preparing speech...";


            await speakText(
                text,
                language
            );


        } catch (error) {

            console.error(
                "Speech error:",
                error
            );


            status.textContent =
                "❌ " +
                error.message;
        }

    }
);


// =========================================================
// COPY BUTTON
// =========================================================

copyButton.addEventListener(
    "click",
    async function () {

        const text =
            translatedText.value.trim();


        if (!text) {

            status.textContent =
                "Nothing to copy.";

            return;
        }


        try {

            await navigator.clipboard.writeText(
                text
            );


            status.textContent =
                "✓ Translation copied.";

        } catch (error) {

            console.error(
                "Copy error:",
                error
            );


            status.textContent =
                "Could not copy the translation.";
        }

    }
);


// =========================================================
// CLEAR BUTTON
// =========================================================

clearButton.addEventListener(
    "click",
    function () {

        // Stop speech
        if (
            "speechSynthesis" in
            window
        ) {

            window.speechSynthesis.cancel();
        }


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
// SWAP LANGUAGES
// =========================================================

swapButton.addEventListener(
    "click",
    function () {

        const currentSource =
            sourceLanguage.value;

        const currentTarget =
            targetLanguage.value;


        // -----------------------------------------------------
        // Swap languages
        // -----------------------------------------------------

        if (currentSource === "auto") {

            sourceLanguage.value =
                currentTarget;

            targetLanguage.value =
                "en";

        } else {

            sourceLanguage.value =
                currentTarget;

            targetLanguage.value =
                currentSource;
        }


        // -----------------------------------------------------
        // Swap text
        // -----------------------------------------------------

        const currentInput =
            inputText.value;

        const currentTranslation =
            translatedText.value;


        inputText.value =
            currentTranslation;

        translatedText.value =
            currentInput;


        // -----------------------------------------------------
        // Clear pronunciation
        // -----------------------------------------------------

        pronunciation.textContent =
            "";

        pronunciationContainer.style.display =
            "none";


        // -----------------------------------------------------
        // Stop speech
        // -----------------------------------------------------

        if (
            "speechSynthesis" in
            window
        ) {

            window.speechSynthesis.cancel();
        }


        status.textContent =
            "Languages swapped.";

    }
);


// =========================================================
// ENTER KEY SHORTCUT
// =========================================================

inputText.addEventListener(
    "keydown",
    function (event) {

        // Ctrl + Enter
        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            translateButton.click();
        }

    }
);


// =========================================================
// PAGE LOAD
// =========================================================

window.addEventListener(
    "load",
    function () {

        // Give Chrome time to load voices
        setTimeout(
            loadVoices,
            500
        );

        setTimeout(
            loadVoices,
            1500
        );

    }
);