import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import BannedPage from "@/components/BannedPage";
import { checkUserBanned } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function BannedUserPage() {
  const [location] = useLocation();
  const [isBanned, setIsBanned] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract phone number from URL params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const phoneNumber = urlParams.get('number') || undefined;
  const reason = urlParams.get('reason') || undefined;

  useEffect(() => {
    const checkBanStatus = async () => {
      if (phoneNumber) {
        try {
          const banned = await checkUserBanned(phoneNumber);
          setIsBanned(banned);
        } catch (error) {
          console.error("Error checking ban status:", error);
          setIsBanned(false);
        }
      } else {
        setIsBanned(false);
      }
      setIsLoading(false);
    };

    checkBanStatus();
  }, [phoneNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <div className="text-sm text-muted-foreground">Checking ban status...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isBanned) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-lg font-medium mb-2">User Not Banned</div>
            <div className="text-sm text-muted-foreground">
              This phone number is not currently blocked.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <BannedPage 
      phoneNumber={phoneNumber}
      reason={reason || "Blocked by administrator"}
      developerContact={{
        email: "support@whatsappbot.com",
        telegram: "@botdeveloper",
        whatsapp: "+1234567890"
      }}
    />
  );
}