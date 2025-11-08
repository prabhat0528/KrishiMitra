from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains (React frontend can access this API)

# -------------------- Model Training --------------------
base_dir = os.path.dirname(__file__)
csv_path = os.path.join(base_dir, 'Crop_recommendation.csv')

# Load dataset
df = pd.read_csv(csv_path)

# Features and labels
X = df.iloc[:, 0:-1]  # all columns except the last
y = df.iloc[:, -1]    # last column (crop name)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Standardize features
std = StandardScaler()
cols_to_scale = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

X_train[cols_to_scale] = std.fit_transform(X_train[cols_to_scale])
X_test[cols_to_scale] = std.transform(X_test[cols_to_scale])

# Train model
rfc = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
rfc.fit(X_train, y_train)

# Evaluate
y_pred = rfc.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model trained with accuracy: {accuracy * 100:.2f}%")

# -------------------- Prediction Function --------------------
def predict_crop(input_data):
    input_array = np.array(input_data).reshape(1, -1)
    scaled_input = std.transform(input_array)
    prediction = rfc.predict(scaled_input)
    return prediction[0]


# -------------------- Flask Route --------------------
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    try:
        N = float(data['N'])
        P = float(data['P'])
        K = float(data['K'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        ph = float(data['ph'])
        rainfall = float(data['rainfall'])

        input_data = [N, P, K, temperature, humidity, ph, rainfall]
        predicted_crop = predict_crop(input_data)

        return jsonify({
            'status': 'success',
            'predicted_crop': predicted_crop
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        })


@app.route('/')
def home():
    return "🌾 KrishiMitra ML Backend is running successfully!"


# -------------------- Run the app --------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
