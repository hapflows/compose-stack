import { BACKEND_URL } from "@/config";

import { RESPONSE_CODES } from "./constants";

import { RequestOptions, PayloadType, QSType } from "./requests.types";

export class RequestInvalid extends Error {}
export class RequestError extends Error {}

export function objectToQueryString(obj: QSType) {
  return Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .map((key) => key + "=" + obj[key])
    .join("&");
}

export function buildRequestUrl(url: string, baseUrl?: string, qs?: QSType) {
  return `${baseUrl}${url}${qs ? `?${objectToQueryString(qs)}` : ""}`;
}

export class Requests {
  baseUrl?: string = undefined;
  logRequests: boolean = false;
  commonHeaders: any = {};
  mocks: any = {};

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  setLogRequests(v: boolean) {
    this.logRequests = v;
  }

  setCommonHeaders(common: any) {
    this.commonHeaders = { ...common };
  }

  getCommonHeaders() {
    return { ...this.commonHeaders };
  }

  setMock(url: string, response: any) {
    this.mocks[url] = response;
  }

  removeMock(url: string) {
    this.mocks[url] && delete this.mocks[url];
  }

  request<TResponse>(
    url: string,
    {
      payload,
      method = "GET",
      headers = {},
      body,
      extraOptions = {},
      qs,
      fetchParams,
      responseType = "json",
      returnResponse = false,
      onError,
    }: RequestOptions = {}
  ): Promise<TResponse> {
    if (this.mocks[url]) {
      if (this.logRequests)
        console.info("Return mocked response for ", url, this.mocks[url]);
      return new Promise((resolve) => {
        resolve(this.mocks[url]);
      });
    }

    const params = fetchParams || {
      method,
      headers: { ...this.getCommonHeaders(), ...headers },
      ...extraOptions,
    };

    // Set auto header to JSON
    if (
      params.headers &&
      typeof payload === "object" &&
      !params.headers["Content-Type"]
    ) {
      params.headers["Content-Type"] = "application/json";
    }

    if (body) {
      params.body = body;
    } else if (typeof payload === "object") {
      params.body = JSON.stringify(payload);
    }

    const requestUrl = buildRequestUrl(url, this.baseUrl, qs);

    if (this.logRequests)
      console.info(`Request [${params.method}]: `, url, params);
    return fetch(requestUrl, params)
      .then((response) => {
        if (this.logRequests)
          console.info("Request: response to ", url, response);
        if (!response.ok) {
          console.error(
            "Request: Invalid!",
            response.status,
            response.statusText
          );
          if (onError) {
            onError(response);
            return;
          }
          throw new RequestInvalid(response + "");
        }

        if (returnResponse) return response;

        return response.status !== RESPONSE_CODES.NO_CONTENT &&
          responseType === "json"
          ? response.json()
          : response.text();
      })
      .catch((error) => {
        if (error instanceof RequestInvalid) throw error;

        throw new RequestError(error);
      });
  }

  GET<TResponse>(url: string, options = {}): Promise<TResponse> {
    return this.request<TResponse>(url, options);
  }

  POST<TResponse>(
    url: string,
    payload: PayloadType,
    options = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(url, {
      payload,
      method: "POST",
      ...options,
    });
  }

  DELETE<TResponse>(
    url: string,
    payload: PayloadType,
    options = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(url, {
      payload,
      method: "DELETE",
      ...options,
    });
  }

  PUT<TResponse>(
    url: string,
    payload: PayloadType,
    options = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(url, { payload, method: "PUT", ...options });
  }

  PATCH<TResponse>(
    url: string,
    payload: PayloadType,
    options = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(url, {
      payload,
      method: "PATCH",
      ...options,
    });
  }
}

export const requests = new Requests(BACKEND_URL);
