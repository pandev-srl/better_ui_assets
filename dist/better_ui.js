var M = Object.defineProperty;
var F = (i, e, t) => e in i ? M(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var o = (i, e, t) => F(i, typeof e != "symbol" ? e + "" : e, t);
function $(i) {
  return i.replace(/(?:[_-])([a-z0-9])/g, (e, t) => t.toUpperCase());
}
function R(i) {
  return $(i.replace(/--/g, "-").replace(/__/g, "_"));
}
function f(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
function j(i) {
  return i.replace(/([A-Z])/g, (e, t) => `-${t.toLowerCase()}`);
}
function S(i) {
  return i != null;
}
function I(i, e) {
  return Object.prototype.hasOwnProperty.call(i, e);
}
function V(i, e) {
  const t = z(i);
  return Array.from(t.reduce((s, a) => (N(a, e).forEach((n) => s.add(n)), s), /* @__PURE__ */ new Set()));
}
function P(i, e) {
  return z(i).reduce((s, a) => (s.push(...q(a, e)), s), []);
}
function z(i) {
  const e = [];
  for (; i; )
    e.push(i), i = Object.getPrototypeOf(i);
  return e.reverse();
}
function N(i, e) {
  const t = i[e];
  return Array.isArray(t) ? t : [];
}
function q(i, e) {
  const t = i[e];
  return t ? Object.keys(t).map((s) => [s, t[s]]) : [];
}
(() => {
  function i(t) {
    function s() {
      return Reflect.construct(t, arguments, new.target);
    }
    return s.prototype = Object.create(t.prototype, {
      constructor: { value: s }
    }), Reflect.setPrototypeOf(s, t), s;
  }
  function e() {
    const s = i(function() {
      this.a.call(this);
    });
    return s.prototype.a = function() {
    }, new s();
  }
  try {
    return e(), i;
  } catch {
    return (s) => class extends s {
    };
  }
})();
Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, L("abcdefghijklmnopqrstuvwxyz".split("").map((i) => [i, i]))), L("0123456789".split("").map((i) => [i, i])));
function L(i) {
  return i.reduce((e, [t, s]) => Object.assign(Object.assign({}, e), { [t]: s }), {});
}
function U(i) {
  return V(i, "classes").reduce((t, s) => Object.assign(t, W(s)), {});
}
function W(i) {
  return {
    [`${i}Class`]: {
      get() {
        const { classes: e } = this;
        if (e.has(i))
          return e.get(i);
        {
          const t = e.getAttributeName(i);
          throw new Error(`Missing attribute "${t}"`);
        }
      }
    },
    [`${i}Classes`]: {
      get() {
        return this.classes.getAll(i);
      }
    },
    [`has${f(i)}Class`]: {
      get() {
        return this.classes.has(i);
      }
    }
  };
}
function _(i) {
  return V(i, "outlets").reduce((t, s) => Object.assign(t, X(s)), {});
}
function E(i, e, t) {
  return i.application.getControllerForElementAndIdentifier(e, t);
}
function C(i, e, t) {
  let s = E(i, e, t);
  if (s || (i.application.router.proposeToConnectScopeForElementAndIdentifier(e, t), s = E(i, e, t), s))
    return s;
}
function X(i) {
  const e = R(i);
  return {
    [`${e}Outlet`]: {
      get() {
        const t = this.outlets.find(i), s = this.outlets.getSelectorForOutletName(i);
        if (t) {
          const a = C(this, t, i);
          if (a)
            return a;
          throw new Error(`The provided outlet element is missing an outlet controller "${i}" instance for host controller "${this.identifier}"`);
        }
        throw new Error(`Missing outlet element "${i}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${s}".`);
      }
    },
    [`${e}Outlets`]: {
      get() {
        const t = this.outlets.findAll(i);
        return t.length > 0 ? t.map((s) => {
          const a = C(this, s, i);
          if (a)
            return a;
          console.warn(`The provided outlet element is missing an outlet controller "${i}" instance for host controller "${this.identifier}"`, s);
        }).filter((s) => s) : [];
      }
    },
    [`${e}OutletElement`]: {
      get() {
        const t = this.outlets.find(i), s = this.outlets.getSelectorForOutletName(i);
        if (t)
          return t;
        throw new Error(`Missing outlet element "${i}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${s}".`);
      }
    },
    [`${e}OutletElements`]: {
      get() {
        return this.outlets.findAll(i);
      }
    },
    [`has${f(e)}Outlet`]: {
      get() {
        return this.outlets.has(i);
      }
    }
  };
}
function K(i) {
  return V(i, "targets").reduce((t, s) => Object.assign(t, J(s)), {});
}
function J(i) {
  return {
    [`${i}Target`]: {
      get() {
        const e = this.targets.find(i);
        if (e)
          return e;
        throw new Error(`Missing target element "${i}" for "${this.identifier}" controller`);
      }
    },
    [`${i}Targets`]: {
      get() {
        return this.targets.findAll(i);
      }
    },
    [`has${f(i)}Target`]: {
      get() {
        return this.targets.has(i);
      }
    }
  };
}
function Y(i) {
  const e = P(i, "values"), t = {
    valueDescriptorMap: {
      get() {
        return e.reduce((s, a) => {
          const n = H(a, this.identifier), r = this.data.getAttributeNameForKey(n.key);
          return Object.assign(s, { [r]: n });
        }, {});
      }
    }
  };
  return e.reduce((s, a) => Object.assign(s, Z(a)), t);
}
function Z(i, e) {
  const t = H(i, e), { key: s, name: a, reader: n, writer: r } = t;
  return {
    [a]: {
      get() {
        const c = this.data.get(s);
        return c !== null ? n(c) : t.defaultValue;
      },
      set(c) {
        c === void 0 ? this.data.delete(s) : this.data.set(s, r(c));
      }
    },
    [`has${f(a)}`]: {
      get() {
        return this.data.has(s) || t.hasCustomDefaultValue;
      }
    }
  };
}
function H([i, e], t) {
  return te({
    controller: t,
    token: i,
    typeDefinition: e
  });
}
function p(i) {
  switch (i) {
    case Array:
      return "array";
    case Boolean:
      return "boolean";
    case Number:
      return "number";
    case Object:
      return "object";
    case String:
      return "string";
  }
}
function h(i) {
  switch (typeof i) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
  }
  if (Array.isArray(i))
    return "array";
  if (Object.prototype.toString.call(i) === "[object Object]")
    return "object";
}
function G(i) {
  const { controller: e, token: t, typeObject: s } = i, a = S(s.type), n = S(s.default), r = a && n, c = a && !n, d = !a && n, u = p(s.type), b = h(i.typeObject.default);
  if (c)
    return u;
  if (d)
    return b;
  if (u !== b) {
    const B = e ? `${e}.${t}` : t;
    throw new Error(`The specified default value for the Stimulus Value "${B}" must match the defined type "${u}". The provided default value of "${s.default}" is of type "${b}".`);
  }
  if (r)
    return u;
}
function Q(i) {
  const { controller: e, token: t, typeDefinition: s } = i, n = G({ controller: e, token: t, typeObject: s }), r = h(s), c = p(s), d = n || r || c;
  if (d)
    return d;
  const u = e ? `${e}.${s}` : t;
  throw new Error(`Unknown value type "${u}" for "${t}" value`);
}
function ee(i) {
  const e = p(i);
  if (e)
    return A[e];
  const t = I(i, "default"), s = I(i, "type"), a = i;
  if (t)
    return a.default;
  if (s) {
    const { type: n } = a, r = p(n);
    if (r)
      return A[r];
  }
  return i;
}
function te(i) {
  const { token: e, typeDefinition: t } = i, s = `${j(e)}-value`, a = Q(i);
  return {
    type: a,
    key: s,
    name: $(s),
    get defaultValue() {
      return ee(t);
    },
    get hasCustomDefaultValue() {
      return h(t) !== void 0;
    },
    reader: se[a],
    writer: O[a] || O.default
  };
}
const A = {
  get array() {
    return [];
  },
  boolean: !1,
  number: 0,
  get object() {
    return {};
  },
  string: ""
}, se = {
  array(i) {
    const e = JSON.parse(i);
    if (!Array.isArray(e))
      throw new TypeError(`expected value of type "array" but instead got value "${i}" of type "${h(e)}"`);
    return e;
  },
  boolean(i) {
    return !(i == "0" || String(i).toLowerCase() == "false");
  },
  number(i) {
    return Number(i.replace(/_/g, ""));
  },
  object(i) {
    const e = JSON.parse(i);
    if (e === null || typeof e != "object" || Array.isArray(e))
      throw new TypeError(`expected value of type "object" but instead got value "${i}" of type "${h(e)}"`);
    return e;
  },
  string(i) {
    return i;
  }
}, O = {
  default: ie,
  array: D,
  object: D
};
function D(i) {
  return JSON.stringify(i);
}
function ie(i) {
  return `${i}`;
}
class l {
  constructor(e) {
    this.context = e;
  }
  static get shouldLoad() {
    return !0;
  }
  static afterLoad(e, t) {
  }
  get application() {
    return this.context.application;
  }
  get scope() {
    return this.context.scope;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get targets() {
    return this.scope.targets;
  }
  get outlets() {
    return this.scope.outlets;
  }
  get classes() {
    return this.scope.classes;
  }
  get data() {
    return this.scope.data;
  }
  initialize() {
  }
  connect() {
  }
  disconnect() {
  }
  dispatch(e, { target: t = this.element, detail: s = {}, prefix: a = this.identifier, bubbles: n = !0, cancelable: r = !0 } = {}) {
    const c = a ? `${a}:${e}` : e, d = new CustomEvent(c, { detail: s, bubbles: n, cancelable: r });
    return t.dispatchEvent(d), d;
  }
}
l.blessings = [
  U,
  K,
  Y,
  _
];
l.targets = [];
l.outlets = [];
l.values = {};
class ae extends l {
  connect() {
    this.element.textContent = "Hello World!";
  }
}
class g extends l {
  connect() {
    this.close(), this.currentIndexValue = -1, this.boundClickOutside = this.clickOutside.bind(this);
  }
  disconnect() {
    document.removeEventListener("click", this.boundClickOutside);
  }
  // Azione principale: toggle del menu dropdown
  toggle() {
    this.openValue ? this.close() : this.open();
  }
  // Apre il menu dropdown
  open() {
    this.openValue = !0, this.menuTarget.style.display = "block", this.triggerTarget.setAttribute("aria-expanded", "true"), document.addEventListener("click", this.boundClickOutside);
  }
  // Chiude il menu dropdown
  close() {
    this.openValue = !1, this.menuTarget.style.display = "none", this.triggerTarget.setAttribute("aria-expanded", "false"), this.clearAllFocus(), this.currentIndexValue = -1, document.removeEventListener("click", this.boundClickOutside);
  }
  // Gestisce click esterno per chiudere il dropdown
  clickOutside(e) {
    this.element.contains(e.target) || this.close();
  }
  // Azione per chiudere il dropdown quando viene cliccato un item
  itemClick(e) {
    if (this.selectableValue) {
      const t = e.target, s = t.closest('[data-bui-dropdown-target="item"]');
      if (s && (s.hasAttribute("href") || s.href)) {
        e.preventDefault(), this.updateTriggerFromItem(t), this.close(), setTimeout(() => {
          s.href ? window.location.href = s.href : s.hasAttribute("href") && (window.location.href = s.getAttribute("href"));
        }, 300);
        return;
      }
      this.updateTriggerFromItem(t);
    }
    this.close();
  }
  // Aggiorna il trigger con il contenuto dell'item selezionato
  updateTriggerFromItem(e) {
    const t = e.closest('[data-bui-dropdown-target="item"]');
    if (!t) {
      console.warn("Item element not found for selectable dropdown");
      return;
    }
    const s = t.innerHTML, a = this.triggerTarget.querySelector("svg"), n = a ? a.outerHTML : "", r = s.replace(/<svg[^>]*>.*?<\/svg>/gi, "").trim();
    n ? this.triggerTarget.innerHTML = `${r} ${n}` : this.triggerTarget.innerHTML = r;
  }
  // Gestione eventi tastiera
  keydown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault(), this.openValue ? this.navigateDown() : (this.open(), this.focusFirstItem());
        break;
      case "ArrowUp":
        e.preventDefault(), this.openValue && this.navigateUp();
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this.openValue && this.currentIndexValue >= 0 ? this.selectCurrentItem() : this.openValue || this.toggle();
        break;
      case "Escape":
        e.preventDefault(), this.openValue && (this.close(), this.triggerTarget.focus());
        break;
      case "Tab":
        this.openValue && this.close();
        break;
    }
  }
  // Naviga al prossimo item (con wrap-around)
  navigateDown() {
    const e = this.getNavigableItems();
    e.length !== 0 && (this.currentIndexValue = (this.currentIndexValue + 1) % e.length, this.updateFocus());
  }
  // Naviga al precedente item (con wrap-around)
  navigateUp() {
    const e = this.getNavigableItems();
    e.length !== 0 && (this.currentIndexValue = this.currentIndexValue <= 0 ? e.length - 1 : this.currentIndexValue - 1, this.updateFocus());
  }
  // Seleziona l'item corrente (simula click)
  selectCurrentItem() {
    const e = this.getNavigableItems();
    this.currentIndexValue >= 0 && this.currentIndexValue < e.length && e[this.currentIndexValue].click();
  }
  // Focus sul primo item disponibile
  focusFirstItem() {
    this.getNavigableItems().length > 0 && (this.currentIndexValue = 0, this.updateFocus());
  }
  // Aggiorna il focus visivo
  updateFocus() {
    this.clearAllFocus();
    const e = this.getNavigableItems();
    if (this.currentIndexValue >= 0 && this.currentIndexValue < e.length) {
      const t = e[this.currentIndexValue], s = this.constructor.focusClasses.split(" ");
      t.classList.add(...s);
    }
  }
  // Rimuove il focus da tutti gli item
  clearAllFocus() {
    const e = this.constructor.focusClasses.split(" ");
    this.itemTargets.forEach((t) => {
      t.classList.remove(...e);
    });
  }
  // Restituisce solo gli item navigabili (non disabled)
  getNavigableItems() {
    return this.itemTargets.filter((e) => !e.hasAttribute("aria-disabled") || e.getAttribute("aria-disabled") !== "true");
  }
}
o(g, "targets", ["trigger", "menu", "item"]), o(g, "values", { open: Boolean, currentIndex: Number, selectable: Boolean }), // Classi CSS per il focus management (Tailwind)
o(g, "focusClasses", "bg-gray-100 text-gray-900");
class m extends l {
  connect() {
    this.setInitialActiveTab();
  }
  // Metodo principale per il cambio di tab (referenziato nei componenti Ruby)
  switchTab(e) {
    e.preventDefault();
    const t = e.currentTarget, s = t.dataset.target;
    if (console.log("🔥 switchTab called for target:", s), !s) {
      console.warn("⚠️ No target ID found on tab");
      return;
    }
    const a = this.tabTargets.indexOf(t);
    console.log("🎯 Tab index:", a), a >= 0 && this.activateTab(a, s);
  }
  // Gestione eventi tastiera per navigazione
  keydown(e) {
    const t = e.currentTarget, s = this.tabTargets.indexOf(t);
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault(), this.navigateLeft(s);
        break;
      case "ArrowRight":
        e.preventDefault(), this.navigateRight(s);
        break;
      case "Home":
        e.preventDefault(), this.navigateToFirst();
        break;
      case "End":
        e.preventDefault(), this.navigateToLast();
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this.switchTab(e);
        break;
    }
  }
  // Attiva un tab specifico per indice
  activateTab(e, t = null) {
    if (e < 0 || e >= this.tabTargets.length) return;
    const s = this.tabTargets[e], a = t || s.dataset.target;
    a && (this.activeIndexValue = e, this.updateTabStates(e), this.updatePanelStates(a), s.focus());
  }
  // Naviga al tab precedente (con wrap-around)
  navigateLeft(e) {
    const t = e <= 0 ? this.tabTargets.length - 1 : e - 1, a = this.tabTargets[t].dataset.target;
    this.activateTab(t, a);
  }
  // Naviga al tab successivo (con wrap-around)  
  navigateRight(e) {
    const t = (e + 1) % this.tabTargets.length, a = this.tabTargets[t].dataset.target;
    this.activateTab(t, a);
  }
  // Naviga al primo tab
  navigateToFirst() {
    const t = this.tabTargets[0].dataset.target;
    this.activateTab(0, t);
  }
  // Naviga all'ultimo tab
  navigateToLast() {
    const e = this.tabTargets.length - 1, s = this.tabTargets[e].dataset.target;
    this.activateTab(e, s);
  }
  // Imposta il tab attivo iniziale
  setInitialActiveTab() {
    const e = this.tabTargets.find(
      (t) => t.getAttribute("aria-selected") === "true"
    );
    if (e) {
      const t = this.tabTargets.indexOf(e);
      this.activeIndexValue = t;
    } else if (this.activeIndexValue = 0, this.tabTargets.length > 0) {
      const s = this.tabTargets[0].dataset.target;
      this.activateTab(0, s);
    }
  }
  // Aggiorna gli stati ARIA e le classi CSS di tutti i tab
  updateTabStates(e) {
    this.tabTargets.forEach((t, s) => {
      const a = s === e;
      t.setAttribute("aria-selected", a.toString()), t.setAttribute("tabindex", a ? "0" : "-1"), this.updateTabClasses(t, a);
    });
  }
  // Aggiorna le classi CSS di un singolo tab
  updateTabClasses(e, t) {
    this.removeThemeClasses(e);
    const s = this.getTabTheme(e);
    t ? this.applyActiveClasses(e, s) : this.applyInactiveClasses(e, s);
  }
  // Aggiorna la visibilità di tutti i panel
  updatePanelStates(e) {
    console.log("🔄 Updating panel states for:", e), console.log("📋 Available panels:", this.panelTargets.map((t) => t.id)), this.panelTargets.forEach((t) => {
      const s = t.id === e;
      console.log(`🎯 Panel ${t.id}: ${s ? "ACTIVE" : "INACTIVE"}`), s ? (t.classList.remove("hidden"), t.classList.add("block"), console.log(`✅ Panel ${t.id} shown`)) : (t.classList.remove("block"), t.classList.add("hidden"), console.log(`❌ Panel ${t.id} hidden`));
    });
  }
  // Utility: rimuove classi di tema esistenti
  removeThemeClasses(e) {
    const t = [
      "bg-white",
      "bg-blue-600",
      "bg-red-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-violet-600",
      "bg-orange-600",
      "bg-rose-600",
      "text-gray-900",
      "text-white",
      "text-gray-500",
      "text-gray-700",
      "text-blue-600",
      "text-blue-700",
      "text-red-600",
      "text-red-700",
      "text-green-600",
      "text-green-700",
      "text-yellow-600",
      "text-yellow-700",
      "text-violet-600",
      "text-violet-700",
      "text-orange-600",
      "text-orange-700",
      "text-rose-600",
      "text-rose-700",
      "text-gray-600",
      "shadow-sm",
      "hover:text-gray-700",
      "hover:text-blue-700",
      "hover:text-red-700",
      "hover:text-green-700",
      "hover:text-yellow-700",
      "hover:text-violet-700",
      "hover:text-orange-700",
      "hover:text-rose-700"
    ];
    e.classList.remove(...t);
  }
  // Utility: ottiene il tema dal tab (default se non specificato)
  getTabTheme(e) {
    return e.classList.contains("text-blue-600") ? "blue" : e.classList.contains("text-red-600") ? "red" : e.classList.contains("text-green-600") ? "green" : e.classList.contains("text-yellow-600") ? "yellow" : e.classList.contains("text-violet-600") ? "violet" : e.classList.contains("text-orange-600") ? "orange" : e.classList.contains("text-rose-600") ? "rose" : e.classList.contains("text-white") ? "white" : "default";
  }
  // Utility: applica classi per stato attivo
  applyActiveClasses(e, t) {
    const s = {
      default: ["bg-white", "text-gray-900", "shadow-sm"],
      blue: ["bg-blue-600", "text-white"],
      red: ["bg-red-600", "text-white"],
      green: ["bg-green-600", "text-white"],
      yellow: ["bg-yellow-600", "text-white"],
      violet: ["bg-violet-600", "text-white"],
      orange: ["bg-orange-600", "text-white"],
      rose: ["bg-rose-600", "text-white"],
      white: ["bg-white", "text-gray-900"]
    }, a = s[t] || s.default;
    e.classList.add(...a);
  }
  // Utility: applica classi per stato inattivo
  applyInactiveClasses(e, t) {
    const s = {
      default: ["text-gray-500", "hover:text-gray-700"],
      blue: ["text-blue-600", "hover:text-blue-700"],
      red: ["text-red-600", "hover:text-red-700"],
      green: ["text-green-600", "hover:text-green-700"],
      yellow: ["text-yellow-600", "hover:text-yellow-700"],
      violet: ["text-violet-600", "hover:text-violet-700"],
      orange: ["text-orange-600", "hover:text-orange-700"],
      rose: ["text-rose-600", "hover:text-rose-700"],
      white: ["text-gray-600", "hover:text-gray-700"]
    }, a = s[t] || s.default;
    e.classList.add(...a);
  }
}
o(m, "targets", ["tab", "panel"]), o(m, "values", { activeIndex: Number });
class T extends l {
  connect() {
    console.log("🎭 Modal controller connected"), this.hasBackdropTarget && (this.backdropTarget.style.display = "none"), this.handleKeydown = this.handleKeydown.bind(this), this.handleBackdropClick = this.handleBackdropClick.bind(this), this.setupAccessibility();
  }
  disconnect() {
    console.log("🎭 Modal controller disconnected"), this.unlockBodyScroll(), this.removeEventListeners();
  }
  // Apre il modal
  open() {
    console.log("🔓 Opening modal"), this.hasBackdropTarget && (this.backdropTarget.style.display = "flex"), this.lockScrollValue && this.lockBodyScroll(), this.addEventListeners(), this.focusModal(), this.hasBackdropTarget && (this.backdropTarget.classList.add("modal-entering"), setTimeout(() => {
      this.backdropTarget.classList.remove("modal-entering"), this.backdropTarget.classList.add("modal-open");
    }, 10));
  }
  // Chiude il modal
  close() {
    console.log("🔒 Closing modal"), this.hasBackdropTarget && (this.backdropTarget.classList.add("modal-leaving"), this.backdropTarget.classList.remove("modal-open"), setTimeout(() => {
      this.backdropTarget.style.display = "none", this.backdropTarget.classList.remove("modal-leaving"), this.unlockBodyScroll(), this.removeEventListeners(), this.restoreFocus();
    }, 200));
  }
  // Toggle del modal
  toggle() {
    this.isOpen() ? this.close() : this.open();
  }
  // Verifica se il modal è aperto
  isOpen() {
    return this.hasBackdropTarget ? this.backdropTarget.style.display !== "none" : !1;
  }
  // Gestisce click sul backdrop
  handleBackdropClick(e) {
    this.closeOnBackdropValue && e.target === this.backdropTarget && (console.log("🎯 Backdrop clicked - closing modal"), this.close());
  }
  // Gestisce eventi tastiera
  handleKeydown(e) {
    switch (e.key) {
      case "Escape":
        this.closeOnEscapeValue && (console.log("⎋ Escape pressed - closing modal"), e.preventDefault(), this.close());
        break;
      case "Tab":
        this.handleTabNavigation(e);
        break;
    }
  }
  // Gestisce la navigazione Tab per il focus trapping
  handleTabNavigation(e) {
    const t = this.getFocusableElements(), s = t[0], a = t[t.length - 1];
    e.shiftKey ? document.activeElement === s && (e.preventDefault(), a.focus()) : document.activeElement === a && (e.preventDefault(), s.focus());
  }
  // Click sul pulsante close
  closeButtonClicked(e) {
    e.preventDefault(), console.log("❌ Close button clicked"), this.close();
  }
  // Setup attributi per accessibilità
  setupAccessibility() {
    this.element.setAttribute("role", "dialog"), this.element.setAttribute("aria-modal", "true");
    const e = this.element.querySelector("#modal-title, [data-modal-title]");
    e && (e.id || (e.id = `modal-title-${Math.random().toString(36).substr(2, 9)}`), this.element.setAttribute("aria-labelledby", e.id));
  }
  // Lock dello scroll del body
  lockBodyScroll() {
    this.scrollPosition = window.pageYOffset, document.body.style.overflow = "hidden", document.body.style.position = "fixed", document.body.style.top = `-${this.scrollPosition}px`, document.body.style.width = "100%", console.log("🔒 Body scroll locked");
  }
  // Unlock dello scroll del body
  unlockBodyScroll() {
    typeof this.scrollPosition < "u" && (document.body.style.overflow = "", document.body.style.position = "", document.body.style.top = "", document.body.style.width = "", window.scrollTo(0, this.scrollPosition), console.log("🔓 Body scroll unlocked"));
  }
  // Focus sul modal per accessibilità
  focusModal() {
    this.previouslyFocusedElement = document.activeElement;
    const e = this.getFocusableElements();
    e.length > 0 ? e[0].focus() : this.hasContainerTarget && this.containerTarget.focus();
  }
  // Ripristina il focus all'elemento precedente
  restoreFocus() {
    this.previouslyFocusedElement && this.previouslyFocusedElement.focus();
  }
  // Ottiene tutti gli elementi focusabili nel modal
  getFocusableElements() {
    const e = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    return Array.from(this.element.querySelectorAll(e)).filter((t) => t.offsetParent !== null);
  }
  // Aggiunge event listeners
  addEventListeners() {
    document.addEventListener("keydown", this.handleKeydown), this.hasBackdropTarget && this.backdropTarget.addEventListener("click", this.handleBackdropClick);
  }
  // Rimuove event listeners
  removeEventListeners() {
    document.removeEventListener("keydown", this.handleKeydown), this.hasBackdropTarget && this.backdropTarget.removeEventListener("click", this.handleBackdropClick);
  }
}
o(T, "targets", ["backdrop", "container", "closeButton"]), o(T, "values", {
  closeOnBackdrop: { type: Boolean, default: !0 },
  closeOnEscape: { type: Boolean, default: !0 },
  lockScroll: { type: Boolean, default: !0 }
});
class y extends l {
  connect() {
    console.log("🎛️ Sidebar controller connected"), this.checkMobileState(), this.boundHandleResize = this.handleWindowResize.bind(this), this.boundHandleClickOutside = this.handleClickOutside.bind(this), window.addEventListener("resize", this.boundHandleResize), this.hasResizeHandleTarget && this.setupResizeHandle(), this.initializeCollapsibleSections(), this.applyInitialState();
  }
  disconnect() {
    console.log("🎛️ Sidebar controller disconnected"), window.removeEventListener("resize", this.boundHandleResize), document.removeEventListener("click", this.boundHandleClickOutside);
  }
  // ========================================
  // COLLAPSIBLE SECTIONS
  // ========================================
  // Toggle sezione collapsible
  toggleSection(e) {
    const t = e.currentTarget, s = t.dataset.buiSidebarSectionId, a = this.sectionContentTargets.find(
      (r) => r.dataset.buiSidebarSectionId === s
    );
    if (!a) return;
    t.getAttribute("aria-expanded") === "true" ? this.collapseSection(t, a) : this.expandSection(t, a);
  }
  // Espandi sezione
  expandSection(e, t) {
    e.setAttribute("aria-expanded", "true"), t.classList.remove("hidden");
    const s = e.querySelector("[data-bui-sidebar-chevron]");
    s && s.classList.add("rotate-90"), console.log("📂 Section expanded:", e.dataset.buiSidebarSectionId);
  }
  // Comprimi sezione
  collapseSection(e, t) {
    e.setAttribute("aria-expanded", "false"), t.classList.add("hidden");
    const s = e.querySelector("[data-bui-sidebar-chevron]");
    s && s.classList.remove("rotate-90"), console.log("📁 Section collapsed:", e.dataset.buiSidebarSectionId);
  }
  // ========================================
  // RESIZABLE WIDTH
  // ========================================
  // Setup drag handle per resize
  setupResizeHandle() {
    this.resizeHandleTarget.addEventListener("mousedown", this.startResize.bind(this)), this.resizeHandleTarget.addEventListener("touchstart", this.startResize.bind(this), { passive: !1 });
  }
  // Inizia resize
  startResize(e) {
    e.preventDefault(), this.isResizing = !0, this.startX = e.clientX || e.touches[0].clientX, this.startWidth = this.containerTarget.offsetWidth, document.addEventListener("mousemove", this.handleResize.bind(this)), document.addEventListener("mouseup", this.stopResize.bind(this)), document.addEventListener("touchmove", this.handleResize.bind(this), { passive: !1 }), document.addEventListener("touchend", this.stopResize.bind(this)), this.containerTarget.classList.add("bui-sidebar-resizing"), document.body.classList.add("bui-sidebar-resizing"), console.log("📏 Started resizing sidebar");
  }
  // Gestisce resize durante drag
  handleResize(e) {
    if (!this.isResizing) return;
    e.preventDefault();
    const s = (e.clientX || e.touches[0].clientX) - this.startX, a = Math.max(
      this.minWidthValue,
      Math.min(this.maxWidthValue, this.startWidth + s)
    );
    this.containerTarget.style.width = `${a}px`, this.widthValue = a;
  }
  // Termina resize
  stopResize() {
    this.isResizing && (this.isResizing = !1, document.removeEventListener("mousemove", this.handleResize.bind(this)), document.removeEventListener("mouseup", this.stopResize.bind(this)), document.removeEventListener("touchmove", this.handleResize.bind(this)), document.removeEventListener("touchend", this.stopResize.bind(this)), this.containerTarget.classList.remove("bui-sidebar-resizing"), document.body.classList.remove("bui-sidebar-resizing"), console.log("📏 Stopped resizing sidebar. New width:", this.widthValue));
  }
  // ========================================
  // MOBILE TOGGLE
  // ========================================
  // Toggle sidebar su mobile
  toggleMobile() {
    this.collapsedValue = !this.collapsedValue, this.updateMobileState();
  }
  // Mostra sidebar su mobile
  showMobile() {
    this.collapsedValue = !1, this.updateMobileState();
  }
  // Nasconde sidebar su mobile
  hideMobile() {
    this.collapsedValue = !0, this.updateMobileState();
  }
  // Aggiorna stato mobile
  updateMobileState() {
    this.mobileValue && (this.collapsedValue ? (this.containerTarget.classList.add("hidden"), this.hasOverlayTarget && this.overlayTarget.classList.add("hidden"), document.removeEventListener("click", this.boundHandleClickOutside)) : (this.containerTarget.classList.remove("hidden"), this.hasOverlayTarget && this.overlayTarget.classList.remove("hidden"), setTimeout(() => {
      document.addEventListener("click", this.boundHandleClickOutside);
    }, 100)), console.log("📱 Mobile sidebar:", this.collapsedValue ? "hidden" : "shown"));
  }
  // ========================================
  // PIN/UNPIN STATE
  // ========================================
  // Toggle pin state
  togglePin() {
    this.pinnedValue = !this.pinnedValue, this.updatePinState();
  }
  // Aggiorna stato pin
  updatePinState() {
    this.pinnedValue ? (this.containerTarget.classList.remove("absolute"), this.containerTarget.classList.add("relative")) : (this.containerTarget.classList.remove("relative"), this.containerTarget.classList.add("absolute")), console.log("📌 Sidebar pin state:", this.pinnedValue ? "pinned" : "floating");
  }
  // ========================================
  // ACTIVE STATE MANAGEMENT
  // ========================================
  // Imposta item attivo
  setActiveItem(e) {
    const t = e.currentTarget;
    this.clearAllActiveStates(), t.classList.add("bg-gray-100", "text-gray-900"), t.setAttribute("aria-current", "page"), console.log("🎯 Active item set:", t.textContent.trim());
  }
  // Rimuovi tutti gli stati attivi
  clearAllActiveStates() {
    this.containerTarget.querySelectorAll('[aria-current="page"]').forEach((t) => {
      t.classList.remove("bg-gray-100", "text-gray-900"), t.removeAttribute("aria-current");
    });
  }
  // ========================================
  // WINDOW EVENTS & UTILITIES
  // ========================================
  // Gestisce resize finestra
  handleWindowResize() {
    this.checkMobileState();
  }
  // Verifica se siamo su mobile
  checkMobileState() {
    const e = this.mobileValue;
    this.mobileValue = window.innerWidth < 768, e !== this.mobileValue && this.updateLayoutForBreakpoint();
  }
  // Aggiorna layout per breakpoint
  updateLayoutForBreakpoint() {
    this.mobileValue ? (this.collapsedValue = !0, this.updateMobileState()) : (this.collapsedValue = !1, this.containerTarget.classList.remove("hidden"), this.hasOverlayTarget && this.overlayTarget.classList.add("hidden"), document.removeEventListener("click", this.boundHandleClickOutside)), console.log("💻 Layout updated for:", this.mobileValue ? "mobile" : "desktop");
  }
  // Gestisce click esterno su mobile
  handleClickOutside(e) {
    !this.mobileValue || this.collapsedValue || this.containerTarget.contains(e.target) || this.hideMobile();
  }
  // Applica stato iniziale
  applyInitialState() {
    this.widthValue && !this.mobileValue && (this.containerTarget.style.width = `${this.widthValue}px`), this.updatePinState(), this.mobileValue && this.updateMobileState();
  }
  // Inizializza sezioni collapsible
  initializeCollapsibleSections() {
    this.sectionTriggerTargets.forEach((e) => {
      const t = e.dataset.buiSidebarSectionId, s = this.sectionContentTargets.find(
        (a) => a.dataset.buiSidebarSectionId === t
      );
      s && (e.getAttribute("aria-expanded") === "true" ? s.classList.remove("hidden") : s.classList.add("hidden"));
    });
  }
}
o(y, "targets", ["container", "section", "sectionTrigger", "sectionContent", "resizeHandle", "overlay"]), o(y, "values", {
  width: Number,
  minWidth: { type: Number, default: 200 },
  maxWidth: { type: Number, default: 400 },
  collapsed: Boolean,
  pinned: { type: Boolean, default: !0 },
  mobile: Boolean
});
class v extends l {
  connect() {
    console.log("🪗 BUI Accordion Controller connected"), console.log("🔧 Multiple mode:", this.multipleValue), this.initializeAriaStates(), this.initializeContentStates();
  }
  // Metodo principale per toggle di un item (referenziato nei componenti Ruby)
  toggle(e) {
    e.preventDefault();
    const t = e.currentTarget, s = t.closest('[data-bui-accordion-target="item"]');
    if (!s) {
      console.warn("⚠️ No accordion item found for trigger");
      return;
    }
    if (t.disabled) {
      console.log("🚫 Accordion item is disabled");
      return;
    }
    const a = s.querySelector('[data-bui-accordion-target="content"]'), n = s.querySelector('[data-bui-accordion-target="icon"]');
    if (!a) {
      console.warn("⚠️ No content found for accordion item");
      return;
    }
    const r = t.getAttribute("aria-expanded") === "true";
    console.log("🎯 Toggle accordion item, currently expanded:", r), r ? this.collapseItem(t, a, n) : (this.expandItem(t, a, n), this.multipleValue || this.collapseOtherItems(s));
  }
  // Gestione eventi tastiera per navigazione
  keydown(e) {
    const t = e.currentTarget, s = this.triggerTargets.indexOf(t);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault(), this.navigateDown(s);
        break;
      case "ArrowUp":
        e.preventDefault(), this.navigateUp(s);
        break;
      case "Home":
        e.preventDefault(), this.navigateToFirst();
        break;
      case "End":
        e.preventDefault(), this.navigateToLast();
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this.toggle(e);
        break;
    }
  }
  // Espande un item specifico
  expandItem(e, t, s) {
    console.log("📖 Expanding accordion item"), e.setAttribute("aria-expanded", "true"), t.classList.remove("hidden"), t.classList.add("block"), s && s.classList.add("rotate-180"), this.element.dispatchEvent(new CustomEvent("bui-accordion:expanded", {
      detail: { trigger: e, content: t },
      bubbles: !0
    }));
  }
  // Collassa un item specifico
  collapseItem(e, t, s) {
    console.log("📕 Collapsing accordion item"), e.setAttribute("aria-expanded", "false"), t.classList.remove("block"), t.classList.add("hidden"), s && s.classList.remove("rotate-180"), this.element.dispatchEvent(new CustomEvent("bui-accordion:collapsed", {
      detail: { trigger: e, content: t },
      bubbles: !0
    }));
  }
  // Collassa tutti gli altri item (per modalità single)
  collapseOtherItems(e) {
    console.log("🔄 Collapsing other items (single mode)"), this.itemTargets.forEach((t) => {
      if (t === e) return;
      const s = t.querySelector('[data-bui-accordion-target="trigger"]'), a = t.querySelector('[data-bui-accordion-target="content"]'), n = t.querySelector('[data-bui-accordion-target="icon"]');
      s && s.getAttribute("aria-expanded") === "true" && this.collapseItem(s, a, n);
    });
  }
  // Naviga al trigger successivo (con wrap-around)
  navigateDown(e) {
    const t = (e + 1) % this.triggerTargets.length;
    this.focusTrigger(t);
  }
  // Naviga al trigger precedente (con wrap-around)
  navigateUp(e) {
    const t = e <= 0 ? this.triggerTargets.length - 1 : e - 1;
    this.focusTrigger(t);
  }
  // Naviga al primo trigger
  navigateToFirst() {
    this.focusTrigger(0);
  }
  // Naviga all'ultimo trigger
  navigateToLast() {
    this.focusTrigger(this.triggerTargets.length - 1);
  }
  // Focus su un trigger specifico
  focusTrigger(e) {
    if (e >= 0 && e < this.triggerTargets.length) {
      const t = this.triggerTargets[e];
      t.disabled || t.focus();
    }
  }
  // Inizializza gli stati ARIA
  initializeAriaStates() {
    console.log("🎭 Initializing ARIA states"), this.triggerTargets.forEach((e) => {
      e.hasAttribute("aria-expanded") || e.setAttribute("aria-expanded", "false"), e.setAttribute("tabindex", "0");
    });
  }
  // Inizializza gli stati dei contenuti basandosi su aria-expanded
  initializeContentStates() {
    console.log("📋 Initializing content states"), this.triggerTargets.forEach((e) => {
      const t = e.closest('[data-bui-accordion-target="item"]');
      if (!t) return;
      const s = t.querySelector('[data-bui-accordion-target="content"]'), a = t.querySelector('[data-bui-accordion-target="icon"]');
      if (!s) return;
      const n = e.getAttribute("aria-expanded") === "true";
      n ? (s.classList.remove("hidden"), s.classList.add("block"), a && a.classList.add("rotate-180")) : (s.classList.remove("block"), s.classList.add("hidden"), a && a.classList.remove("rotate-180")), console.log(`🎯 Item initialized - expanded: ${n}`);
    });
  }
  // Metodi pubblici per controllo programmatico
  // Espande tutti gli item (solo se multiple = true)
  expandAll() {
    if (!this.multipleValue) {
      console.warn("⚠️ expandAll() not available in single mode");
      return;
    }
    console.log("📖 Expanding all items"), this.triggerTargets.forEach((e) => {
      const t = e.closest('[data-bui-accordion-target="item"]');
      if (!t || e.disabled) return;
      const s = t.querySelector('[data-bui-accordion-target="content"]'), a = t.querySelector('[data-bui-accordion-target="icon"]');
      s && e.getAttribute("aria-expanded") !== "true" && this.expandItem(e, s, a);
    });
  }
  // Collassa tutti gli item
  collapseAll() {
    console.log("📕 Collapsing all items"), this.triggerTargets.forEach((e) => {
      const t = e.closest('[data-bui-accordion-target="item"]');
      if (!t) return;
      const s = t.querySelector('[data-bui-accordion-target="content"]'), a = t.querySelector('[data-bui-accordion-target="icon"]');
      s && e.getAttribute("aria-expanded") === "true" && this.collapseItem(e, s, a);
    });
  }
  // Getter per stato accordion
  get expandedItems() {
    return this.triggerTargets.filter(
      (e) => e.getAttribute("aria-expanded") === "true"
    );
  }
  get collapsedItems() {
    return this.triggerTargets.filter(
      (e) => e.getAttribute("aria-expanded") !== "true"
    );
  }
}
o(v, "targets", ["item", "trigger", "content", "icon"]), o(v, "values", { multiple: Boolean });
class x extends l {
  connect() {
    this.close(), this.updateTriggerText(), this.boundClickOutside = this.clickOutside.bind(this), this.initializeOptions(), this.multipleValue && this.updateBadges();
  }
  disconnect() {
    document.removeEventListener("click", this.boundClickOutside);
  }
  // Initialize options from DOM
  initializeOptions() {
    this.hasOptionTargets && (this.optionsValue = this.optionTargets.map((e) => ({
      value: e.dataset.value,
      label: e.textContent.trim(),
      element: e
    })));
  }
  // Toggle dropdown
  toggle() {
    this.openValue ? this.close() : this.open();
  }
  // Open dropdown with animation
  open() {
    this.openValue = !0, this.dropdownTarget.classList.remove("hidden"), this.dropdownTarget.offsetHeight, this.dropdownTarget.classList.remove("opacity-0", "scale-95", "translate-y-1"), this.dropdownTarget.classList.add("opacity-100", "scale-100", "translate-y-0"), this.searchableValue && this.hasSearchTarget && setTimeout(() => this.searchTarget.focus(), 100), document.addEventListener("click", this.boundClickOutside);
  }
  // Close dropdown with animation
  close() {
    this.openValue && (this.openValue = !1, this.dropdownTarget.classList.remove("opacity-100", "scale-100", "translate-y-0"), this.dropdownTarget.classList.add("opacity-0", "scale-95", "translate-y-1"), setTimeout(() => {
      this.dropdownTarget.classList.add("hidden");
    }, 150), this.hasSearchTarget && (this.searchTarget.value = "", this.performSearch()), document.removeEventListener("click", this.boundClickOutside));
  }
  // Handle click outside
  clickOutside(e) {
    this.element.contains(e.target) || this.close();
  }
  // Select option
  selectOption(e) {
    const t = e.currentTarget.dataset.value, s = e.currentTarget.textContent.trim();
    this.multipleValue ? this.toggleMultipleSelection(t, s) : (this.setSingleSelection(t, s), this.close()), this.updateHiddenInput(), this.updateTriggerText();
  }
  // Toggle selection for multiple mode
  toggleMultipleSelection(e, t) {
    const s = [...this.selectedValue], a = s.findIndex((n) => n.value === e);
    a >= 0 ? s.splice(a, 1) : s.push({ value: e, label: t }), this.selectedValue = s, this.updateBadges();
  }
  // Set single selection
  setSingleSelection(e, t) {
    this.selectedValue = [{ value: e, label: t }];
  }
  // Remove selection (from badge)
  removeSelection(e) {
    const t = e.currentTarget.dataset.value, s = [...this.selectedValue], a = s.findIndex((n) => n.value === t);
    a >= 0 && (s.splice(a, 1), this.selectedValue = s, this.updateBadges(), this.updateHiddenInput(), this.updateTriggerText());
  }
  // Search functionality
  search(e) {
    this.performSearch();
  }
  performSearch() {
    if (!this.hasSearchTarget) return;
    const e = this.searchTarget.value.toLowerCase();
    this.optionTargets.forEach((t) => {
      const a = t.textContent.trim().toLowerCase().includes(e);
      t.style.display = a ? "block" : "none", e && a ? this.highlightMatch(t, e) : this.removeHighlight(t);
    });
  }
  // Highlight matching text
  highlightMatch(e, t) {
    const s = e.dataset.originalText || e.textContent;
    e.dataset.originalText = s;
    const a = new RegExp(`(${t})`, "gi"), n = s.replace(a, '<mark class="bg-yellow-200">$1</mark>');
    e.innerHTML = n;
  }
  // Remove highlight
  removeHighlight(e) {
    e.dataset.originalText && (e.textContent = e.dataset.originalText, delete e.dataset.originalText);
  }
  // Update trigger text
  updateTriggerText() {
    const e = this.triggerTarget.querySelector("[data-select-text]");
    e && (this.selectedValue.length === 0 ? (e.textContent = this.placeholderValue || "Seleziona...", e.classList.add("text-gray-500")) : this.multipleValue ? (this.selectedValue.length === 1 ? e.textContent = this.selectedValue[0].label : e.textContent = `${this.selectedValue.length} selezionati`, e.classList.remove("text-gray-500")) : (e.textContent = this.selectedValue[0].label, e.classList.remove("text-gray-500")));
  }
  // Update badges for multiple selection
  updateBadges() {
    !this.multipleValue || !this.hasBadgeContainerTarget || (this.badgeContainerTarget.innerHTML = "", this.selectedValue.length > 0 ? (this.badgeContainerTarget.style.display = "flex", this.selectedValue.forEach((e) => {
      const t = this.createBadge(e.value, e.label);
      this.badgeContainerTarget.appendChild(t);
    })) : this.badgeContainerTarget.style.display = "none");
  }
  // Create badge element
  createBadge(e, t) {
    const s = document.createElement("span");
    s.className = "inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded", s.dataset.selectTarget = "badge";
    const a = document.createElement("span");
    a.textContent = t;
    const n = document.createElement("button");
    return n.type = "button", n.className = "hover:text-gray-600", n.dataset.value = e, n.dataset.action = "click->select#removeSelection", n.innerHTML = "×", s.appendChild(a), s.appendChild(n), s;
  }
  // Update hidden input
  updateHiddenInput() {
    if (this.hasHiddenInputTarget)
      if (this.multipleValue) {
        const e = this.selectedValue.map((t) => t.value);
        this.hiddenInputTarget.value = JSON.stringify(e);
      } else
        this.hiddenInputTarget.value = this.selectedValue.length > 0 ? this.selectedValue[0].value : "";
  }
  // Keyboard navigation
  keydown(e) {
    switch (e.key) {
      case "Enter":
        e.preventDefault(), this.openValue || this.open();
        break;
      case "Escape":
        e.preventDefault(), this.openValue && this.close();
        break;
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault(), this.openValue || this.open();
        break;
    }
  }
  // Update selected state visual indicators
  selectedValueChanged() {
    this.updateOptionStates();
  }
  updateOptionStates() {
    this.optionTargets.forEach((e) => {
      const t = e.dataset.value, s = this.selectedValue.some((n) => n.value === t);
      e.classList.toggle("bg-gray-100", s);
      const a = e.querySelector(".checkmark");
      if (s && !a) {
        const n = document.createElement("span");
        n.className = "checkmark ml-auto text-gray-600", n.innerHTML = "✓", e.appendChild(n);
      } else !s && a && a.remove();
    });
  }
}
o(x, "targets", ["trigger", "dropdown", "search", "option", "hiddenInput", "badgeContainer", "badge"]), o(x, "values", {
  open: Boolean,
  multiple: Boolean,
  searchable: Boolean,
  selected: Array,
  options: Array,
  placeholder: String,
  searchPlaceholder: String
});
class w extends l {
  connect() {
    this.updateStarsDisplay();
  }
  // Handle star click
  starClick(e) {
    if (this.readonlyValue) return;
    const t = parseInt(e.currentTarget.dataset.index), s = this.halfStarsValue ? this.getClickPosition(e) > 0.5 : !0;
    this.ratingValue = s ? t + 1 : t + 0.5, this.updateStarsDisplay(), this.updateHiddenInput(), this.dispatch("change", { detail: { rating: this.ratingValue } });
  }
  // Handle star hover for preview
  starHover(e) {
    if (this.readonlyValue) return;
    const t = parseInt(e.currentTarget.dataset.index), a = (this.halfStarsValue ? this.getClickPosition(e) > 0.5 : !0) ? t + 1 : t + 0.5;
    this.updateStarsDisplay(a);
  }
  // Reset to actual rating when hover ends
  starLeave() {
    this.readonlyValue || this.updateStarsDisplay();
  }
  // Get click/hover position within star (0-1)
  getClickPosition(e) {
    const t = e.currentTarget.getBoundingClientRect();
    return (e.clientX - t.left) / t.width;
  }
  // Update visual display of stars
  updateStarsDisplay(e = null) {
    const t = e !== null ? e : this.ratingValue;
    this.starTargets.forEach((s, a) => {
      const n = a + 1, r = t;
      s.classList.remove("text-yellow-400", "text-yellow-300", "text-gray-300"), r >= n ? (s.classList.add("text-yellow-400"), s.innerHTML = "★") : this.halfStarsValue && r >= n - 0.5 ? (s.classList.add("text-yellow-300"), s.innerHTML = this.createHalfStar()) : (s.classList.add("text-gray-300"), s.innerHTML = "☆");
    }), this.hasDisplayTarget && (this.displayTarget.textContent = t > 0 ? t.toString() : "");
  }
  // Create half star HTML
  createHalfStar() {
    return `
      <span class="relative inline-block">
        <span class="text-gray-300">☆</span>
        <span class="absolute inset-0 overflow-hidden w-1/2">
          <span class="text-yellow-400">★</span>
        </span>
      </span>
    `;
  }
  // Update hidden input value
  updateHiddenInput() {
    this.hasHiddenInputTarget && (this.hiddenInputTarget.value = this.ratingValue);
  }
  // Handle rating value change
  ratingValueChanged() {
    this.updateStarsDisplay(), this.updateHiddenInput();
  }
  // Reset rating
  reset() {
    this.readonlyValue || (this.ratingValue = 0, this.updateStarsDisplay(), this.updateHiddenInput(), this.dispatch("change", { detail: { rating: this.ratingValue } }));
  }
  // Keyboard navigation
  keydown(e) {
    if (!this.readonlyValue)
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault(), this.incrementRating();
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault(), this.decrementRating();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          e.preventDefault(), this.setRating(parseInt(e.key));
          break;
        case "Escape":
          e.preventDefault(), this.reset();
          break;
      }
  }
  // Increment rating
  incrementRating() {
    const e = this.halfStarsValue ? 0.5 : 1, t = Math.min(this.ratingValue + e, this.maxValue);
    t !== this.ratingValue && (this.ratingValue = t, this.updateStarsDisplay(), this.updateHiddenInput(), this.dispatch("change", { detail: { rating: this.ratingValue } }));
  }
  // Decrement rating
  decrementRating() {
    const e = this.halfStarsValue ? 0.5 : 1, t = Math.max(this.ratingValue - e, 0);
    t !== this.ratingValue && (this.ratingValue = t, this.updateStarsDisplay(), this.updateHiddenInput(), this.dispatch("change", { detail: { rating: this.ratingValue } }));
  }
  // Set specific rating
  setRating(e) {
    const t = Math.min(Math.max(e, 0), this.maxValue);
    t !== this.ratingValue && (this.ratingValue = t, this.updateStarsDisplay(), this.updateHiddenInput(), this.dispatch("change", { detail: { rating: this.ratingValue } }));
  }
}
o(w, "targets", ["star", "hiddenInput", "display"]), o(w, "values", {
  rating: Number,
  max: Number,
  readonly: Boolean,
  halfStars: Boolean,
  name: String
});
class k extends l {
  connect() {
    this.initializeInputs(), this.updateHiddenInput();
  }
  // Initialize input states and values
  initializeInputs() {
    this.inputTargets.forEach((e, t) => {
      this.placeholderValue && (e.placeholder = this.placeholderValue), e.setAttribute("maxlength", "1"), e.setAttribute("autocomplete", "off"), e.setAttribute("inputmode", "numeric"), e.setAttribute("pattern", "[0-9]*"), e.dataset.index = t;
    });
  }
  // Handle input on each field
  inputChange(e) {
    const t = e.currentTarget, s = t.value, a = parseInt(t.dataset.index);
    (s.length > 1 || !/^\d*$/.test(s)) && (t.value = s.slice(-1).replace(/\D/g, "")), t.value.length === 1 && a < this.lengthValue - 1 && this.focusInput(a + 1), this.updateHiddenInput(), this.checkCompletion();
  }
  // Handle keydown events (backspace, arrows, etc.)
  inputKeydown(e) {
    const t = e.currentTarget, s = parseInt(t.dataset.index);
    switch (e.key) {
      case "Backspace":
        t.value === "" && s > 0 && (e.preventDefault(), this.focusInput(s - 1), this.inputTargets[s - 1].value = "", this.updateHiddenInput());
        break;
      case "ArrowLeft":
        e.preventDefault(), s > 0 && this.focusInput(s - 1);
        break;
      case "ArrowRight":
        e.preventDefault(), s < this.lengthValue - 1 && this.focusInput(s + 1);
        break;
      case "ArrowUp":
      case "ArrowDown":
        e.preventDefault();
        break;
      case "Delete":
        t.value = "", this.updateHiddenInput();
        break;
      case "Tab":
        break;
      default:
        !/^\d$/.test(e.key) && !["Backspace", "Delete", "Tab", "Enter"].includes(e.key) && e.preventDefault();
    }
  }
  // Handle paste events
  inputPaste(e) {
    e.preventDefault();
    const s = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, this.lengthValue);
    if (s.length > 0) {
      this.fillInputs(s), this.updateHiddenInput(), this.checkCompletion();
      const a = Math.min(s.length, this.lengthValue - 1);
      this.focusInput(a);
    }
  }
  // Fill inputs with provided digits
  fillInputs(e) {
    this.inputTargets.forEach((t, s) => {
      t.value = e[s] || "";
    });
  }
  // Focus specific input by index
  focusInput(e) {
    e >= 0 && e < this.inputTargets.length && (this.inputTargets[e].focus(), this.inputTargets[e].select());
  }
  // Update hidden input with combined value
  updateHiddenInput() {
    if (this.hasHiddenInputTarget) {
      const e = this.inputTargets.map((t) => t.value).join("");
      this.hiddenInputTarget.value = e;
    }
  }
  // Check if all fields are filled and dispatch completion event
  checkCompletion() {
    const e = this.inputTargets.map((s) => s.value).join(""), t = e.length === this.lengthValue;
    this.element.classList.toggle("pin-complete", t), t ? this.dispatch("complete", {
      detail: {
        value: e,
        element: this.element
      }
    }) : this.dispatch("incomplete", {
      detail: {
        value: e,
        element: this.element
      }
    });
  }
  // Public method to get current value
  getValue() {
    return this.inputTargets.map((e) => e.value).join("");
  }
  // Public method to set value
  setValue(e) {
    const t = e.toString().replace(/\D/g, "").slice(0, this.lengthValue);
    this.fillInputs(t), this.updateHiddenInput(), this.checkCompletion();
  }
  // Public method to clear all inputs
  clear() {
    this.inputTargets.forEach((e) => {
      e.value = "";
    }), this.updateHiddenInput(), this.focusInput(0), this.element.classList.remove("pin-complete");
  }
  // Public method to focus first input
  focus() {
    this.focusInput(0);
  }
  // Handle form reset
  reset() {
    this.clear();
  }
  // Disable all inputs
  disable() {
    this.inputTargets.forEach((e) => {
      e.disabled = !0;
    });
  }
  // Enable all inputs
  enable() {
    this.inputTargets.forEach((e) => {
      e.disabled = !1;
    });
  }
}
o(k, "targets", ["input", "hiddenInput"]), o(k, "values", {
  length: Number,
  name: String,
  placeholder: String
});
function oe(i) {
  i.register("example", ae), i.register("bui-dropdown", g), i.register("bui-tabs", m), i.register("bui-modal", T), i.register("bui-sidebar", y), i.register("bui-accordion", v), i.register("select", x), i.register("bui-rating", w), i.register("bui-pin", k);
}
console.log("CIAO");
export {
  v as AccordionController,
  g as DropdownController,
  ae as ExampleController,
  T as ModalController,
  k as PinController,
  w as RatingController,
  x as SelectController,
  y as SidebarController,
  m as TabsController,
  oe as registerBetterUiComponents
};
