import { useLocation } from "wouter";
import BannedPage from "@/components/BannedPage";

export default function BannedUserPage() {
  const [location] = useLocation();
  
  // Extract phone number from URL params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const phoneNumber = urlParams.get('number') || undefined;
  const reason = urlParams.get('reason') || undefined;

  // TODO: remove mock functionality - fetch real ban details from API based on phone number
  const mockReason = reason || "Multiple violations of community guidelines";
  
  return (
    <BannedPage 
      phoneNumber={phoneNumber}
      reason={mockReason}
      developerContact={{
        email: "support@whatsappbot.com",
        telegram: "@botdeveloper",
        whatsapp: "+1234567890"
      }}
    />
  );
}