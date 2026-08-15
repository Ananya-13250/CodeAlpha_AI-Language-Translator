from flask import Flask, render_template, request, jsonify
import requests
import pykakasi
from unidecode import unidecode
from pypinyin import lazy_pinyin, Style
from gtts import gTTS
from langdetect import detect, DetectorFactory
import base64
from io import BytesIO


app = Flask(__name__)


# =========================================================
# LANGUAGE DETECTION
# =========================================================

# Make language detection consistent
DetectorFactory.seed = 0


def detect_language(text):
    """
    Automatically detect the language of the input text.
    """

    try:

        detected = detect(text)

        print(
            "Detected language:",
            detected
        )

        return detected

    except Exception as e:

        print(
            "Language detection error:",
            str(e)
        )

        return "en"


# =========================================================
# JAPANESE ROMAJI
# =========================================================

kks = pykakasi.kakasi()


def romanize_japanese(text):
    """
    Convert Japanese Kanji, Hiragana and Katakana
    into Romaji.
    """

    result = kks.convert(text)

    words = []

    for item in result:

        word = item.get(
            "hepburn",
            ""
        ).strip()

        if word:

            words.append(word)

    return " ".join(words)


# =========================================================
# CHINESE PINYIN
# =========================================================

def romanize_chinese(text):
    """
    Convert Chinese characters into Pinyin.
    """

    result = lazy_pinyin(
        text,
        style=Style.NORMAL
    )

    return " ".join(result)


# =========================================================
# GENERAL PRONUNCIATION
# =========================================================

def get_pronunciation(text, language):

    # Japanese
    if language == "ja":

        return romanize_japanese(text)


    # Chinese Simplified
    elif language == "zh-CN":

        return romanize_chinese(text)


    # Chinese Traditional
    elif language == "zh-TW":

        return romanize_chinese(text)


    # Other languages
    else:

        return unidecode(text)


# =========================================================
# TEXT TO SPEECH
# =========================================================

def generate_speech(text, language):
    """
    Convert translated text into speech.

    Returns Base64 encoded MP3 audio.
    """

    tts_languages = {

        # -------------------------------------------------
        # INDIAN
        # -------------------------------------------------

        "en": "en",
        "hi": "hi",
        "mr": "mr",
        "gu": "gu",
        "bn": "bn",
        "ta": "ta",
        "te": "te",
        "kn": "kn",
        "ml": "ml",
        "pa": "pa",
        "ur": "ur",
        "ne": "ne",


        # -------------------------------------------------
        # EUROPEAN
        # -------------------------------------------------

        "fr": "fr",
        "es": "es",
        "de": "de",
        "it": "it",
        "pt": "pt",
        "nl": "nl",
        "ru": "ru",
        "uk": "uk",
        "pl": "pl",
        "cs": "cs",
        "sk": "sk",
        "ro": "ro",
        "hu": "hu",
        "bg": "bg",
        "el": "el",
        "sv": "sv",
        "da": "da",
        "no": "no",
        "fi": "fi",
        "is": "is",
        "ga": "ga",
        "cy": "cy",
        "ca": "ca",
        "hr": "hr",
        "sr": "sr",
        "sl": "sl",
        "et": "et",
        "lv": "lv",
        "lt": "lt",
        "mk": "mk",
        "sq": "sq",
        "bs": "bs",
        "be": "be",


        # -------------------------------------------------
        # MIDDLE EAST
        # -------------------------------------------------

        "ar": "ar",
        "he": "iw",
        "fa": "fa",
        "tr": "tr",


        # -------------------------------------------------
        # EAST ASIA
        # -------------------------------------------------

        "ja": "ja",
        "ko": "ko",
        "zh-CN": "zh-CN",
        "zh-TW": "zh-TW",
        "th": "th",
        "vi": "vi",


        # -------------------------------------------------
        # SOUTH EAST ASIA
        # -------------------------------------------------

        "id": "id",
        "ms": "ms",
        "fil": "tl",


        # -------------------------------------------------
        # AFRICA
        # -------------------------------------------------

        "sw": "sw",
        "af": "af",


        # -------------------------------------------------
        # OTHER
        # -------------------------------------------------

        "hy": "hy",
        "az": "az",
        "eu": "eu",
        "ka": "ka",
        "kk": "kk",
        "km": "km",
        "lo": "lo",
        "mn": "mn"
    }


    tts_language = tts_languages.get(
        language
    )


    if not tts_language:

        raise Exception(
            f"Speech is not supported for language: {language}"
        )


    mp3_fp = BytesIO()


    tts = gTTS(
        text=text,
        lang=tts_language,
        slow=False
    )


    tts.write_to_fp(
        mp3_fp
    )


    mp3_fp.seek(0)


    audio_base64 = base64.b64encode(
        mp3_fp.read()
    ).decode("utf-8")


    return audio_base64


# =========================================================
# TRANSLATION
# =========================================================

def translate_text(text, source, target):

    url = "https://api.mymemory.translated.net/get"


    params = {

        "q": text,

        "langpair":
            f"{source}|{target}"
    }


    print(
        "Translation:",
        source,
        "->",
        target
    )


    response = requests.get(
        url,
        params=params,
        timeout=30
    )


    if response.status_code != 200:

        raise Exception(
            "Translation service is unavailable."
        )


    result = response.json()


    print(
        "Translation API response:",
        result
    )


    response_status = result.get(
        "responseStatus"
    )


    # MyMemory may return 200 as either
    # integer or string depending on response

    if str(response_status) != "200":

        raise Exception(
            result.get(
                "responseDetails",
                "Translation failed."
            )
        )


    translated = result.get(
        "responseData",
        {}
    ).get(
        "translatedText",
        ""
    )


    if not translated:

        raise Exception(
            "No translation was returned."
        )


    return translated


# =========================================================
# HOME PAGE
# =========================================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# =========================================================
# TRANSLATION API
# =========================================================

@app.route(
    "/translate",
    methods=["POST"]
)
def translate():

    try:

        # =================================================
        # GET REQUEST
        # =================================================

        data = request.get_json()


        if not data:

            return jsonify({

                "error":
                    "Invalid request."

            }), 400


        # =================================================
        # GET VALUES
        # =================================================

        text = data.get(
            "text",
            ""
        ).strip()


        source = data.get(
            "source_language",
            "auto"
        )


        target = data.get(
            "target_language",
            "en"
        )


        # =================================================
        # VALIDATE TEXT
        # =================================================

        if not text:

            return jsonify({

                "error":
                    "Please enter some text."

            }), 400


        # =================================================
        # AUTO DETECTION
        # =================================================

        detected_language = None


        if source == "auto":

            detected_language = detect_language(
                text
            )

            source = detected_language


        # =================================================
        # FIX LANGUAGE CODES
        # =================================================

        # langdetect uses "zh" for Chinese.
        # MyMemory needs a more specific code.

        if source == "zh":

            source = "zh-CN"


        # =================================================
        # SAME LANGUAGE
        # =================================================

        if source == target:

            translated = text


        # =================================================
        # TRANSLATE
        # =================================================

        else:

            translated = translate_text(

                text,

                source,

                target
            )


        # =================================================
        # PRONUNCIATION
        # =================================================

        pronunciation = ""


        try:

            pronunciation = get_pronunciation(

                translated,

                target
            )

        except Exception as e:

            print(
                "Pronunciation error:",
                str(e)
            )

            pronunciation = ""


        # =================================================
        # SPEECH
        # =================================================

        speech = ""

        speech_error = ""


        try:

            speech = generate_speech(

                translated,

                target
            )


        except Exception as e:

            print(
                "Speech error:",
                str(e)
            )

            speech = ""

            speech_error = str(e)


        # =================================================
        # RESPONSE
        # =================================================

        return jsonify({

            "translation":
                translated,

            "pronunciation":
                pronunciation,

            "speech":
                speech,

            "speech_error":
                speech_error,

            "detected_language":
                detected_language,

            "source_language":
                source,

            "target_language":
                target

        })


    # =====================================================
    # REQUEST ERROR
    # =====================================================

    except requests.RequestException as e:

        print(
            "Request error:",
            str(e)
        )


        return jsonify({

            "error":
                "Could not connect to the translation service."

        }), 500


    # =====================================================
    # GENERAL ERROR
    # =====================================================

    except Exception as e:

        print(
            "Translation error:",
            str(e)
        )


        return jsonify({

            "error":
                str(e)

        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )