import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AiTriageResult {
  category: "BILLING" | "TECHNICAL" | "ACCOUNT" | "GENERAL";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  aiSummary: string;
  aiSuggestedReply: string;
}

export const analyzeTicketWithAi = async (
  title: string,
  description: string
): Promise<AiTriageResult> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== "") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an automated support ticket triage assistant.
Analyze the following customer support ticket and classify it accurately.

Ticket Title: "${title}"
Ticket Description: "${description}"

Return ONLY a valid JSON object with the following schema:
{
  "category": "BILLING" | "TECHNICAL" | "ACCOUNT" | "GENERAL",
  "priority": "URGENT" | "HIGH" | "MEDIUM" | "LOW",
  "aiSummary": "A concise 1-sentence summary of the core issue",
  "aiSuggestedReply": "A helpful, empathetic draft response for the support agent to send to the customer"
}

Do not include any markdown formatting, backticks, or other text. Return raw JSON only.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      return {
        category: validateCategory(parsed.category),
        priority: validatePriority(parsed.priority),
        aiSummary: parsed.aiSummary || title,
        aiSuggestedReply: parsed.aiSuggestedReply || "Thank you for reaching out. We are investigating your issue.",
      };
    } catch (error) {
      console.warn("Gemini API call failed or timed out. Falling back to local rules engine.", error);
    }
  }

  return fallbackLocalTriage(title, description);
};

const fallbackLocalTriage = (title: string, description: string): AiTriageResult => {
  const text = `${title} ${description}`.toLowerCase();

  let category: "BILLING" | "TECHNICAL" | "ACCOUNT" | "GENERAL" = "GENERAL";
  if (/\b(payment|bkash|nagad|rocket|invoice|charge|bill|refund|subscription|money|trxid)\b/.test(text)) {
    category = "BILLING";
  } else if (/\b(bug|crash|error|server|500|database|api|slow|down|freeze|issue|exception)\b/.test(text)) {
    category = "TECHNICAL";
  } else if (/\b(login|password|otp|account|email|profile|register|access|auth)\b/.test(text)) {
    category = "ACCOUNT";
  }

  let priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
  if (/\b(urgent|asap|emergency|critical|crash|down|immediately|blocked)\b/.test(text)) {
    priority = "URGENT";
  } else if (/\b(payment|failed|trxid|broken|cannot login)\b/.test(text)) {
    priority = "HIGH";
  } else if (/\b(minor|typo|suggestion|trivial|low)\b/.test(text)) {
    priority = "LOW";
  }

  const aiSummary = title.length > 50 ? `${title.slice(0, 50)}...` : title;

  let aiSuggestedReply = `Hello, thank you for contacting support regarding "${title}". We have logged this ticket under our ${category} department with ${priority} priority. A support specialist is actively reviewing it and will assist you shortly.`;
  if (category === "BILLING") {
    aiSuggestedReply = `Hello, thank you for reaching out to billing support. We understand the urgency regarding your payment query. Please allow us a moment to verify the transaction details with our finance team and update your status.`;
  } else if (category === "TECHNICAL") {
    aiSuggestedReply = `Hello, thanks for reporting this technical issue. Our engineering team has been alerted and is investigating the root cause. We will provide an update as soon as possible.`;
  }

  return {
    category,
    priority,
    aiSummary,
    aiSuggestedReply,
  };
};

const validateCategory = (cat: any): "BILLING" | "TECHNICAL" | "ACCOUNT" | "GENERAL" => {
  const allowed = ["BILLING", "TECHNICAL", "ACCOUNT", "GENERAL"];
  return allowed.includes(cat) ? cat : "GENERAL";
};

const validatePriority = (pri: any): "URGENT" | "HIGH" | "MEDIUM" | "LOW" => {
  const allowed = ["URGENT", "HIGH", "MEDIUM", "LOW"];
  return allowed.includes(pri) ? pri : "MEDIUM";
};
