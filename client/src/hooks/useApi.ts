import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, transformSessionsData, transformBlocklistData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Custom hooks for API operations
export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      try {
        const data = await apiClient.getSessions();
        return transformSessionsData(data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        // Return empty array as fallback
        return [];
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds to reduce errors
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 2, // Retry failed requests twice
    retryDelay: 5000, // Wait 5 seconds between retries
  });
}

export function useBlocklist() {
  return useQuery({
    queryKey: ["blocklist"],
    queryFn: async () => {
      try {
        const data = await apiClient.getBlocklist();
        return transformBlocklistData(data);
      } catch (error) {
        console.error("Failed to fetch blocklist:", error);
        // Return empty array as fallback
        return [];
      }
    },
    refetchInterval: 60000, // Refresh every 60 seconds
    retry: 2,
    retryDelay: 5000,
  });
}

export function usePairNumber() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.pairNumber,
    onSuccess: (data) => {
      // Handle different response types
      if (data.error) {
        if (data.error.includes("ban")) {
          toast({
            title: "Account Banned",
            description: `User ${data.number} is banned from using this service`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Pairing Failed",
            description: data.error,
            variant: "destructive",
          });
        }
      } else if (data.code) {
        toast({
          title: "Pairing Code Generated!",
          description: `Your pairing code is: ${data.code}`,
        });
      } else if (data.status) {
        toast({
          title: "Already Registered",
          description: `Number ${data.number} is already paired and registered`,
        });
      }
      // Refresh sessions data after any pairing attempt
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error) => {
      toast({
        title: "Connection Error",
        description: "Failed to connect to pairing service. Please try again.",
        variant: "destructive",
      });
      console.error("Pairing error:", error);
    },
  });
}

export function useDeleteSession() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.deleteSession,
    onSuccess: (data, phoneNumber) => {
      if (data.error) {
        toast({
          title: "Delete Failed",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Session Deleted",
          description: `Session for ${phoneNumber} has been removed`,
        });
      }
      // Refresh sessions data
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
      console.error("Delete session error:", error);
    },
  });
}

export function useBlockUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.blockUser,
    onSuccess: (data, phoneNumber) => {
      if (data.error) {
        toast({
          title: "Block Failed",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "User Blocked",
          description: `${phoneNumber} has been blocked`,
          variant: "destructive",
        });
      }
      // Refresh both sessions and blocklist
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["blocklist"] });
    },
    onError: (error) => {
      toast({
        title: "Block Failed",
        description: "Failed to block user. Please try again.",
        variant: "destructive",
      });
      console.error("Block user error:", error);
    },
  });
}

export function useUnblockUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.unblockUser,
    onSuccess: (data, phoneNumber) => {
      if (data.error) {
        toast({
          title: "Unblock Failed",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "User Unblocked",
          description: `${phoneNumber} has been unblocked`,
        });
      }
      // Refresh blocklist data
      queryClient.invalidateQueries({ queryKey: ["blocklist"] });
    },
    onError: (error) => {
      toast({
        title: "Unblock Failed",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive",
      });
      console.error("Unblock user error:", error);
    },
  });
}