
const GEMINI_API_KEY = "AIzaSyD3j23woEWwDD37zfUNhg5xzrZbuZiM6PE";

interface BusinessInfo {
  company_name: string;
  niche: string;
  description: string;
}

export const generateAIPrompt = (businessInfo: BusinessInfo): string => {
  const { company_name, niche, description } = businessInfo;
  
  return `You are a voice assistant for a ${niche.replace('-', ' ')} business named ${company_name}.
Begin each call with "Welcome to ${company_name}, how may I help you?"
Respond like a human staff member using this description: ${description}
Keep responses professional, helpful, and conversational. Always try to assist the caller with their needs.`;
};

export const processCallWithGemini = async (
  transcript: string, 
  businessInfo: BusinessInfo
): Promise<string> => {
  try {
    const prompt = generateAIPrompt(businessInfo);
    const fullPrompt = `${prompt}\n\nCustomer said: "${transcript}"\n\nRespond appropriately:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I didn't understand that. Could you please repeat?";
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return "I'm experiencing technical difficulties. Please try again later.";
  }
};

export const generateCallSummary = async (
  transcript: string,
  businessInfo: BusinessInfo
): Promise<string> => {
  try {
    const prompt = `Summarize this customer service call for ${businessInfo.company_name}:
    
Call transcript: "${transcript}"

Provide a brief summary including:
- Customer's main request or concern
- Actions taken or information provided
- Any follow-up needed

Keep it concise and professional.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Call summary unavailable";
  } catch (error) {
    console.error('Gemini AI Summary Error:', error);
    return "Call summary unavailable";
  }
};
