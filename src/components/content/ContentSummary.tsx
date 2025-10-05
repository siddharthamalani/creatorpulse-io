import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Eye, Heart } from "lucide-react";

interface ContentSummaryProps {
  totalCreators: number;
  totalPosts: number;
  totalViews: number;
  totalEngagements: number;
}

export function ContentSummary({
  totalCreators,
  totalPosts,
  totalViews,
  totalEngagements,
}: ContentSummaryProps) {
  const metrics = [
    {
      title: "Creators",
      value: totalCreators,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Posts",
      value: totalPosts,
      icon: FileText,
      color: "text-green-500",
    },
    {
      title: "Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-purple-500",
    },
    {
      title: "Engagements",
      value: totalEngagements.toLocaleString(),
      icon: Heart,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
