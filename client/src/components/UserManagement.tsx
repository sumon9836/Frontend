import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Ban, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserManagementProps {
  onBlock?: (phoneNumber: string, reason?: string) => void;
  onUnblock?: (phoneNumber: string) => void;
}

export default function UserManagement({ onBlock, onUnblock }: UserManagementProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reason, setReason] = useState("");
  const [action, setAction] = useState<"block" | "unblock">("block");
  const { toast } = useToast();

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,5})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(" ");
    }
    return cleaned;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    
    if (cleanNumber.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number", 
        variant: "destructive",
      });
      return;
    }

    if (action === "block") {
      console.log("Block user:", cleanNumber, "Reason:", reason);
      onBlock?.(cleanNumber, reason || undefined);
      toast({
        title: "User Blocked",
        description: `${formatPhoneNumber(cleanNumber)} has been blocked`,
        variant: "destructive",
      });
    } else {
      console.log("Unblock user:", cleanNumber);
      onUnblock?.(cleanNumber);
      toast({
        title: "User Unblocked",
        description: `${formatPhoneNumber(cleanNumber)} has been unblocked`,
      });
    }

    // Reset form
    setPhoneNumber("");
    setReason("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle>User Management</CardTitle>
        </div>
        <CardDescription>
          Block or unblock users from accessing the WhatsApp bot
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant={action === "block" ? "default" : "outline"}
              onClick={() => setAction("block")}
              className="flex-1"
              data-testid="button-action-block"
            >
              <Ban className="w-4 h-4 mr-2" />
              Block User
            </Button>
            <Button
              type="button"
              variant={action === "unblock" ? "default" : "outline"}
              onClick={() => setAction("unblock")}
              className="flex-1"
              data-testid="button-action-unblock"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unblock User
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manage-phone">Phone Number</Label>
            <Input
              id="manage-phone"
              type="tel"
              placeholder="91 12345 67890"
              value={formatPhoneNumber(phoneNumber)}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="font-mono"
              data-testid="input-manage-phone"
            />
          </div>

          {action === "block" && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for blocking this user..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                data-testid="textarea-block-reason"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            variant={action === "block" ? "destructive" : "default"}
            data-testid="button-submit-management"
          >
            {action === "block" ? (
              <>
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Unblock User
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}