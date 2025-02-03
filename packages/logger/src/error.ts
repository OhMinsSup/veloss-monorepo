/**
 * The error kind.
 */
export enum ErrorKind {
  /** Argument is unclosed (e.g. `{0`) */
  EXPECT_ARGUMENT_CLOSING_BRACE = 1,
  /** Argument is empty (e.g. `{}`). */
  EMPTY_ARGUMENT = 2,
  /** Argument is malformed (e.g. `{foo!}``) */
  MALFORMED_ARGUMENT = 3,
}
