export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = "Resource") {
    super(404, "NOT_FOUND", `${resource} not found`);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized — please login") {
    super(401, "UNAUTHORIZED", message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You don't have permission to do this") {
    super(403, "FORBIDDEN", message);
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Invalid request data") {
    super(422, "VALIDATION_ERROR", message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource already exists") {
    super(409, "CONFLICT", message);
  }
}
