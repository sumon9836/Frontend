import SessionCard from "@/components/SessionCard";
import BlockedUsersList from "@/components/BlockedUsersList";
import UserManagement from "@/components/UserManagement";
import ThemeToggle from "@/components/ThemeToggle";
import ApiStatus from "@/components/ApiStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Settings, ArrowLeft, Activity, Ban, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useSessions, useBlocklist, useDeleteSession, useBlockUser, useUnblockUser } from "@/hooks/useApi";

export default function AdminPanel() {
  // Use real API hooks
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: blockedUsers = [], isLoading: blocklistLoading } = useBlocklist();
  const deleteSessionMutation = useDeleteSession();
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();

  const handleDeleteSession = (phoneNumber: string) => {
    deleteSessionMutation.mutate(phoneNumber);
  };

  const handleBlockUser = (phoneNumber: string, reason?: string) => {
    blockUserMutation.mutate(phoneNumber);
  };

  const handleUnblockUser = (phoneNumber: string) => {
    unblockUserMutation.mutate(phoneNumber);
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
        <div className="mb-6">
          <ApiStatus />
        </div>
        
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
                {sessionsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                    <CardTitle className="text-lg mb-2">Loading Sessions...</CardTitle>
                    <CardDescription>
                      Fetching active sessions from server
                    </CardDescription>
                  </div>
                ) : sessions.length === 0 ? (
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
            {blocklistLoading ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <CardTitle className="text-lg mb-2">Loading Blocked Users...</CardTitle>
                  <CardDescription>
                    Fetching blocked users list from server
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <BlockedUsersList
                blockedUsers={blockedUsers}
                onUnblock={handleUnblockUser}
                isAdmin={true}
              />
            )}
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