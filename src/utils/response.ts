type BaseResponse = {
  status: boolean;
  message: string;
  meta?: unknown;
};

export function formatResponse<T = unknown>({
  status = true,
  message = "Success",
  data,
  meta,
}: Partial<BaseResponse> & { data?: T }) {
  return {
    status,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(meta ? { meta } : {}),
  };
}

export function formatError({
  status = false,
  message = "An error occurred",
  meta,
}: Partial<BaseResponse>) {
  return {
    status,
    message,
    ...(meta ? { meta } : {}),
  };
}
