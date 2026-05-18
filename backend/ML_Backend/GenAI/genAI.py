from flask import Flask, request, jsonify, g
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from prometheus_client import (
    Counter,
    Histogram,
    generate_latest,
    CONTENT_TYPE_LATEST
)

import os
import json
from time import time

# -----------------------------------------------------------
# Load Environment Variables
# -----------------------------------------------------------
load_dotenv()

# -----------------------------------------------------------
# Flask App Initialization
# -----------------------------------------------------------
app = Flask(__name__)

# Allow frontend (React) to connect
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

# -----------------------------------------------------------
# Gemini Model Initialization
# -----------------------------------------------------------
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_KEY")
)

# -----------------------------------------------------------
# Prometheus Metrics
# -----------------------------------------------------------

# Total Request Counter
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP Requests',
    ['method', 'endpoint', 'status']
)

# Request Latency Histogram
REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP Request Latency',
    ['endpoint']
)

# -----------------------------------------------------------
# Request Monitoring Middleware
# -----------------------------------------------------------
@app.before_request
def start_timer():
    g.start_time = time()


@app.after_request
def track_metrics(response):

    # Ignore metrics endpoint itself
    if request.path != "/metrics":

        request_latency = time() - g.start_time

        REQUEST_LATENCY.labels(
            request.path
        ).observe(request_latency)

        REQUEST_COUNT.labels(
            request.method,
            request.path,
            response.status_code
        ).inc()

    return response


# -----------------------------------------------------------
# Metrics Endpoint
# -----------------------------------------------------------
@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {
        'Content-Type': CONTENT_TYPE_LATEST
    }


# -----------------------------------------------------------
# Yield Insight Endpoint
# -----------------------------------------------------------
@app.route("/yield-insights", methods=["POST"])
def yield_insights():

    try:
        data = request.get_json()

        crop = data.get("Crop")
        season = data.get("Season")
        state = data.get("State")
        area = data.get("Area")
        rainfall = data.get("Annual_Rainfall")
        fertilizer = data.get("Fertilizer")
        pesticide = data.get("Pesticide")
        predicted_yield = data.get("Predicted_Yield")

        if not crop or not predicted_yield:
            return jsonify({
                "error": "Crop name and predicted yield are required"
            }), 400

        prompt = f"""
        You are KrishiMitra, an AI farming assistant.

        A farmer has provided the following details:

        Crop: {crop}
        Season: {season}
        State: {state}
        Area (hectares): {area}
        Annual Rainfall (mm): {rainfall}
        Fertilizer Used (kg): {fertilizer}
        Pesticide Used (kg): {pesticide}
        Predicted Yield (quintals/ha): {predicted_yield}

        Based on these details, provide a detailed & helpful report in strict JSON format:

        {{
            "yield_explanation": "Explain what factors caused this yield",
            "soil_and_rainfall_analysis": "Short analysis of rainfall vs crop requirement",
            "fertilizer_evaluation": "Is fertilizer amount good or needs adjustment?",
            "pesticide_evaluation": "Comments on pesticide usage and pest risk",
            "season_suitability": "Is this crop suitable for this season and state?",
            "improvement_tips": [
                "Tip 1",
                "Tip 2",
                "Tip 3"
            ],
            "recommended_crops": [
                "Crop 1",
                "Crop 2"
            ]
        }}

        Keep the explanation practical and India-farming focused.
        Return only JSON.
        """

        result = model.invoke(prompt)

        output = result.content.strip()

        # Remove markdown formatting
        if output.startswith("```json"):
            output = output.replace("```json", "").replace("```", "")

        parsed_output = json.loads(output)

        return jsonify(parsed_output)

    except Exception as e:
        print("Error in /yield-insights:", e)

        return jsonify({
            "error": str(e)
        }), 500


# -----------------------------------------------------------
# Suggest Crop Endpoint
# -----------------------------------------------------------
@app.route("/suggest-crop", methods=["POST"])
def suggest_crop():

    try:
        data = request.get_json()

        crop = data.get("crop")

        if not crop:
            return jsonify({
                "error": "Missing 'crop' field"
            }), 400

        prompt = PromptTemplate(
            input_variables=["crop"],
            template=(
                "Provide a concise overview of the crop '{crop}' "
                "including its ideal growing conditions, yield, and "
                "best fertilizer recommendations in JSON format with keys: "
                "description, ideal_conditions, fertilizer."
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

        return jsonify({
            "error": str(e)
        }), 500


# -----------------------------------------------------------
# Translate Endpoint
# -----------------------------------------------------------
@app.route("/translate", methods=["POST"])
def translate_text():

    try:
        data = request.get_json()

        text = data.get("text")

        target_lang = data.get("target_lang", "en")

        prompt = (
            f"Translate the following crop information into "
            f"{target_lang} language while keeping the JSON "
            f"structure intact:\n\n{text}"
        )

        result = model.invoke(prompt)

        translated_output = result.content.strip()

        if translated_output.startswith("```json"):
            translated_output = translated_output.replace(
                "```json",
                ""
            ).replace("```", "")

        parsed_output = json.loads(translated_output)

        return jsonify(parsed_output)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# -----------------------------------------------------------
# Similar Crops Endpoint
# -----------------------------------------------------------
@app.route("/similar-crops", methods=["POST"])
def similar_crops():

    try:
        data = request.get_json()

        crop = data.get("crop")

        conditions = data.get("ideal_conditions")

        prompt = (
            f"The crop '{crop}' grows under the following ideal conditions:\n"
            f"{json.dumps(conditions, indent=2)}.\n"
            "Suggest 3 to 5 other crops that can grow in similar soil "
            "and climatic conditions in India. "
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

        return jsonify({
            "error": str(e)
        }), 500


# -----------------------------------------------------------
# Run Flask App
# -----------------------------------------------------------
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )