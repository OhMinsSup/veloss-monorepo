export const HttpErrorName = {
  BadRequestException: "BadRequestException",
  ForbiddenException: "ForbiddenException",
  NotFoundException: "NotFoundException",
  UnauthorizedException: "UnauthorizedException",
  NotAcceptableException: "NotAcceptableException",
  RequestTimeoutException: "RequestTimeoutException",
  ConflictException: "ConflictException",
  GoneException: "GoneException",
  HttpVersionNotSupportedException: "HttpVersionNotSupportedException",
  PayloadTooLargeException: "PayloadTooLargeException",
  UnsupportedMediaTypeException: "UnsupportedMediaTypeException",
  UnprocessableEntityException: "UnprocessableEntityException",
  InternalServerErrorException: "InternalServerErrorException",
  NotImplementedException: "NotImplementedException",
  ImATeapotException: "ImATeapotException",
  MethodNotAllowedException: "MethodNotAllowedException",
  BadGatewayException: "BadGatewayException",
  ServiceUnavailableException: "ServiceUnavailableException",
  GatewayTimeoutException: "GatewayTimeoutException",
  PreconditionFailedException: "PreconditionFailedException",
  ThrottlerException: "ThrottlerException",
} as const;

export type KeyOfHttpErrorName = keyof typeof HttpErrorName;
export type ValueOfHttpErrorName = (typeof HttpErrorName)[KeyOfHttpErrorName];

export enum HttpErrorNameEnum {
  BadRequestException = "BadRequestException",
  ForbiddenException = "ForbiddenException",
  NotFoundException = "NotFoundException",
  UnauthorizedException = "UnauthorizedException",
  NotAcceptableException = "NotAcceptableException",
  RequestTimeoutException = "RequestTimeoutException",
  ConflictException = "ConflictException",
  GoneException = "GoneException",
  HttpVersionNotSupportedException = "HttpVersionNotSupportedException",
  PayloadTooLargeException = "PayloadTooLargeException",
  UnsupportedMediaTypeException = "UnsupportedMediaTypeException",
  UnprocessableEntityException = "UnprocessableEntityException",
  InternalServerErrorException = "InternalServerErrorException",
  NotImplementedException = "NotImplementedException",
  ImATeapotException = "ImATeapotException",
  MethodNotAllowedException = "MethodNotAllowedException",
  BadGatewayException = "BadGatewayException",
  ServiceUnavailableException = "ServiceUnavailableException",
  GatewayTimeoutException = "GatewayTimeoutException",
  PreconditionFailedException = "PreconditionFailedException",
  ThrottlerException = "ThrottlerException",
}

export type KeyOfHttpErrorNameEnum = keyof typeof HttpErrorNameEnum;
export type ValueOfHttpErrorNameEnum = (typeof HttpErrorNameEnum)[KeyOfHttpErrorNameEnum];
