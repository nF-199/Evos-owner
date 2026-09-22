export const API_URL = "http://localhost:3000";

const request = async (path, options) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${options?.method ?? "GET"} ${path} — ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  list: (resource) => request(`/${resource}`),
  get: (resource, id) => request(`/${resource}/${id}`),
  create: (resource, body) =>
    request(`/${resource}`, { method: "POST", body: JSON.stringify(body) }),
  update: (resource, id, body) =>
    request(`/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  replace: (resource, id, body) =>
    request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: "DELETE" }),
};
