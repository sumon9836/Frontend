import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Status Badge Examples</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="connected" />
          <StatusBadge status="disconnected" />
          <StatusBadge status="pairing" />
          <StatusBadge status="blocked" />
        </div>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="connected" size="sm" />
          <StatusBadge status="disconnected" size="sm" />
          <StatusBadge status="pairing" size="sm" />
          <StatusBadge status="blocked" size="sm" />
        </div>
      </div>
    </div>
  );
}