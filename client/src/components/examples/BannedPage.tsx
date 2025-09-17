import BannedPage from '../BannedPage';

export default function BannedPageExample() {
  return (
    <BannedPage 
      phoneNumber="919876543210"
      reason="Multiple violations of community guidelines and spam behavior"
      developerContact={{
        email: "support@whatsappbot.com",
        telegram: "@botdeveloper", 
        whatsapp: "+1234567890"
      }}
    />
  );
}