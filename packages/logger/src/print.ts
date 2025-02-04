import type { ArgumentElement, LiteralElement, MessageFormatElement } from "./parser";
import { TYPE } from "./types";

export class LoggerPrint {
  /**
   * Template String Tag function to print AST to a string
   * @param ast - The AST to print {@link MessageFormatElement}
   * @returns The printed AST as a string
   */
  printAST(ast: MessageFormatElement[]) {
    const printedNodes = ast.map((el, i) => {
      if (this.isLiteralElement(el)) {
        return this.printLiteralElement(el, i === 0, i === ast.length - 1);
      }

      if (this.isArgumentElement(el)) {
        return this.printArgumentElement(el);
      }
    });

    return printedNodes.join("");
  }

  /**
   * Template String Tag function to print AST to an array
   * @param ast - The AST to print {@link MessageFormatElement}
   * @returns The printed AST as an array
   */
  printASTtoArray(ast: MessageFormatElement[]) {
    const printedNodes = ast.map((el, i) => {
      if (this.isLiteralElement(el)) {
        return this.printLiteralElement(el, i === 0, i === ast.length - 1);
      }

      if (this.isArgumentElement(el)) {
        return this.printArgumentElement(el);
      }
    });

    return printedNodes;
  }

  /**
   * Print an escaped message
   * @param message - The message to escape
   * @returns The escaped message
   */
  private printEscapedMessage(message: string): string {
    return message.replace(/([{}](?:[\s\S]*[{}])?)/, `'$1'`);
  }

  /**
   * Print an argument element
   * @param param - The argument element to print {@link ArgumentElement}
   * @returns The printed argument element
   */
  private printArgumentElement({ value }: ArgumentElement): string {
    return `${value}`;
  }

  /**
   * Print a literal element
   * @param param - The literal element to print {@link LiteralElement}
   * @param isFirstEl - If the element is the first element in the AST
   * @param isLastEl - If the element is the last element in the AST
   * @returns The printed literal element
   */
  private printLiteralElement({ value }: LiteralElement, isFirstEl: boolean, isLastEl: boolean): string {
    let escaped = value;
    // If this literal starts with a ' and its not the 1st node, this means the node before it is non-literal
    // and the `'` needs to be unescaped
    if (!isFirstEl && escaped[0] === `'`) {
      escaped = `''${escaped.slice(1)}`;
    }
    // Same logic but for last el
    if (!isLastEl && escaped[escaped.length - 1] === `'`) {
      escaped = `${escaped.slice(0, escaped.length - 1)}''`;
    }
    escaped = this.printEscapedMessage(escaped);
    return escaped;
  }

  /**
   * Check if the element is a literal element
   * @param el - The element to check {@link MessageFormatElement}
   * @returns True if the element is a literal element {@link LiteralElement}
   */
  private isLiteralElement(el: MessageFormatElement): el is LiteralElement {
    return el.type === TYPE.literal;
  }

  /**
   * Check if the element is an argument element
   * @param el - The element to check {@link MessageFormatElement}
   * @returns True if the element is an argument element {@link ArgumentElement}
   */
  private isArgumentElement(el: MessageFormatElement): el is ArgumentElement {
    return el.type === TYPE.argument;
  }
}
