import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold">Theme Toggle</h2>
        <p className="text-muted-foreground mb-6">Click the button to switch between light and dark mode</p>
        <ThemeToggle />
      </div>
    </div>
  );
}