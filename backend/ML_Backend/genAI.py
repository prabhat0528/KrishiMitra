from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)

# Allow frontend to connect
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GEMINI_KEY"))


@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    # Handle preflight (CORS) request
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        prompt = f"You are KrishiMitra, an AI farming assistant. Reply in a friendly and helpful tone.\nUser: {user_message}\nKrishiMitra:"
        result = model.invoke(prompt)
        response = result.content.strip()

        res = jsonify({"reply": response})
        res.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return res, 200

    except Exception as e:
        print("Error in /chat:", e)
        return jsonify({"error": str(e)}), 500


# --- Other routes (unchanged) ---

@app.route("/suggest-crop", methods=["POST"])
def suggest_crop():
    try:
        data = request.get_json()
        crop = data.get("crop")

        if not crop:
            return jsonify({"error": "Missing 'crop' field"}), 400

        prompt = PromptTemplate(
            input_variables=["crop"],
            template="Give a short summary about the crop '{crop}', including its ideal growing conditions, yield, and best fertilizer recommendations in JSON format with keys: description, ideal_conditions, fertilizer."
        )

        llm_input = prompt.format(crop=crop)
        result = model.invoke(llm_input)

        clean_output = result.content.strip()
        if clean_output.startswith("```json"):
            clean_output = clean_output.replace("```json", "").replace("```", "")
        parsed_output = json.loads(clean_output)

        return jsonify(parsed_output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json()
    text = data.get("text")
    target_lang = data.get("target_lang", "en")

    try:
        prompt = f"Translate the following crop information into {target_lang} language while keeping JSON structure:\n\n{text}"
        result = model.invoke(prompt)
        translated_output = result.content.strip()

        if translated_output.startswith("```json"):
            translated_output = translated_output.replace("```json", "").replace("```", "")
        parsed_output = json.loads(translated_output)

        return jsonify(parsed_output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/similar-crops", methods=["POST"])
def similar_crops():
    data = request.get_json()
    crop = data.get("crop")
    conditions = data.get("ideal_conditions")

    try:
        prompt = f"""
        The crop '{crop}' grows under the following ideal conditions:
        {json.dumps(conditions, indent=2)}.
        Suggest 3 to 5 other crops that can grow in similar soil and climatic conditions in India.
        Return them as a JSON list with key 'similar_crops'.
        Example: {{"similar_crops": ["Wheat", "Barley", "Oats"]}}
        """

        result = model.invoke(prompt)
        output = result.content.strip()

        if output.startswith("```json"):
            output = output.replace("```json", "").replace("```", "")

        parsed_output = json.loads(output)
        return jsonify(parsed_output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8080)
