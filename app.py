from flask import Flask, render_template, request, jsonify, send_file
import requests
import pykakasi
from unidecode import unidecode
from pypinyin import lazy_pinyin, Style
from gtts import gTTS
import io


app = Flask(__name__)


# =========================================================
# JAPANESE ROMAJI
# =========================================================

kks = pykakasi.kakasi()


def romanize_japanese(text):

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

    result = lazy_pinyin(
        text,
        style=Style.NORMAL
    )

    return " ".join(result)


# =========================================================
# PRONUNCIATION
# =========================================================

def get_pronunciation(
    text,
    language
):

    if language == "ja":

        return romanize_japanese(text)

    elif language in ["zh-CN", "zh-TW"]:

        return romanize_chinese(text)

    else:

        return unidecode(text)


# =========================================================
# LANGUAGE CODES FOR GOOGLE TTS
# =========================================================

TTS_LANGUAGES = {

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

    "ar": "ar",
    "he": "he",
    "fa": "fa",
    "tr": "tr",

    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",

    "ja": "ja",
    "ko": "ko",
    "th": "th",
    "vi": "vi",

    "id": "id",
    "ms": "ms",
    "fil": "tl",

    "sw": "sw",
    "af": "af",
    "sq": "sq",
    "hy": "hy",
    "az": "az",
    "eu": "eu",
    "be": "be",
    "bs": "bs",
    "ca": "ca",
    "hr": "hr",
    "et": "et",
    "ka": "ka",
    "kk": "kk",
    "km": "km",
    "lo": "lo",
    "lv": "lv",
    "lt": "lt",
    "mk": "mk",
    "mn": "mn",
    "ne": "ne",
    "sr": "sr",
    "sl": "sl",
    "cy": "cy"
}


# =========================================================
# TRANSLATION
# =========================================================

def translate_text(
    text,
    source,
    target
):

    url = (
        "https://api.mymemory.translated.net/get"
    )

    params = {

        "q": text,

        "langpair":
            f"{source}|{target}"

    }

    response = requests.get(
        url,
        params=params,
        timeout=20
    )

    if response.status_code != 200:

        raise Exception(
            "Translation service is unavailable."
        )

    result = response.json()

    if result.get("responseStatus") != 200:

        raise Exception(
            result.get(
                "responseDetails",
                "Translation failed."
            )
        )

    translated = (
        result
        .get("responseData", {})
        .get("translatedText", "")
    )

    if not translated:

        raise Exception(
            "No translation was returned."
        )

    return translated


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# =========================================================
# TRANSLATE API
# =========================================================

@app.route(
    "/translate",
    methods=["POST"]
)
def translate():

    try:

        data = request.get_json()

        text = data.get(
            "text",
            ""
        ).strip()

        source = data.get(
            "source_language",
            "en"
        )

        target = data.get(
            "target_language",
            "en"
        )

        if not text:

            return jsonify({
                "error":
                "Please enter some text."
            }), 400


        if source == "auto":

            source = "en"


        if source == target:

            translated = text

        else:

            translated = translate_text(
                text,
                source,
                target
            )


        # Generate pronunciation text

        pronunciation = ""

        try:

            pronunciation = get_pronunciation(
                translated,
                target
            )

        except Exception as error:

            print(
                "Pronunciation error:",
                error
            )


        return jsonify({

            "translation":
                translated,

            "pronunciation":
                pronunciation

        })


    except Exception as error:

        print(
            "Translation error:",
            error
        )

        return jsonify({
            "error":
            str(error)
        }), 500


# =========================================================
# TEXT TO SPEECH
# =========================================================

@app.route(
    "/speak",
    methods=["POST"]
)
def speak():

    try:

        data = request.get_json()

        text = data.get(
            "text",
            ""
        ).strip()

        language = data.get(
            "language",
            "en"
        )


        if not text:

            return jsonify({
                "error":
                "Nothing to speak."
            }), 400


        # Get Google TTS language code

        tts_language = TTS_LANGUAGES.get(
            language
        )


        if not tts_language:

            return jsonify({
                "error":
                f"Speech is not available for {language}."
            }), 400


        # Create speech

        speech = gTTS(
            text=text,
            lang=tts_language,
            slow=False
        )


        # Store audio in memory

        audio = io.BytesIO()

        speech.write_to_fp(
            audio
        )

        audio.seek(0)


        return send_file(
            audio,
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="speech.mp3"
        )


    except Exception as error:

        print(
            "Speech error:",
            error
        )

        return jsonify({
            "error":
            "Could not generate speech. Check your internet connection."
        }), 500


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )