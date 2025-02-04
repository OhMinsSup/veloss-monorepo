import { ErrorKind, TYPE } from "./types";

export interface Position {
  /** Offset in terms of UTF-16 *code unit*. */
  offset: number;
  /** Line number in terms of unicode *code point*. */
  line: number;
  /** Column offset in terms of unicode *code point*. */
  column: number;
}

export interface ParserError {
  /**
   * The kind of error.
   */
  kind: ErrorKind;
  /**
   * The message string that the error occurred in.
   */
  message: string;
  /**
   * The location of the error.
   */
  location: Location;
}

export interface LocationDetails {
  /**
   * Offset in terms of UTF-16 *code unit*.
   */
  offset: number;
  /**
   * Line number in terms of unicode *code point*.
   */
  line: number;
  /**
   * Column offset in terms of unicode *code point*.
   */
  column: number;
}

export interface Location {
  /**
   * The start location of the element.
   */
  start: LocationDetails;
  /**
   * The end location of the element.
   */
  end: LocationDetails;
}

export interface BaseElement<T extends TYPE> {
  /**
   * The type of the element.
   */
  type: T;
  /**
   * The value of the element.
   */
  value: string;
  /**
   * The location of the element.
   */
  location?: Location;
}

export type LiteralElement = BaseElement<TYPE.literal>;

export type ArgumentElement = BaseElement<TYPE.argument>;

export type MessageFormatElement = ArgumentElement | LiteralElement;

export type Result<T, E> = { val: T; err: null } | { val: null; err: E };

export class LoggerParser {
  /**
   * The message string to parse.
   * This is the string that the parser will parse.
   */
  private message: string;

  /**
   * The properties to use for argument replacement.
   * This is the object that the parser will use to replace arguments in the message string.
   */
  private properties: Record<string, unknown>;

  /**
   * The current position of the parser.
   */
  private position: Position;

  constructor() {
    this.message = "";
    this.position = { offset: 0, line: 1, column: 1 };
    this.properties = {};
  }

  /**
   * Parse a template string with values.
   *
   * @param template - The template string to parse.
   * @param values - The values to replace in the template string.
   *
   * @returns The parsed message format elements.
   */
  parseTemplate(
    template: TemplateStringsArray,
    values: readonly unknown[],
  ): Result<MessageFormatElement[], ParserError> {
    const message: unknown[] = [];
    for (let i = 0; i < template.length; i++) {
      const part = template[i];
      message.push(part);
      if (i < values.length) {
        message.push(values[i]);
      }
    }
    return this.parse(message.join(""), {});
  }

  /**
   * Parse a message string with properties.
   *
   * @param message - The message string to parse.
   * @param properties - The properties to use for argument replacement.
   *
   * @returns The parsed message format elements.
   */
  parse(message: string, properties: Record<string, unknown>): Result<MessageFormatElement[], ParserError> {
    this.message = message;
    this.properties = properties;

    if (this.offset() !== 0) {
      throw Error("parser can only be used once");
    }

    return this.parseMessage(0);
  }

  /**
   * Release the parser.
   */
  release() {
    this.message = "";
    this.position = { offset: 0, line: 1, column: 1 };
    this.properties = {};
  }

  /**
   * Parse a message string.
   *
   * @param nestingLevel - The current nesting level.
   *
   * @returns The parsed message format elements.
   */
  private parseMessage(nestingLevel: number): Result<MessageFormatElement[], ParserError> {
    const elements: MessageFormatElement[] = [];

    while (!this.isEOF()) {
      const char = this.char();
      if (char === 123 /* `{` */) {
        const result = this.parseArgument();
        if (result.err) {
          return result;
        }
        elements.push(result.val);
      } else if (char === 125 /* `}` */ && nestingLevel > 0) {
        break;
      } else {
        const result = this.parseLiteral(nestingLevel);
        if (result.err) {
          return result;
        }
        elements.push(result.val);
      }
    }

    return { val: elements, err: null };
  }

  /**
   * Parse an argument.
   *
   * @returns The parsed argument element. If the argument is malformed, an error is returned.
   */
  private parseArgument(): Result<MessageFormatElement, ParserError> {
    const openingBracePosition = this.clonePosition();
    this.bump(); // `{`

    this.bumpSpace();

    if (this.isEOF()) {
      return this.error(
        ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE,
        this.createLocation(openingBracePosition, this.clonePosition()),
      );
    }

    if (this.char() === 125 /* `}` */) {
      this.bump();
      return this.error(ErrorKind.EMPTY_ARGUMENT, this.createLocation(openingBracePosition, this.clonePosition()));
    }

    // argument name
    const value = this.parseIdentifierIfPossible().value;
    if (!value) {
      return this.error(ErrorKind.MALFORMED_ARGUMENT, this.createLocation(openingBracePosition, this.clonePosition()));
    }

    this.bumpSpace();

    if (this.isEOF()) {
      return this.error(
        ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE,
        this.createLocation(openingBracePosition, this.clonePosition()),
      );
    }

    const targetValue = this.properties[value] as unknown as string;

    switch (this.char()) {
      // Simple argument: `{name}`
      case 125 /* `}` */: {
        this.bump(); // `}`
        return {
          val: {
            type: TYPE.argument,
            // value does not include the opening and closing braces.
            value: targetValue ?? value,
            location: this.createLocation(openingBracePosition, this.clonePosition()),
          },
          err: null,
        };
      }
      default:
        return this.error(
          ErrorKind.MALFORMED_ARGUMENT,
          this.createLocation(openingBracePosition, this.clonePosition()),
        );
    }
  }

  /**
   * Parse a literal.
   *
   * @param nestingLevel - The current nesting level.
   *
   * @returns The parsed literal element.
   */
  private parseLiteral(nestingLevel: number): Result<LiteralElement, ParserError> {
    const start = this.clonePosition();

    let value = "";
    while (true) {
      const parseQuoteResult = this.tryParseQuote();
      if (parseQuoteResult) {
        value += parseQuoteResult;
        continue;
      }

      const parseUnquotedResult = this.tryParseUnquoted(nestingLevel);
      if (parseUnquotedResult) {
        value += parseUnquotedResult;
        continue;
      }

      break;
    }

    const location = this.createLocation(start, this.clonePosition());
    return {
      val: { type: TYPE.literal, value, location },
      err: null,
    };
  }

  /**
   * Try to parse an unquoted string.
   *
   * @param nestingLevel - The current nesting level.
   *
   * @returns The parsed unquoted string. If the unquoted string is malformed, null is returned.
   */
  private tryParseUnquoted(nestingLevel: number): string | null {
    if (this.isEOF()) {
      return null;
    }
    const ch = this.char();

    if (ch === 123 /* `{` */ || (ch === 125 /* `}` */ && nestingLevel > 0)) {
      return null;
    } else {
      this.bump();
      return String.fromCodePoint(ch);
    }
  }

  /**
   * Starting with ICU 4.8, an ASCII apostrophe only starts quoted text if it immediately precedes
   * a character that requires quoting (that is, "only where needed"), and works the same in
   * nested messages as on the top level of the pattern. The new behavior is otherwise compatible.
   *
   * @returns The parsed quoted string. If the quoted string is malformed, null is returned.
   */
  private tryParseQuote(): string | null {
    if (this.isEOF() || this.char() !== 39 /* `'` */) {
      return null;
    }

    // Parse escaped char following the apostrophe, or early return if there is no escaped char.
    // Check if is valid escaped character
    switch (this.peek()) {
      case 39 /* `'` */:
        // double quote, should return as a single quote.
        this.bump();
        this.bump();
        return "'";
      // '{', '<', '>', '}'
      case 123:
      case 125:
        break;
      default:
        return null;
    }

    this.bump(); // apostrophe
    const codePoints = [this.char()]; // escaped char
    this.bump();

    // read chars until the optional closing apostrophe is found
    while (!this.isEOF()) {
      const ch = this.char();
      if (ch === 39 /* `'` */) {
        if (this.peek() === 39 /* `'` */) {
          codePoints.push(39);
          // Bump one more time because we need to skip 2 characters.
          this.bump();
        } else {
          // Optional closing apostrophe.
          this.bump();
          break;
        }
      } else {
        codePoints.push(ch);
      }
      this.bump();
    }

    return String.fromCodePoint(...codePoints);
  }

  /**
   * Advance the parser until the end of the identifier, if it is currently on
   * an identifier character. Return an empty string otherwise.
   *
   * @returns The identifier string.
   */
  private parseIdentifierIfPossible(): { value: string; location: Location } {
    const startingPosition = this.clonePosition();

    const startOffset = this.offset();
    const value = this.matchIdentifierAtIndex(this.message, startOffset);
    const endOffset = startOffset + value.length;

    this.bumpTo(endOffset);

    const endPosition = this.clonePosition();
    const location = this.createLocation(startingPosition, endPosition);

    return { value, location };
  }

  /**
   * Create a location object.
   *
   * @returns The location object. {@link Location}
   */
  private createLocation(start: Position, end: Position): Location {
    return { start, end };
  }

  /**
   * Clone the current position of the parser.
   *
   * @returns The cloned position. {@link Position}
   */
  private clonePosition(): Position {
    return {
      offset: this.position.offset,
      line: this.position.line,
      column: this.position.column,
    };
  }

  /**
   * Return the current position of the parser.
   */
  private offset(): number {
    return this.position.offset;
  }

  /**
   * Check if the parser has reached the end of the input.
   */
  private isEOF(): boolean {
    return this.offset() === this.message.length;
  }

  /** Bump the parser to the next UTF-16 code unit. */
  private bump(): void {
    if (this.isEOF()) {
      return;
    }
    const code = this.char();
    if (code === 10 /* '\n' */) {
      this.position.line += 1;
      this.position.column = 1;
      this.position.offset += 1;
    } else {
      this.position.column += 1;
      // 0 ~ 0x10000 -> unicode BMP, otherwise skip the surrogate pair.
      this.position.offset += code < 0x10000 ? 1 : 2;
    }
  }

  /** advance the parser through all whitespace to the next non-whitespace code unit. */
  private bumpSpace() {
    while (!this.isEOF() && this.isWhiteSpace(this.char())) {
      this.bump();
    }
  }

  /**
   * Bump the parser to the target offset.
   * If target offset is beyond the end of the input, bump the parser to the end of the input.
   */
  private bumpTo(targetOffset: number) {
    if (this.offset() > targetOffset) {
      throw Error(`targetOffset ${targetOffset} must be greater than or equal to the current offset ${this.offset()}`);
    }

    // If the target offset is beyond the end of the input, bump the parser to the end of the input.
    const newTargetOffset = Math.min(targetOffset, this.message.length);
    while (true) {
      const offset = this.offset();
      if (offset === newTargetOffset) {
        break;
      }
      if (offset > newTargetOffset) {
        throw Error(`targetOffset ${targetOffset} is at invalid UTF-16 code unit boundary`);
      }

      this.bump();
      if (this.isEOF()) {
        break;
      }
    }
  }

  /**
   * Peek at the *next* Unicode codepoint in the input without advancing the parser.
   * If the input has been exhausted, then this returns null.
   */
  private peek(): number | null {
    if (this.isEOF()) {
      return null;
    }
    const code = this.char();
    const offset = this.offset();
    const nextCode = this.message.charCodeAt(offset + (code >= 0x10000 ? 2 : 1));
    return nextCode ?? null;
  }

  /**
   * Return the code point at the current position of the parser.
   * Throws if the index is out of bound.
   */
  private char(): number {
    const offset = this.position.offset;
    if (offset >= this.message.length) {
      throw Error("out of bound");
    }
    const code = this.message.charCodeAt(offset);
    if (code === undefined) {
      throw Error(`Offset ${offset} is at invalid UTF-16 code unit boundary`);
    }
    return code;
  }

  /**
   * Create a parser error.
   */
  private error(kind: ErrorKind, location: Location): Result<never, ParserError> {
    return {
      val: null,
      err: {
        kind,
        message: this.message,
        location,
      },
    };
  }

  /**
   *  Check if the code point is a whitespace.
   *
   * @param c - The code point to check.
   *
   * @returns True if the code point is a whitespace.
   */
  private isWhiteSpace(c: number) {
    return (
      (c >= 0x0009 && c <= 0x000d) ||
      c === 0x0020 ||
      c === 0x0085 ||
      (c >= 0x200e && c <= 0x200f) ||
      c === 0x2028 ||
      c === 0x2029
    );
  }

  /**
   * Match an identifier at the given index.
   *
   * @param s - The string to match.
   * @param index - The index to match.
   * @returns The matched identifier.
   */
  private matchIdentifierAtIndex(s: string, index: number) {
    const IDENTIFIER_PREFIX_RE = /([^\p{White_Space}\p{Pattern_Syntax}]*)/uy;
    IDENTIFIER_PREFIX_RE.lastIndex = index;
    const match = IDENTIFIER_PREFIX_RE.exec(s);
    return match?.at(1) ?? "";
  }
}
