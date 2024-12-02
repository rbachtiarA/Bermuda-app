import { ICreateStore } from "@/type/store";
import { getToken } from "./server";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;

// Fungsi untuk membuat store baru
export const createStore = async (storeData: ICreateStore) => {
    try {
        const token = await getToken()
        const response = await fetch(`${API_URL}super-admin/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(storeData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create store");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating store:", error);
        throw error;
    }
};

export const getAllStores = async () => {
    try {
        const token = await getToken()
        const response = await fetch(`${API_URL}super-admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch stores");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching stores:", error);
        throw error;
    }
};
