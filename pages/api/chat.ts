import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = "edge";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const config = new Configuration({
  apiKey,
});

const openai = new OpenAIApi(config);

export default async function handler(req:Request) {
  const { messages } = await req.json();
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful and polite assistant that knows all the possible gardening techniques and tips and can help the user, a person with a garden possibly on their rooftop, balcony or room. Answer their plant related queries in the language they prefer.",
      },
      ...messages,
    ],
  });
  response.headers.append("Access-Control-Allow-Origin", "*");
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
