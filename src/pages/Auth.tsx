import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, TrendingUp, Users, Zap } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Simulate authentication
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Hero Section */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Welcome to InfluencerHub</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Manage Your{" "}
              <span className="text-gradient">Influencer Campaigns</span>{" "}
              Effortlessly
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover, collaborate, and measure ROI with the most powerful influencer management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Users, label: "10K+ Creators", color: "text-primary" },
              { icon: TrendingUp, label: "3x Better ROI", color: "text-secondary" },
              { icon: Zap, label: "Real-time Analytics", color: "text-accent" },
            ].map((item, i) => (
              <div key={i} className="glass-card p-4 rounded-xl space-y-2 hover:scale-105 transition-transform">
                <item.icon className={`h-6 w-6 ${item.color}`} />
                <p className="font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Form */}
        <Card className="glass-card p-8 animate-slide-up">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold">{isLogin ? "Welcome Back" : "Get Started"}</h2>
              <p className="text-muted-foreground">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>

              <Button type="submit" className="w-full gradient-primary font-semibold hover:opacity-90 transition-opacity">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
