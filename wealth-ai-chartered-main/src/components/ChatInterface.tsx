import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { groqService } from "@/services/groqService";
import { knowledgeService } from "@/services/knowledgeService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onQuickAction?: (actionType: string) => void;
}

export interface ChatInterfaceRef {
  handleQuickAction: (actionType: string) => void;
  handleSearchQuery: (query: string) => void;
}

export const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({ onQuickAction }, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "🙏 **Namaste! I'm your AI Chartered Accountant.**\n\nI specialize in:\n• **Tax Planning** - Section 80C, 80D, and other deductions\n• **Investment Strategies** - SIP, mutual funds, and portfolio optimization\n• **Financial Planning** - Retirement, insurance, and goal-based planning\n• **Compliance** - ITR filing guidance and tax-saving strategies\n\nHow can I assist you with your financial goals today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const aiResponse = await groqService.getChatResponse(userMessage, conversationHistory);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Connection Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm experiencing technical difficulties. Please try asking your question again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionType: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await groqService.getQuickActionResponse(actionType);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      onQuickAction?.(actionType);
    } catch (error) {
      console.error('Error getting quick action response:', error);
      toast({
        title: "Error",
        description: "Failed to process quick action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchQuery = async (query: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Get relevant context from knowledge base
      const context = knowledgeService.getRelevantContext(query);
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: query,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Get conversation history for context
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const response = await groqService.getChatResponse(query, conversationHistory, context);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      onQuickAction?.(query);
    } catch (error) {
      console.error('Error getting search response:', error);
      toast({
        title: "Error",
        description: "Failed to process search query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleQuickAction,
    handleSearchQuery
  }));

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Handle markdown-style formatting for better readability
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0
                ${message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
                }
              `}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`
                ${message.type === 'user' ? 'chat-message-user' : 'chat-message-ai'}
              `}>
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 bg-secondary text-secondary-foreground">
                <Bot className="w-4 h-4" />
              </div>
              <div className="chat-message-ai">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing your query...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex space-x-3">
          <Input
            placeholder="Ask about tax planning, investments, or financial advice..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="gradient-primary hover:opacity-90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface";