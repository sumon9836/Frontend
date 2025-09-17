
import PairingForm from "@/components/PairingForm";
import SessionCard from "@/components/SessionCard";
import BlockedUsersList from "@/components/BlockedUsersList";
import ThemeToggle from "@/components/ThemeToggle";
import ApiStatus from "@/components/ApiStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, Shield, RefreshCw, Loader2, Sparkles, Zap } from "lucide-react";

import { useSessions, useBlocklist, usePairNumber } from "@/hooks/useApi";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // Use real API hooks
  const { data: sessions = [], isLoading: sessionsLoading, refetch: refetchSessions } = useSessions();
  const { data: blockedUsers = [], isLoading: blocklistLoading } = useBlocklist();
  const pairNumberMutation = usePairNumber();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePair = (phoneNumber: string) => {
    pairNumberMutation.mutate(phoneNumber);
  };

  const handleRefresh = async () => {
    await refetchSessions();
  };

  const connectedCount = sessions.filter(s => s.status === "connected").length;
  const pairingCount = sessions.filter(s => s.status === "pairing").length;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-bounce-gentle"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex items-center justify-between ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" data-testid="title-dashboard">
                  WhatsApp Bot Dashboard
                </h1>
                <p className="text-sm text-white/70">Manage your bot connections with style</p>
              </div>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            
            <div className={`flex items-center space-x-2 ${mounted ? 'animate-fade-in-left stagger-2' : 'opacity-0'}`}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={sessionsLoading}
                data-testid="button-refresh"
                className="glass-effect hover-lift border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${sessionsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Pairing & Stats */}
          <div className={`space-y-6 ${mounted ? 'animate-fade-in-left stagger-1' : 'opacity-0'}`}>
            {/* API Status */}
            <div className="glass-card rounded-2xl p-1 hover-lift transition-all duration-300">
              <ApiStatus />
            </div>
            
            {/* Enhanced Pairing Form */}
            <div className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" />
                <h3 className="text-lg font-semibold text-white">Quick Pair</h3>
              </div>
              <PairingForm onPair={handlePair} isLoading={pairNumberMutation.isPending} />
            </div>
            
            {/* Quick Stats with Glass Effect */}
            <Card className="glass-card rounded-2xl border-0 hover-lift transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 glass-effect rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/90">Connected</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse-slow" data-testid="badge-connected-count">
                    {connectedCount}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 glass-effect rounded-xl">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
                    <span className="text-sm text-white/90">Pairing</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30" data-testid="badge-pairing-count">
                    {pairingCount}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 glass-effect rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-white/90">Blocked</span>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30" data-testid="badge-blocked-count">
                    {blockedUsers.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Active Sessions */}
          <div className={`space-y-6 ${mounted ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Bot className="w-6 h-6 mr-3 text-blue-400 animate-bounce-gentle" />
                  Active Sessions
                </h2>
                <Badge variant="outline" className="glass-effect border-white/20 text-white animate-shimmer" data-testid="badge-total-sessions">
                  {sessions.length} total
                </Badge>
              </div>
              
              {sessionsLoading ? (
                <Card className="glass-card rounded-2xl border-0">
                  <CardContent className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                    <CardDescription className="text-white/70 text-lg">Loading sessions...</CardDescription>
                  </CardContent>
                </Card>
              ) : sessions.length === 0 ? (
                <Card className="glass-card rounded-2xl border-0">
                  <CardContent className="text-center py-12">
                    <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-float" />
                    <CardTitle className="text-xl mb-3 text-white">No Active Sessions</CardTitle>
                    <CardDescription className="text-white/70 text-lg">
                      Pair your first WhatsApp number to get started
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div 
                      key={session.id} 
                      className={`hover-lift transition-all duration-300 ${mounted ? `animate-fade-in-up stagger-${Math.min(index + 1, 6)}` : 'opacity-0'}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="glass-card rounded-xl p-1">
                        <SessionCard session={session} isAdmin={false} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Blocked Users */}
          <div className={`space-y-6 ${mounted ? 'animate-fade-in-right stagger-3' : 'opacity-0'}`}>
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-red-400 animate-pulse" />
                Blocked Users
              </h2>
              {blocklistLoading ? (
                <Card className="glass-card rounded-2xl border-0">
                  <CardContent className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-red-400 mx-auto mb-4 animate-spin" />
                    <CardDescription className="text-white/70 text-lg">Loading blocked users...</CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="glass-card rounded-2xl p-1 hover-lift transition-all duration-300">
                  <BlockedUsersList blockedUsers={blockedUsers} isAdmin={false} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
