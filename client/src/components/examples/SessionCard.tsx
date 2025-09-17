import SessionCard from '../SessionCard';
import { TooltipProvider } from "@/components/ui/tooltip";

const mockSession = {
  id: "1",
  phoneNumber: "919876543210",
  status: "connected",
  pairingCode: null,
  lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
};

const mockPairingSession = {
  id: "2", 
  phoneNumber: "911234567890",
  status: "pairing",
  pairingCode: "ABC123",
  lastSeen: null,
  createdAt: new Date(),
};

export default function SessionCardExample() {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center min-h-screen bg-background p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <SessionCard 
            session={mockSession}
            onDelete={(phoneNumber) => console.log('Delete session:', phoneNumber)}
            isAdmin={true}
          />
          <SessionCard 
            session={mockPairingSession}
            onDelete={(phoneNumber) => console.log('Delete session:', phoneNumber)}
            isAdmin={true}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}