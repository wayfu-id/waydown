
import { elementOptions } from "@wayfu/wayfu-dom";

export type WaydowOptions = {
    plain: boolean,
} & elementOptions;

/**
 * Waydown : A WhatsApp markdown/Format decoder
 *
 * Inspired by Drawdown (c) Adam Leggett
 * https://github.com/adamvleggett/drawdown
 */

declare function Waydown(source: string): string;
declare function Waydown(source: string, plain?: boolean): string;
declare function Waydown(source: string, option?: WaydowOptions): string;

export default Waydown;