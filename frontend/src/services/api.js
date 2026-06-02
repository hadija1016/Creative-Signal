const BASE_URL = "http://127.0.0.1:5000";

export async function analyzeBrief({ title, description, moodTags, hasImage }) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      mood_tags: moodTags,
      has_image: hasImage,
    }),
  });

  const data = await response.json();
  console.log("RAW API RESPONSE:", data)

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Analysis failed");
  }

  return {
    results:     Array.isArray(data.results) ? data.results : [],
    visualBoard: data.visual_board || null,
  }
}