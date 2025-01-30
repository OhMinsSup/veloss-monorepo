# Auth error

This document describes the properties and usage of AuthError.

## Examples

### Simple example

```ts
import { AuthError } from "@veloss/error/auth";

try {
  // ...
} catch (cause) {
  throw new AuthError("Could not read the file.", { cause });
}
```

```ts
import { createAuthError } from "@veloss/error/auth";

try {
  // ...
} catch (cause) {
  throw createAuthError({
    message: "Could not read the file.",
    cause,
  });
}
```

```ts
import { isAuthError } from "@veloss/error/auth";

try {
  const data = await func();
} catch (e) {
  if (isAuthError(e)) {
    const e = e.toJSON();
    console.log(e);
  }
}
```

## API

```ts
type AuthErrorCode =
  | "unexpected_failure"
  | "validation_failed"
  | "bad_json"
  | "email_exists"
  | "phone_exists"
  | "bad_jwt"
  | "not_admin"
  | "no_authorization"
  | "user_not_found"
  | "session_not_found"
  | "session_expired"
  | "refresh_token_not_found"
  | "refresh_token_already_used"
  | "flow_state_not_found"
  | "flow_state_expired"
  | "signup_disabled"
  | "user_banned"
  | "provider_email_needs_verification"
  | "invite_not_found"
  | "bad_oauth_state"
  | "bad_oauth_callback"
  | "oauth_provider_not_supported"
  | "unexpected_audience"
  | "single_identity_not_deletable"
  | "email_conflict_identity_not_deletable"
  | "identity_already_exists"
  | "email_provider_disabled"
  | "phone_provider_disabled"
  | "too_many_enrolled_mfa_factors"
  | "mfa_factor_name_conflict"
  | "mfa_factor_not_found"
  | "mfa_ip_address_mismatch"
  | "mfa_challenge_expired"
  | "mfa_verification_failed"
  | "mfa_verification_rejected"
  | "insufficient_aal"
  | "captcha_failed"
  | "saml_provider_disabled"
  | "manual_linking_disabled"
  | "sms_send_failed"
  | "email_not_confirmed"
  | "phone_not_confirmed"
  | "reauth_nonce_missing"
  | "saml_relay_state_not_found"
  | "saml_relay_state_expired"
  | "saml_idp_not_found"
  | "saml_assertion_no_user_id"
  | "saml_assertion_no_email"
  | "user_already_exists"
  | "sso_provider_not_found"
  | "saml_metadata_fetch_failed"
  | "saml_idp_already_exists"
  | "sso_domain_already_exists"
  | "saml_entity_id_mismatch"
  | "conflict"
  | "provider_disabled"
  | "user_sso_managed"
  | "reauthentication_needed"
  | "same_password"
  | "reauthentication_not_valid"
  | "otp_expired"
  | "otp_disabled"
  | "identity_not_found"
  | "weak_password"
  | "over_request_rate_limit"
  | "over_email_send_rate_limit"
  | "over_sms_send_rate_limit"
  | "bad_code_verifier"
  | "anonymous_provider_disabled"
  | "hook_timeout"
  | "hook_timeout_after_retry"
  | "hook_payload_over_size_limit"
  | "hook_payload_invalid_content_type"
  | "request_timeout"
  | "mfa_phone_enroll_not_enabled"
  | "mfa_phone_verify_not_enabled"
  | "mfa_totp_enroll_not_enabled"
  | "mfa_totp_verify_not_enabled"
  | "mfa_webauthn_enroll_not_enabled"
  | "mfa_webauthn_verify_not_enabled"
  | "mfa_verified_factor_exists"
  | "invalid_credentials"
  | "email_address_not_authorized"
  | "email_address_invalid"
  | "unknown_error";

interface IAuthError<DataT = unknown> extends BaseError<DataT> {
  errorCode?: AuthErrorCode;
  statusCode?: number;
  fatal: boolean;
  unhandled: boolean;
  toJSON(): Pick<
    AuthError<DataT>,
    "message" | "statusCode" | "errorCode" | "data"
  >;
}

interface AuthErrorConstructorOptions<DataT = unknown>
  extends BaseErrorConstructorOptions<DataT> {
  errorCode?: AuthErrorCode;
  statusCode?: number;
}

class AuthError<DataT = unknown>
  extends BaseError<DataT>
  implements IAuthError<DataT>
{
  name: string;
  errorCode?: AuthErrorCode;
  fatal: boolean;
  unhandled: boolean;
  statusCode?: number;
  static __auth_error__: boolean;
  constructor(message: string, opts?: AuthErrorConstructorOptions<DataT>);
  toJSON(): Pick<
    AuthError<DataT>,
    "message" | "data" | "statusCode" | "errorCode"
  >;
}

function createAuthError<DataT = unknown>(
  input:
    | string
    | (Partial<AuthError<DataT>> & {
        errorCode?: AuthErrorCode | string;
        status?: number;
      })
): AuthError<DataT>;

function isAuthError<DataT = unknown>(input: any): input is AuthError<DataT>;
```

### name

_Type_: `string`

Error name. This is used to identify the error class and should be unique among

```ts
const error = new AuthError("message");
error.name; // "AuthError"
```

### fatal

_Type_: `boolean`

Whether the error is fatal. This is used to determine whether the process should

```ts
const error = new AuthError("message", { fatal: true });
error.fatal; // true
```

### unhandled

_Type_: `boolean`

Whether the error is unhandled. This is used to determine whether the error was

```ts
const error = new AuthError("message", { unhandled: true });
error.unhandled; // true
```

### data

_Type_: `DataT`

Additional data. This can be any type and is used to store any additional

```ts
const error = new AuthError("message", { data: { key: "value" } });
error.data; // { key: "value" }
```

### cause

_Type_: `unknown`

The error that caused this error. This is used to store the error that caused

```ts
const error = new AuthError("message", { cause: new Error("cause") });
error.cause; // Error: cause
```

### code

_Type_: `number`

Error code. This is used to store an error code and is used to identify the

```ts
const error = new AuthError("message", { code: 404 });
error.code; // 404
```

### errorCode

_Type_: `AuthErrorCode`

Error code. This is used to store an error code and is used to identify the

```ts
const error = new AuthError("message", { errorCode: "unexpected_failure" });
error.errorCode; // "unexpected_failure"
```

### statusCode

_Type_: `number`

HTTP status code. This is used to store an HTTP status code and is used to

```ts
const error = new AuthError("message", { statusCode: 404 });
error.statusCode; // 404
```

### toJSON

_Type_: `() => Pick<AuthError<DataT>, "message" | "statusCode" | "errorCode" | "data">`

Converts the error to a JSON-serializable object. This is used to serialize the

```ts
const error = new AuthError("message", { data: { key: "value" } });

error.toJSON(); // { message: "message", data: { key: "value" } }
```

### staticMethods.auth_error

_Type_: `boolean`

Whether the error is a `AuthError`. This is used to determine whether an error

```ts
AuthError.__auth_error__; // true
```

## Related

- [createAuthError](#createautherror)
- [isAuthError](#isautherror)

## createAuthError

```ts
function createAuthError<DataT = unknown>(
  input:
    | string
    | (Partial<AuthError<DataT>> & {
        errorCode?: AuthErrorCode | string;
        status?: number;
      })
): AuthError<DataT>;
```

Creates a new `AuthError` instance. This is used to create a new `AuthError` with

```ts
const error = createAuthError("message");

error instanceof AuthError; // true
```

```ts
const error = createAuthError({
  message: "message",
  errorCode: "unexpected_failure",
  status: 404,
});

error instanceof AuthError; // true
```

## isAuthError

```ts
function isAuthError<DataT = unknown>(input: any): input is AuthError<DataT>;
```

Checks whether the input is a `AuthError`. This is used to determine whether an

```ts
const error = new AuthError("message");

isAuthError(error); // true
```

```ts
isAuthError(new Error("message")); // false
```

## See also

- [AuthError](#autherror)

## License

[MIT](../LICENSE)
