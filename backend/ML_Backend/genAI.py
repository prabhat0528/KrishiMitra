from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Allow frontend (React) to connect
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Initialize Gemini model
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GEMINI_KEY"))

# ✅ Create Conversation Memory for chat
memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input")

# Define the conversation prompt template
chat_prompt = PromptTemplate(
    input_variables=["chat_history", "human_input"],
    template=(
        "You are KrishiMitra, an AI farming assistant who helps Indian farmers with crop advice, "
        "market trends, and sustainable practices. Use a professional tone and behave like an educated professional.\n\n"
        "Conversation so far:\n{chat_history}\n\n"
        "Farmer: {human_input}\nKrishiMitra:"
    )
)

# Create chain with memory
chat_chain = LLMChain(llm=model, prompt=chat_prompt, memory=memory)


@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    # Handle preflight request for CORS
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

        # Invoke memory-enabled chat chain
        result = chat_chain.invoke({"human_input": user_message})
        response_text = result["text"].strip()

        res = jsonify({"reply": response_text})
        res.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return res, 200

    except Exception as e:
        print("Error in /chat:", e)
        return jsonify({"error": str(e)}), 500


# --- Suggest crop summary route ---
@app.route("/suggest-crop", methods=["POST"])
def suggest_crop():
    try:
        data = request.get_json()
        crop = data.get("crop")

        if not crop:
            return jsonify({"error": "Missing 'crop' field"}), 400

        prompt = PromptTemplate(
            input_variables=["crop"],
            template=(
                "Provide a concise overview of the crop '{crop}' "
                "including its ideal growing conditions, yield, and best fertilizer recommendations "
                "in JSON format with keys: description, ideal_conditions, fertilizer."
            ),
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


# --- Translate crop information route ---
@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json()
    text = data.get("text")
    target_lang = data.get("target_lang", "en")

    try:
        prompt = (
            f"Translate the following crop information into {target_lang} language "
            f"while keeping the JSON structure intact:\n\n{text}"
        )
        result = model.invoke(prompt)
        translated_output = result.content.strip()

        if translated_output.startswith("```json"):
            translated_output = translated_output.replace("```json", "").replace("```", "")
        parsed_output = json.loads(translated_output)

        return jsonify(parsed_output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Suggest similar crops based on conditions ---
@app.route("/similar-crops", methods=["POST"])
def similar_crops():
    data = request.get_json()
    crop = data.get("crop")
    conditions = data.get("ideal_conditions")

    try:
        prompt = (
            f"The crop '{crop}' grows under the following ideal conditions:\n"
            f"{json.dumps(conditions, indent=2)}.\n"
            "Suggest 3 to 5 other crops that can grow in similar soil and climatic conditions in India. "
            "Return them as a JSON list with key 'similar_crops'. "
            "Example: {\"similar_crops\": [\"Wheat\", \"Barley\", \"Oats\"]}"
        )

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
