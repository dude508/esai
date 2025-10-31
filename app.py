import os
from flask import Flask, request, jsonify, render_template
from google import genai
from google.genai.errors import APIError

app = Flask(__name__)

# Konfigirasyon API Gemini an
# Kle a ap soti nan anviwònman Render la
try:
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY pa defini nan anviwònman an")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    chat = client.chats.create(model="gemini-2.5-flash") # Chwazi modèl ou vle a

except (ValueError, Exception) as e:
    # Sa ap itil pou depànaj sou Render
    print(f"Erè nan inisyalizasyon Gemini: {e}")
    client = None
    chat = None


@app.route("/")
def index():
    # Affiche paj prensipal la (aparans WhatsApp la)
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    if not client or not chat:
        return jsonify({"error": "Sèvis AI a pa disponib. Kle API a gendwa manke oswa mal konfigire."}), 500

    try:
        # Pran mesaj itilizatè a nan demann POST la
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Mesaj la manke"}), 400

        # Voye mesaj la bay Gemini
        response = chat.send_message(user_message)

        # Retounen repons Gemini an
        return jsonify({"response": response.text})

    except APIError as e:
        return jsonify({"error": f"Erè API Gemini a: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"Yon erè inatandi rive: {e}"}), 500

if __name__ == "__main__":
    # Sa itil pou teste lokalman. Render ap itilize Procfile la.
    app.run(debug=True)
