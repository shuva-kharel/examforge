import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, Calendar, MapPin, Link as LinkIcon, User } from "lucide-react";
import { getUserByUsernameQueryFn } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => getUserByUsernameQueryFn(username!),
    enabled: !!username,
  });

  if (error) {
    toast({
      title: "Error",
      description: "User not found",
      variant: "destructive",
    });
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          User Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The user you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const user = data?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            @{user?.username}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {user?.profile?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user.profile.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {new Date(user?.createdAt || "").toLocaleDateString()}
            </div>
            {user?.role && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {user?.profile?.bio && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {user.profile.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contact & Links */}
        <div className="grid gap-4 md:grid-cols-2">
          {user?.email && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
              </CardContent>
            </Card>
          )}

          {user?.profile?.website && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Website
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={user.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {user.profile.website}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
