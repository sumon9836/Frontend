
import SessionCard from "@/components/SessionCard";
import BlockedUsersList from "@/components/BlockedUsersList";
import UserManagement from "@/components/UserManagement";
import ThemeToggle from "@/components/ThemeToggle";
import ApiStatus from "@/components/ApiStatus";
import ApiConnectionGuide from "@/components/ApiConnectionGuide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Settings, ArrowLeft, Activity, Ban, Loader2, Link as LinkIcon, Crown, Zap } from "lucide-react";
import { Link } from "wouter";
import { useSessions, useBlocklist, useDeleteSession, useBlockUser, useUnblockUser } from "@/hooks/useApi";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  // Use real API hooks
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: blockedUsers = [], isLoading: blocklistLoading } = useBlocklist();
  const deleteSessionMutation = useDeleteSession();
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen gradient-bg">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-bounce-gentle"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex items-center justify-between ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  data-testid="button-back"
                  className="glass-effect hover:bg-white/10 text-white rounded-xl hover-lift transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                <Crown className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-orange-400 bg-clip-text text-transparent" data-testid="title-admin">
                  Admin Control Center
                </h1>
                <p className="text-sm text-white/70">Advanced management and monitoring</p>
              </div>
              <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            
            <div className={`flex items-center space-x-2 ${mounted ? 'animate-fade-in-left stagger-2' : 'opacity-0'}`}>
              <Badge variant="outline" className="hidden sm:flex glass-effect border-white/20 text-white animate-shimmer">
                <Activity className="w-3 h-3 mr-1 text-green-400" />
                {connectedCount}/{totalSessions} active
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className={`mb-6 ${mounted ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
          <div className="glass-card rounded-2xl p-1 hover-lift transition-all duration-300">
            <ApiStatus />
          </div>
        </div>
        
        <Tabs defaultValue="sessions" className={`space-y-6 ${mounted ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
          <TabsList className="grid w-full grid-cols-4 glass-effect border-white/20 h-12 rounded-xl">
            <TabsTrigger 
              value="sessions" 
              data-testid="tab-sessions"
              className="data-[state=active]:glass-effect data-[state=active]:text-white text-white/70 rounded-lg transition-all duration-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Sessions ({totalSessions})
            </TabsTrigger>
            <TabsTrigger 
              value="blocked" 
              data-testid="tab-blocked"
              className="data-[state=active]:glass-effect data-[state=active]:text-white text-white/70 rounded-lg transition-all duration-300"
            >
              <Ban className="w-4 h-4 mr-2" />
              Blocked ({blockedUsers.length})
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              data-testid="tab-manage"
              className="data-[state=active]:glass-effect data-[state=active]:text-white text-white/70 rounded-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger 
              value="api" 
              data-testid="tab-api"
              className="data-[state=active]:glass-effect data-[state=active]:text-white text-white/70 rounded-lg transition-all duration-300"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>

          {/* Sessions Management */}
          <TabsContent value="sessions" className="space-y-6">
            <Card className="glass-card rounded-2xl border-0 hover-lift transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-400" />
                  Active Sessions
                </CardTitle>
                <CardDescription className="text-white/70">
                  Manage all WhatsApp bot sessions. You can delete sessions to log users out.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
                    <CardTitle className="text-lg mb-2 text-white">Loading Sessions...</CardTitle>
                    <CardDescription className="text-white/70">
                      Fetching active sessions from server
                    </CardDescription>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-float" />
                    <CardTitle className="text-lg mb-2 text-white">No Active Sessions</CardTitle>
                    <CardDescription className="text-white/70">
                      No sessions are currently active
                    </CardDescription>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sessions.map((session, index) => (
                      <div 
                        key={session.id}
                        className={`hover-lift transition-all duration-300 ${mounted ? `animate-fade-in-up stagger-${Math.min(index + 1, 6)}` : 'opacity-0'}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="glass-effect rounded-xl p-1">
                          <SessionCard
                            session={session}
                            onDelete={handleDeleteSession}
                            isAdmin={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocked Users Management */}
          <TabsContent value="blocked" className="space-y-6">
            {blocklistLoading ? (
              <Card className="glass-card rounded-2xl border-0">
                <CardContent className="text-center py-12">
                  <Loader2 className="w-16 h-16 text-red-400 mx-auto mb-4 animate-spin" />
                  <CardTitle className="text-lg mb-2 text-white">Loading Blocked Users...</CardTitle>
                  <CardDescription className="text-white/70">
                    Fetching blocked users list from server
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="glass-card rounded-2xl p-1 hover-lift transition-all duration-300">
                <BlockedUsersList
                  blockedUsers={blockedUsers}
                  onUnblock={handleUnblockUser}
                  isAdmin={true}
                />
              </div>
            )}
          </TabsContent>

          {/* User Management */}
          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-1 hover-lift transition-all duration-300">
                <UserManagement
                  onBlock={handleBlockUser}
                  onUnblock={handleUnblockUser}
                />
              </div>
              
              {/* Quick Actions */}
              <Card className="glass-card rounded-2xl border-0 hover-lift transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-400" />
                    System Overview
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Real-time statistics and system health
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 glass-effect rounded-xl hover-lift transition-all duration-300">
                      <div className="text-3xl font-bold text-blue-400 animate-bounce-gentle">{totalSessions}</div>
                      <div className="text-sm text-white/70">Total Sessions</div>
                    </div>
                    <div className="text-center p-4 glass-effect rounded-xl hover-lift transition-all duration-300">
                      <div className="text-3xl font-bold text-green-400 animate-pulse-slow">{connectedCount}</div>
                      <div className="text-sm text-white/70">Connected</div>
                    </div>
                    <div className="text-center p-4 glass-effect rounded-xl hover-lift transition-all duration-300">
                      <div className="text-3xl font-bold text-red-400 animate-pulse">{blockedUsers.length}</div>
                      <div className="text-sm text-white/70">Blocked Users</div>
                    </div>
                    <div className="text-center p-4 glass-effect rounded-xl hover-lift transition-all duration-300">
                      <div className="text-3xl font-bold text-yellow-400 animate-bounce-gentle">
                        {sessions.filter(s => s.status === "pairing").length}
                      </div>
                      <div className="text-sm text-white/70">Pairing</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm text-white/60 text-center animate-pulse-slow">
                      System running smoothly • Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Connection Guide */}
          <TabsContent value="api" className="space-y-6">
            <div className="glass-card rounded-2xl p-1 hover-lift transition-all duration-300">
              <ApiConnectionGuide />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
