import { useMemo } from "react";
import useFetchWithAuth from "./useFetchWithAuth";

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export type PaginatedResult<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

type RequestOptions = {
  path?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  params?: QueryParams;
  headers?: HeadersInit;
};

const toSearchParams = (params?: QueryParams) => {
  const entries = Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== null);
  return entries.length > 0 ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))}` : "";
};

const normalizePath = (path?: string) => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

const unwrapData = <R>(data: any): R => {
  if (data && typeof data === "object" && "data" in data) {
    return (data as any).data as R;
  }
  return data as R;
};

const normalizePaginated = <T>(raw: any): PaginatedResult<T> => {
  const data: any = unwrapData(raw) ?? {};
  const content = (data.content ?? data.items ?? data.results ?? data.data ?? []) as T[];
  const size = data.size ?? data.pageSize ?? data.limit ?? (Array.isArray(content) ? content.length : 0);
  const totalElements = data.totalElements ?? data.total ?? data.totalItems ?? (Array.isArray(content) ? content.length : 0);
  const totalPages = data.totalPages ?? data.pages ?? (size > 0 ? Math.ceil(totalElements / size) : 0);
  const page = data.page ?? data.number ?? data.pageNumber ?? 0;
  return { content, totalElements, totalPages, page, size };
};

const useApi = <T>(endpoint: string) => {
  const fetchWithAuth = useFetchWithAuth();
  const apiBase = (import.meta as any).env?.VITE_API_BASE ?? "";

  const baseUrl = useMemo(() => {
    const sanitizedBase = apiBase ? apiBase.replace(/\/$/, "") : "";
    const sanitizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${sanitizedBase}${sanitizedEndpoint}`;
  }, [apiBase, endpoint]);

  const request = async <R = any>({ path = "", method = "GET", body, params, headers }: RequestOptions = {}): Promise<R> => {
    const qs = toSearchParams(params);
    const fullUrl = `${baseUrl}${normalizePath(path)}${qs}`;
    const payload =
      body === undefined || body === null || body instanceof FormData || typeof body === "string" || body instanceof Blob
        ? (body as BodyInit | undefined)
        : (JSON.stringify(body) as BodyInit);

    const response = await fetchWithAuth(fullUrl, { method, headers, body: payload });
    return unwrapData<R>(response);
  };

  const list = (params?: QueryParams) => request<T[]>({ params });

  const getById = (id: number | string) => request<T>({ path: `/${id}` });

  const create = (payload: Partial<T>) => request<T>({ method: "POST", body: payload });

  const update = (payload: Partial<T>, id?: number | string) => {
    const targetId = id ?? (payload as any)?.id ?? "";
    return request<T>({ path: targetId ? `/${targetId}` : "", method: "PUT", body: payload });
  };

  const save = (payload: Partial<T>) => {
    const hasId = (payload as any)?.id !== undefined && (payload as any)?.id !== null;
    return hasId ? update(payload) : create(payload);
  };

  const remove = (id: number | string) => request<void>({ path: `/${id}`, method: "DELETE" });

  const paginated = async (params: QueryParams) => normalizePaginated<T>(await request<any>({ path: "/paginacao", params }));

  const getPath = <R = any>(path: string, params?: QueryParams) => request<R>({ path, params });

  const postPath = <R = any>(path: string, payload: any) => request<R>({ path, method: "POST", body: payload });

  const putPath = <R = any>(path: string, payload: any) => request<R>({ path, method: "PUT", body: payload });

  return { request, list, getById, create, update, save, remove, paginated, getPath, postPath, putPath };
};

export default useApi;
