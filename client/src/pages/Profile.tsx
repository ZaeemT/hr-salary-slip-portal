import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface User {
    name: string;
    email: string;
    role: string;
    department: string;
    joinDate: string;
    avatarUrl?: string;
}

export function Profile () {
    // Mock user data - replace this with actual user data from your auth system
    const user: User = {
        name: "John Doe",
        email: "john.doe@company.com",
        role: "Software Engineer",
        department: "Engineering",
        joinDate: "2022-01-01",
        avatarUrl: "https://github.com/shadcn.png",
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="bg-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                </svg>
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
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
                                <Label className="text-sm font-medium">Department</Label>
                                <p className="text-sm text-muted-foreground">{user.department}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Join Date</Label>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(user.joinDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
