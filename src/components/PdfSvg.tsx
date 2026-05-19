import React, { useId } from "react";
import { usePdf } from "./PdfProvider";
import { usePdfItemContext } from "./internal/PdfItemContext";

export interface PdfSvgProps {
  children?: React.ReactNode;
  w: number; // width in mm
  h: number; // height in mm
  x?: number; // optional absolute x in mm
  y?: number; // optional absolute y in mm
  viewBox?: string; // e.g. "0 0 24 24"
  className?: string;
  style?: React.CSSProperties;
}

export const PdfSvg: React.FC<PdfSvgProps> = ({
  children,
  w,
  h,
  x,
  y,
  viewBox = `0 0 ${w} ${h}`,
  className,
  style,
}) => {
  const pdf = usePdf();
  const context = usePdfItemContext();
  const id = useId();
  const ref = React.useRef<SVGSVGElement>(null);
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);

  React.useLayoutEffect(() => {
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    const task = async () => {
      const startPos = pdf.getCursor();
      const startX = x ?? startPos.x;
      const startY = y ?? startPos.y;

      const draw = () => {
        if (!ref.current) return;

        // Parse viewBox (check if inner svg specifies it)
        let activeViewBox = viewBox;
        const innerSvg = ref.current.querySelector("svg");
        if (innerSvg && innerSvg.getAttribute("viewBox")) {
          activeViewBox = innerSvg.getAttribute("viewBox")!;
        }

        const vbParts = activeViewBox.split(/\s+/).map(parseFloat);
        const vbW = vbParts[2] || w;
        const vbH = vbParts[3] || h;

        const scaleX = w / vbW;
        const scaleY = h / vbH;

        const parseColor = (colorStr: string): [number, number, number] | null => {
          if (!colorStr || colorStr === "none" || colorStr === "transparent") return null;
          if (colorStr.startsWith("rgb")) {
            const parts = colorStr.match(/\d+/g);
            if (parts && parts.length >= 3) {
              return [parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])];
            }
          }
          if (colorStr.startsWith("#")) {
            const hex = colorStr.substring(1);
            if (hex.length === 3) {
              return [
                parseInt(hex[0] + hex[0], 16),
                parseInt(hex[1] + hex[1], 16),
                parseInt(hex[2] + hex[2], 16),
              ];
            }
            if (hex.length === 6) {
              return [
                parseInt(hex.substring(0, 2), 16),
                parseInt(hex.substring(2, 4), 16),
                parseInt(hex.substring(4, 6), 16),
              ];
            }
          }
          return null;
        };

        const setSvgStyle = (el: Element) => {
          const computed = window.getComputedStyle(el);
          const fill = computed.fill;
          const stroke = computed.stroke;

          let hasFill = fill && fill !== "none" && fill !== "transparent";
          let hasStroke = stroke && stroke !== "none" && stroke !== "transparent";

          if (hasStroke) {
            const rgb = parseColor(stroke);
            if (rgb) pdf.instance.setDrawColor(rgb[0], rgb[1], rgb[2]);

            const attrStrokeWidth = parseFloat(el.getAttribute("stroke-width") ?? "1");
            const lineWidth = attrStrokeWidth * scaleX;
            pdf.instance.setLineWidth(lineWidth);
          }

          if (hasFill) {
            const rgb = parseColor(fill);
            if (rgb) pdf.instance.setFillColor(rgb[0], rgb[1], rgb[2]);
          }

          let styleStr = "";
          if (hasFill) styleStr += "F";
          if (hasStroke) styleStr += "D";
          return styleStr;
        };

        const parsePath = (d: string) => {
          const pathData: any[] = [];
          const commandRegex = /([a-df-z])([^a-df-z]*)/gi;
          let match;

          let currentX = 0;
          let currentY = 0;

          while ((match = commandRegex.exec(d)) !== null) {
            const cmd = match[1];
            const args = match[2]
              .trim()
              .split(/[\s,]+/)
              .map(parseFloat)
              .filter((n) => !isNaN(n));

            const isRelative = cmd === cmd.toLowerCase();
            const cmdUpper = cmd.toUpperCase();

            if (cmdUpper === "M") {
              for (let i = 0; i < args.length; i += 2) {
                const px = (isRelative ? currentX : 0) + args[i];
                const py = (isRelative ? currentY : 0) + args[i + 1];

                pathData.push({
                  op: "m",
                  c: [startX + px * scaleX, startY + py * scaleY],
                });

                currentX = px;
                currentY = py;
              }
            } else if (cmdUpper === "L") {
              for (let i = 0; i < args.length; i += 2) {
                const px = (isRelative ? currentX : 0) + args[i];
                const py = (isRelative ? currentY : 0) + args[i + 1];

                pathData.push({
                  op: "l",
                  c: [startX + px * scaleX, startY + py * scaleY],
                });

                currentX = px;
                currentY = py;
              }
            } else if (cmdUpper === "H") {
              for (let i = 0; i < args.length; i++) {
                const px = (isRelative ? currentX : 0) + args[i];

                pathData.push({
                  op: "l",
                  c: [startX + px * scaleX, startY + currentY * scaleY],
                });

                currentX = px;
              }
            } else if (cmdUpper === "V") {
              for (let i = 0; i < args.length; i++) {
                const py = (isRelative ? currentY : 0) + args[i];

                pathData.push({
                  op: "l",
                  c: [startX + currentX * scaleX, startY + py * scaleY],
                });

                currentY = py;
              }
            } else if (cmdUpper === "C") {
              for (let i = 0; i < args.length; i += 6) {
                const x1 = (isRelative ? currentX : 0) + args[i];
                const y1 = (isRelative ? currentY : 0) + args[i + 1];
                const x2 = (isRelative ? currentX : 0) + args[i + 2];
                const y2 = (isRelative ? currentY : 0) + args[i + 3];
                const px = (isRelative ? currentX : 0) + args[i + 4];
                const py = (isRelative ? currentY : 0) + args[i + 5];

                pathData.push({
                  op: "c",
                  c: [
                    startX + x1 * scaleX,
                    startY + y1 * scaleY,
                    startX + x2 * scaleX,
                    startY + y2 * scaleY,
                    startX + px * scaleX,
                    startY + py * scaleY,
                  ],
                });

                currentX = px;
                currentY = py;
              }
            } else if (cmdUpper === "Z") {
              pathData.push({ op: "h", c: [] });
            }
          }
          return pathData;
        };

        const walkNode = (node: Element) => {
          const tag = node.tagName.toLowerCase();

          if (tag === "g" || tag === "svg") {
            Array.from(node.children).forEach(walkNode);
            return;
          }

          if (tag === "line") {
            const styleStr = setSvgStyle(node);
            const lx1 = startX + parseFloat(node.getAttribute("x1") ?? "0") * scaleX;
            const ly1 = startY + parseFloat(node.getAttribute("y1") ?? "0") * scaleY;
            const lx2 = startX + parseFloat(node.getAttribute("x2") ?? "0") * scaleX;
            const ly2 = startY + parseFloat(node.getAttribute("y2") ?? "0") * scaleY;
            pdf.instance.line(lx1, ly1, lx2, ly2);
          } else if (tag === "rect") {
            const styleStr = setSvgStyle(node);
            const rx_pos = startX + parseFloat(node.getAttribute("x") ?? "0") * scaleX;
            const ry_pos = startY + parseFloat(node.getAttribute("y") ?? "0") * scaleY;
            const rw = parseFloat(node.getAttribute("width") ?? "0") * scaleX;
            const rh = parseFloat(node.getAttribute("height") ?? "0") * scaleY;
            const radiusX = parseFloat(node.getAttribute("rx") ?? "0") * scaleX;
            const radiusY = parseFloat(node.getAttribute("ry") ?? "0") * scaleY;

            if (radiusX > 0) {
              pdf.instance.roundedRect(rx_pos, ry_pos, rw, rh, radiusX, radiusY, styleStr);
            } else {
              pdf.instance.rect(rx_pos, ry_pos, rw, rh, styleStr);
            }
          } else if (tag === "circle") {
            const styleStr = setSvgStyle(node);
            const cx = startX + parseFloat(node.getAttribute("cx") ?? "0") * scaleX;
            const cy = startY + parseFloat(node.getAttribute("cy") ?? "0") * scaleY;
            const r = parseFloat(node.getAttribute("r") ?? "0") * scaleX;
            pdf.instance.circle(cx, cy, r, styleStr);
          } else if (tag === "ellipse") {
            const styleStr = setSvgStyle(node);
            const cx = startX + parseFloat(node.getAttribute("cx") ?? "0") * scaleX;
            const cy = startY + parseFloat(node.getAttribute("cy") ?? "0") * scaleY;
            const rx = parseFloat(node.getAttribute("rx") ?? "0") * scaleX;
            const ry = parseFloat(node.getAttribute("ry") ?? "0") * scaleY;
            pdf.instance.ellipse(cx, cy, rx, ry, styleStr);
          } else if (tag === "polygon" || tag === "polyline") {
            const styleStr = setSvgStyle(node);
            const pointsStr = node.getAttribute("points") ?? "";
            const pairs = pointsStr.trim().split(/\s+/);
            const points = pairs
              .map((pair) => {
                const parts = pair.split(",");
                if (parts.length < 2) return null;
                return {
                  x: startX + parseFloat(parts[0]) * scaleX,
                  y: startY + parseFloat(parts[1]) * scaleY,
                };
              })
              .filter((p): p is { x: number; y: number } => p !== null);

            if (points.length > 0) {
              const pathData = points.map((p, idx) => ({
                op: idx === 0 ? "m" : "l",
                c: [p.x, p.y],
              }));
              if (tag === "polygon") {
                pathData.push({ op: "h", c: [] });
              }
              pdf.instance.path(pathData, styleStr);
            }
          } else if (tag === "path") {
            const styleStr = setSvgStyle(node);
            const d = node.getAttribute("d") ?? "";
            const pathData = parsePath(d);
            if (pathData.length > 0) {
              pdf.instance.path(pathData, styleStr);
            }
          }
        };

        // Reset draw state and save
        pdf.instance.saveGraphicsState();

        // Walk elements
        Array.from(ref.current.children).forEach(walkNode);

        // Restore defaults
        pdf.instance.restoreGraphicsState();
        pdf.instance.setLineWidth(0.2);
        pdf.instance.setDrawColor(0, 0, 0);
      };

      draw();

      if (!(typeof x === "number" && typeof y === "number")) {
        pdf.setCursor(startPos.x, startPos.y + h);
      }
    };

    if (context) {
      context.registerOperation(id, task);
      return () => context.unregisterOperation(id);
    } else {
      pdf.queueOperation(task);
    }
  }, [pdf, context, x, y, w, h, viewBox]);

  return (
    <svg
      ref={ref}
      className={className}
      style={{
        ...style,
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    >
      {children}
    </svg>
  );
};

(PdfSvg as any).displayName = "PdfSvg";
