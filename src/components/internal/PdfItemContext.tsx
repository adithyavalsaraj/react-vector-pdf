import { createContext, useContext } from "react";

export type PdfOperation = () => void | Promise<void>;

export interface PdfItemContextType {
  registerOperation: (id: string, op: PdfOperation) => void;
  unregisterOperation: (id: string) => void;
}

export const PdfItemContext = createContext<PdfItemContextType | null>(null);

export const usePdfItemContext = () => useContext(PdfItemContext);
