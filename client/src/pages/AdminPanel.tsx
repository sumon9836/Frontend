import { useState } from "react";
import SessionCard from "@/components/SessionCard";
import BlockedUsersList from "@/components/BlockedUsersList";
import UserManagement from "@/components/UserManagement";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Settings, ArrowLeft, Activity, Ban } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Session, BlockedUser } from "@shared/schema";

export default function AdminPanel() {
  const { toast } = useToast();
  
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

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
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

  const handleDeleteSession = (phoneNumber: string) => {
    console.log("Delete session:", phoneNumber);
    // TODO: remove mock functionality - call real API
    setSessions(prev => prev.filter(s => s.phoneNumber !== phoneNumber));
    toast({
      title: "Session Deleted",
      description: `Session for ${phoneNumber} has been removed`,
      variant: "destructive",
    });
  };

  const handleBlockUser = (phoneNumber: string, reason?: string) => {
    console.log("Block user:", phoneNumber, reason);
    // TODO: remove mock functionality - call real API
    const newBlockedUser: BlockedUser = {
      id: Date.now().toString(),
      phoneNumber,
      blockedAt: new Date(),
      reason: reason || null,
    };
    setBlockedUsers(prev => [...prev, newBlockedUser]);
    
    // Remove from active sessions
    setSessions(prev => prev.filter(s => s.phoneNumber !== phoneNumber));
    
    toast({
      title: "User Blocked",
      description: `${phoneNumber} has been blocked`,
      variant: "destructive",
    });
  };

  const handleUnblockUser = (phoneNumber: string) => {
    console.log("Unblock user:", phoneNumber);
    // TODO: remove mock functionality - call real API
    setBlockedUsers(prev => prev.filter(u => u.phoneNumber !== phoneNumber));
    toast({
      title: "User Unblocked", 
      description: `${phoneNumber} has been unblocked`,
    });
  };

  const connectedCount = sessions.filter(s => s.status === "connected").length;
  const totalSessions = sessions.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              
              <div>
                <h1 className="text-xl font-semibold" data-testid="title-admin">
                  Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">Manage users and sessions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="hidden sm:flex">
                <Activity className="w-3 h-3 mr-1" />
                {connectedCount}/{totalSessions} active
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions" data-testid="tab-sessions">
              <Users className="w-4 h-4 mr-2" />
              Sessions ({totalSessions})
            </TabsTrigger>
            <TabsTrigger value="blocked" data-testid="tab-blocked">
              <Ban className="w-4 h-4 mr-2" />
              Blocked ({blockedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="manage" data-testid="tab-manage">
              <Settings className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
          </TabsList>

          {/* Sessions Management */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage all WhatsApp bot sessions. You can delete sessions to log users out.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="text-lg mb-2">No Active Sessions</CardTitle>
                    <CardDescription>
                      No sessions are currently active
                    </CardDescription>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onDelete={handleDeleteSession}
                        isAdmin={true}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocked Users Management */}
          <TabsContent value="blocked" className="space-y-6">
            <BlockedUsersList
              blockedUsers={blockedUsers}
              onUnblock={handleUnblockUser}
              isAdmin={true}
            />
          </TabsContent>

          {/* User Management */}
          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserManagement
                onBlock={handleBlockUser}
                onUnblock={handleUnblockUser}
              />
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks and system information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{totalSessions}</div>
                      <div className="text-sm text-muted-foreground">Total Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
                      <div className="text-sm text-muted-foreground">Connected</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{blockedUsers.length}</div>
                      <div className="text-sm text-muted-foreground">Blocked Users</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {sessions.filter(s => s.status === "pairing").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Pairing</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground text-center">
                      System running smoothly. Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}