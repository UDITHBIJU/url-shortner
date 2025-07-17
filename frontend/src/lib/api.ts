const API_BASE_URL = "http://localhost:3000";

const refreshToken = async (): Promise<string | null> => {
	
    try {
		const refreshToken = localStorage.getItem("refreshToken");
		if (!refreshToken) return null;

		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (response.ok) {
			const data = await response.json();
			localStorage.setItem("accessToken", data.accessToken);
			if (data.refreshToken) {
				localStorage.setItem("refreshToken", data.refreshToken);
			}
			return data.accessToken;
		}
		return null;
	} catch (error) {
		console.error("Token refresh failed:", error);
		return null;
	}
};

export const apiCall = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	let accessToken = localStorage.getItem("accessToken");

	const makeRequest = async (token: string | null) => {
		return fetch(`${API_BASE_URL}${url}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
				...options.headers,
			},
		});
	};

	let response = await makeRequest(accessToken);


	if (response.status === 401 && accessToken) {
		const newToken = await refreshToken();
		if (newToken) {
			response = await makeRequest(newToken);
		}
	}

	return response;
};
