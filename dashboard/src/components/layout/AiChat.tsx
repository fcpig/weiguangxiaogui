import { useState, useRef, useEffect } from "react";
import { Button, Input, Spin } from "antd";
import { AI_API_URL, AI_API_KEY } from "../providers/constants";

const SYSTEM_PROMPT = `你是无锡市扬名小柜公益项目优化建议助手。这是一个面向困难群体的公益小柜项目，目前是demo，用户可通过app触屏或100%语音交互模式领取余量食物。还有企业和政府管理面板，可以进行食物管理、过期提醒、志愿者分配等控制功能，包含可视化面板等。你要回答政府管理人员对于本项目的问题，不要说无关内容，如果管理员问你一些数据等，就先模拟出一些数据进行介绍，不要推理，快速且简洁的回复问题。`;

const MODEL_ID = "zai-org/GLM-4.5-Air";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const AiChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 18px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          background: "rgba(59, 130, 246, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(96, 165, 250, 0.4)",
          cursor: "pointer",
          color: "#60A5FA",
          transition: "all 0.3s ease",
          marginBottom: "8px",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(59, 130, 246, 0.25)";
          e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.6)";
          e.currentTarget.style.color = "#93C5FD";
          e.currentTarget.style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
          e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.4)";
          e.currentTarget.style.color = "#60A5FA";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <span style={{ fontSize: "20px" }}>🤖</span>
        <span>AI 助手</span>
      </button>

      {isOpen && <AiChatPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};

interface AiChatPanelProps {
  onClose: () => void;
}

const AiChatPanel = ({ onClose }: AiChatPanelProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "您好！我是扬名小柜 AI 助手，可以为您解答关于本项目的各类问题。",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const allMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: userMessage.content },
      ];

      const response = await fetch(AI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: allMessages,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `请求失败: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "抱歉，我没有理解您的问题。",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `抱歉，服务暂时不可用：${error?.message || "未知错误"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "260px",
        bottom: "24px",
        width: "480px",
        height: "600px",
        background: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🤖</span>
          <div>
            <div style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "16px" }}>
              AI 助手
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>
              扬名小柜智能顾问
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "none",
            borderRadius: "10px",
            padding: "8px 14px",
            cursor: "pointer",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          收起
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "14px 18px",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 6px 18px"
                    : "18px 18px 18px 6px",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)"
                    : "#FFFFFF",
                color: msg.role === "user" ? "#FFFFFF" : "#1E293B",
                fontSize: "14px",
                lineHeight: 1.7,
                wordBreak: "break-word",
                boxShadow: msg.role === "assistant" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                border: msg.role === "assistant" ? "1px solid rgba(0,0,0,0.05)" : "none",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "18px 18px 18px 6px",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Spin size="small" />
              <span style={{ fontSize: "13px", color: "#64748B" }}>
                AI 思考中...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(59, 130, 246, 0.1)",
          display: "flex",
          gap: "10px",
          background: "#FFFFFF",
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题..."
          style={{
            flex: 1,
            borderRadius: "24px",
            border: "1px solid #E2E8F0",
            fontSize: "14px",
            padding: "10px 16px",
          }}
          disabled={isLoading}
        />
        <Button
          type="primary"
          onClick={handleSend}
          loading={isLoading}
          style={{
            borderRadius: "24px",
            background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
            border: "none",
            padding: "8px 20px",
            fontSize: "14px",
            fontWeight: 500,
            height: "40px",
          }}
        >
          发送
        </Button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
