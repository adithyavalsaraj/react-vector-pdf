import O, { createContext as st, useContext as it } from "react";
import { jsPDF as at } from "jspdf";
var W = { exports: {} }, j = {};
var Z;
function ft() {
  if (Z) return j;
  Z = 1;
  var f = /* @__PURE__ */ Symbol.for("react.transitional.element"), e = /* @__PURE__ */ Symbol.for("react.fragment");
  function r(n, o, a) {
    var s = null;
    if (a !== void 0 && (s = "" + a), o.key !== void 0 && (s = "" + o.key), "key" in o) {
      a = {};
      for (var i in o)
        i !== "key" && (a[i] = o[i]);
    } else a = o;
    return o = a.ref, {
      $$typeof: f,
      type: n,
      key: s,
      ref: o !== void 0 ? o : null,
      props: a
    };
  }
  return j.Fragment = e, j.jsx = r, j.jsxs = r, j;
}
var D = {};
var Q;
function ct() {
  return Q || (Q = 1, process.env.NODE_ENV !== "production" && (function() {
    function f(t) {
      if (t == null) return null;
      if (typeof t == "function")
        return t.$$typeof === rt ? null : t.displayName || t.name || null;
      if (typeof t == "string") return t;
      switch (t) {
        case u:
          return "Fragment";
        case P:
          return "Profiler";
        case g:
          return "StrictMode";
        case w:
          return "Suspense";
        case y:
          return "SuspenseList";
        case N:
          return "Activity";
      }
      if (typeof t == "object")
        switch (typeof t.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), t.$$typeof) {
          case d:
            return "Portal";
          case T:
            return t.displayName || "Context";
          case S:
            return (t._context.displayName || "Context") + ".Consumer";
          case _:
            var c = t.render;
            return t = t.displayName, t || (t = c.displayName || c.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
          case A:
            return c = t.displayName || null, c !== null ? c : f(t.type) || "Memo";
          case k:
            c = t._payload, t = t._init;
            try {
              return f(t(c));
            } catch {
            }
        }
      return null;
    }
    function e(t) {
      return "" + t;
    }
    function r(t) {
      try {
        e(t);
        var c = !1;
      } catch {
        c = !0;
      }
      if (c) {
        c = console;
        var p = c.error, x = typeof Symbol == "function" && Symbol.toStringTag && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return p.call(
          c,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          x
        ), e(t);
      }
    }
    function n(t) {
      if (t === u) return "<>";
      if (typeof t == "object" && t !== null && t.$$typeof === k)
        return "<...>";
      try {
        var c = f(t);
        return c ? "<" + c + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function o() {
      var t = L.A;
      return t === null ? null : t.getOwner();
    }
    function a() {
      return Error("react-stack-top-frame");
    }
    function s(t) {
      if (U.call(t, "key")) {
        var c = Object.getOwnPropertyDescriptor(t, "key").get;
        if (c && c.isReactWarning) return !1;
      }
      return t.key !== void 0;
    }
    function i(t, c) {
      function p() {
        B || (B = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          c
        ));
      }
      p.isReactWarning = !0, Object.defineProperty(t, "key", {
        get: p,
        configurable: !0
      });
    }
    function h() {
      var t = f(this.type);
      return V[t] || (V[t] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), t = this.props.ref, t !== void 0 ? t : null;
    }
    function R(t, c, p, x, I, M) {
      var E = p.ref;
      return t = {
        $$typeof: C,
        type: t,
        key: c,
        props: p,
        _owner: x
      }, (E !== void 0 ? E : null) !== null ? Object.defineProperty(t, "ref", {
        enumerable: !1,
        get: h
      }) : Object.defineProperty(t, "ref", { enumerable: !1, value: null }), t._store = {}, Object.defineProperty(t._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(t, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(t, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: I
      }), Object.defineProperty(t, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: M
      }), Object.freeze && (Object.freeze(t.props), Object.freeze(t)), t;
    }
    function l(t, c, p, x, I, M) {
      var E = c.children;
      if (E !== void 0)
        if (x)
          if (ot(E)) {
            for (x = 0; x < E.length; x++)
              m(E[x]);
            Object.freeze && Object.freeze(E);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else m(E);
      if (U.call(c, "key")) {
        E = f(t);
        var F = Object.keys(c).filter(function(nt) {
          return nt !== "key";
        });
        x = 0 < F.length ? "{key: someKey, " + F.join(": ..., ") + ": ...}" : "{key: someKey}", q[E + x] || (F = 0 < F.length ? "{" + F.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          x,
          E,
          F,
          E
        ), q[E + x] = !0);
      }
      if (E = null, p !== void 0 && (r(p), E = "" + p), s(c) && (r(c.key), E = "" + c.key), "key" in c) {
        p = {};
        for (var $ in c)
          $ !== "key" && (p[$] = c[$]);
      } else p = c;
      return E && i(
        p,
        typeof t == "function" ? t.displayName || t.name || "Unknown" : t
      ), R(
        t,
        E,
        p,
        o(),
        I,
        M
      );
    }
    function m(t) {
      v(t) ? t._store && (t._store.validated = 1) : typeof t == "object" && t !== null && t.$$typeof === k && (t._payload.status === "fulfilled" ? v(t._payload.value) && t._payload.value._store && (t._payload.value._store.validated = 1) : t._store && (t._store.validated = 1));
    }
    function v(t) {
      return typeof t == "object" && t !== null && t.$$typeof === C;
    }
    var b = O, C = /* @__PURE__ */ Symbol.for("react.transitional.element"), d = /* @__PURE__ */ Symbol.for("react.portal"), u = /* @__PURE__ */ Symbol.for("react.fragment"), g = /* @__PURE__ */ Symbol.for("react.strict_mode"), P = /* @__PURE__ */ Symbol.for("react.profiler"), S = /* @__PURE__ */ Symbol.for("react.consumer"), T = /* @__PURE__ */ Symbol.for("react.context"), _ = /* @__PURE__ */ Symbol.for("react.forward_ref"), w = /* @__PURE__ */ Symbol.for("react.suspense"), y = /* @__PURE__ */ Symbol.for("react.suspense_list"), A = /* @__PURE__ */ Symbol.for("react.memo"), k = /* @__PURE__ */ Symbol.for("react.lazy"), N = /* @__PURE__ */ Symbol.for("react.activity"), rt = /* @__PURE__ */ Symbol.for("react.client.reference"), L = b.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = Object.prototype.hasOwnProperty, ot = Array.isArray, X = console.createTask ? console.createTask : function() {
      return null;
    };
    b = {
      react_stack_bottom_frame: function(t) {
        return t();
      }
    };
    var B, V = {}, G = b.react_stack_bottom_frame.bind(
      b,
      a
    )(), J = X(n(a)), q = {};
    D.Fragment = u, D.jsx = function(t, c, p) {
      var x = 1e4 > L.recentlyCreatedOwnerStacks++;
      return l(
        t,
        c,
        p,
        !1,
        x ? Error("react-stack-top-frame") : G,
        x ? X(n(t)) : J
      );
    }, D.jsxs = function(t, c, p) {
      var x = 1e4 > L.recentlyCreatedOwnerStacks++;
      return l(
        t,
        c,
        p,
        !0,
        x ? Error("react-stack-top-frame") : G,
        x ? X(n(t)) : J
      );
    };
  })()), D;
}
var K;
function ut() {
  return K || (K = 1, process.env.NODE_ENV === "production" ? W.exports = ft() : W.exports = ct()), W.exports;
}
var z = ut();
function lt(f) {
  return !f && f !== 0 ? { top: 0, right: 0, bottom: 0, left: 0 } : typeof f == "number" ? { top: f, right: f, bottom: f, left: f } : { top: f.top ?? 0, right: f.right ?? 0, bottom: f.bottom ?? 0, left: f.left ?? 0 };
}
function H(f) {
  const e = f.replace("#", "");
  if (e.length === 3) {
    const r = parseInt(e[0] + e[0], 16), n = parseInt(e[1] + e[1], 16), o = parseInt(e[2] + e[2], 16);
    return [r, n, o];
  }
  if (e.length === 6) {
    const r = parseInt(e.slice(0, 2), 16), n = parseInt(e.slice(2, 4), 16), o = parseInt(e.slice(4, 6), 16);
    return [r, n, o];
  }
  return null;
}
function tt(f, e = !0) {
  if (f <= 0) return String(f);
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
  let n = f, o = "";
  for (const [a, s] of r)
    for (; n >= a; )
      o += s, n -= a;
  return e ? o : o.toLowerCase();
}
class ht {
  constructor(e = {}) {
    this.cursorX = 0, this.cursorY = 0, this.contentWidth = 0, this.margin = { top: 15, right: 15, bottom: 15, left: 15 }, this.defaultFont = {
      name: void 0,
      style: "normal",
      size: 12
    }, this.defaultColor = "#111827", this.defaultLineHeight = 1.25, this.margin = e.margin ?? this.margin, this.defaultFont = {
      name: e.font?.name,
      style: e.font?.style ?? "normal",
      size: e.font?.size ?? 12
    }, this.defaultColor = e.color ?? this.defaultColor, this.defaultLineHeight = e.lineHeight ?? this.defaultLineHeight, this.pdf = new at({
      unit: e.unit ?? "mm",
      format: e.format ?? "a4",
      orientation: e.orientation ?? "p"
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
  resetFlowCursor() {
    this.cursorX = this.margin.left, this.cursorY = this.margin.top, this.contentWidth = this.pageWidth - this.margin.left - this.margin.right;
  }
  setHeaderFooter(e, r) {
    this.headerDrawer = e, this.footerDrawer = r;
  }
  applyBaseFont() {
    const e = this.defaultFont.name ?? this.pdf.getFont().fontName;
    this.pdf.setFont(e, this.defaultFont.style), this.pdf.setFontSize(this.defaultFont.size);
    const r = H(this.defaultColor);
    r && this.pdf.setTextColor(...r);
  }
  addPage() {
    this.pdf.addPage(), this.resetFlowCursor();
  }
  ensureSpace(e) {
    this.cursorY + e > this.contentBottom && this.addPage();
  }
  setTextStyle(e) {
    if (e) {
      if (e.fontSize && this.pdf.setFontSize(e.fontSize), e.fontStyle) {
        const r = this.pdf.getFont().fontName;
        this.pdf.setFont(r, e.fontStyle);
      }
      if (e.color) {
        const r = H(e.color);
        r && this.pdf.setTextColor(...r);
      }
    }
  }
  textRaw(e, r, n, o, a, s = "left") {
    this.setTextStyle(o);
    const i = { align: s };
    typeof a == "number" && (i.maxWidth = a), this.pdf.text(e, r, n, i), this.applyBaseFont();
  }
  box(e, r, n, o, a) {
    const s = a ?? {};
    if (s.fillColor) {
      const i = H(s.fillColor);
      i && this.pdf.setFillColor(...i), this.pdf.rect(e, r, n, o, "F");
    }
    if (s.borderWidth || s.borderColor) {
      if (s.borderWidth && this.pdf.setLineWidth(s.borderWidth), s.borderColor) {
        const i = H(s.borderColor);
        i && this.pdf.setDrawColor(...i);
      }
      this.pdf.rect(e, r, n, o), this.pdf.setLineWidth(0.2), this.pdf.setDrawColor(0, 0, 0);
    }
  }
  line(e, r, n, o) {
    this.pdf.line(e, r, n, o);
  }
  async imageFromUrl(e, r, n, o, a, s = "PNG") {
    const i = await this.loadImageAsDataURL(e);
    this.pdf.addImage(i, s, r, n, o, a);
  }
  loadImageAsDataURL(e) {
    return new Promise((r, n) => {
      const o = new Image();
      o.crossOrigin = "anonymous", o.onload = () => {
        const a = document.createElement("canvas");
        a.width = o.width, a.height = o.height;
        const s = a.getContext("2d");
        if (!s) return n(new Error("Canvas 2D context not available"));
        s.drawImage(o, 0, 0), r(a.toDataURL("image/png"));
      }, o.onerror = (a) => n(a), o.src = e;
    });
  }
  paragraph(e, r, n) {
    const o = n ?? this.contentWidth;
    this.setTextStyle(r);
    const a = r?.lineHeight ?? this.defaultLineHeight, s = r?.fontSize ?? this.defaultFont.size, i = s * a * 0.3528, h = this.pdf.splitTextToSize(e, o), R = h.length * i;
    this.ensureSpace(R);
    const l = r?.align ?? "left";
    return h.forEach((m, v) => {
      const b = this.cursorY + v * i + s * 0.3528;
      this.pdf.text(m, this.cursorX, b, { align: l, maxWidth: o });
    }), this.cursorY += R + 1, this.applyBaseFont(), R;
  }
  moveCursor(e, r) {
    this.cursorX += e, this.cursorY += r;
  }
  setCursor(e, r) {
    this.cursorX = e, this.cursorY = r;
  }
  getCursor() {
    return { x: this.cursorX, y: this.cursorY };
  }
  getPageCount() {
    return this.pdf.getNumberOfPages();
  }
  applyHeaderFooter() {
    const e = this.getPageCount();
    if (!(!this.headerDrawer && !this.footerDrawer)) {
      for (let r = 1; r <= e; r++)
        this.pdf.setPage(r), this.headerDrawer && this.headerDrawer(this.pdf, r, e, this), this.footerDrawer && this.footerDrawer(this.pdf, r, e, this);
      this.pdf.setPage(e);
    }
  }
  measureText(e, r, n) {
    this.setTextStyle(r);
    const o = r?.fontSize ?? this.defaultFont.size, a = r?.lineHeight ?? this.defaultLineHeight, s = o * a * 0.3528;
    if (n) {
      const i = this.pdf.splitTextToSize(e, n);
      return {
        width: n,
        height: i.length * s + o * 0.3528 / 2
        // padding
      };
    } else {
      const i = this.pdf.getTextDimensions(e);
      return { width: i.w, height: i.h };
    }
  }
  setMetadata(e) {
    e.title && this.pdf.setDocumentProperties({ title: e.title }), e.author && this.pdf.setDocumentProperties({ author: e.author }), e.subject && this.pdf.setDocumentProperties({ subject: e.subject }), e.keywords && this.pdf.setDocumentProperties({
      keywords: e.keywords.join(", ")
    });
  }
  save(e) {
    this.applyHeaderFooter(), this.pdf.save(e);
  }
}
const et = st(null), Y = () => {
  const f = it(et);
  if (!f) throw new Error("usePdf must be used within <PdfDocument>");
  return f;
}, pt = ({
  options: f,
  header: e,
  footer: r,
  pageNumbers: n,
  centerLabel: o,
  metadata: a,
  children: s,
  onReady: i,
  filename: h,
  autoSave: R = !1
}) => {
  const [l] = O.useState(() => new ht(f));
  return O.useEffect(() => {
    a && l.setMetadata(a);
  }, [l, a]), O.useEffect(() => {
    const m = (d, u) => !u || u === "all" ? !0 : u === "first-only" ? d === 1 : u === "except-first" ? d > 1 : Array.isArray(u) ? u.includes(d) : !0, v = (d, u) => u === "roman-upper" ? tt(d, !0) : u === "roman-lower" ? tt(d, !1) : String(d), b = (d, u, g) => {
      if (!n?.enabled || !m(u, n.scope)) return;
      const P = n.preset ?? "page-slash-total", T = (n.template ?? (P === "page-slash-total" ? "Page {page}/{total}" : P === "page-of-total" ? "Page {page} of {total}" : "{page}/{total}")).replace("{page}", v(u, n.format)).replace("{total}", v(g, n.format)), _ = n.align ?? "right", w = _ === "left" ? l.contentLeft + (n.offsetX ?? 0) : _ === "right" ? l.contentRight - (n.offsetX ?? 0) : (l.contentLeft + l.contentRight) / 2 + (n.offsetX ?? 0), y = d === "header" ? 10 : l.height - 7, A = typeof n.y == "number" ? n.y : y;
      l.textRaw(T, w, A, n.style, void 0, _);
    }, C = (d, u, g) => {
      if (!o?.enabled || !m(u, o.scope)) return;
      const P = "center", S = (l.contentLeft + l.contentRight) / 2 + (o.offsetX ?? 0), T = d === "header" ? 10 : l.height - 7, _ = typeof o.y == "number" ? o.y : T;
      l.textRaw(
        o.text,
        S,
        _,
        o.style,
        void 0,
        P
      );
    };
    l.setHeaderFooter(
      (d, u, g) => {
        e && e(l, u, g), n?.position === "header" && b("header", u, g), o?.position === "header" && C("header", u);
      },
      (d, u, g) => {
        n?.position === "footer" && b("footer", u, g), r && r(l, u, g), o?.position === "footer" && C("footer", u);
      }
    ), i?.(l);
  }, []), O.useEffect(() => {
    R && h && l.save(h);
  }, [R, h]), /* @__PURE__ */ z.jsx(et.Provider, { value: l, children: s });
}, mt = ({ children: f, x: e, y: r, maxWidth: n, spacingBelow: o = 2, ...a }) => {
  const s = Y();
  if (typeof e == "number" && typeof r == "number")
    s.textRaw(f, e, r, a, n, a.align);
  else {
    s.paragraph(f, a, n);
    const i = s.getCursor();
    s.setCursor(i.x, i.y + o);
  }
  return null;
}, bt = ({ x: f, y: e, w: r, h: n, children: o, ...a }) => {
  const s = Y(), i = lt(a.padding);
  if (typeof f == "number" && typeof e == "number" && typeof r == "number" && typeof n == "number")
    return s.box(f, e, r, n, a), null;
  const h = s.getCursor(), R = h.x + i.left, l = h.y + i.top;
  s.contentAreaWidth - i.left - i.right, s.setCursor(R, l);
  const m = s.getCursor().y, v = ({ children: b }) => /* @__PURE__ */ z.jsx(z.Fragment, { children: b });
  return /* @__PURE__ */ z.jsxs(v, { children: [
    o,
    (() => {
      const b = s.getCursor(), d = Math.max(b.y - m, 0) + i.top + i.bottom;
      return s.box(h.x, h.y, s.contentAreaWidth, d, a), s.setCursor(h.x, h.y + d), null;
    })()
  ] });
}, xt = ({
  src: f,
  x: e,
  y: r,
  w: n,
  h: o,
  mime: a = "PNG",
  flow: s = !1
}) => {
  const i = Y();
  return O.useEffect(() => {
    let h = r;
    s && (h = i.getCursor().y), i.imageFromUrl(f, e, h, n, o, a).then(() => {
      s && i.moveCursor(0, o + 2);
    }).catch(console.error);
  }, [f, e, r, n, o, a, s]), null;
}, Et = ({
  columns: f,
  data: e,
  rowHeight: r = 8,
  headerStyle: n,
  cellStyle: o,
  zebra: a = !0,
  topGap: s = 2
}) => {
  const i = Y(), h = 1, R = 1, l = i.getCursor();
  i.setCursor(l.x, l.y + s);
  let m = i.getCursor().x;
  const v = i.getCursor().y;
  let b = 0;
  f.forEach((g) => {
    b += g.width;
  });
  const C = r;
  n?.fillColor && i.box(m, v, b, C, n);
  let d = m;
  f.forEach((g) => {
    i.textRaw(
      String(g.header),
      d + h,
      v + R + 3,
      // approx baseline shift
      n,
      g.width - h * 2,
      g.align ?? "left"
    ), i.box(d, v, g.width, C, {
      ...n,
      borderWidth: 0.2,
      fillColor: void 0
    }), d += g.width;
  });
  let u = v + C;
  return e.forEach((g, P) => {
    let S = 0;
    f.forEach((w) => {
      const y = g[w.key] ? String(g[w.key]) : "";
      if (!y) return;
      const A = w.width - h * 2, k = i.measureText(y, o, A);
      k.height > S && (S = k.height);
    });
    const T = Math.max(
      r,
      S + R * 2
    );
    u + T > i.contentBottom && (i.addPage(), m = i.contentLeft, u = i.contentTop), a && P % 2 === 1 && i.box(m, u, b, T, { fillColor: "#f5f5f5" });
    let _ = m;
    f.forEach((w) => {
      const y = g[w.key];
      if (y) {
        const A = _ + h, k = o?.fontSize ?? 12, N = u + R + k * 0.75;
        i.textRaw(
          String(y),
          A,
          N,
          o,
          w.width - h * 2,
          w.align ?? "left"
        );
      }
      i.box(_, u, w.width, T, { borderWidth: 0.2 }), _ += w.width;
    }), u += T;
  }), i.setCursor(m, u + 1), null;
}, Rt = ({
  items: f,
  ordered: e = !1,
  style: r,
  indent: n = 5,
  markerWidth: o = 5,
  spacing: a = 2
}) => {
  const s = Y();
  return f.forEach((i, h) => {
    const R = e ? `${h + 1}.` : "•", l = s.getCursor().y, m = s.getCursor().x + n + o;
    s.textRaw(
      R,
      s.getCursor().x + n,
      l,
      r,
      o,
      "right"
    );
    const v = s.getCursor().x;
    s.setCursor(m, l);
    const b = s.contentRight - m;
    s.paragraph(i, r, b);
    const C = s.getCursor().y;
    s.setCursor(v, C + a);
  }), null;
};
export {
  bt as PdfBox,
  pt as PdfDocument,
  xt as PdfImage,
  Rt as PdfList,
  ht as PdfRenderer,
  Et as PdfTable,
  mt as PdfText
};
