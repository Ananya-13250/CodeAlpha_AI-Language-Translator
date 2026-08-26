# AI Language Translator

A web-based **AI Language Translator** built as part of the CodeAlpha Artificial Intelligence Internship.

The application allows users to enter text, select source and target languages, translate the text, view pronunciation/romanization where useful, copy the result, and listen to the translated text using text-to-speech.

## Features

- 🌐 Translate text between multiple languages
- 🔄 Swap source and target languages
- 📋 Copy translated text
- 🔊 Text-to-speech for supported languages
- 🇯🇵 Japanese Romaji pronunciation
- 🇰🇷 Korean romanization
- 🇨🇳 Chinese Pinyin pronunciation
- 🗑️ Clear input and translation
- Simple and responsive web interface
- Flask backend with a JavaScript-based frontend

## Languages

The application includes a large selection of languages, including:

- English
- Hindi
- Marathi
- Gujarati
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Punjabi
- Urdu
- French
- Spanish
- German
- Italian
- Portuguese
- Dutch
- Russian
- Ukrainian
- Polish
- Czech
- Slovak
- Romanian
- Hungarian
- Bulgarian
- Greek
- Swedish
- Danish
- Norwegian
- Finnish
- Icelandic
- Irish
- Arabic
- Hebrew
- Persian
- Turkish
- Chinese (Simplified)
- Chinese (Traditional)
- Japanese
- Korean
- Thai
- Vietnamese
- Indonesian
- Malay
- Filipino
- Swahili
- Afrikaans
- Albanian
- Armenian
- Azerbaijani
- Basque
- Belarusian
- Bosnian
- Catalan
- Croatian
- Estonian
- Georgian
- Kazakh
- Khmer
- Lao
- Latvian
- Lithuanian
- Macedonian
- Mongolian
- Nepali
- Serbian
- Slovenian
- Welsh

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask

### APIs and Libraries
- MyMemory Translation API
- gTTS (Google Text-to-Speech)
- Pykakasi — Japanese Romaji conversion
- Pypinyin — Chinese Pinyin conversion
- Unidecode — pronunciation/transliteration support
- Requests — API requests

## Project Structure

```text
CodeAlpha_AI-Language-Translator/
│
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── script.js
│
└── venv/
```

> The `venv` folder is used locally and should not be uploaded to GitHub.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ananya-13250/CodeAlpha_AI-Language-Translator.git
cd CodeAlpha_AI-Language-Translator
```

### 2. Create a virtual environment

On Windows:

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### 3. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

If you need to install the main packages manually:

```powershell
python -m pip install flask requests pykakasi pypinyin unidecode gTTS
```

### 4. Run the application

```powershell
python app.py
```

Open the application in your browser:

```text
http://127.0.0.1:5000
```

## How to Use

1. Open the translator in your browser.
2. Select the **From** language.
3. Select the **To** language.
4. Enter the text you want to translate.
5. Click **Translate**.
6. The translated text will appear in the output box.
7. For languages such as Japanese, Korean and Chinese, pronunciation information is also displayed when available.
8. Click **🔊 Speak** to listen to the translation.
9. Use **📋 Copy** to copy the translated text.
10. Use **⇄ Swap** to exchange the source and target languages.
11. Use **🗑 Clear** to clear the current translation.

## Text-to-Speech

The application uses `gTTS` to generate speech for supported languages.

The speech flow is:

```text
Translated Text
      ↓
Flask /speak endpoint
      ↓
gTTS
      ↓
MP3 audio
      ↓
Browser audio player
```

This approach avoids depending only on the voices installed on the user's computer.

## Pronunciation Support

Some writing systems are difficult for users who cannot read the original script. The project therefore provides additional pronunciation information:

- **Japanese:** Romaji using Pykakasi
- **Chinese:** Pinyin using Pypinyin
- **Korean:** Romanization/transliteration support
- Other languages may use transliteration where appropriate

For example:

```text
Japanese:
こんにちは

Romaji:
Konnichiwa
```

## API

The Flask application provides two main endpoints.

### Translation

```text
POST /translate
```

Example request:

```json
{
    "text": "Hello, how are you?",
    "source_language": "en",
    "target_language": "hi"
}
```

### Speech

```text
POST /speak
```

Example request:

```json
{
    "text": "नमस्ते, आप कैसे हैं?",
    "language": "hi"
}
```

## Requirements

- Python 3.10 or newer
- Internet connection for translation and gTTS requests
- Modern web browser
- Required Python packages listed in `requirements.txt`

## Internship Task

This project was developed for:

**CodeAlpha Artificial Intelligence Internship — Task 1: Language Translation Tool**

The project demonstrates:

- API integration
- Language translation
- Frontend and backend communication
- Text processing
- Pronunciation/transliteration
- Text-to-speech
- Flask web application development

## Future Improvements

- Automatic language detection
- Voice input using microphone
- Translation history
- Download translated audio
- Offline translation support
- More advanced speech/voice selection
- Improved mobile responsiveness
- User accounts and saved translations

## Author

**Ananya Shetty**

Developed as part of the CodeAlpha AI Internship.

## License

This project is created for educational and internship purposes.
