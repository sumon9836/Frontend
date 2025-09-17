import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Smartphone, Loader2, Copy, Check, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PairingFormProps {
  onPair: (phoneNumber: string) => void;
  isLoading?: boolean;
}

export default function PairingForm({ onPair, isLoading = false }: PairingFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onPair(phoneNumber.trim());
      // Simulate getting a code back (in real implementation, this would come from the API response)
      setTimeout(() => {
        const mockCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        setLastCode(mockCode);
        toast({
          title: "Pairing Code Generated! 🎉",
          description: `Code: ${mockCode} - Click to copy`,
        });
      }, 2000);
    }
  };

  const copyCode = async () => {
    if (lastCode) {
      await navigator.clipboard.writeText(lastCode);
      setCopied(true);
      toast({
        title: "Code Copied! ✨",
        description: "Pairing code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white/90 font-medium">Phone Number</Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., 919876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              data-testid="input-phone"
              className="glass-effect border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300"
            />
            <Smartphone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
        </div>

        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={!phoneNumber.trim() || isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0 shadow-lg hover-lift transition-all duration-300 h-12"
          data-testid="button-pair"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Magic Code...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Generate Pairing Code
            </>
          )}
        </Button>

        {/* Code Display with Copy Animation */}
        {lastCode && (
          <div className="glass-effect rounded-xl p-4 border border-white/20 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">Your Pairing Code:</p>
                <p className="text-2xl font-mono font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text animate-pulse">
                  {lastCode}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="glass-effect border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-white/60 mt-2 animate-pulse">
              Enter this code in your WhatsApp settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}