import os

def load_prompt_template():
    """Load the editorial prompt template from file"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    prompt_path = os.path.join(base_dir, 'prompts', 'analysis_prompt.txt')

    with open(prompt_path, 'r') as f:
        return f.read()


def build_prompt(title, description, mood_tags, has_image=False):
    """
    Assemble the final prompt using manual replacement
    """
    template = load_prompt_template()

    image_note = (
        "Visual Reference: The director has uploaded a visual reference image. "
        "Factor in that they think visually and work with strong image-based references."
        if has_image else ""
    )

    mood_tags_str = ", ".join(mood_tags) if mood_tags else "None specified"

    prompt = template.replace("{title}",       title)
    prompt = prompt.replace("{description}",   description)
    prompt = prompt.replace("{mood_tags}",     mood_tags_str)
    prompt = prompt.replace("{image_note}",    image_note)

    return prompt