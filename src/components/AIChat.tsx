import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot } from "lucide-react";

interface AIChatProps {
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your Zizo_MedAI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setLoading(true);
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "ai", text: `AI Response to: ${input}` }]);
      setLoading(false);
    }, 1200);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px] shadow-2xl rounded-xl bg-gradient-to-br from-blue-900/90 to-purple-900/90 border border-blue-400/30 text-white">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-300"><Bot /> Zizo_MedAI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 overflow-y-auto mb-2 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-sm ${msg.sender === "ai" ? "text-cyan-200" : "text-white"}`}>{msg.text}</div>
            ))}
            {loading && <div className="text-cyan-400 animate-pulse">AI is thinking...</div>}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              className="flex-1 bg-blue-950/40 text-white border-cyan-400"
            />
            <Button variant="outline" onClick={handleSend} disabled={loading}>Send</Button>
          </div>
          <Button variant="ghost" className="w-full mt-2 text-cyan-300" onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    </div>
  );
};
