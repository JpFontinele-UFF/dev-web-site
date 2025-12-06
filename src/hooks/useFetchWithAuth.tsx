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
        const errMsg = json?.message || `Request failed: ${res.status}`;
        const err: any = new Error(errMsg);
        // preserve possible structured validation errors
        if (json && typeof json === 'object') {
          // If the backend returned an object mapping field->message
          if (json.errors && typeof json.errors === 'object' && !Array.isArray(json.errors)) {
            err.validation = json.errors;
          }

          // If the backend (like default Spring Boot) returned an array of field errors,
          // convert it to a field->message map so the form can map errors to fields.
          if (Array.isArray(json.errors)) {
            const map: Record<string, string> = {};
            json.errors.forEach((e: any) => {
              if (e && (e.field || e.defaultMessage || e.message)) {
                const field = e.field;
                const message = e.defaultMessage ?? e.message ?? String(e);
                if (field) map[field] = message;
              }
            });
            if (Object.keys(map).length > 0) err.validation = map;
          }

          // Also support other common shapes like `fieldErrors` (some backends)
          if (json.fieldErrors && Array.isArray(json.fieldErrors)) {
            const map2: Record<string, string> = {};
            json.fieldErrors.forEach((e: any) => {
              if (e && e.field) {
                map2[e.field] = e.defaultMessage ?? e.message ?? String(e);
              }
            });
            if (Object.keys(map2).length > 0) err.validation = { ...(err.validation || {}), ...map2 };
          }

          err.body = json;
        }
        err.status = res.status;
        throw err;
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
