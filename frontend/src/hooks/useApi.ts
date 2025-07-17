import { useState } from "react";
import { apiCall } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface UrlShortener {
	id: string;
	originalUrl: string;
	shortCode: string;
	shortUrl: string;
	expiresAt: string;
	createdAt: string;
}

export const useApi = () => {
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const createShortUrl = async (
		url: string,
		expiresAt?: string
	): Promise<UrlShortener> => {
		setLoading(true);
		const accessToken = localStorage.getItem("accessToken");

		try {
			const response = await apiCall("/links/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					url,
					...(expiresAt && { expiresAt }),
					userId: user.id,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create short URL");
			}

			return await response.json();
		} finally {
			setLoading(false);
		}
	};

	const getUrls = async (): Promise<UrlShortener[]> => {
		setLoading(true);
		try {
			const response = await apiCall("/links/getAll");

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to fetch URLs");
			}

      const API_BASE_URL = "http://localhost:3000";
			const result = await response.json();
			const formatedResult = result.map((link: any) => ({
				id: link.id,
				originalUrl: link.originalUrl,
				shortCode: link.shortCode,
				shortUrl: `${API_BASE_URL}/${link.shortCode}`,
				expiresAt: link.expiresAt,
				createdAt: link.createdAt,
			}));
			console.log(formatedResult);
			return formatedResult;
		} finally {
			setLoading(false);
		}
	};

	const updateUrl = async (
		id: string,
		url: string,
		expiresAt: string
	): Promise<UrlShortener> => {
		setLoading(true);
		try {
			const response = await apiCall(`/links/update/${id}`, {
				method: "PUT",
				body: JSON.stringify({
					url,
					...(expiresAt && { expiresAt }),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to update URL");
			}

			return await response.json();
		} finally {
			setLoading(false);
		}
	};

	const deleteUrl = async (id: string): Promise<void> => {
		setLoading(true);
		try {
			const response = await apiCall(`/links/delete/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to delete URL");
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		createShortUrl,
		getUrls,
		updateUrl,
		deleteUrl,
		loading,
	};
};
