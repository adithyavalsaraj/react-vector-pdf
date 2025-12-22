import A, { createContext as at, useContext as ft, useState as ct } from "react";
import { jsPDF as tt } from "jspdf";
var Q = { exports: {} }, $ = {};
var et;
function lt() {
  if (et) return $;
  et = 1;
  var i = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function r(n, o, s) {
    var a = null;
    if (s !== void 0 && (a = "" + s), o.key !== void 0 && (a = "" + o.key), "key" in o) {
      s = {};
      for (var c in o)
        c !== "key" && (s[c] = o[c]);
    } else s = o;
    return o = s.ref, {
      $$typeof: i,
      type: n,
      key: a,
      ref: o !== void 0 ? o : null,
      props: s
    };
  }
  return $.Fragment = t, $.jsx = r, $.jsxs = r, $;
}
var V = {};
var rt;
function ut() {
  return rt || (rt = 1, process.env.NODE_ENV !== "production" && (function() {
    function i(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === S ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case h:
          return "Fragment";
        case X:
          return "Profiler";
        case O:
          return "StrictMode";
        case J:
          return "Suspense";
        case b:
          return "SuspenseList";
        case W:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case E:
            return "Portal";
          case U:
            return e.displayName || "Context";
          case N:
            return (e._context.displayName || "Context") + ".Consumer";
          case B:
            var l = e.render;
            return e = e.displayName, e || (e = l.displayName || l.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case R:
            return l = e.displayName || null, l !== null ? l : i(e.type) || "Memo";
          case P:
            l = e._payload, e = e._init;
            try {
              return i(e(l));
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
        var l = !1;
      } catch {
        l = !0;
      }
      if (l) {
        l = console;
        var g = l.error, C = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return g.call(
          l,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          C
        ), t(e);
      }
    }
    function n(e) {
      if (e === h) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === P)
        return "<...>";
      try {
        var l = i(e);
        return l ? "<" + l + ">" : "<...>";
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
    function a(e) {
      if (D.call(e, "key")) {
        var l = Object.getOwnPropertyDescriptor(e, "key").get;
        if (l && l.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function c(e, l) {
      function g() {
        T || (T = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          l
        ));
      }
      g.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: g,
        configurable: !0
      });
    }
    function u() {
      var e = i(this.type);
      return w[e] || (w[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function m(e, l, g, C, L, _) {
      var y = g.ref;
      return e = {
        $$typeof: j,
        type: e,
        key: l,
        props: g,
        _owner: C
      }, (y !== void 0 ? y : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: u
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
    function f(e, l, g, C, L, _) {
      var y = l.children;
      if (y !== void 0)
        if (C)
          if (Y(y)) {
            for (C = 0; C < y.length; C++)
              x(y[C]);
            Object.freeze && Object.freeze(y);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else x(y);
      if (D.call(l, "key")) {
        y = i(e);
        var M = Object.keys(l).filter(function(st) {
          return st !== "key";
        });
        C = 0 < M.length ? "{key: someKey, " + M.join(": ..., ") + ": ...}" : "{key: someKey}", F[y + C] || (M = 0 < M.length ? "{" + M.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          C,
          y,
          M,
          y
        ), F[y + C] = !0);
      }
      if (y = null, g !== void 0 && (r(g), y = "" + g), a(l) && (r(l.key), y = "" + l.key), "key" in l) {
        g = {};
        for (var K in l)
          K !== "key" && (g[K] = l[K]);
      } else g = l;
      return y && c(
        g,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), m(
        e,
        y,
        g,
        o(),
        L,
        _
      );
    }
    function x(e) {
      d(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === P && (e._payload.status === "fulfilled" ? d(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function d(e) {
      return typeof e == "object" && e !== null && e.$$typeof === j;
    }
    var H = A, j = /* @__PURE__ */ Symbol.for("react.transitional.element"), E = /* @__PURE__ */ Symbol.for("react.portal"), h = /* @__PURE__ */ Symbol.for("react.fragment"), O = /* @__PURE__ */ Symbol.for("react.strict_mode"), X = /* @__PURE__ */ Symbol.for("react.profiler"), N = /* @__PURE__ */ Symbol.for("react.consumer"), U = /* @__PURE__ */ Symbol.for("react.context"), B = /* @__PURE__ */ Symbol.for("react.forward_ref"), J = /* @__PURE__ */ Symbol.for("react.suspense"), b = /* @__PURE__ */ Symbol.for("react.suspense_list"), R = /* @__PURE__ */ Symbol.for("react.memo"), P = /* @__PURE__ */ Symbol.for("react.lazy"), W = /* @__PURE__ */ Symbol.for("react.activity"), S = /* @__PURE__ */ Symbol.for("react.client.reference"), p = H.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = Object.prototype.hasOwnProperty, Y = Array.isArray, z = console.createTask ? console.createTask : function() {
      return null;
    };
    H = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var T, w = {}, k = H.react_stack_bottom_frame.bind(
      H,
      s
    )(), v = z(n(s)), F = {};
    V.Fragment = h, V.jsx = function(e, l, g) {
      var C = 1e4 > p.recentlyCreatedOwnerStacks++;
      return f(
        e,
        l,
        g,
        !1,
        C ? Error("react-stack-top-frame") : k,
        C ? z(n(e)) : v
      );
    }, V.jsxs = function(e, l, g) {
      var C = 1e4 > p.recentlyCreatedOwnerStacks++;
      return f(
        e,
        l,
        g,
        !0,
        C ? Error("react-stack-top-frame") : k,
        C ? z(n(e)) : v
      );
    };
  })()), V;
}
var ot;
function ht() {
  return ot || (ot = 1, process.env.NODE_ENV === "production" ? Q.exports = lt() : Q.exports = ut()), Q.exports;
}
var I = ht();
function Z(i) {
  return !i && i !== 0 ? { top: 0, right: 0, bottom: 0, left: 0 } : typeof i == "number" ? { top: i, right: i, bottom: i, left: i } : { top: i.top ?? 0, right: i.right ?? 0, bottom: i.bottom ?? 0, left: i.left ?? 0 };
}
function G(i) {
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
function nt(i, t = !0) {
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
  for (const [s, a] of r)
    for (; n >= s; )
      o += a, n -= s;
  return t ? o : o.toLowerCase();
}
class dt {
  constructor(t = {}) {
    this.cursorX = 0, this.cursorY = 0, this.contentWidth = 0, this.margin = { top: 15, right: 15, bottom: 15, left: 15 }, this.defaultFont = {
      name: void 0,
      style: "normal",
      size: 12
    }, this.defaultColor = "#111827", this.defaultLineHeight = 1.25, this.pendingTasks = /* @__PURE__ */ new Set(), this.opQueue = Promise.resolve(), this.generation = 0, this.options = t, this.margin = t.margin ?? this.margin, this.defaultFont = {
      name: t.font?.name,
      style: t.font?.style ?? "normal",
      size: t.font?.size ?? 12
    }, this.defaultColor = t.color ?? this.defaultColor, this.defaultLineHeight = t.lineHeight ?? this.defaultLineHeight, this.pdf = new tt({
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
  reset() {
    if (this.pdf = new tt({
      unit: this.options.unit ?? "mm",
      format: this.options.format ?? "a4",
      orientation: this.options.orientation ?? "p"
    }), this.generation++, this.cursorX = 0, this.cursorY = 0, this.pendingTasks = /* @__PURE__ */ new Set(), this.opQueue = Promise.resolve(), this.resetFlowCursor(), this.applyBaseFont(), this.options.color) {
      const t = G(this.options.color);
      t && this.pdf.setTextColor(...t);
    }
  }
  setHeaderFooter(t, r) {
    this.headerDrawer = t, this.footerDrawer = r;
  }
  applyBaseFont() {
    const t = this.defaultFont.name ?? this.pdf.getFont().fontName;
    this.pdf.setFont(t, this.defaultFont.style), this.pdf.setFontSize(this.defaultFont.size);
    const r = G(this.defaultColor);
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
        const r = G(t.color);
        r && this.pdf.setTextColor(...r);
      }
    }
  }
  textRaw(t, r, n, o, s, a = "left") {
    this.setTextStyle(o);
    const c = { align: a };
    typeof s == "number" && (c.maxWidth = s), this.pdf.text(t, r, n, c), this.applyBaseFont();
  }
  box(t, r, n, o, s) {
    const a = s ?? {};
    if (a.fillColor) {
      const c = G(a.fillColor);
      c && this.pdf.setFillColor(...c), this.pdf.rect(t, r, n, o, "F");
    }
    if (a.borderWidth || a.borderColor) {
      if (a.borderWidth && this.pdf.setLineWidth(a.borderWidth), a.borderColor) {
        const c = G(a.borderColor);
        c && this.pdf.setDrawColor(...c);
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
        const { dataUrl: o, width: s, height: a } = await this.loadImageAsDataURL(t), c = 0.264583, u = s * c, m = a * c;
        let f = r.w, x = r.h;
        f === void 0 && x === void 0 ? (f = u, x = m) : f === void 0 && x !== void 0 ? f = x * (u / m) : x === void 0 && f !== void 0 && (x = f * (m / u));
        const d = f ?? u, H = x ?? m;
        let j = r.x, E = r.y ?? this.cursorY;
        if (r.y === void 0 && E + H > this.contentBottom && (this.addPage(), E = this.cursorY), j === void 0) {
          const h = r.align ?? "left";
          h === "left" ? j = this.contentLeft : h === "center" ? j = (this.contentLeft + this.contentRight) / 2 - d / 2 : h === "right" && (j = this.contentRight - d);
        }
        return this.pdf.addImage(
          o,
          r.mime ?? "PNG",
          j,
          E,
          d,
          H
        ), { width: d, height: H, x: j, y: E };
      } catch (o) {
        return console.error("Failed to load image", t, o), { width: 0, height: 0, x: 0, y: 0 };
      }
    })();
    return this.registerTask(n), n;
  }
  queueOperation(t) {
    const r = this.generation, n = this.opQueue.then(async () => {
      if (this.generation === r)
        try {
          await t();
        } catch (o) {
          console.error("Operation failed", o);
        }
    });
    this.opQueue = n, this.registerTask(n);
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
        const a = s.getContext("2d");
        if (!a) return n(new Error("Canvas 2D context not available"));
        a.drawImage(o, 0, 0), r({
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
    const s = r?.lineHeight ?? this.defaultLineHeight, a = r?.fontSize ?? this.defaultFont.size, c = a * s * 0.3528, u = this.pdf.splitTextToSize(t, o), m = r?.align ?? "left";
    let f = 0;
    return u.forEach((x) => {
      this.cursorY + c > this.contentBottom && this.addPage();
      const d = this.cursorY + a * 0.3528;
      this.pdf.text(x, this.cursorX, d, { align: m, maxWidth: o }), this.cursorY += c, f += c;
    }), this.cursorY += 1, this.applyBaseFont(), f;
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
    const o = r?.fontSize ?? this.defaultFont.size, s = r?.lineHeight ?? this.defaultLineHeight, a = o * s * 0.3528;
    if (n) {
      const c = this.pdf.splitTextToSize(t, n);
      return {
        width: n,
        height: c.length * a
      };
    } else {
      const c = this.pdf.getTextDimensions(t);
      return { width: c.w, height: c.h };
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
  getBlobUrl() {
    return this.applyHeaderFooter(), this.pdf.output("bloburl");
  }
}
const it = at(null), q = () => {
  const i = ft(it);
  if (!i) throw new Error("usePdf must be used within <PdfDocument>");
  return i;
}, gt = ({
  options: i,
  header: t,
  footer: r,
  pageNumbers: n,
  centerLabel: o,
  metadata: s,
  children: a,
  onReady: c,
  filename: u,
  autoSave: m = !1
}) => {
  const f = A.useMemo(() => new dt(i), [i]);
  return A.useEffect(() => {
    s && f.setMetadata(s);
  }, [f, s]), A.useEffect(() => {
    const x = (E, h) => !h || h === "all" ? !0 : h === "first-only" ? E === 1 : h === "except-first" ? E > 1 : Array.isArray(h) ? h.includes(E) : !0, d = (E, h) => h === "roman-upper" ? nt(E, !0) : h === "roman-lower" ? nt(E, !1) : String(E), H = (E, h, O) => {
      if (!n?.enabled || !x(h, n.scope)) return;
      const X = n.preset ?? "page-slash-total", U = (n.template ?? (X === "page-slash-total" ? "Page {page}/{total}" : X === "page-of-total" ? "Page {page} of {total}" : "{page}/{total}")).replace("{page}", d(h, n.format)).replace("{total}", d(O, n.format)), B = n.align ?? "right", J = B === "left" ? f.contentLeft + (n.offsetX ?? 0) : B === "right" ? f.contentRight - (n.offsetX ?? 0) : (f.contentLeft + f.contentRight) / 2 + (n.offsetX ?? 0), b = E === "header" ? 10 : f.height - 7, R = typeof n.y == "number" ? n.y : b;
      f.textRaw(U, J, R, n.style, void 0, B);
    }, j = (E, h, O) => {
      if (!o?.enabled || !x(h, o.scope)) return;
      const X = "center", N = (f.contentLeft + f.contentRight) / 2 + (o.offsetX ?? 0), U = E === "header" ? 10 : f.height - 7, B = typeof o.y == "number" ? o.y : U;
      f.textRaw(
        o.text,
        N,
        B,
        o.style,
        void 0,
        X
      );
    };
    return f.setHeaderFooter(
      (E, h, O) => {
        t && t(f, h, O), n?.position === "header" && H("header", h, O), o?.position === "header" && j("header", h);
      },
      (E, h, O) => {
        n?.position === "footer" && H("footer", h, O), r && r(f, h, O), o?.position === "footer" && j("footer", h);
      }
    ), f.waitForTasks().then(() => {
      c?.(f);
    }), () => {
      f.reset();
    };
  }, [f]), A.useEffect(() => {
    m && u && f.save(u);
  }, [m, u]), /* @__PURE__ */ I.jsx(it.Provider, { value: f, children: a });
}, xt = ({
  x: i,
  y: t,
  w: r,
  h: n,
  children: o,
  ...s
}) => {
  const a = q(), c = Z(s.padding), u = {
    top: s.paddingTop ?? c.top,
    right: s.paddingRight ?? c.right,
    bottom: s.paddingBottom ?? c.bottom,
    left: s.paddingLeft ?? c.left
  }, m = A.useRef(
    {}
  ).current;
  return typeof i == "number" && typeof t == "number" && typeof r == "number" && typeof n == "number" ? (A.useEffect(() => {
    a.queueOperation(() => {
      a.box(i, t, r, n, s);
    });
  }, [a, i, t, r, n]), /* @__PURE__ */ I.jsx(A.Fragment, { children: o })) : (A.useEffect(() => {
    a.queueOperation(() => {
      const f = a.getCursor();
      m.start = { ...f };
      const x = f.x + u.left, d = f.y + u.top;
      a.setCursor(x, d);
    });
  }, [a]), /* @__PURE__ */ I.jsxs(A.Fragment, { children: [
    o,
    /* @__PURE__ */ I.jsx(pt, { boxState: m, pad: u, style: s })
  ] }));
}, pt = ({ boxState: i, style: t, pad: r }) => {
  const n = q();
  return A.useEffect(() => {
    n.queueOperation(() => {
      const o = i.start;
      if (!o) return;
      const s = n.getCursor(), c = Math.max(s.y - o.y - r.top, 0) + r.top + r.bottom;
      n.box(o.x, o.y, n.contentAreaWidth, c, t), n.setCursor(o.x, o.y + c);
    });
  }, [n]), null;
}, Rt = ({
  src: i,
  x: t,
  y: r,
  w: n,
  h: o,
  mime: s = "PNG",
  flow: a,
  align: c = "left"
}) => {
  const u = q();
  return A.useEffect(() => {
    const m = a === !0 || t === void 0 && r === void 0, f = t, x = r;
    u.queueOperation(async () => {
      const d = await u.imageFromUrl(i, {
        x: f,
        y: x,
        w: n,
        h: o,
        mime: s,
        align: c
      });
      m && d && u.moveCursor(0, d.height + 2);
    });
  }, [u, i, t, r, n, o, s, a, c]), null;
}, Tt = ({
  items: i,
  ordered: t = !1,
  style: r,
  indent: n = 5,
  markerWidth: o = 5,
  spacing: s = 2
}) => {
  const a = q();
  return A.useEffect(() => {
    a.queueOperation(() => {
      i.forEach((c, u) => {
        const m = t ? `${u + 1}.` : "•", f = a.getCursor().y, x = a.getCursor().x, d = x + n + o, H = r?.fontSize ?? a.baseFont.size, j = f + H * 0.3528;
        a.textRaw(
          m,
          x + n,
          j,
          r,
          o,
          "right"
        ), a.setCursor(d, f);
        const E = a.contentRight - d;
        a.paragraph(c, r, E);
        const h = a.getCursor().y;
        a.setCursor(x, h + s);
      });
    });
  }, [a, i, t, r, n, o, s]), null;
}, Ct = ({
  width: i = "100%",
  height: t = "500px",
  className: r,
  style: n,
  iframeClassName: o,
  iframeStyle: s,
  ...a
}) => {
  const [c, u] = ct(null), m = (f) => {
    const x = f.getBlobUrl();
    u(x.toString());
  };
  return /* @__PURE__ */ I.jsxs("div", { className: r, style: { width: i, height: t, ...n }, children: [
    /* @__PURE__ */ I.jsx("div", { style: { display: "none" }, children: /* @__PURE__ */ I.jsx(gt, { ...a, onReady: m, autoSave: !1, children: a.children }) }),
    c ? /* @__PURE__ */ I.jsx(
      "iframe",
      {
        src: c,
        width: "100%",
        height: "100%",
        className: o,
        style: { border: "none", ...s },
        title: "PDF Preview"
      }
    ) : /* @__PURE__ */ I.jsx(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
          color: "#6b7280"
        },
        children: "Generating Preview..."
      }
    )
  ] });
}, Et = ({
  data: i,
  columns: t,
  width: r = "100%",
  borderWidth: n = 0.1,
  borderColor: o = "#000000",
  cellPadding: s = 2,
  headerStyle: a,
  rowStyle: c,
  alternateRowStyle: u,
  headerHeight: m
}) => {
  const f = q();
  return A.useEffect(() => {
    f.queueOperation(() => {
      const x = typeof r == "number" ? r : parseFloat(r) / 100 * f.contentAreaWidth, d = t.map((b) => typeof b.width == "number" ? b.width : typeof b.width == "string" && b.width.endsWith("%") ? parseFloat(b.width) / 100 * x : 0), H = d.reduce((b, R) => b + R, 0), j = Math.max(0, x - H), E = d.filter((b) => b === 0).length;
      if (E > 0) {
        const b = j / E;
        for (let R = 0; R < d.length; R++)
          d[R] === 0 && (d[R] = b);
      }
      const h = (b, R, P, W, S, p, D = "left", Y = !0) => {
        Y && f.box(R, P, W, S, {
          borderColor: p.borderColor ?? o,
          borderWidth: p.borderWidth ?? n,
          fillColor: p.fillColor
        });
        const z = Z(p.padding ?? s), T = {
          top: p.paddingTop ?? z.top,
          right: p.paddingRight ?? z.right,
          bottom: p.paddingBottom ?? z.bottom,
          left: p.paddingLeft ?? z.left
        }, w = W - T.left - T.right, k = f.instance.splitTextToSize(b, w, p), v = (p.fontSize ?? f.baseFont.size) * (p.lineHeight ?? f.baseLineHeight) * 0.3528, F = (p.fontSize ?? f.baseFont.size) * 0.3528, e = k.length * v, l = S - T.top - T.bottom;
        let g = 0;
        p.verticalAlign === "middle" ? g = Math.max(0, (l - e) / 2) : p.verticalAlign === "bottom" && (g = Math.max(0, l - e));
        let C = P + T.top + g + F;
        const L = p.align ?? D, _ = f.getCursor();
        k.forEach((y) => {
          let M = R + T.left;
          L === "center" ? M = R + W / 2 : L === "right" && (M = R + W - T.right), f.textRaw(y, M, C, p, void 0, L), C += v;
        }), f.setCursor(_.x, _.y);
      };
      let O = f.getCursor().y;
      const X = f.getCursor().x, N = m ?? 10;
      O + N > f.contentBottom && (f.addPage(), O = f.getCursor().y);
      let U = X;
      t.forEach((b, R) => {
        const P = d[R];
        h(
          b.header ?? "",
          U,
          O,
          P,
          N,
          a ?? { fontStyle: "bold" },
          b.align ?? "left"
        ), U += P;
      }), O += N, f.setCursor(X, O);
      const B = (b, R, P) => {
        const W = Z(s), S = {
          top: P.paddingTop ?? W.top,
          right: P.paddingRight ?? W.right,
          bottom: P.paddingBottom ?? W.bottom,
          left: P.paddingLeft ?? W.left
        }, p = R - S.left - S.right;
        return f.measureText(b, P, p).height + S.top + S.bottom;
      };
      new Array(t.length).fill(0), (() => {
        const b = new Array(i.length).fill(0);
        for (let S = 0; S < i.length; S++) {
          const p = i[S];
          let D = 0;
          for (let Y = 0; Y < t.length; Y++) {
            const z = t[Y], T = typeof z.accessor == "function" ? z.accessor(p) : p[z.accessor];
            let w = "", k = c, v = 1, F = 1;
            if (T && typeof T == "object" && T.content !== void 0 ? (w = String(T.content), T.style && (k = T.style), T.colSpan && (v = T.colSpan), T.rowSpan && (F = T.rowSpan)) : w = String(T ?? ""), F > 1) {
              Y += v - 1;
              continue;
            }
            let e = d[Y];
            for (let g = 1; g < v; g++)
              Y + g < d.length && (e += d[Y + g]);
            const l = B(w, e, k ?? {});
            l > D && (D = l), Y += v - 1;
          }
          D < 8 && (D = 8), b[S] = D;
        }
        let R = O;
        const P = new Array(t.length).fill(0), W = f.getCursor().x;
        for (let S = 0; S < i.length; S++) {
          const p = i[S], D = b[S];
          let Y = D;
          for (let w = 0; w < t.length; w++) {
            const k = t[w], v = typeof k.accessor == "function" ? k.accessor(p) : p[k.accessor];
            let F = 1;
            if (v && typeof v == "object" && v.rowSpan && (F = v.rowSpan), F > 1) {
              let e = 0;
              for (let l = 0; l < F; l++)
                S + l < b.length && (e += b[S + l]);
              e > Y && (Y = e);
            }
          }
          const z = Math.abs(R - (f.contentTop + (m ?? 10))) < 1;
          if (R + Y > f.contentBottom && !z && (f.addPage(), R = f.getCursor().y, m !== 0)) {
            let w = W;
            t.forEach((k, v) => {
              const F = d[v];
              h(
                k.header ?? "",
                w,
                R,
                F,
                m ?? 10,
                a ?? { fontStyle: "bold" },
                k.align ?? "left"
              ), w += F;
            }), R += m ?? 10;
          }
          let T = W;
          for (let w = 0; w < t.length; w++) {
            if (P[w] > 0) {
              P[w]--, T += d[w];
              continue;
            }
            const k = t[w], v = typeof k.accessor == "function" ? k.accessor(p) : p[k.accessor];
            let F = 1, e = 1, l = S % 2 === 1 && u ? u : c, g = "";
            v && typeof v == "object" && v.content !== void 0 ? (g = String(v.content), v.colSpan && (F = v.colSpan), v.rowSpan && (e = v.rowSpan), v.style && (l = { ...l, ...v.style })) : g = String(v ?? "");
            let C = d[w];
            for (let _ = 1; _ < F; _++)
              w + _ < d.length && (C += d[w + _]);
            let L = D;
            if (e > 1)
              for (let _ = 1; _ < e; _++)
                S + _ < b.length && (L += b[S + _]);
            if (h(
              g,
              T,
              R,
              C,
              L,
              l ?? {},
              k.align ?? "left",
              !0
            ), e > 1) {
              P[w] = e - 1;
              for (let _ = 1; _ < F; _++)
                w + _ < P.length && (P[w + _] = e - 1);
            }
            T += C, w += F - 1;
          }
          R += D;
        }
        f.setCursor(W, R);
      })();
    });
  }, [f, i, t, r]), null;
}, St = ({
  children: i,
  x: t,
  y: r,
  maxWidth: n,
  spacingBelow: o = 2,
  ...s
}) => {
  const a = q();
  return A.useEffect(() => {
    a.queueOperation(() => {
      if (typeof t == "number" && typeof r == "number")
        a.textRaw(i, t, r, s, n, s.align);
      else {
        a.paragraph(i, s, n);
        const c = a.getCursor();
        a.setCursor(c.x, c.y + o);
      }
    });
  }, [
    a,
    i,
    t,
    r,
    n,
    o,
    s.fontSize,
    s.align
  ]), null;
};
function mt(i) {
  return typeof i == "number" ? { top: i, right: i, bottom: i, left: i } : {
    top: i?.top ?? 0,
    right: i?.right ?? 0,
    bottom: i?.bottom ?? 0,
    left: i?.left ?? 0
  };
}
const Pt = ({ style: i = {}, children: t }) => {
  const r = q(), n = Z(i.padding), o = {
    top: i.paddingTop ?? n.top,
    right: i.paddingRight ?? n.right,
    bottom: i.paddingBottom ?? n.bottom,
    left: i.paddingLeft ?? n.left
  }, s = mt(i.margin), a = {
    top: i.marginTop ?? s.top,
    right: i.marginRight ?? s.right,
    bottom: i.marginBottom ?? s.bottom,
    left: i.marginLeft ?? s.left
  }, c = A.useRef(
    {}
  ).current;
  return A.useEffect(() => {
    r.queueOperation(() => {
      a.top > 0 && r.moveCursor(0, a.top);
      const u = r.getCursor();
      c.start = { ...u }, r.setCursor(u.x + o.left, u.y + o.top);
    });
  }, [r]), /* @__PURE__ */ I.jsxs(A.Fragment, { children: [
    t,
    /* @__PURE__ */ I.jsx(
      bt,
      {
        viewState: c,
        style: i,
        pad: o,
        margin: a
      }
    )
  ] });
}, bt = ({ viewState: i, style: t, pad: r, margin: n }) => {
  const o = q();
  return A.useEffect(() => {
    o.queueOperation(() => {
      const s = i.start;
      if (!s) return;
      const a = o.getCursor();
      let u = Math.max(a.y - s.y - r.top, 0) + r.top + r.bottom;
      t.height && (u = t.height);
      let m = o.contentAreaWidth;
      typeof t.width == "number" && (m = t.width), (t.borderColor || t.fillColor || t.borderWidth) && o.box(s.x, s.y, m, u, t);
      const f = s.y + u + n.bottom;
      o.setCursor(s.x, f);
    });
  }, [o]), null;
};
export {
  xt as PdfBox,
  gt as PdfDocument,
  Rt as PdfImage,
  Tt as PdfList,
  Ct as PdfPreview,
  dt as PdfRenderer,
  Et as PdfTable,
  St as PdfText,
  Pt as PdfView
};
