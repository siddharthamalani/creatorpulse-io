import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const profileSchema = z.object({
  userName: z.string().min(1, "User name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  profilePhoto: z.any().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { toast } = useToast();
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
  );

  const initialProfileData = {
    userName: "John Doe",
    email: "john.doe@example.com",
    brandName: "Brand Studio",
    status: "Active",
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: initialProfileData.userName,
      email: initialProfileData.email,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG, or WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Profile photo must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onProfileSubmit = (data: ProfileFormValues) => {
    const hasChanges = 
      data.userName !== initialProfileData.userName ||
      data.email !== initialProfileData.email ||
      profilePhotoPreview !== "https://api.dicebear.com/7.x/avataaars/svg?seed=user";

    if (!hasChanges) {
      toast({
        title: "No changes detected",
        description: "No updates were made to your profile",
      });
      return;
    }

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    toast({
      title: "Password changed",
      description: "Your password has been successfully updated",
    });
    passwordForm.reset();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Settings</h1>
          <p className="text-muted-foreground text-lg mt-2">Manage your account and preferences</p>
        </div>

        {/* User Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profilePhotoPreview} alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("profile-photo")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <Input
                        id="profile-photo"
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        className="hidden"
                        onChange={handleProfilePhotoChange}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPEG, PNG, WebP. Max size: 5MB
                  </p>
                </div>

                {/* User Name */}
                <FormField
                  control={profileForm.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Brand Name (Non-editable) */}
                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input value={initialProfileData.brandName} disabled />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div>
                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {initialProfileData.status}
                    </Badge>
                  </div>
                </div>

                {/* Email */}
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      profileForm.reset();
                      setProfilePhotoPreview("https://api.dicebear.com/7.x/avataaars/svg?seed=user");
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card>
          <CardHeader>
            <CardTitle>Password Change</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password *</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Enter current password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password *</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Enter new password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => passwordForm.reset()}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
