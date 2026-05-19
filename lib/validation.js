import { MAX_MESSAGE_LENGTH } from "./chat";

export function validateMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: false, error: "Please type a message." };
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }
  return { valid: true, text: trimmed };
}
