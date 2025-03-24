import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Mail,
    Calendar,
    Upload,
    Clock,
} from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardData {
    total_uploads: number;
    latest_upload_date: string;
    total_emails_sent: number;
    pending_approvals: number;
}

interface TilesProps {
    data: DashboardData | null;
    loading: boolean;
}

export function Tiles({ data, loading }: TilesProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 py-3">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-[100px] mb-2" />
                                <Skeleton className="h-3 w-[140px]" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-3">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.total_uploads || 0}</div>
                        <p className="text-xs text-muted-foreground">Total salary batches uploaded</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.total_emails_sent || 0}</div>
                        <p className="text-xs text-muted-foreground">Total salary slips sent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.pending_approvals || 0}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Latest Upload</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.latest_upload_date ? formatDate(data.latest_upload_date) : 'No uploads'}</div>
                        <p className="text-xs text-muted-foreground">Last batch uploaded</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}