export async function generateAISuggestions(clothes) {
  // Use import.meta.env for Vite to access environment variables
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key is missing. Please check your .env file.");

  // Reduce the objects to minimal information to save LLM context
  const minimalClothes = clothes.map(c => ({
    id: c.id,
    category: c.category,
    color: c.color,
    season: c.season,
    occasion: c.occasion,
    subCategory: c.subCategory || ''
  }));

  const systemPrompt = `You are a professional fashion stylist AI.
Your goal is to create up to 3 stylish outfit combinations from the user's provided wardrobe items.
Return ONLY a valid JSON object with the following structure:
{
  "suggestions": [
    {
      "outfit_ids": ["item_id_1", "item_id_2"],
      "score": 90,
      "type": "Casual"
    }
  ]
}
Rules getting outfits:
1. "score" should be an integer between 70 and 100 based on color harmony and style compatibility.
2. "type" should be a short string describing the style (e.g. "Mix & Match", "Athleisure", "Smart Casual").
3. Ensure items in the same outfit are logical to wear together (e.g., a top with a bottom, or a dress). Do not put two tops together unless one is outerwear.
4. Try to vary the style between suggestions if possible.
5. Provide a maximum of 3 suggestions.`;

  const userPrompt = `Here is my wardrobe: ${JSON.stringify(minimalClothes)}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Updated from decommissioned llama3-8b-8192
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errDetail = await response.text();
      console.error("Groq API Error:", errDetail);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const contentStr = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    const content = JSON.parse(contentStr);
    
    // Reconstruct full item objects from IDs
    return (content.suggestions || []).map(sug => {
      // Find original items maintaining their robust data
      const matchedItems = sug.outfit_ids
        .map(id => clothes.find(c => c.id === id))
        .filter(Boolean); // Filter out any undefined matches
        
      return {
        items: matchedItems,
        score: sug.score || 85,
        type: sug.type || 'AI Style'
      };
    }).filter(sug => sug.items.length > 0); // Remove any empty/invalid suggestions

  } catch (error) {
    console.error("Failed to generate AI suggestions:", error);
    throw error;
  }
}
