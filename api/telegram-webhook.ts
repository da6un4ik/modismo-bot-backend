import type { VercelRequest, VercelResponse } from "@vercel/node";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBAPP_URL = process.env.WEBAPP_URL!;

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  try {
    const update = req.body as any;

    const message = update.message || update.callback_query?.message;
    if (!message) {
      return res.status(200).send("No message");
    }

    const chatId = message.chat.id;
    const text: string = message.text || "";

    if (text.startsWith("/start")) {
      await sendStartMessage(chatId);
    }

    return res.status(200).send("OK");
  } catch (e) {
    console.error("Error in webhook:", e);
    return res.status(500).send("Error");
  }
}

async function sendStartMessage(chatId: number) {
  const payload = {
    chat_id: chatId,
    text: "¡Bienvenido a Modismo Pro!\n\nPulsa el botón para abrir la app:",
    reply_markup: {
      keyboard: [
        [
          {
            text: "Abrir Modismo Pro",
            web_app: {
              url: WEBAPP_URL
            }
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
