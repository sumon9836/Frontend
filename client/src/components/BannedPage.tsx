import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail, MessageCircle } from "lucide-react";

interface BannedPageProps {
  phoneNumber?: string;
  reason?: string;
  developerContact?: {
    email?: string;
    telegram?: string;
    whatsapp?: string;
  };
}

export default function BannedPage({ 
  phoneNumber, 
  reason, 
  developerContact = {
    email: "support@whatsappbot.com",
    telegram: "@botdeveloper",
    whatsapp: "+1234567890"
  }
}: BannedPageProps) {
  const formatPhoneNumber = (number?: string) => {
    if (!number) return "Your number";
    const cleaned = number.replace(/[^0-9]/g, "");
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return number;
  };

  const handleContactDeveloper = (method: "email" | "telegram" | "whatsapp") => {
    console.log(`Contact developer via ${method}`);
    
    switch (method) {
      case "email":
        window.open(`mailto:${developerContact.email}?subject=Ban Appeal for ${phoneNumber}`);
        break;
      case "telegram":
        window.open(`https://t.me/${developerContact.telegram?.replace("@", "")}`);
        break;
      case "whatsapp":
        window.open(`https://wa.me/${developerContact.whatsapp?.replace(/[^0-9]/g, "")}`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Banner Card */}
        <Card className="text-center border-destructive/20">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">Access Restricted</CardTitle>
            <CardDescription>
              {formatPhoneNumber(phoneNumber)} has been blocked from using this service
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {reason && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Reason</div>
                <div className="text-sm" data-testid="text-ban-reason">{reason}</div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              If you believe this is a mistake, please contact our developer using one of the methods below.
            </div>
          </CardContent>
        </Card>

        {/* Contact Developer Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Developer</CardTitle>
            <CardDescription>
              Reach out for support or to appeal this restriction
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {developerContact.email && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleContactDeveloper("email")}
                data-testid="button-contact-email"
              >
                <Mail className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Email Support</div>
                  <div className="text-xs text-muted-foreground">{developerContact.email}</div>
                </div>
              </Button>
            )}

            {developerContact.telegram && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleContactDeveloper("telegram")}
                data-testid="button-contact-telegram"
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Telegram</div>
                  <div className="text-xs text-muted-foreground">{developerContact.telegram}</div>
                </div>
              </Button>
            )}

            {developerContact.whatsapp && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleContactDeveloper("whatsapp")}
                data-testid="button-contact-whatsapp"
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-xs text-muted-foreground">{developerContact.whatsapp}</div>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Appeal Notice */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-sm text-muted-foreground">
              <strong>Note:</strong> When contacting support, please include your phone number 
              ({formatPhoneNumber(phoneNumber)}) and explain your situation clearly.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}