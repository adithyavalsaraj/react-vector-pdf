import A, { createContext as st, useContext as at } from "react";
import { jsPDF as ft } from "jspdf";
var J = { exports: {} }, $ = {};
var tt;
function ct() {
  if (tt) return $;
  tt = 1;
  var i = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function r(n, o, s) {
    var f = null;
    if (s !== void 0 && (f = "" + s), o.key !== void 0 && (f = "" + o.key), "key" in o) {
      s = {};
      for (var l in o)
        l !== "key" && (s[l] = o[l]);
    } else s = o;
    return o = s.ref, {
      $$typeof: i,
      type: n,
      key: f,
      ref: o !== void 0 ? o : null,
      props: s
    };
  }
  return $.Fragment = t, $.jsx = r, $.jsxs = r, $;
}
var V = {};
var et;
function lt() {
  return et || (et = 1, process.env.NODE_ENV !== "production" && (function() {
    function i(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === S ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case u:
          return "Fragment";
        case M:
          return "Profiler";
        case O:
          return "StrictMode";
        case G:
          return "Suspense";
        case m:
          return "SuspenseList";
        case W:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case C:
            return "Portal";
          case B:
            return e.displayName || "Context";
          case N:
            return (e._context.displayName || "Context") + ".Consumer";
          case X:
            var c = e.render;
            return e = e.displayName, e || (e = c.displayName || c.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case v:
            return c = e.displayName || null, c !== null ? c : i(e.type) || "Memo";
          case P:
            c = e._payload, e = e._init;
            try {
              return i(e(c));
            } catch {
            }
        }
      return null;
    }
    function t(e) {
      return "" + e;
    }
    function r(e) {
      try {
        t(e);
        var c = !1;
      } catch {
        c = !0;
      }
      if (c) {
        c = console;
        var d = c.error, T = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return d.call(
          c,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          T
        ), t(e);
      }
    }
    function n(e) {
      if (e === u) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === P)
        return "<...>";
      try {
        var c = i(e);
        return c ? "<" + c + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function o() {
      var e = p.A;
      return e === null ? null : e.getOwner();
    }
    function s() {
      return Error("react-stack-top-frame");
    }
    function f(e) {
      if (D.call(e, "key")) {
        var c = Object.getOwnPropertyDescriptor(e, "key").get;
        if (c && c.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function l(e, c) {
      function d() {
        E || (E = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          c
        ));
      }
      d.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: d,
        configurable: !0
      });
    }
    function g() {
      var e = i(this.type);
      return b[e] || (b[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function x(e, c, d, T, L, _) {
      var k = d.ref;
      return e = {
        $$typeof: j,
        type: e,
        key: c,
        props: d,
        _owner: T
      }, (k !== void 0 ? k : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: g
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(e, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: L
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: _
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function a(e, c, d, T, L, _) {
      var k = c.children;
      if (k !== void 0)
        if (T)
          if (Y(k)) {
            for (T = 0; T < k.length; T++)
              R(k[T]);
            Object.freeze && Object.freeze(k);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else R(k);
      if (D.call(c, "key")) {
        k = i(e);
        var I = Object.keys(c).filter(function(it) {
          return it !== "key";
        });
        T = 0 < I.length ? "{key: someKey, " + I.join(": ..., ") + ": ...}" : "{key: someKey}", F[k + T] || (I = 0 < I.length ? "{" + I.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          T,
          k,
          I,
          k
        ), F[k + T] = !0);
      }
      if (k = null, d !== void 0 && (r(d), k = "" + d), f(c) && (r(c.key), k = "" + c.key), "key" in c) {
        d = {};
        for (var K in c)
          K !== "key" && (d[K] = c[K]);
      } else d = c;
      return k && l(
        d,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), x(
        e,
        k,
        d,
        o(),
        L,
        _
      );
    }
    function R(e) {
      h(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === P && (e._payload.status === "fulfilled" ? h(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function h(e) {
      return typeof e == "object" && e !== null && e.$$typeof === j;
    }
    var H = A, j = /* @__PURE__ */ Symbol.for("react.transitional.element"), C = /* @__PURE__ */ Symbol.for("react.portal"), u = /* @__PURE__ */ Symbol.for("react.fragment"), O = /* @__PURE__ */ Symbol.for("react.strict_mode"), M = /* @__PURE__ */ Symbol.for("react.profiler"), N = /* @__PURE__ */ Symbol.for("react.consumer"), B = /* @__PURE__ */ Symbol.for("react.context"), X = /* @__PURE__ */ Symbol.for("react.forward_ref"), G = /* @__PURE__ */ Symbol.for("react.suspense"), m = /* @__PURE__ */ Symbol.for("react.suspense_list"), v = /* @__PURE__ */ Symbol.for("react.memo"), P = /* @__PURE__ */ Symbol.for("react.lazy"), W = /* @__PURE__ */ Symbol.for("react.activity"), S = /* @__PURE__ */ Symbol.for("react.client.reference"), p = H.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = Object.prototype.hasOwnProperty, Y = Array.isArray, z = console.createTask ? console.createTask : function() {
      return null;
    };
    H = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var E, b = {}, y = H.react_stack_bottom_frame.bind(
      H,
      s
    )(), w = z(n(s)), F = {};
    V.Fragment = u, V.jsx = function(e, c, d) {
      var T = 1e4 > p.recentlyCreatedOwnerStacks++;
      return a(
        e,
        c,
        d,
        !1,
        T ? Error("react-stack-top-frame") : y,
        T ? z(n(e)) : w
      );
    }, V.jsxs = function(e, c, d) {
      var T = 1e4 > p.recentlyCreatedOwnerStacks++;
      return a(
        e,
        c,
        d,
        !0,
        T ? Error("react-stack-top-frame") : y,
        T ? z(n(e)) : w
      );
    };
  })()), V;
}
var rt;
function ut() {
  return rt || (rt = 1, process.env.NODE_ENV === "production" ? J.exports = ct() : J.exports = lt()), J.exports;
}
var U = ut();
function Z(i) {
  return !i && i !== 0 ? { top: 0, right: 0, bottom: 0, left: 0 } : typeof i == "number" ? { top: i, right: i, bottom: i, left: i } : { top: i.top ?? 0, right: i.right ?? 0, bottom: i.bottom ?? 0, left: i.left ?? 0 };
}
function Q(i) {
  const t = i.replace("#", "");
  if (t.length === 3) {
    const r = parseInt(t[0] + t[0], 16), n = parseInt(t[1] + t[1], 16), o = parseInt(t[2] + t[2], 16);
    return [r, n, o];
  }
  if (t.length === 6) {
    const r = parseInt(t.slice(0, 2), 16), n = parseInt(t.slice(2, 4), 16), o = parseInt(t.slice(4, 6), 16);
    return [r, n, o];
  }
  return null;
}
function ot(i, t = !0) {
  if (i <= 0) return String(i);
  const r = [
    [1e3, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"]
  ];
  let n = i, o = "";
  for (const [s, f] of r)
    for (; n >= s; )
      o += f, n -= s;
  return t ? o : o.toLowerCase();
}
class ht {
  constructor(t = {}) {
    this.cursorX = 0, this.cursorY = 0, this.contentWidth = 0, this.margin = { top: 15, right: 15, bottom: 15, left: 15 }, this.defaultFont = {
      name: void 0,
      style: "normal",
      size: 12
    }, this.defaultColor = "#111827", this.defaultLineHeight = 1.25, this.pendingTasks = /* @__PURE__ */ new Set(), this.opQueue = Promise.resolve(), this.margin = t.margin ?? this.margin, this.defaultFont = {
      name: t.font?.name,
      style: t.font?.style ?? "normal",
      size: t.font?.size ?? 12
    }, this.defaultColor = t.color ?? this.defaultColor, this.defaultLineHeight = t.lineHeight ?? this.defaultLineHeight, this.pdf = new ft({
      unit: t.unit ?? "mm",
      format: t.format ?? "a4",
      orientation: t.orientation ?? "p"
    }), this.pageWidth = this.pdf.internal.pageSize.getWidth(), this.pageHeight = this.pdf.internal.pageSize.getHeight(), this.resetFlowCursor(), this.applyBaseFont();
  }
  get instance() {
    return this.pdf;
  }
  get width() {
    return this.pageWidth;
  }
  get height() {
    return this.pageHeight;
  }
  get contentLeft() {
    return this.margin.left;
  }
  get contentRight() {
    return this.pageWidth - this.margin.right;
  }
  get contentTop() {
    return this.margin.top;
  }
  get contentBottom() {
    return this.pageHeight - this.margin.bottom;
  }
  get contentHeight() {
    return this.contentBottom - this.contentTop;
  }
  get contentAreaWidth() {
    return this.contentWidth;
  }
  get baseFont() {
    return this.defaultFont;
  }
  get baseLineHeight() {
    return this.defaultLineHeight;
  }
  resetFlowCursor() {
    this.cursorX = this.margin.left, this.cursorY = this.margin.top, this.contentWidth = this.pageWidth - this.margin.left - this.margin.right;
  }
  setHeaderFooter(t, r) {
    this.headerDrawer = t, this.footerDrawer = r;
  }
  applyBaseFont() {
    const t = this.defaultFont.name ?? this.pdf.getFont().fontName;
    this.pdf.setFont(t, this.defaultFont.style), this.pdf.setFontSize(this.defaultFont.size);
    const r = Q(this.defaultColor);
    r && this.pdf.setTextColor(...r);
  }
  addPage() {
    this.pdf.addPage(), this.resetFlowCursor();
  }
  ensureSpace(t) {
    this.cursorY + t > this.contentBottom && this.addPage();
  }
  setTextStyle(t) {
    if (t) {
      if (t.fontSize && this.pdf.setFontSize(t.fontSize), t.fontStyle) {
        const r = this.pdf.getFont().fontName;
        this.pdf.setFont(r, t.fontStyle);
      }
      if (t.color) {
        const r = Q(t.color);
        r && this.pdf.setTextColor(...r);
      }
    }
  }
  textRaw(t, r, n, o, s, f = "left") {
    this.setTextStyle(o);
    const l = { align: f };
    typeof s == "number" && (l.maxWidth = s), this.pdf.text(t, r, n, l), this.applyBaseFont();
  }
  box(t, r, n, o, s) {
    const f = s ?? {};
    if (f.fillColor) {
      const l = Q(f.fillColor);
      l && this.pdf.setFillColor(...l), this.pdf.rect(t, r, n, o, "F");
    }
    if (f.borderWidth || f.borderColor) {
      if (f.borderWidth && this.pdf.setLineWidth(f.borderWidth), f.borderColor) {
        const l = Q(f.borderColor);
        l && this.pdf.setDrawColor(...l);
      }
      this.pdf.rect(t, r, n, o), this.pdf.setLineWidth(0.2), this.pdf.setDrawColor(0, 0, 0);
    }
  }
  line(t, r, n, o) {
    this.pdf.line(t, r, n, o);
  }
  async imageFromUrl(t, r = {}) {
    const n = (async () => {
      try {
        const { dataUrl: o, width: s, height: f } = await this.loadImageAsDataURL(t), l = 0.264583, g = s * l, x = f * l;
        let a = r.w, R = r.h;
        a === void 0 && R === void 0 ? (a = g, R = x) : a === void 0 && R !== void 0 ? a = R * (g / x) : R === void 0 && a !== void 0 && (R = a * (x / g));
        const h = a ?? g, H = R ?? x;
        let j = r.x, C = r.y ?? this.cursorY;
        if (r.y === void 0 && C + H > this.contentBottom && (this.addPage(), C = this.cursorY), j === void 0) {
          const u = r.align ?? "left";
          u === "left" ? j = this.contentLeft : u === "center" ? j = (this.contentLeft + this.contentRight) / 2 - h / 2 : u === "right" && (j = this.contentRight - h);
        }
        return this.pdf.addImage(
          o,
          r.mime ?? "PNG",
          j,
          C,
          h,
          H
        ), { width: h, height: H, x: j, y: C };
      } catch (o) {
        return console.error("Failed to load image", t, o), { width: 0, height: 0, x: 0, y: 0 };
      }
    })();
    return this.registerTask(n), n;
  }
  queueOperation(t) {
    const r = this.opQueue.then(async () => {
      try {
        await t();
      } catch (n) {
        console.error("Operation failed", n);
      }
    });
    this.opQueue = r, this.registerTask(r);
  }
  registerTask(t) {
    this.pendingTasks.add(t), t.finally(() => {
      this.pendingTasks.delete(t);
    });
  }
  async waitForTasks() {
    await Promise.all(this.pendingTasks), await this.opQueue;
  }
  loadImageAsDataURL(t) {
    return new Promise((r, n) => {
      const o = new Image();
      o.crossOrigin = "anonymous", o.onload = () => {
        const s = document.createElement("canvas");
        s.width = o.width, s.height = o.height;
        const f = s.getContext("2d");
        if (!f) return n(new Error("Canvas 2D context not available"));
        f.drawImage(o, 0, 0), r({
          dataUrl: s.toDataURL("image/png"),
          width: o.width,
          height: o.height
        });
      }, o.onerror = (s) => n(s), o.src = t;
    });
  }
  paragraph(t, r, n) {
    const o = n ?? this.contentWidth;
    this.setTextStyle(r);
    const s = r?.lineHeight ?? this.defaultLineHeight, f = r?.fontSize ?? this.defaultFont.size, l = f * s * 0.3528, g = this.pdf.splitTextToSize(t, o), x = r?.align ?? "left";
    let a = 0;
    return g.forEach((R) => {
      this.cursorY + l > this.contentBottom && this.addPage();
      const h = this.cursorY + f * 0.3528;
      this.pdf.text(R, this.cursorX, h, { align: x, maxWidth: o }), this.cursorY += l, a += l;
    }), this.cursorY += 1, this.applyBaseFont(), a;
  }
  moveCursor(t, r) {
    this.cursorX += t, this.cursorY += r;
  }
  setCursor(t, r) {
    this.cursorX = t, this.cursorY = r;
  }
  getCursor() {
    return { x: this.cursorX, y: this.cursorY };
  }
  getPageCount() {
    return this.pdf.getNumberOfPages();
  }
  applyHeaderFooter() {
    const t = this.getPageCount();
    if (!(!this.headerDrawer && !this.footerDrawer)) {
      for (let r = 1; r <= t; r++)
        this.pdf.setPage(r), this.headerDrawer && this.headerDrawer(this.pdf, r, t, this), this.footerDrawer && this.footerDrawer(this.pdf, r, t, this);
      this.pdf.setPage(t);
    }
  }
  measureText(t, r, n) {
    this.setTextStyle(r);
    const o = r?.fontSize ?? this.defaultFont.size, s = r?.lineHeight ?? this.defaultLineHeight, f = o * s * 0.3528;
    if (n) {
      const l = this.pdf.splitTextToSize(t, n);
      return {
        width: n,
        height: l.length * f
      };
    } else {
      const l = this.pdf.getTextDimensions(t);
      return { width: l.w, height: l.h };
    }
  }
  setMetadata(t) {
    t.title && this.pdf.setDocumentProperties({ title: t.title }), t.author && this.pdf.setDocumentProperties({ author: t.author }), t.subject && this.pdf.setDocumentProperties({ subject: t.subject }), t.keywords && this.pdf.setDocumentProperties({
      keywords: t.keywords.join(", ")
    });
  }
  save(t) {
    this.applyHeaderFooter(), this.pdf.save(t);
  }
}
const nt = st(null), q = () => {
  const i = at(nt);
  if (!i) throw new Error("usePdf must be used within <PdfDocument>");
  return i;
}, wt = ({
  options: i,
  header: t,
  footer: r,
  pageNumbers: n,
  centerLabel: o,
  metadata: s,
  children: f,
  onReady: l,
  filename: g,
  autoSave: x = !1
}) => {
  const [a] = A.useState(() => new ht(i));
  return A.useEffect(() => {
    s && a.setMetadata(s);
  }, [a, s]), A.useEffect(() => {
    const R = (C, u) => !u || u === "all" ? !0 : u === "first-only" ? C === 1 : u === "except-first" ? C > 1 : Array.isArray(u) ? u.includes(C) : !0, h = (C, u) => u === "roman-upper" ? ot(C, !0) : u === "roman-lower" ? ot(C, !1) : String(C), H = (C, u, O) => {
      if (!n?.enabled || !R(u, n.scope)) return;
      const M = n.preset ?? "page-slash-total", B = (n.template ?? (M === "page-slash-total" ? "Page {page}/{total}" : M === "page-of-total" ? "Page {page} of {total}" : "{page}/{total}")).replace("{page}", h(u, n.format)).replace("{total}", h(O, n.format)), X = n.align ?? "right", G = X === "left" ? a.contentLeft + (n.offsetX ?? 0) : X === "right" ? a.contentRight - (n.offsetX ?? 0) : (a.contentLeft + a.contentRight) / 2 + (n.offsetX ?? 0), m = C === "header" ? 10 : a.height - 7, v = typeof n.y == "number" ? n.y : m;
      a.textRaw(B, G, v, n.style, void 0, X);
    }, j = (C, u, O) => {
      if (!o?.enabled || !R(u, o.scope)) return;
      const M = "center", N = (a.contentLeft + a.contentRight) / 2 + (o.offsetX ?? 0), B = C === "header" ? 10 : a.height - 7, X = typeof o.y == "number" ? o.y : B;
      a.textRaw(
        o.text,
        N,
        X,
        o.style,
        void 0,
        M
      );
    };
    a.setHeaderFooter(
      (C, u, O) => {
        t && t(a, u, O), n?.position === "header" && H("header", u, O), o?.position === "header" && j("header", u);
      },
      (C, u, O) => {
        n?.position === "footer" && H("footer", u, O), r && r(a, u, O), o?.position === "footer" && j("footer", u);
      }
    ), a.waitForTasks().then(() => {
      l?.(a);
    });
  }, []), A.useEffect(() => {
    x && g && a.save(g);
  }, [x, g]), /* @__PURE__ */ U.jsx(nt.Provider, { value: a, children: f });
}, vt = ({
  x: i,
  y: t,
  w: r,
  h: n,
  children: o,
  ...s
}) => {
  const f = q(), l = Z(s.padding), g = {
    top: s.paddingTop ?? l.top,
    right: s.paddingRight ?? l.right,
    bottom: s.paddingBottom ?? l.bottom,
    left: s.paddingLeft ?? l.left
  }, x = A.useRef(
    {}
  ).current;
  return typeof i == "number" && typeof t == "number" && typeof r == "number" && typeof n == "number" ? (A.useEffect(() => {
    f.queueOperation(() => {
      f.box(i, t, r, n, s);
    });
  }, [i, t, r, n]), /* @__PURE__ */ U.jsx(A.Fragment, { children: o })) : (A.useEffect(() => {
    f.queueOperation(() => {
      const a = f.getCursor();
      x.start = { ...a };
      const R = a.x + g.left, h = a.y + g.top;
      f.setCursor(R, h);
    });
  }, []), /* @__PURE__ */ U.jsxs(A.Fragment, { children: [
    o,
    /* @__PURE__ */ U.jsx(dt, { boxState: x, pad: g, style: s })
  ] }));
}, dt = ({ boxState: i, style: t, pad: r }) => {
  const n = q();
  return A.useEffect(() => {
    n.queueOperation(() => {
      const o = i.start;
      if (!o) return;
      const s = n.getCursor(), l = Math.max(s.y - o.y - r.top, 0) + r.top + r.bottom;
      n.box(o.x, o.y, n.contentAreaWidth, l, t), n.setCursor(o.x, o.y + l);
    });
  }, []), null;
}, xt = ({
  src: i,
  x: t,
  y: r,
  w: n,
  h: o,
  mime: s = "PNG",
  flow: f,
  align: l = "left"
}) => {
  const g = q();
  return A.useEffect(() => {
    const x = f === !0 || t === void 0 && r === void 0, a = t, R = r;
    g.queueOperation(async () => {
      const h = await g.imageFromUrl(i, {
        x: a,
        y: R,
        w: n,
        h: o,
        mime: s,
        align: l
      });
      x && h && g.moveCursor(0, h.height + 2);
    });
  }, [i, t, r, n, o, s, f, l]), null;
}, Rt = ({
  items: i,
  ordered: t = !1,
  style: r,
  indent: n = 5,
  markerWidth: o = 5,
  spacing: s = 2
}) => {
  const f = q();
  return A.useEffect(() => {
    f.queueOperation(() => {
      i.forEach((l, g) => {
        const x = t ? `${g + 1}.` : "•", a = f.getCursor().y, R = f.getCursor().x, h = R + n + o, H = r?.fontSize ?? f.baseFont.size, j = a + H * 0.3528;
        f.textRaw(
          x,
          R + n,
          j,
          r,
          o,
          "right"
        ), f.setCursor(h, a);
        const C = f.contentRight - h;
        f.paragraph(l, r, C);
        const u = f.getCursor().y;
        f.setCursor(R, u + s);
      });
    });
  }, [i, t, r, n, o, s]), null;
}, Et = ({
  data: i,
  columns: t,
  width: r = "100%",
  borderWidth: n = 0.1,
  borderColor: o = "#000000",
  cellPadding: s = 2,
  headerStyle: f,
  rowStyle: l,
  alternateRowStyle: g,
  headerHeight: x
}) => {
  const a = q();
  return A.useEffect(() => {
    a.queueOperation(() => {
      const R = typeof r == "number" ? r : parseFloat(r) / 100 * a.contentAreaWidth, h = t.map((m) => typeof m.width == "number" ? m.width : typeof m.width == "string" && m.width.endsWith("%") ? parseFloat(m.width) / 100 * R : 0), H = h.reduce((m, v) => m + v, 0), j = Math.max(0, R - H), C = h.filter((m) => m === 0).length;
      if (C > 0) {
        const m = j / C;
        for (let v = 0; v < h.length; v++)
          h[v] === 0 && (h[v] = m);
      }
      const u = (m, v, P, W, S, p, D = "left", Y = !0) => {
        Y && a.box(v, P, W, S, {
          borderColor: p.borderColor ?? o,
          borderWidth: p.borderWidth ?? n,
          fillColor: p.fillColor
        });
        const z = Z(p.padding ?? s), E = {
          top: p.paddingTop ?? z.top,
          right: p.paddingRight ?? z.right,
          bottom: p.paddingBottom ?? z.bottom,
          left: p.paddingLeft ?? z.left
        }, b = W - E.left - E.right, y = a.instance.splitTextToSize(m, b, p), w = (p.fontSize ?? a.baseFont.size) * (p.lineHeight ?? a.baseLineHeight) * 0.3528, F = (p.fontSize ?? a.baseFont.size) * 0.3528, e = y.length * w, c = S - E.top - E.bottom;
        let d = 0;
        p.verticalAlign === "middle" ? d = Math.max(0, (c - e) / 2) : p.verticalAlign === "bottom" && (d = Math.max(0, c - e));
        let T = P + E.top + d + F;
        const L = p.align ?? D, _ = a.getCursor();
        y.forEach((k) => {
          let I = v + E.left;
          L === "center" ? I = v + W / 2 : L === "right" && (I = v + W - E.right), a.textRaw(k, I, T, p, void 0, L), T += w;
        }), a.setCursor(_.x, _.y);
      };
      let O = a.getCursor().y;
      const M = a.getCursor().x, N = x ?? 10;
      O + N > a.contentBottom && (a.addPage(), O = a.getCursor().y);
      let B = M;
      t.forEach((m, v) => {
        const P = h[v];
        u(
          m.header ?? "",
          B,
          O,
          P,
          N,
          f ?? { fontStyle: "bold" },
          m.align ?? "left"
        ), B += P;
      }), O += N, a.setCursor(M, O);
      const X = (m, v, P) => {
        const W = Z(s), S = {
          top: P.paddingTop ?? W.top,
          right: P.paddingRight ?? W.right,
          bottom: P.paddingBottom ?? W.bottom,
          left: P.paddingLeft ?? W.left
        }, p = v - S.left - S.right;
        return a.measureText(m, P, p).height + S.top + S.bottom;
      };
      new Array(t.length).fill(0), (() => {
        const m = new Array(i.length).fill(0);
        for (let S = 0; S < i.length; S++) {
          const p = i[S];
          let D = 0;
          for (let Y = 0; Y < t.length; Y++) {
            const z = t[Y], E = typeof z.accessor == "function" ? z.accessor(p) : p[z.accessor];
            let b = "", y = l, w = 1, F = 1;
            if (E && typeof E == "object" && E.content !== void 0 ? (b = String(E.content), E.style && (y = E.style), E.colSpan && (w = E.colSpan), E.rowSpan && (F = E.rowSpan)) : b = String(E ?? ""), F > 1) {
              Y += w - 1;
              continue;
            }
            let e = h[Y];
            for (let d = 1; d < w; d++)
              Y + d < h.length && (e += h[Y + d]);
            const c = X(b, e, y ?? {});
            c > D && (D = c), Y += w - 1;
          }
          D < 8 && (D = 8), m[S] = D;
        }
        let v = O;
        const P = new Array(t.length).fill(0), W = a.getCursor().x;
        for (let S = 0; S < i.length; S++) {
          const p = i[S], D = m[S];
          let Y = D;
          for (let b = 0; b < t.length; b++) {
            const y = t[b], w = typeof y.accessor == "function" ? y.accessor(p) : p[y.accessor];
            let F = 1;
            if (w && typeof w == "object" && w.rowSpan && (F = w.rowSpan), F > 1) {
              let e = 0;
              for (let c = 0; c < F; c++)
                S + c < m.length && (e += m[S + c]);
              e > Y && (Y = e);
            }
          }
          const z = Math.abs(v - (a.contentTop + (x ?? 10))) < 1;
          if (v + Y > a.contentBottom && !z && (a.addPage(), v = a.getCursor().y, x !== 0)) {
            let b = W;
            t.forEach((y, w) => {
              const F = h[w];
              u(
                y.header ?? "",
                b,
                v,
                F,
                x ?? 10,
                f ?? { fontStyle: "bold" },
                y.align ?? "left"
              ), b += F;
            }), v += x ?? 10;
          }
          let E = W;
          for (let b = 0; b < t.length; b++) {
            if (P[b] > 0) {
              P[b]--, E += h[b];
              continue;
            }
            const y = t[b], w = typeof y.accessor == "function" ? y.accessor(p) : p[y.accessor];
            let F = 1, e = 1, c = S % 2 === 1 && g ? g : l, d = "";
            w && typeof w == "object" && w.content !== void 0 ? (d = String(w.content), w.colSpan && (F = w.colSpan), w.rowSpan && (e = w.rowSpan), w.style && (c = { ...c, ...w.style })) : d = String(w ?? "");
            let T = h[b];
            for (let _ = 1; _ < F; _++)
              b + _ < h.length && (T += h[b + _]);
            let L = D;
            if (e > 1)
              for (let _ = 1; _ < e; _++)
                S + _ < m.length && (L += m[S + _]);
            if (u(
              d,
              E,
              v,
              T,
              L,
              c ?? {},
              y.align ?? "left",
              !0
            ), e > 1) {
              P[b] = e - 1;
              for (let _ = 1; _ < F; _++)
                b + _ < P.length && (P[b + _] = e - 1);
            }
            E += T, b += F - 1;
          }
          v += D;
        }
        a.setCursor(W, v);
      })();
    });
  }, [i, t, r]), null;
}, Tt = ({
  children: i,
  x: t,
  y: r,
  maxWidth: n,
  spacingBelow: o = 2,
  ...s
}) => {
  const f = q();
  return A.useEffect(() => {
    f.queueOperation(() => {
      if (typeof t == "number" && typeof r == "number")
        f.textRaw(i, t, r, s, n, s.align);
      else {
        f.paragraph(i, s, n);
        const l = f.getCursor();
        f.setCursor(l.x, l.y + o);
      }
    });
  }, [i, t, r, n, o, s.fontSize, s.align]), null;
};
function gt(i) {
  return typeof i == "number" ? { top: i, right: i, bottom: i, left: i } : {
    top: i?.top ?? 0,
    right: i?.right ?? 0,
    bottom: i?.bottom ?? 0,
    left: i?.left ?? 0
  };
}
const Ct = ({ style: i = {}, children: t }) => {
  const r = q(), n = Z(i.padding), o = {
    top: i.paddingTop ?? n.top,
    right: i.paddingRight ?? n.right,
    bottom: i.paddingBottom ?? n.bottom,
    left: i.paddingLeft ?? n.left
  }, s = gt(i.margin), f = {
    top: i.marginTop ?? s.top,
    right: i.marginRight ?? s.right,
    bottom: i.marginBottom ?? s.bottom,
    left: i.marginLeft ?? s.left
  }, l = A.useRef(
    {}
  ).current;
  return A.useEffect(() => {
    r.queueOperation(() => {
      f.top > 0 && r.moveCursor(0, f.top);
      const g = r.getCursor();
      l.start = { ...g }, r.setCursor(g.x + o.left, g.y + o.top);
    });
  }, []), /* @__PURE__ */ U.jsxs(A.Fragment, { children: [
    t,
    /* @__PURE__ */ U.jsx(
      pt,
      {
        viewState: l,
        style: i,
        pad: o,
        margin: f
      }
    )
  ] });
}, pt = ({ viewState: i, style: t, pad: r, margin: n }) => {
  const o = q();
  return A.useEffect(() => {
    o.queueOperation(() => {
      const s = i.start;
      if (!s) return;
      const f = o.getCursor();
      let g = Math.max(f.y - s.y - r.top, 0) + r.top + r.bottom;
      t.height && (g = t.height);
      let x = o.contentAreaWidth;
      typeof t.width == "number" && (x = t.width), (t.borderColor || t.fillColor || t.borderWidth) && o.box(s.x, s.y, x, g, t);
      const a = s.y + g + n.bottom;
      o.setCursor(s.x, a);
    });
  }, []), null;
};
export {
  vt as PdfBox,
  wt as PdfDocument,
  xt as PdfImage,
  Rt as PdfList,
  ht as PdfRenderer,
  Et as PdfTable,
  Tt as PdfText,
  Ct as PdfView
};
