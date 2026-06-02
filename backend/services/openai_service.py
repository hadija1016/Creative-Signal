import os
import json
from groq import Groq
from dotenv import load_dotenv
from services.insight_generator import build_prompt

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_brief(title, description, mood_tags, has_image=False):
    try:
        prompt = build_prompt(title, description, mood_tags, has_image)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Creative Signal — an editorial creative intelligence system. "
                        "You return only raw valid JSON. No markdown. No explanation. "
                        "No preamble. Return exactly the JSON structure requested."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.85,
            max_tokens=3000
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model wraps response
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        parsed = json.loads(raw)

        return {
            "success":      True,
            "results":      parsed.get("categories", []),
            "visual_board": parsed.get("visual_board", {})
        }

    except json.JSONDecodeError as e:
        return { "success": False, "error": f"Failed to parse AI response: {str(e)}" }
    except Exception as e:
        return { "success": False, "error": str(e) }