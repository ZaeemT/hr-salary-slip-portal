import { Listing } from "@/components/Home/Listing";
import { Tiles } from "@/components/Home/Tiles";
import { GetBatchListing, DeleteBatch } from "@/services/salary.service";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <>
      <Tiles />
      <Listing 
        batches={batches} 
        loading={loading} 
        onDeleteBatch={handleDeleteBatch}
      />      
    </>
  );
};

export default Home;