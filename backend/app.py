import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from services.openai_service import analyze_brief

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    """Quick health check endpoint"""
    return jsonify({ "status": "Creative Signal backend is live ✦" })


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Main analysis endpoint.
    Expects JSON body:
    {
        "title":       string,
        "description": string,
        "mood_tags":   list of strings,
        "has_image":   boolean
    }
    """
    try:
        data = request.get_json()

        title       = data.get("title", "").strip()
        description = data.get("description", "").strip()
        mood_tags   = data.get("mood_tags", [])
        has_image   = data.get("has_image", False)

        # Validate required fields
        if not title or not description:
            return jsonify({
                "success": False,
                "error": "Title and description are required."
            }), 400

        # Run AI analysis
        result = analyze_brief(title, description, mood_tags, has_image)

        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)