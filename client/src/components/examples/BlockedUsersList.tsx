import BlockedUsersList from '../BlockedUsersList';

const mockBlockedUsers = [
  {
    id: "1",
    phoneNumber: "919876543210",
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    reason: "Spam messages and abuse",
  },
  {
    id: "2", 
    phoneNumber: "918765432109",
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    reason: "Violation of terms of service",
  },
  {
    id: "3",
    phoneNumber: "917654321098", 
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    reason: null,
  },
];

export default function BlockedUsersListExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-2xl">
        <BlockedUsersList 
          blockedUsers={mockBlockedUsers}
          onUnblock={(phoneNumber) => console.log('Unblock user:', phoneNumber)}
          isAdmin={true}
        />
      </div>
    </div>
  );
}