import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { GetProfile } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChangePassword } from "@/services/auth.service";
import { type ChangePasswordFormData } from "@/schemas/auth.schema";
import { ChangePasswordForm } from "@/components/Forms/ChangePasswordForm";

interface User {
    username: string;
    email: string;
    role: string;
    created_at: string;
}

export function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response: any = await GetProfile();
                if (response.status === 'success') {
                    setUser(response.user);
                } else {
                    toast({
                        title: "Error",
                        description: response.message || "Failed to fetch profile",
                        variant: "destructive",
                    });
                }
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to fetch profile",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [toast]);

    const handleChangePassword = async (data: ChangePasswordFormData) => {
        setIsChangingPassword(true);
        try {
            const response: any = await ChangePassword(data.currentPassword, data.newPassword);
            if (response.status === 'success') {
                toast({
                    title: "Success",
                    description: "Password changed successfully",
                });
                setIsOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to change password",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to change password",
                variant: "destructive",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="bg-muted">
                                {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
                            <p className="text-muted-foreground">{user.role}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Join Date</Label>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="default" className="gap-2">
                                        <Key className="h-4 w-4" />
                                        Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                    </DialogHeader>
                                    <ChangePasswordForm
                                        onSubmit={handleChangePassword}
                                        isChangingPassword={isChangingPassword}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
