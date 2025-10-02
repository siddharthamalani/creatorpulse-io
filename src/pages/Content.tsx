import { DashboardLayout } from "@/components/DashboardLayout";

export default function Content() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient">Content Library</h1>
        <p className="text-muted-foreground text-lg">Manage and organize your content assets.</p>
      </div>
    </DashboardLayout>
  );
}
