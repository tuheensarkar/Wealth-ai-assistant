import { useState, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Add type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitonEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface VoiceAssistantProps {
  onVoiceCommand: (command: string) => void;
}

export const VoiceAssistant = ({ onVoiceCommand }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        toast.success("Voice assistant is listening...");
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', transcript);
        
        // Process voice commands
        processVoiceCommand(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error("Voice recognition error. Please try again.");
      };
      
      return recognition;
    }
    return null;
  };

  const processVoiceCommand = (transcript: string) => {
    let command = "";
    
    // SIP Calculator commands
    if (transcript.includes('sip') || transcript.includes('systematic investment')) {
      if (transcript.includes('calculate') || transcript.includes('returns')) {
        command = "Calculate SIP returns based on your voice command: " + transcript;
      } else {
        command = "Tell me about SIP investments";
      }
    }
    // Tax Planning commands
    else if (transcript.includes('tax') && (transcript.includes('save') || transcript.includes('planning'))) {
      command = "Provide tax saving strategies for current financial year";
    }
    // EMI Calculator commands
    else if (transcript.includes('emi') || transcript.includes('loan')) {
      if (transcript.includes('calculate')) {
        command = "Calculate EMI based on your requirements: " + transcript;
      } else {
        command = "Help me with loan and EMI planning";
      }
    }
    // Retirement Planning
    else if (transcript.includes('retirement') || transcript.includes('corpus')) {
      command = "Help me plan for retirement and calculate required corpus";
    }
    // Section 80C
    else if (transcript.includes('80c') || transcript.includes('section 80c')) {
      command = "Explain Section 80C tax deductions and investment options";
    }
    // Investment Portfolio
    else if (transcript.includes('investment') || transcript.includes('portfolio')) {
      command = "Guide me on building a balanced investment portfolio";
    }
    // General greeting
    else if (transcript.includes('hey wealth ai') || transcript.includes('hello wealth ai')) {
      command = "Hello! I'm your personal CA assistant. How can I help you with your finances today?";
    }
    // Default case
    else {
      command = transcript;
    }
    
    onVoiceCommand(command);
    toast.success("Voice command processed: " + (command.length > 50 ? command.substring(0, 50) + "..." : command));
  };

  const startListening = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recognition = initSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      } else {
        toast.error("Speech recognition not supported in this browser");
      }
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast.error("Microphone access is required for voice commands");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Voice assistant unmuted" : "Voice assistant muted");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Voice Assistant
            </CardTitle>
            <CardDescription>
              Say "Hey Wealth AI" to get started
            </CardDescription>
          </div>
          {isListening && (
            <Badge variant="secondary" className="animate-pulse">
              Listening...
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className="flex-1"
            disabled={false}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Voice Assistant
              </>
            )}
          </Button>
          
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">Try saying:</p>
          <ul className="text-xs space-y-1 ml-2">
            <li>• "Calculate my SIP returns for ₹10k monthly"</li>
            <li>• "Show me tax saving options"</li>
            <li>• "Help with retirement planning"</li>
            <li>• "Calculate EMI for home loan"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};