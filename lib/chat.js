const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 20;

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { valid: false, error: "Messages are required" };
  }

  if (messages.length > MAX_MESSAGES) {
    return {
      valid: false,
      error: `Maximum ${MAX_MESSAGES} messages allowed`,
    };
  }

  for (const msg of messages) {
    if (!msg.role || !["user", "assistant", "system"].includes(msg.role)) {
      return { valid: false, error: "Invalid message role" };
    }
    if (!msg.content || typeof msg.content !== "string" || !msg.content.trim()) {
      return { valid: false, error: "Message content is required" };
    }
    if (msg.content.trim().length > MAX_MESSAGE_LENGTH) {
      return {
        valid: false,
        error: `Each message must be under ${MAX_MESSAGE_LENGTH} characters`,
      };
    }
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return { valid: false, error: "Last message must be from user" };
  }

  return {
    valid: true,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content.trim(),
    })),
  };
}

export async function chat(messages) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "OpenAI API key is not configured",
    };
  }

  const validation = validateMessages(messages);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const systemMessage = {
    role: "system",
    content:
      "You are NovaPulse AI, a friendly and helpful assistant. Answer clearly and concisely.",
  };

  const hasSystem = validation.messages.some((m) => m.role === "system");
  const apiMessages = hasSystem
    ? validation.messages
    : [systemMessage, ...validation.messages];

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      messages: apiMessages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errMsg =
      data.error?.message || `OpenAI API error (${response.status})`;
    return { success: false, error: errMsg };
  }

  const reply = data.choices?.[0]?.message?.content;
  if (!reply) {
    return { success: false, error: "No response from ChatGPT" };
  }

  return { success: true, reply };
}

export { MAX_MESSAGE_LENGTH };
