import { useCallback } from "react";
import { useAuth } from "../store/AuthContext";

export default function useFetchWithAuth() {
  const { auth } = useAuth();

  const fetchWithAuth = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      const headers = new Headers(init?.headers as HeadersInit | undefined);
      if (auth?.token) {
        headers.set("Authorization", `Bearer ${auth.token}`);
      }
      if (!headers.has("Content-Type") && init?.body) {
        headers.set("Content-Type", "application/json");
      }
      const res = await fetch(input, { ...init, headers });
      if (!res.ok) {
        const text = await res.text();
        let json: any = {};
        try {
          json = JSON.parse(text);
        } catch {
          json = { message: text };
        }
        throw new Error(json?.message || `Request failed: ${res.status}`);
      }
      const bodyText = await res.text();
      try {
        return JSON.parse(bodyText);
      } catch {
        return bodyText;
      }
    },
    [auth]
  );

  return fetchWithAuth;
}
