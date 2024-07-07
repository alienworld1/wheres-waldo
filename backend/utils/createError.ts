interface ErrorWithStatus extends Error {
  status?: number;
}

function createError(status: number, message: string): ErrorWithStatus {
  const err: ErrorWithStatus = new Error(message);
  err.status = status;
  return err;
}

export default createError;
