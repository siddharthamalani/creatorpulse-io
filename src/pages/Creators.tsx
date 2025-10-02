import { DashboardLayout } from "@/components/DashboardLayout";

export default function Creators() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient">Creators</h1>
        <p className="text-muted-foreground text-lg">Discover and manage your creator network.</p>
      </div>
    </DashboardLayout>
  );
}
