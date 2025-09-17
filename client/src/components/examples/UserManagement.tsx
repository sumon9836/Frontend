import UserManagement from '../UserManagement';

export default function UserManagementExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-md">
        <UserManagement 
          onBlock={(phoneNumber, reason) => console.log('Block user:', phoneNumber, reason)}
          onUnblock={(phoneNumber) => console.log('Unblock user:', phoneNumber)}
        />
      </div>
    </div>
  );
}