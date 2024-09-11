// /app/barbershops/[id]/ratings/ratings-api.ts
export const fetchServices = async (barbershopId) => {
    try {
        const response = await fetch(`/barbershops/${barbershopId}/services`);
        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error("Failed to fetch services");
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
export async function fetchBarbers(barbershopId) {
    const response = await fetch(`/api/barbers?barbershopId=${barbershopId}`);
    if (!response.ok) {
        throw new Error("Falha ao buscar barbeiros");
    }
    return response.json();
}
export const submitRating = async (barbershopId, rating) => {
    try {
        const response = await fetch(`/barbershops/${barbershopId}/ratings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rating),
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error("Failed to submit rating");
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};