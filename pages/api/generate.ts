import type { NextRequest } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload = {
    model: "text-davinci-003",
    prompt: "Help me find more companies like the one given:\n\nExample: Superfly, https://superf.ly/\nAnswer: Exhibition hub, https://www.exhibitionhub.com/\n\nExample: Ticketmaster, https://www.ticketmaster.com/\nanswer: StubHub, https://www.stubhub.com/\nLiveNation, https://www.livenation.com/\nAXS, https://www.axs.com/\n\nExample: JP Morgan, https://www.jpmorgan.com/global\nAnswer:\nBank of America, https://www.bankofamerica.com/\nCitigroup, https://www.citigroup.com/\nWells Fargo, https://www.wellsfargo.com/\nGoldman Sachs, https://www.goldmansachs.com/\n\nExample: Pullman Yards, https://www.pullmanyards.com/\nAnswer:\nThe Battery Atlanta, https://www.batteryatl.com/\nThe Interlock, https://www.theinterlockatl.com/\nThe Works at Chattahoochee, https://www.theworksatl.com/\nThe Works at Perimeter, https://www.theworksperimeter.com/\n\nExample:",,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const res = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = res.body;

  return new Response(data, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};

export default handler;
