import type { APIRoute } from "astro";
import { isDefinedAndNotEmpty, isNotDefinedOrEmpty } from "../utils/fp.util";
import { NewsService } from "../services/news.service";
import { capitalizeFirst } from "../utils/string.util";

export const POST: APIRoute = async ({ request }) => {
  if (isNotDefinedOrEmpty(process.env.OPENAI_TOKEN)) {
    return new Response(JSON.stringify({ tags: [] }), { status: 200 });
  }

  const data = await extractFormData(request);
  try {
    const tags = await askOpenAi(data, process.env.OPENAI_TOKEN);
    return new Response(JSON.stringify({ tags }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({}), { status: 500 });
  }
};

async function extractFormData(request: Request) {
  const formData = await request.formData();
  return {
    title: formData.get("title")?.toString() ?? "",
    selectedTags: (formData.get("selectedTags")?.toString() ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(isDefinedAndNotEmpty),
    content: decodeURIComponent(
      atob(formData.get("content")?.toString() ?? "")
    ),
    knownTags: NewsService.getTags(),
  } as const;
}

type Data = Awaited<ReturnType<typeof extractFormData>>;

function askOpenAi(data: Data, token: string) {
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: buildRequestMessages(data),
    }),
  })
    .then((res) => res.json())
    .then((completion) => {
      const content = completion?.choices?.[0]?.message?.content;
      console.log(JSON.stringify({ completion, content }, undefined, 2));
      return content;
    })
    .then((res) => {
      try {
        const tags = JSON.parse(res)?.tags?.map(capitalizeFirst);
        console.log("found tags", tags);
        return tags;
      } catch {
        return res;
      }
    });
}

function buildRequestMessages(data: Data) {
  return [
    {
      role: "system",
      content: `You can only response a list of useful tag to categorize micro-blogging posts. A tag is a word or sometimes an expression. You can only use a json response format like {"tags":["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10"]}`,
    },
    {
      role: "system",
      content: `Known tags of the platform: ${JSON.stringify(data.knownTags)}`,
    },
    ...(isDefinedAndNotEmpty(data.title)
      ? [
          {
            role: "user",
            content: `The title of my post is: ${data.title}`,
          },
        ]
      : []),
    ...(isDefinedAndNotEmpty(data.selectedTags)
      ? [
          {
            role: "user",
            content: `Avoid those tags as I already selected it: ${data.selectedTags.join(
              ", "
            )}`,
          },
        ]
      : []),
    ...(isDefinedAndNotEmpty(data.content)
      ? [
          {
            role: "user",
            content: `The actual post content is:\n\n ${data.content}`,
          },
        ]
      : []),
    {
      role: "user",
      content: `Can you give me twenty (20) tags that can categorize this post with at least ten (10) from known tags?`,
    },
  ];
}
