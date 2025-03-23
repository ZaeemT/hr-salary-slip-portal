import { Listing } from "@/components/Home/Listing";
import { Tiles } from "@/components/Home/Tiles";
import { GetBatchListing } from "@/services/salary.service";
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

  return (
    <>
      <Tiles />
      <Listing batches={batches} loading={loading} />      
    </>
  );
};

export default Home;