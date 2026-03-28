import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIChat, AIMessage } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";

function MessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2 mb-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted/50 text-foreground rounded-bl-md"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat("chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full gradient-primary shadow-lg hover:opacity-90 hover:scale-110 transition-all flex items-center justify-center glow-primary"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl border border-border bg-background shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/60 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Assistant</p>
                <p className="text-xs text-muted-foreground">Powered by Lovable AI</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearMessages}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="h-10 w-10 text-primary/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium">How can I help you today?</p>
                <p className="text-xs text-muted-foreground mt-1">Ask about creators, content, or campaigns</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2 items-center text-muted-foreground text-sm">
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                </div>
                <span className="animate-pulse">Thinking...</span>
              </div>
            )}
            {error && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-lg p-2 mt-2">{error}</div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about influencers, trends..."
                className="flex-1 bg-muted/30 border-border/50 text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="gradient-primary h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
