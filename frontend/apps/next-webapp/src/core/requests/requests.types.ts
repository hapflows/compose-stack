export type PayloadType = any;
export type QSType = { [key: string]: string | string[] };

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  payload?: PayloadType;
  headers?: any;
  body?: any;
  extraOptions?: any;
  qs?: QSType;
  fetchParams?: any;
  responseType?: string;
  returnResponse?: boolean;
}
