import React, { useId } from "react";
import type { TextStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { usePdf } from "./PdfProvider";
import { usePdfItemContext } from "./internal/PdfItemContext";

export interface PdfTextProps extends TextStyle {
  children: React.ReactNode;
  x?: number;
  y?: number;
  maxWidth?: number;
  spacingBelow?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PdfText: React.FC<PdfTextProps> = ({
  children,
  x,
  y,
  maxWidth,
  spacingBelow = 2,
  className,
  style: styleProp,
  ...textStyle
}) => {
  const pdf = usePdf();
  const context = usePdfItemContext();
  const id = useId();
  const { ref, computeStyle } = useClassStyles(className, styleProp);
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);

  React.useLayoutEffect(() => {
    // Prevent double-queuing for the same document generation
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    const resolved = computeStyle();

    const finalStyle = {
      ...resolved,
      ...textStyle,
    } as TextStyle;

    const task = async () => {
      const startPos = pdf.getCursor();
      let h = 0;
      const draw = () => {
        if (typeof x === "number" && typeof y === "number") {
          const textContent = ref.current?.textContent ?? String(children);
          pdf.textRaw(textContent, x, y, finalStyle, maxWidth, finalStyle.align);
        } else {
          pdf.setCursor(startPos.x, startPos.y);

          // Check if there are nested elements
          const hasSpans =
            ref.current &&
            Array.from(ref.current.childNodes).some(
              (node) => node.nodeType === 1 // ELEMENT_NODE
            );

          if (hasSpans && ref.current) {
            const spans: any[] = [];
            ref.current.childNodes.forEach((node) => {
              if (node.nodeType === 3) {
                // TEXT_NODE
                if (node.textContent) {
                  spans.push({
                    text: node.textContent,
                    style: finalStyle,
                  });
                }
              } else if (node.nodeType === 1) {
                // ELEMENT_NODE
                const el = node as HTMLElement;
                const computed = window.getComputedStyle(el);

                const cleanFontFamily = (family?: string) => {
                  if (!family) return undefined;
                  const clean = family
                    .split(",")[0]
                    .trim()
                    .replace(/['"]/g, "");
                  if (
                    clean &&
                    clean !== "sans-serif" &&
                    clean !== "serif" &&
                    clean !== "monospace"
                  ) {
                    return clean;
                  }
                  return undefined;
                };

                const resolveFontStyle = (weight?: string, styleName?: string) => {
                  const fw = weight || "normal";
                  const fs = styleName || "normal";
                  if (fs === "italic") {
                    if (fw === "bold" || fw === "700" || parseInt(fw) >= 700)
                      return "bolditalic";
                    return "italic";
                  }
                  if (fw === "bold" || fw === "700" || parseInt(fw) >= 700)
                    return "bold";
                  return "normal";
                };

                const parseColorStr = (c: string) => {
                  if (
                    !c ||
                    c === "rgba(0, 0, 0, 0)" ||
                    c === "transparent"
                  )
                    return undefined;
                  return c;
                };

                const spanStyle: TextStyle = {
                  fontSize:
                    parseFloat(computed.fontSize) * (72 / 96) ||
                    finalStyle.fontSize,
                  fontName:
                    cleanFontFamily(computed.fontFamily) ?? finalStyle.fontName,
                  fontStyle:
                    resolveFontStyle(
                      computed.fontWeight,
                      computed.fontStyle
                    ) ?? finalStyle.fontStyle,
                  color: parseColorStr(computed.color) ?? finalStyle.color,
                  link: el.getAttribute("data-link") ?? undefined,
                };

                spans.push({
                  text: el.textContent || "",
                  style: spanStyle,
                });
              }
            });
            h = pdf.richParagraph(spans, finalStyle, maxWidth);
          } else {
            h = pdf.paragraph(String(children), finalStyle, maxWidth);
          }
          const cur = pdf.getCursor();

          if (spacingBelow > 0) {
            pdf.setCursor(cur.x, cur.y + spacingBelow);
          }
        }
      };

      draw();

      if (finalStyle.showInAllPages) {
        pdf.registerRecurringItem({
          draw,
          scope: finalStyle.scope ?? "all",
          y: startPos.y,
          height: h + spacingBelow,
        });
      }
    };

    if (context) {
      context.registerOperation(id, task);
      return () => context.unregisterOperation(id);
    } else {
      pdf.queueOperation(task);
    }
  }, [
    pdf,
    context, // Add context dependency
    id,
    children,
    x,
    y,
    maxWidth,
    spacingBelow,
    className,
    textStyle.fontSize,
    textStyle.color,
    textStyle.align,
    textStyle.fontName,
    textStyle.link,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...styleProp,
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    />
  );
};
