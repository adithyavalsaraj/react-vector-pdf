export declare const mm: (v: number) => number;
export declare function resolvePadding(p?: number | {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}): {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare function hexToRgb(hex: string): [number, number, number] | null;
export declare function toRoman(n: number, uppercase?: boolean): string;
