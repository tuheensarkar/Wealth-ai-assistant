// src/services/groqService.ts

// Load environment variables (make sure you have dotenv setup in your project)
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama3-8b-8192";

// ==========================
// Interfaces
// ==========================
export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ==========================
// System Prompt
// ==========================
const SYSTEM_PROMPT = `You are Wealth AI, an experienced Chartered Accountant who advises clients on personal finance, tax-saving strategies, and investments.

Answer in a professional, trustworthy, and concise manner.

Provide just the right balance: not too much detail to overwhelm, but not too little that it lacks clarity.

Structure responses in a neat, numbered or bulleted format.

Always suggest actionable, compliant advice based on Indian tax laws (e.g., Section 80C, 80D, capital gains, etc.) and general best practices in personal finance.

If a user asks something outside your scope, politely decline and suggest consulting a certified professional.

Maintain the tone of a seasoned CA speaking directly to their client.`;

// ==========================
// Service Class
// ==========================
export class GroqService {
  private conversationHistory: GroqMessage[] = [];

  // Core request handler
  private async makeRequest(messages: GroqMessage[]): Promise<string> {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages,
          temperature: 0.3,
          max_tokens: 1000,
          top_p: 0.9,
          stream: false, // set to true if you want streaming
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errText}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    } catch (error) {
      console.error('Groq API Error:', error);
      return "There was a technical issue. Please try again later.";
    }
  }

  // Handles user chat queries
  async getChatResponse(userMessage: string, context?: string): Promise<string> {
    let enhancedMessage = context
      ? `Context:\n${context}\n\nUser question: ${userMessage}`
      : userMessage;

    const messages: GroqMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...this.conversationHistory,
      { role: 'user', content: enhancedMessage }
    ];

    const reply = await this.makeRequest(messages);

    // Store conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });
    this.conversationHistory.push({ role: 'assistant', content: reply });

    return reply;
  }

  // Quick action responses for shortcuts
  async getQuickActionResponse(actionType: string): Promise<string> {
    const actionPrompts: Record<string, string> = {
      'section-80c': 'Explain Section 80C tax deductions available in India with current limits and best investment options.',
      'sip-calculator': 'Explain SIP (Systematic Investment Plan) benefits and provide guidance on calculating returns.',
      'tax-planning': 'Provide tax planning strategies for the current financial year in India.',
      'emi-planning': 'Explain EMI planning and how to calculate affordable loan amounts.',
      'investment-portfolio': 'Provide guidance on building a balanced investment portfolio.',
      'retirement-planning': 'Explain retirement planning strategies and required corpus calculation.'
    };

    const prompt = actionPrompts[actionType] || 
                  'Provide general financial advice and guidance.';

    return await this.getChatResponse(prompt);
  }

  // Reset history if needed
  resetHistory() {
    this.conversationHistory = [];
  }
}

// Singleton export
export const groqService = new GroqService();
