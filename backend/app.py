from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from shap_e.models.download import load_model
from shap_e.models.model_utils import model_to_bytes
from shap_e.util.io import save_latent_to_file
import torch

app = Flask(__name__)
CORS(app)

# Load the pretrained Shap-E model
model = load_model("shap-e/model")

@app.route("/generate", methods=["POST"])
def generate():
    prompt = request.json.get("prompt", "a simple cube")
    
    # Generate latent 3D model
    with torch.no_grad():
        latent = model.sample(prompt=prompt)
    
    # Save as .glb
    output_file = "output.glb"
    save_latent_to_file(latent, output_file)
    
    return send_file(output_file, mimetype="model/gltf-binary")

if __name__ == "__main__":
    app.run(port=5000)
