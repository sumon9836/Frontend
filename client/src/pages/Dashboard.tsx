import { useState } from "react";
import PairingForm from "@/components/PairingForm";
import SessionCard from "@/components/SessionCard";
import BlockedUsersList from "@/components/BlockedUsersList";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, Shield, Settings, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import type { Session, BlockedUser } from "@shared/schema";

export default function Dashboard() {
  // TODO: remove mock functionality - replace with real API calls
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      phoneNumber: "919876543210", 
      status: "connected",
      pairingCode: null,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: "2",
      phoneNumber: "911234567890",
      status: "pairing", 
      pairingCode: "ABC123",
      lastSeen: null,
      createdAt: new Date(),
    },
    {
      id: "3",
      phoneNumber: "918765432109",
      status: "disconnected",
      pairingCode: null, 
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    },
  ]);

  const [blockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      phoneNumber: "919999999999",
      blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      reason: "Spam messages and abuse",
    },
    {
      id: "2",
      phoneNumber: "918888888888", 
      blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      reason: "Violation of terms of service",
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePair = (phoneNumber: string) => {
    console.log("Pairing request for:", phoneNumber);
    // TODO: remove mock functionality - call real API
    const mockSession: Session = {
      id: Date.now().toString(),
      phoneNumber,
      status: "pairing",
      pairingCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      lastSeen: null,
      createdAt: new Date(),
    };
    setSessions(prev => [...prev, mockSession]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log("Refreshing sessions...");
    // TODO: remove mock functionality - fetch real data from API
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const connectedCount = sessions.filter(s => s.status === "connected").length;
  const pairingCount = sessions.filter(s => s.status === "pairing").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold" data-testid="title-dashboard">
                  WhatsApp Bot Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage your bot connections</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Link href="/admin">
                <Button variant="outline" data-testid="link-admin">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Pairing & Stats */}
          <div className="space-y-6">
            {/* Pairing Form */}
            <PairingForm onPair={handlePair} />
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Connected</span>
                  </div>
                  <Badge variant="secondary" data-testid="badge-connected-count">
                    {connectedCount}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Pairing</span>
                  </div>
                  <Badge variant="secondary" data-testid="badge-pairing-count">
                    {pairingCount}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Blocked</span>
                  </div>
                  <Badge variant="destructive" data-testid="badge-blocked-count">
                    {blockedUsers.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Active Sessions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Sessions</h2>
                <Badge variant="outline" data-testid="badge-total-sessions">
                  {sessions.length} total
                </Badge>
              </div>
              
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="text-lg mb-2">No Active Sessions</CardTitle>
                    <CardDescription>
                      Pair your first WhatsApp number to get started
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <SessionCard key={session.id} session={session} isAdmin={false} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Blocked Users */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Blocked Users</h2>
              <BlockedUsersList blockedUsers={blockedUsers} isAdmin={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}