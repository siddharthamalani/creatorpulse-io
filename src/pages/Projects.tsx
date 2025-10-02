import { DashboardLayout } from "@/components/DashboardLayout";

export default function Projects() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient">Projects</h1>
        <p className="text-muted-foreground text-lg">Track and manage your influencer campaigns.</p>
      </div>
    </DashboardLayout>
  );
}
