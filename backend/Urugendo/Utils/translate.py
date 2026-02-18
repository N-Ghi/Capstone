import uuid
import requests
from django.conf import settings


def translate_text(text: str, to_lang: str, from_lang: str = None) -> str:
    """
    Translate text using Azure Cognitive Translator.
    Omit from_lang to enable auto-detection.

    Args:
        text: The text to translate
        to_lang: Target language code e.g. "fr", "en", "ar", "sw", "rw"
        from_lang: Source language code (optional, auto-detected if omitted)

    Returns:
        Translated string

    Usage:
        from Utils.translate import translate_text
        translated = translate_text("Muraho!", to_lang="en")
        # returns "Hello!"
    """
    params = {"api-version": "3.0", "to": to_lang}
    if from_lang:
        params["from"] = from_lang

    headers = {
        "Ocp-Apim-Subscription-Key": settings.AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": settings.AZURE_TRANSLATOR_REGION,
        "Content-Type": "application/json",
        "X-ClientTraceId": str(uuid.uuid4()),
    }

    try:
        response = requests.post(
            f"{settings.AZURE_TRANSLATOR_ENDPOINT}/translate",
            params=params,
            headers=headers,
            json=[{"text": text}],
            timeout=10,
        )
        response.raise_for_status()
        return response.json()[0]["translations"][0]["text"]
    except requests.RequestException as e:
        raise Exception(f"Azure Translator error: {e}")


def detect_language(text: str) -> str:
    """
    Detect the language of a given text.

    Returns:
        Language code string e.g. "en", "fr", "rw"

    Usage:
        from Utils.translate import detect_language
        lang = detect_language("Muraho!")
        # returns "rw"
    """
    headers = {
        "Ocp-Apim-Subscription-Key": settings.AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": settings.AZURE_TRANSLATOR_REGION,
        "Content-Type": "application/json",
        "X-ClientTraceId": str(uuid.uuid4()),
    }

    try:
        response = requests.post(
            f"{settings.AZURE_TRANSLATOR_ENDPOINT}/detect",
            params={"api-version": "3.0"},
            headers=headers,
            json=[{"text": text}],
            timeout=10,
        )
        response.raise_for_status()
        return response.json()[0]["language"]
    except requests.RequestException as e:
        raise Exception(f"Azure Detect error: {e}")