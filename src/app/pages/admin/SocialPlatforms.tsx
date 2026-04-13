import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Settings, Building2, Activity,
  Menu, X, Shield, TrendingUp, Search, Plus, Edit, Trash2, CheckCircle2, XCircle,
  Facebook, Instagram, Twitter, Youtube, MessageSquare, Share2, UserCheck, UserX
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  followers: number;
  lastPost?: string;
  permissions: {
    canPost: boolean;
    staffIds: string[];
  };
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  canPost: boolean;
}

export default function SocialPlatforms() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("accounts");
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  // Mock data - in real app, this would come from API
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      id: "1",
      platform: "Facebook",
      username: "@repairshopfb",
      connected: true,
      followers: 1250,
      lastPost: "2024-01-15",
      permissions: {
        canPost: true,
        staffIds: ["staff1", "staff2"]
      }
    },
    {
      id: "2",
      platform: "Instagram",
      username: "@repairshop_insta",
      connected: true,
      followers: 890,
      lastPost: "2024-01-14",
      permissions: {
        canPost: false,
        staffIds: ["staff1"]
      }
    },
    {
      id: "3",
      platform: "Twitter",
      username: "@repairshop_tw",
      connected: false,
      followers: 0,
      permissions: {
        canPost: false,
        staffIds: []
      }
    }
  ]);

  const [staffMembers] = useState<StaffMember[]>([
    { id: "staff1", name: "John Technician", role: "Technician", canPost: true },
    { id: "staff2", name: "Jane Manager", role: "Manager", canPost: true },
    { id: "staff3", name: "Mike Assistant", role: "Assistant", canPost: false }
  ]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook": return Facebook;
      case "instagram": return Instagram;
      case "twitter": return Twitter;
      case "youtube": return Youtube;
      default: return MessageSquare;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook": return "text-blue-600";
      case "instagram": return "text-pink-600";
      case "twitter": return "text-blue-400";
      case "youtube": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const handleConnectAccount = (platform: string) => {
    setSelectedPlatform(platform);
    setIsConnectDialogOpen(true);
  };

  const handleDisconnectAccount = (accountId: string) => {
    setSocialAccounts(accounts =>
      accounts.map(account =>
        account.id === accountId
          ? { ...account, connected: false, permissions: { canPost: false, staffIds: [] } }
          : account
      )
    );
  };

  const handleUpdatePermissions = (account: SocialAccount) => {
    setSelectedAccount(account);
    setIsPermissionsDialogOpen(true);
  };

  const handleSavePermissions = () => {
    if (!selectedAccount) return;

    // In real app, this would save to backend
    setSocialAccounts(accounts =>
      accounts.map(account =>
        account.id === selectedAccount.id
          ? selectedAccount
          : account
      )
    );
    setIsPermissionsDialogOpen(false);
    setSelectedAccount(null);
  };

  const handleStaffPermissionChange = (staffId: string, canPost: boolean) => {
    if (!selectedAccount) return;

    setSelectedAccount({
      ...selectedAccount,
      permissions: {
        ...selectedAccount.permissions,
        staffIds: canPost
          ? [...selectedAccount.permissions.staffIds, staffId]
          : selectedAccount.permissions.staffIds.filter(id => id !== staffId)
      }
    });
  };

  const handleCreatePost = (accountId: string) => {
    // In real app, this would open a post creation modal
    alert(`Create post for account ${accountId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="flex">

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Social Platforms</h1>
              <p className="text-gray-600">Connect and manage your social media accounts</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
                <TabsTrigger value="permissions">Staff Posting Access</TabsTrigger>
                <TabsTrigger value="posts">Create & Manage Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="accounts" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {socialAccounts.map((account) => {
                    const Icon = getPlatformIcon(account.platform);
                    return (
                      <Card key={account.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className={`size-6 ${getPlatformColor(account.platform)}`} />
                              <div>
                                <CardTitle className="text-lg">{account.platform}</CardTitle>
                                <CardDescription>{account.username}</CardDescription>
                              </div>
                            </div>
                            <Badge variant={account.connected ? "default" : "secondary"}>
                              {account.connected ? "Connected" : "Disconnected"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {account.connected && (
                            <div className="text-sm text-gray-600">
                              <p>{account.followers.toLocaleString()} followers</p>
                              {account.lastPost && <p>Last post: {account.lastPost}</p>}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {account.connected ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleCreatePost(account.id)}
                                  className="flex-1"
                                >
                                  <Share2 className="size-4 mr-2" />
                                  Post
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdatePermissions(account)}
                                >
                                  <Shield className="size-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDisconnectAccount(account.id)}
                                >
                                  <XCircle className="size-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleConnectAccount(account.platform)}
                                className="w-full"
                              >
                                <Plus className="size-4 mr-2" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Posting Permissions</CardTitle>
                    <CardDescription>
                      Grant your staff members access to post to your connected social media platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staffMembers.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-gray-600">{staff.role}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {socialAccounts
                              .filter(account => account.connected)
                              .map((account) => {
                                const Icon = getPlatformIcon(account.platform);
                                const hasPermission = account.permissions.staffIds.includes(staff.id);
                                return (
                                  <div key={account.id} className="flex items-center gap-2">
                                    <Icon className={`size-4 ${getPlatformColor(account.platform)}`} />
                                    <Switch
                                      checked={hasPermission}
                                      onCheckedChange={(checked) => {
                                        setSocialAccounts(accounts =>
                                          accounts.map(acc =>
                                            acc.id === account.id
                                              ? {
                                                  ...acc,
                                                  permissions: {
                                                    ...acc.permissions,
                                                    staffIds: checked
                                                      ? [...acc.permissions.staffIds, staff.id]
                                                      : acc.permissions.staffIds.filter(id => id !== staff.id)
                                                  }
                                                }
                                              : acc
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                    <CardDescription>
                      Create a post and publish it to multiple connected social media platforms at once
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="post-content">Post Content</Label>
                        <textarea
                          id="post-content"
                          className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                          rows={4}
                          placeholder="Write your post content here..."
                        />
                      </div>
                      <div>
                        <Label>Platforms to Post To</Label>
                        <div className="flex gap-4 mt-2">
                          {socialAccounts
                            .filter(account => account.connected)
                            .map((account) => {
                              const Icon = getPlatformIcon(account.platform);
                              return (
                                <div key={account.id} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`platform-${account.id}`}
                                    defaultChecked={true}
                                    className="rounded"
                                  />
                                  <label htmlFor={`platform-${account.id}`} className="flex items-center gap-2 cursor-pointer">
                                    <Icon className={`size-4 ${getPlatformColor(account.platform)}`} />
                                    <span className="text-sm">{account.platform}</span>
                                  </label>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button>
                          <Share2 className="size-4 mr-2" />
                          Post Now
                        </Button>
                        <Button variant="outline">
                          Schedule Post
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>
                      View and manage your recent social media posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
                      <p>No posts yet. Create your first post above!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Connect Account Dialog */}
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedPlatform} Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username or Account ID</Label>
              <Input
                id="username"
                placeholder={`Enter your ${selectedPlatform} username`}
              />
            </div>
            <div>
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                id="accessToken"
                type="password"
                placeholder="Enter access token"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // In real app, this would connect the account
              setSocialAccounts(accounts =>
                accounts.map(account =>
                  account.platform === selectedPlatform
                    ? { ...account, connected: true, username: `@${selectedPlatform.toLowerCase()}_account` }
                    : account
                )
              );
              setIsConnectDialogOpen(false);
            }}>
              Connect Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions - {selectedAccount?.platform}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Allow posting to this account</Label>
              <Switch
                checked={selectedAccount?.permissions.canPost || false}
                onCheckedChange={(checked) => {
                  if (selectedAccount) {
                    setSelectedAccount({
                      ...selectedAccount,
                      permissions: { ...selectedAccount.permissions, canPost: checked }
                    });
                  }
                }}
              />
            </div>
            <div>
              <Label>Staff members who can post</Label>
              <div className="space-y-2 mt-2">
                {staffMembers.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between">
                    <span>{staff.name} ({staff.role})</span>
                    <Switch
                      checked={selectedAccount?.permissions.staffIds.includes(staff.id) || false}
                      onCheckedChange={(checked) => handleStaffPermissionChange(staff.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}