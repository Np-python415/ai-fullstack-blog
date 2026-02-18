import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    // 如果没有配置 API Key，返回模拟结果（用于演示）
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        summary: `这是一篇关于「${title || "技术文章"}」的文章。文章内容涉及技术实践与最佳实践，适合在项目中直接应用。`,
        model: "模拟模式（未配置 OPENAI_API_KEY）",
        note: "配置 OPENAI_API_KEY 环境变量后可使用真实的 AI 摘要生成功能。",
      });
    }

    // 构建提示词（RAG 工作流示例）
    const prompt = `请为以下技术博客文章生成一段简洁的中文摘要（2-4句话），突出核心观点和适用场景。

标题：${title || "技术文章"}

正文：
${content.substring(0, 2000)}${content.length > 2000 ? "..." : ""}

请直接输出摘要，不要重复标题。`;

    // 调用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个专业的技术博客摘要生成助手，擅长提取文章的核心观点。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content || "生成摘要失败";

    return NextResponse.json({
      summary,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("AI 摘要生成失败:", error);
    return NextResponse.json(
      {
        error: "AI 摘要生成失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
