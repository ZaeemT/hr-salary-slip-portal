import { Listing } from "@/components/Home/Listing";
import { Tiles } from "@/components/Home/Tiles";
import { GetBatchListing, DeleteBatch, SendSlips } from "@/services/salary.service";
import { GetDashboard } from "@/services/auth.service";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      const response: any = await GetDashboard();
      if (response.status === 'success') {
        setDashboardData(response?.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [toast]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response: any = await GetBatchListing();
        
        if (response.status === 'success') {
          setBatches(response.data || []);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch batches",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to fetch batches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [toast]);

  const handleDeleteBatch = async (batchId: string) => {
    try {
      const response: any = await DeleteBatch(batchId);
      
      if (response.status === 'success') {
        // Update local state to remove the deleted batch
        setBatches(prevBatches => prevBatches.filter(batch => batch.batch_id !== batchId));
        
        toast({
          title: "Success",
          description: "Batch deleted successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete batch",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete batch",
        variant: "destructive",
      });
    }
  };

  const handleSendSlips = async (batchId: string) => {
    try {
      
      // Update the batch status in local state
      setBatches(prevBatches => 
        prevBatches.map(batch => 
          batch.batch_id === batchId 
          ? { ...batch, status: 'processing' } 
          : batch
        )
      );
      
      const response:any = await SendSlips(batchId);
      
      if (response.status === 'success') {
        setBatches(prevBatches => 
          prevBatches.map(batch => 
            batch.batch_id === batchId 
            ? { ...batch, status: 'completed' } 
            : batch
          )
        );
        
        // Refresh dashboard data after successful sending
        await fetchDashboardData();
        
        toast({
          title: "Success",
          description: "Salary slips have been sent to employees.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to process batch",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to process batch",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Tiles 
        data={dashboardData} 
        loading={dashboardLoading} 
      />
      <Listing 
        batches={batches} 
        loading={loading} 
        onDeleteBatch={handleDeleteBatch}
        onSendSlips={handleSendSlips}
      />      
    </>
  );
};

export default Home;