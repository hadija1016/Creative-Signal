import json
import os

def load_brands():
    """Load brand profiles from brands.json"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    brands_path = os.path.join(base_dir, 'data', 'brands.json')
    
    with open(brands_path, 'r') as f:
        data = json.load(f)
    
    return data['brands']


def format_brands_for_prompt(brands):
    """Format brand profiles into readable text for prompt injection"""
    formatted = []
    
    for brand in brands:
        block = f"""
BRAND: {brand['brand_name']}
- Emotional Identity  : {brand['emotional_identity']}
- Pacing Style        : {brand['pacing_style']}
- Audience Energy     : {brand['audience_energy']}
- Storytelling Type   : {brand['storytelling_type']}
- Visual Language     : {brand['visual_language']}
        """.strip()
        
        formatted.append(block)
    
    return "\n\n".join(formatted)


def get_formatted_brands():
    """Main function — load and format brands in one call"""
    brands = load_brands()
    return format_brands_for_prompt(brands)