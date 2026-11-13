const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
  } catch {
    throw new Error("Cannot reach TripMate API. Check that the backend is running.");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload;
}

export const api = {
  health: () => request("/health"),
  search: (kind, params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/${kind}?${query}`);
  },
  createBooking: (body) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
  getBookings: (email) => request(`/bookings?email=${encodeURIComponent(email)}`),
  getBooking: (ref) => request(`/bookings/${encodeURIComponent(ref)}`),
  cancelBooking: (ref) => request(`/bookings/${encodeURIComponent(ref)}/cancel`, { method: "PATCH" }),
  logs: () => request("/logs")
};
