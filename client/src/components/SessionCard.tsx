import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Trash2, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Session } from "@shared/schema";

interface SessionCardProps {
  session: Session;
  onDelete?: (phoneNumber: string) => void;
  isAdmin?: boolean;
}

export default function SessionCard({ session, onDelete, isAdmin = false }: SessionCardProps) {
  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/[^0-9]/g, "");
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return number;
  };

  const formatLastSeen = (date: Date | null) => {
    if (!date) return "Never connected";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleDelete = () => {
    console.log("Delete session:", session.phoneNumber);
    onDelete?.(session.phoneNumber);
  };

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-mono" data-testid={`text-phone-${session.id}`}>
              {formatPhoneNumber(session.phoneNumber)}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={session.status as any} size="sm" />
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            data-testid={`button-delete-${session.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span data-testid={`text-last-seen-${session.id}`}>
              {formatLastSeen(session.lastSeen)}
            </span>
          </div>
          
          {session.status === "connected" && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          )}
        </div>
        
        {session.pairingCode && session.status === "pairing" && (
          <div className="mt-3 p-2 bg-muted rounded text-center">
            <div className="text-xs text-muted-foreground mb-1">Pairing Code</div>
            <code className="font-mono font-bold" data-testid={`text-pairing-code-${session.id}`}>
              {session.pairingCode}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}