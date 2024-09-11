// /app/barbershops/[id]/ratings/useRatings.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitRating } from "./ratings-api";
export const useSubmitRating = (barbershopId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const handleSubmitRating = async (rating) => {
        setLoading(true);
        try {
            await submitRating(barbershopId, rating);
            router.refresh();
        }
        catch (err) {
            setError("Failed to submit rating");
        }
        finally {
            setLoading(false);
        }
    };
    return { handleSubmitRating, loading, error };
};
