import { DashboardLayout } from "@/components/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account and preferences.</p>
      </div>
    </DashboardLayout>
  );
}
