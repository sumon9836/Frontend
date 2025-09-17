import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PairingFormProps {
  onPair?: (phoneNumber: string) => void;
  isLoading?: boolean;
}

export default function PairingForm({ onPair, isLoading = false }: PairingFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pairingCode, setPairingCode] = useState("");
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [pairingStatus, setPairingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    // Clean phone number
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    
    if (cleanNumber.length < 10) {
      toast({
        title: "Error", 
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    console.log("Pairing request for:", cleanNumber);
    
    try {
      // Call the API directly to get the response
      const response = await fetch(`/api/pair?number=${cleanNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Pairing response:", data);
      
      if (data.error) {
        // Handle ban or other errors
        if (data.error.includes("ban")) {
          toast({
            title: "Account Banned",
            description: `User ${cleanNumber} is banned from using this service`,
            variant: "destructive",
          });
          setPairingStatus("banned");
        } else {
          toast({
            title: "Pairing Failed",
            description: data.error,
            variant: "destructive",
          });
        }
      } else if (data.code) {
        // Successfully generated pairing code
        setPairingCode(data.code);
        setIsCodeGenerated(true);
        setPairingStatus("code_generated");
        toast({
          title: "Pairing Code Generated!",
          description: `Your pairing code is: ${data.code}`,
        });
      } else if (data.status && data.status === "already paired") {
        // Already registered
        setPairingStatus("already_paired");
        toast({
          title: "Already Paired",
          description: `Number ${data.number} is already registered and paired`,
        });
      } else {
        // Unexpected response format
        console.warn("Unexpected API response format:", data);
        toast({
          title: "Unexpected Response",
          description: "The server returned an unexpected response format.",
          variant: "destructive",
        });
      }
      
      // Also call the parent handler
      onPair?.(cleanNumber);
      
    } catch (error) {
      console.error("Pairing error:", error);
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Failed to connect to pairing service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairingCode);
    toast({
      title: "Copied!",
      description: "Pairing code copied to clipboard",
    });
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,5})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(" ");
    }
    return cleaned;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Smartphone className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Pair Your WhatsApp</CardTitle>
        <CardDescription>
          Enter your phone number to generate a pairing code for your WhatsApp bot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" data-testid="label-phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="91 12345 67890"
              value={formatPhoneNumber(phoneNumber)}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading || isCodeGenerated}
              data-testid="input-phone"
              className="font-mono"
            />
          </div>
          
          {pairingStatus === "banned" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <span className="text-sm font-medium">❌ Account Banned</span>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-sm text-red-800">
                  Your number has been banned from using this service.
                  Please contact the administrator for assistance.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setPairingStatus(null);
                  setPhoneNumber("");
                }}
                data-testid="button-try-different"
              >
                Try Different Number
              </Button>
            </div>
          ) : pairingStatus === "already_paired" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Already Registered</span>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm text-green-800">
                  This number is already paired and registered with WhatsApp Web.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setPairingStatus(null);
                  setPhoneNumber("");
                }}
                data-testid="button-pair-different"
              >
                Pair Different Number
              </Button>
            </div>
          ) : !isCodeGenerated ? (
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="button-generate-code"
            >
              {isLoading ? "Generating..." : "Generate Pairing Code"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Code Generated!</span>
              </div>
              
              <div className="p-4 bg-muted rounded-lg text-center space-y-2">
                <Label className="text-xs text-muted-foreground">Your Pairing Code</Label>
                <div className="flex items-center justify-center space-x-2">
                  <code className="text-2xl font-mono font-bold tracking-widest" data-testid="text-pairing-code">
                    {pairingCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    data-testid="button-copy-code"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Go to WhatsApp Settings → Linked Devices → Link a Device → Enter this code
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsCodeGenerated(false);
                  setPairingCode("");
                  setPhoneNumber("");
                  setPairingStatus(null);
                }}
                data-testid="button-generate-new"
              >
                Generate New Code
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}