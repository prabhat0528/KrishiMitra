from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score

# -----------------------------------------------------------
#  Flask App Initialization
# -----------------------------------------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------------------------------------
#  File Paths
# -----------------------------------------------------------
BASE_DIR = os.path.dirname(__file__)
CROP_RECOMMENDATION_CSV = os.path.join(BASE_DIR, "Crop_recommendation.csv")
CROP_YIELD_CSV = os.path.join(BASE_DIR, "crop_yield.csv")

# -----------------------------------------------------------
#  Crop Recommendation Model
# -----------------------------------------------------------
print("\n[INFO] Loading Crop Recommendation Model...")

crop_df = pd.read_csv(CROP_RECOMMENDATION_CSV)
X = crop_df.iloc[:, :-1]
y = crop_df.iloc[:, -1]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler_crop = StandardScaler()
cols_to_scale = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
X_train[cols_to_scale] = scaler_crop.fit_transform(X_train[cols_to_scale])
X_test[cols_to_scale] = scaler_crop.transform(X_test[cols_to_scale])

crop_model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
crop_model.fit(X_train, y_train)

y_pred = crop_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f" Crop Recommendation Model trained successfully (Accuracy: {accuracy * 100:.2f}%)")


def predict_crop(input_data: dict) -> str:
    """Predict crop based on soil and weather parameters."""
    input_values = np.array([
        input_data["N"], input_data["P"], input_data["K"],
        input_data["temperature"], input_data["humidity"],
        input_data["ph"], input_data["rainfall"]
    ]).reshape(1, -1)

    scaled_input = scaler_crop.transform(input_values)
    prediction = crop_model.predict(scaled_input)
    return prediction[0]


# -----------------------------------------------------------
#  Crop Yield Prediction Model
# -----------------------------------------------------------
print("\n[INFO] Loading Crop Yield Prediction Model...")

yield_df = pd.read_csv(CROP_YIELD_CSV)

# Clean categorical fields
for col in ['Crop', 'State', 'Season']:
    yield_df[col] = yield_df[col].str.replace(" ", "")

# Drop unnecessary columns
yield_df = yield_df.drop(columns=["Crop_Year", "Production"])

X_yield = yield_df.iloc[:, :-1]
y_yield = yield_df.iloc[:, -1]

X_train_y, X_test_y, y_train_y, y_test_y = train_test_split(
    X_yield, y_yield, test_size=0.2, random_state=42
)

categorical_features = ["Crop", "Season", "State"]
label_encoders = {feature: LabelEncoder() for feature in categorical_features}

for feature in categorical_features:
    X_train_y[feature] = label_encoders[feature].fit_transform(X_train_y[feature])
    X_test_y[feature] = label_encoders[feature].transform(X_test_y[feature])

numeric_features = ["Area", "Annual_Rainfall", "Fertilizer", "Pesticide"]
scaler_yield = StandardScaler()
X_train_y[numeric_features] = scaler_yield.fit_transform(X_train_y[numeric_features])
X_test_y[numeric_features] = scaler_yield.transform(X_test_y[numeric_features])

yield_model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
yield_model.fit(X_train_y, y_train_y)

y_pred_yield = yield_model.predict(X_test_y)
mse = mean_squared_error(y_test_y, y_pred_yield)
r2 = r2_score(y_test_y, y_pred_yield)
print(f" Crop Yield Model trained (R²: {r2:.3f}, RMSE: {np.sqrt(mse):.3f})")


def predict_yield(input_data: dict) -> float:
    """Predict crop yield (tons per hectare) using trained model."""
    try:
        processed_data = input_data.copy()

        # Encode categorical features
        for feature in categorical_features:
            value = processed_data[feature]
            if value not in label_encoders[feature].classes_:
                raise ValueError(f"Unknown value '{value}' for {feature}")
            processed_data[feature] = label_encoders[feature].transform([value])[0]

        # Prepare a DataFrame
        df_input = pd.DataFrame([processed_data])

        # Apply scaling to numeric features 
        df_input[numeric_features] = scaler_yield.transform(df_input[numeric_features])

        # Predict
        prediction = yield_model.predict(df_input)[0]
        return round(prediction, 3)

    except Exception as e:
        raise ValueError(f"Yield prediction failed: {e}")


# -----------------------------------------------------------
#  Routes
# -----------------------------------------------------------
@app.route("/")
def home():
    return jsonify({"message": "🌾 KrishiMitra ML Backend is running successfully!"})


@app.route("/predict", methods=["POST"])
def predict_crop_route():
    try:
        data = request.get_json()
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        prediction = predict_crop({k: float(data[k]) for k in data})
        return jsonify({"status": "success", "predicted_crop": prediction})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/predict_yield", methods=["POST"])
def predict_yield_route():
    try:
        data = request.get_json()
        required_fields = ["Crop", "Season", "State", "Area", "Annual_Rainfall", "Fertilizer", "Pesticide"]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        processed_data = {
            "Crop": data["Crop"].replace(" ", ""),
            "Season": data["Season"].replace(" ", ""),
            "State": data["State"].replace(" ", ""),
            "Area": float(data["Area"]),
            "Annual_Rainfall": float(data["Annual_Rainfall"]),
            "Fertilizer": float(data["Fertilizer"]),
            "Pesticide": float(data["Pesticide"])
        }

        prediction = predict_yield(processed_data)
        return jsonify({
            "status": "success",
            "predicted_yield": f"{prediction} metric tons per hectare"
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# -----------------------------------------------------------
# Run Flask App
# -----------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
