import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Unlock, Calendar } from "lucide-react";
import type { BlockedUser } from "@shared/schema";

interface BlockedUsersListProps {
  blockedUsers: BlockedUser[];
  onUnblock?: (phoneNumber: string) => void;
  isAdmin?: boolean;
}

export default function BlockedUsersList({ 
  blockedUsers, 
  onUnblock, 
  isAdmin = false 
}: BlockedUsersListProps) {
  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/[^0-9]/g, "");
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return number;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleUnblock = (phoneNumber: string) => {
    console.log("Unblock user:", phoneNumber);
    onUnblock?.(phoneNumber);
  };

  if (blockedUsers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="text-lg mb-2">No Blocked Users</CardTitle>
          <CardDescription>
            All users are currently active. Blocked users will appear here.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-destructive" />
          <CardTitle>Blocked Users</CardTitle>
          <Badge variant="destructive" data-testid="badge-blocked-count">
            {blockedUsers.length}
          </Badge>
        </div>
        <CardDescription>
          {isAdmin 
            ? "Manage blocked users and unblock them when needed"
            : "Users who are currently blocked from using the bot"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {blockedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
            data-testid={`blocked-user-${user.id}`}
          >
            <div className="flex-1">
              <div className="font-mono font-medium" data-testid={`text-blocked-phone-${user.id}`}>
                {formatPhoneNumber(user.phoneNumber)}
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Blocked {formatDate(user.blockedAt)}</span>
                </div>
                
                {user.reason && (
                  <div className="flex-1">
                    <span className="text-xs">Reason: </span>
                    <span className="italic" data-testid={`text-block-reason-${user.id}`}>
                      {user.reason}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnblock(user.phoneNumber)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                data-testid={`button-unblock-${user.id}`}
              >
                <Unlock className="w-4 h-4 mr-1" />
                Unblock
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}