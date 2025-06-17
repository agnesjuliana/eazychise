type BaseResponse = {
  status: boolean;
  message: string;
  meta?: any;
};

export function formatResponse<T = any>({
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