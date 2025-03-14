!(function (e) {
  var t = {};
  function n(s) {
    if (t[s]) return t[s].exports;
    var r = (t[s] = { i: s, l: !1, exports: {} });
    return e[s].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, s) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: s });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var s = Object.create(null);
      if (
        (n.r(s),
        Object.defineProperty(s, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var r in e)
          n.d(
            s,
            r,
            function (t) {
              return e[t];
            }.bind(null, r)
          );
      return s;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 459));
})({
  136: function (e, t) {
    e.exports =
      '.sa-gamepad-container {\n  margin-right: 0.2rem;\n}\n\n.sa-gamepad-spacer {\n  display: flex;\n  width: 100%;\n  justify-content: flex-end;\n}\n\n.sa-gamepad-popup-outer {\n  /* above fullscreen */\n  z-index: 99999;\n}\n.sa-gamepad-popup {\n  box-sizing: border-box;\n  width: 700px;\n  max-height: min(800px, 85vh);\n  height: 100%;\n  max-width: 85%;\n  margin: 50px auto;\n  display: flex;\n  flex-direction: column;\n}\n.sa-gamepad-popup-content {\n  background-color: white;\n  padding: 1.5rem 2.25rem;\n  height: 100%;\n  overflow-y: auto;\n}\n\n.sa-gamepad-popup [class*="modal_header-item-title"] {\n  margin: 0 -20rem 0 0;\n}\n\n.sa-gamepad-cursor {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 9999;\n  user-select: none;\n  pointer-events: none;\n  will-change: transform;\n  image-rendering: optimizeSpeed;\n  image-rendering: crisp-edges;\n  image-rendering: pixelated;\n}\n.sa-gamepad-cursor-down {\n  filter: invert(100%);\n}\n\n.sa-gamepad-small .sa-gamepad-container[data-editor-mode="editor"] {\n  display: none !important;\n}\n\n.sa-gamepad-hide-cursor {\n  cursor: none;\n}\n\n.sa-gamepad-browser-support-warning {\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n\n.sa-gamepad-store-settings {\n  display: none;\n}\n.sa-gamepad-store-settings > input {\n  margin-right: 4px;\n}\n.sa-gamepad-has-controller .sa-gamepad-store-settings {\n  display: block;\n}\n';
  },
  137: function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    const isPromise = (e) => !!e && "function" == typeof e.then,
      jsValueToScratchValue = (e) =>
        "boolean" == typeof e || "number" == typeof e || "string" == typeof e
          ? e
          : "" + e;
    class UnsafeCloudBehaviorsProvider {
      enable() {}
      setEvalValue(e) {
        this.manager.setVariable(
          this,
          "☁ eval output",
          jsValueToScratchValue(e)
        );
      }
      setEvalError(e) {
        console.error("Error evaluating ☁ eval", e),
          this.manager.setVariable(
            this,
            "☁ eval error",
            jsValueToScratchValue(e)
          );
      }
      evaluateAsync(js) {
        try {
          const value = eval(js);
          isPromise(value)
            ? value
                .then((e) => this.setEvalValue(e))
                .catch((e) => this.setEvalError(e))
            : this.setEvalValue(value);
        } catch (e) {
          this.setEvalError(e);
        }
      }
      handleUpdateVariable(e, t) {
        "☁ eval" === e && this.evaluateAsync(t);
      }
    }
    __webpack_exports__.a = function (e) {
      let { scaffolding: t } = e;
      const n = new UnsafeCloudBehaviorsProvider();
      t.addCloudProvider(n),
        t.addCloudProviderOverride("☁ eval", n),
        t.addCloudProviderOverride("☁ eval output", n),
        t.addCloudProviderOverride("☁ eval error", n);
    };
  },
  459: function (e, t, n) {
    "use strict";
    n.r(t);
    var s = n(8);
    let r = window.console;
    const i = [
        { type: "key", high: "ArrowRight", low: "ArrowLeft", deadZone: 0.5 },
        { type: "key", high: "ArrowDown", low: "ArrowUp", deadZone: 0.5 },
      ],
      o = [
        { type: "key", high: "d", low: "a", deadZone: 0.5 },
        { type: "key", high: "s", low: "w", deadZone: 0.5 },
      ],
      a = [
        {
          type: "virtual_cursor",
          high: "+x",
          low: "-x",
          sensitivity: 0.6,
          deadZone: 0.2,
        },
        {
          type: "virtual_cursor",
          high: "-y",
          low: "+y",
          sensitivity: 0.6,
          deadZone: 0.2,
        },
      ],
      d = (e) => {
        if ("object" != typeof e || !e)
          return (
            r.warn("invalid mapping", e), { type: "key", high: null, low: null }
          );
        const t = Object.assign({}, e);
        if ("key" === t.type)
          void 0 === t.deadZone && (t.deadZone = 0.5),
            void 0 === t.high && (t.high = ""),
            void 0 === t.low && (t.low = "");
        else if ("mousedown" === t.type)
          void 0 === t.deadZone && (t.deadZone = 0.5),
            void 0 === t.button && (t.button = 0);
        else {
          if ("virtual_cursor" !== t.type)
            return (
              r.warn("unknown mapping type", t.type),
              { type: "key", high: null, low: null }
            );
          void 0 === t.high && (t.high = ""),
            void 0 === t.low && (t.low = ""),
            void 0 === t.sensitivity && (t.sensitivity = 10),
            void 0 === t.deadZone && (t.deadZone = 0.5);
        }
        return t;
      },
      u = (e, t) => {
        for (; e.length < t; ) e.push({ type: "key", high: null, low: null });
        return (e.length = t), e;
      },
      c = (e) => u([], e),
      l = (e) => ({
        usesArrows:
          e.has("ArrowUp") ||
          e.has("ArrowDown") ||
          e.has("ArrowRight") ||
          e.has("ArrowLeft"),
        usesWASD: (e.has("w") && e.has("s")) || (e.has("a") && e.has("d")),
      }),
      h = (e) => "".concat(e.id, " (").concat(e.index, ")");
    class p {
      constructor(e, t) {
        (this.gamepad = e), (this.gamepadLib = t), this.resetMappings();
      }
      resetMappings() {
        (this.hints = this.gamepadLib.getHints()),
          (this.buttonMappings = this.getDefaultButtonMappings().map(d)),
          (this.axesMappings = this.getDefaultAxisMappings().map(d));
      }
      clearMappings() {
        (this.buttonMappings = c(this.gamepad.buttons.length)),
          (this.axesMappings = c(this.gamepad.axes.length));
      }
      getDefaultButtonMappings() {
        let e;
        if (this.hints.importedSettings)
          e = this.hints.importedSettings.buttons;
        else {
          const t = this.hints.usedKeys,
            n = new Set(),
            { usesArrows: s, usesWASD: r } = l(t);
          r && (n.add("w"), n.add("a"), n.add("s"), n.add("d"));
          const i = ["p", "q", "r"],
            o = [
              " ",
              "Enter",
              "e",
              "f",
              "z",
              "x",
              "c",
              ...Array.from(t).filter((e) => 1 === e.length && !i.includes(e)),
            ],
            a = (e) => {
              for (const s of e) if (t.has(s) && !n.has(s)) return n.add(s), s;
              return null;
            },
            d = () => a(o),
            u = () => a(i),
            c = () => (s || !r ? "ArrowUp" : "w"),
            h = () => (s || !r ? "ArrowDown" : "s"),
            p = () => (s || !r ? "ArrowRight" : "d"),
            m = () => (s || !r ? "ArrowLeft" : "a"),
            g = (() =>
              s && t.has("ArrowUp")
                ? "ArrowUp"
                : r && t.has("w")
                ? "w"
                : a(o))();
          let v = d(),
            f = d(),
            y = d();
          !g || v || f || y || ((v = g), (f = g), (y = g)),
            g && v && !f && !y && ((f = g), (y = v)),
            (e = []),
            (e[0] = { type: "key", high: g }),
            (e[1] = { type: "key", high: v }),
            (e[2] = { type: "key", high: f }),
            (e[3] = { type: "key", high: y }),
            (e[4] = { type: "mousedown" }),
            (e[5] = { type: "mousedown" }),
            (e[6] = { type: "mousedown" }),
            (e[7] = { type: "mousedown" }),
            (e[9] = { type: "key", high: u() }),
            (e[8] = { type: "key", high: u() }),
            (e[10] = { type: "key", high: null, low: null }),
            (e[11] = { type: "key", high: null, low: null }),
            (e[12] = { type: "key", high: c() }),
            (e[13] = { type: "key", high: h() }),
            (e[14] = { type: "key", high: m() }),
            (e[15] = { type: "key", high: p() });
        }
        return u(e, this.gamepad.buttons.length);
      }
      getDefaultAxisMappings() {
        let e = [];
        if (this.hints.importedSettings) e = this.hints.importedSettings.axes;
        else if (4 === this.gamepad.axes.length) {
          const t = this.hints.usedKeys,
            { usesArrows: n, usesWASD: s } = l(t);
          s
            ? (e.push(o[0]), e.push(o[1]))
            : n
            ? (e.push(i[0]), e.push(i[1]))
            : (e.push(a[0]), e.push(a[1])),
            e.push(a[0]),
            e.push(a[1]);
        }
        return u(e, this.gamepad.axes.length);
      }
    }
    class m extends s.b {
      constructor() {
        super(),
          (this.gamepads = new Map()),
          (this.handleConnect = this.handleConnect.bind(this)),
          (this.handleDisconnect = this.handleDisconnect.bind(this)),
          (this.update = this.update.bind(this)),
          (this.animationFrame = null),
          (this.currentTime = null),
          (this.deltaTime = 0),
          (this.virtualCursor = {
            x: 0,
            y: 0,
            maxX: 1 / 0,
            minX: -1 / 0,
            maxY: 1 / 0,
            minY: -1 / 0,
            modified: !1,
          }),
          (this._editor = null),
          (this.connectCallbacks = []),
          (this.keysPressedThisFrame = new Set()),
          (this.oldKeysPressed = new Set()),
          (this.mouseButtonsPressedThisFrame = new Set()),
          (this.oldMouseDown = new Set()),
          this.addEventHandlers();
      }
      addEventHandlers() {
        window.addEventListener("gamepadconnected", this.handleConnect),
          window.addEventListener("gamepaddisconnected", this.handleDisconnect);
      }
      removeEventHandlers() {
        window.removeEventListener("gamepadconnected", this.handleConnect),
          window.removeEventListener(
            "gamepaddisconnected",
            this.handleDisconnect
          );
      }
      gamepadConnected() {
        return this.gamepads.size > 0
          ? Promise.resolve()
          : new Promise((e) => {
              this.connectCallbacks.push(e);
            });
      }
      getHints() {
        return Object.assign(
          { usedKeys: new Set(), importedSettings: null, generated: !1 },
          this.getUserHints()
        );
      }
      getUserHints() {
        return {};
      }
      resetControls() {
        for (const e of this.gamepads.values()) e.resetMappings();
      }
      clearControls() {
        for (const e of this.gamepads.values()) e.clearMappings();
      }
      handleConnect(e) {
        for (const e of this.connectCallbacks) e();
        this.connectCallbacks = [];
        const t = e.gamepad,
          n = h(t);
        r.log("connected", t);
        const i = new p(t, this);
        this.gamepads.set(n, i),
          null === this.animationFrame &&
            (this.animationFrame = requestAnimationFrame(this.update)),
          this.dispatchEvent(new s.a("gamepadconnected", { detail: i }));
      }
      handleDisconnect(e) {
        const t = e.gamepad,
          n = h(t);
        r.log("disconnected", t);
        const i = this.gamepads.get(n);
        this.gamepads.delete(n),
          this.dispatchEvent(new s.a("gamepaddisconnected", { detail: i })),
          0 === this.gamepads.size &&
            (cancelAnimationFrame(this.animationFrame),
            (this.animationFrame = null),
            (this.currentTime = null));
      }
      dispatchKey(e, t) {
        t
          ? this.dispatchEvent(new s.a("keydown", { detail: e }))
          : this.dispatchEvent(new s.a("keyup", { detail: e }));
      }
      dispatchMouse(e, t) {
        t
          ? this.dispatchEvent(new s.a("mousedown", { detail: e }))
          : this.dispatchEvent(new s.a("mouseup", { detail: e }));
      }
      dispatchMouseMove(e, t) {
        this.dispatchEvent(new s.a("mousemove", { detail: { x: e, y: t } }));
      }
      updateButton(e, t) {
        if ("key" === t.type)
          e >= t.deadZone
            ? t.high && this.keysPressedThisFrame.add(t.high)
            : e <= -t.deadZone && t.low && this.keysPressedThisFrame.add(t.low);
        else if ("mousedown" === t.type) {
          Math.abs(e) >= t.deadZone &&
            this.mouseButtonsPressedThisFrame.add(t.button);
        } else if ("virtual_cursor" === t.type) {
          const n = t.deadZone;
          let s;
          if ((e >= n && (s = t.high), e <= -n && (s = t.low), s)) {
            const r = (Math.abs(e) - n) / (1 - n),
              i = r * r * t.sensitivity * this.deltaTime;
            "+x" === s
              ? (this.virtualCursor.x += i)
              : "-x" === s
              ? (this.virtualCursor.x -= i)
              : "+y" === s
              ? (this.virtualCursor.y += i)
              : "-y" === s && (this.virtualCursor.y -= i),
              (this.virtualCursor.modified = !0);
          }
        }
      }
      update(e) {
        (this.oldKeysPressed = this.keysPressedThisFrame),
          (this.oldMouseButtonsPressed = this.mouseButtonsPressedThisFrame),
          (this.keysPressedThisFrame = new Set()),
          (this.mouseButtonsPressedThisFrame = new Set()),
          null === this.currentTime
            ? (this.deltaTime = 0)
            : (this.deltaTime = e - this.currentTime),
          (this.deltaTime = Math.max(Math.min(this.deltaTime, 1e3), 0)),
          (this.currentTime = e),
          (this.animationFrame = requestAnimationFrame(this.update));
        const t = navigator.getGamepads();
        for (const e of t) {
          if (null === e) continue;
          const t = h(e),
            n = this.gamepads.get(t);
          for (let t = 0; t < e.buttons.length; t++) {
            const s = e.buttons[t].value,
              r = n.buttonMappings[t];
            this.updateButton(s, r);
          }
          for (let t = 0; t < e.axes.length; t++) {
            const s = e.axes[t],
              r = n.axesMappings[t];
            this.updateButton(s, r);
          }
        }
        this._editor && this._editor.update(t);
        for (const e of this.keysPressedThisFrame)
          this.oldKeysPressed.has(e) || this.dispatchKey(e, !0);
        for (const e of this.oldKeysPressed)
          this.keysPressedThisFrame.has(e) || this.dispatchKey(e, !1);
        for (const e of this.mouseButtonsPressedThisFrame)
          this.oldMouseButtonsPressed.has(e) || this.dispatchMouse(e, !0);
        for (const e of this.oldMouseButtonsPressed)
          this.mouseButtonsPressedThisFrame.has(e) || this.dispatchMouse(e, !1);
        this.virtualCursor.modified &&
          ((this.virtualCursor.modified = !1),
          this.virtualCursor.x > this.virtualCursor.maxX &&
            (this.virtualCursor.x = this.virtualCursor.maxX),
          this.virtualCursor.x < this.virtualCursor.minX &&
            (this.virtualCursor.x = this.virtualCursor.minX),
          this.virtualCursor.y > this.virtualCursor.maxY &&
            (this.virtualCursor.y = this.virtualCursor.maxY),
          this.virtualCursor.y < this.virtualCursor.minY &&
            (this.virtualCursor.y = this.virtualCursor.minY),
          this.dispatchMouseMove(this.virtualCursor.x, this.virtualCursor.y));
      }
    }
    (m.browserHasBrokenGamepadAPI = () =>
      !navigator.getGamepads ||
      !(
        !navigator.userAgent.includes("Firefox") ||
        !navigator.userAgent.includes("Linux")
      ) ||
      !(
        !navigator.userAgent.includes("Firefox") ||
        !navigator.userAgent.includes("Mac OS")
      )),
      (m.setConsole = (e) => (r = e));
    var g = m;
    function v(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var s = Object.getOwnPropertySymbols(e);
        t &&
          (s = s.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          n.push.apply(n, s);
      }
      return n;
    }
    function f(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? v(Object(n), !0).forEach(function (t) {
              y(e, t, n[t]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : v(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t)
              );
            });
      }
      return e;
    }
    function y(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = n),
        e
      );
    }
    var w = async function (e, t) {
        const n = e.vm;
        await new Promise((e) => {
          if (n.editingTarget) return e();
          n.runtime.once("PROJECT_LOADED", e);
        });
        const s = () => null !== n.runtime._steppingInterval,
          r = (e) => {
            switch (e) {
              case "right arrow":
                return "ArrowRight";
              case "up arrow":
                return "ArrowUp";
              case "left arrow":
                return "ArrowLeft";
              case "down arrow":
                return "ArrowDown";
              case "enter":
                return "Enter";
              case "space":
                return " ";
            }
            return e.toLowerCase().charAt(0);
          },
          i = () => {
            const e = [n.runtime.getTargetForStage(), ...n.runtime.targets]
                .filter((e) => e.isOriginal)
                .map((e) => e.blocks),
              t = new Set();
            for (const n of e)
              for (const e of Object.values(n._blocks))
                if (
                  "event_whenkeypressed" === e.opcode ||
                  "sensing_keyoptions" === e.opcode
                ) {
                  if ("sensing_keyoptions" === e.opcode && !e.parent) continue;
                  const n = e.fields.KEY_OPTION.value;
                  t.add(r(n));
                }
            return t;
          };
        g.setConsole(console);
        const o = new g(),
          a = (() => {
            const e = (() => {
              const e = n.runtime.getTargetForStage().comments;
              for (const t of Object.values(e))
                if (t.text.includes(" // _gamepad_")) return t;
              return null;
            })();
            if (!e) return null;
            const t = e.text
              .split("\n")
              .find((e) => e.endsWith(" // _gamepad_"));
            if (!t)
              return (
                console.warn("Gamepad comment does not contain valid line"),
                null
              );
            const s = t.substr(0, t.length - " // _gamepad_".length);
            let r;
            try {
              if (
                ((r = JSON.parse(s)),
                !r ||
                  "object" != typeof r ||
                  !Array.isArray(r.buttons) ||
                  !Array.isArray(r.axes))
              )
                throw new Error("Invalid data");
            } catch (e) {
              return console.warn("Gamepad comment has invalid JSON", e), null;
            }
            return r;
          })();
        o.getUserHints = () =>
          a ? { importedSettings: a } : { usedKeys: i() };
        const d = n.runtime.renderer,
          u = d._xRight - d._xLeft,
          c = d._yTop - d._yBottom,
          l = d.canvas,
          h = document.createElement("img");
        let p;
        (h.hidden = !0),
          (h.className = "sa-gamepad-cursor"),
          (h.src = ((e) => {
            if ("/active.png" === e)
              return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAIAAABvrngfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAgSURBVBhXY/z//z8DKmCC0kgAKsQIBhA2FlXEmMXAAAC+2gYLeDM0CAAAAABJRU5ErkJggg==";
            if ("/close.svg" === e)
              return "data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDcuNDggNy40OCI+PHBhdGggZD0iTTMuNzQgNi40OFYxTTEgMy43NGg1LjQ4IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojZmZmO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4Ii8+PC9zdmc+Cg==";
            if ("/cursor.png" === e)
              return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAIAAABvrngfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAVSURBVBhXYyAF/AcDCJsJQpEKGBgAjmQF/WBrfi0AAAAASUVORK5CYII=";
            if ("/dot.svg" === e)
              return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHZpZXdCb3g9IjAgMCAyLjExNyAyLjExNyI+PGNpcmNsZSBjeD0iMS4wNTgiIGN5PSIxLjA1OCIgcj0iMS4wNTgiIGZpbGw9InJlZCIvPjwvc3ZnPgo=";
            throw new Error("Unknown asset: ".concat(e));
          })("/cursor.png"));
        const m = (e) => {
            (h.hidden = !e),
              clearTimeout(p),
              e &&
                (document.body.classList.add("sa-gamepad-hide-cursor"),
                (p = setTimeout(v, 8e3)));
          },
          v = () => {
            m(!1);
          },
          y = (e) => {
            m(!0), h.classList.toggle("sa-gamepad-cursor-down", e);
          };
        let w;
        if (
          (document.addEventListener("mousemove", () => {
            m(!1), document.body.classList.remove("sa-gamepad-hide-cursor");
          }),
          window.ResizeObserver)
        ) {
          let e = u,
            t = c;
          new ResizeObserver((n) => {
            for (const s of n)
              (e = s.contentRect.width), (t = s.contentRect.height);
          }).observe(l),
            (w = () => [e, t]);
        } else
          w = () => {
            const e = l.getBoundingClientRect();
            return [e.width, e.height];
          };
        let A = 0,
          b = 0;
        const C = (e) => {
            if (!s()) return;
            const [t, r] = w();
            n.postIOData(
              "mouse",
              f(
                f({}, e),
                {},
                {
                  canvasWidth: t,
                  canvasHeight: r,
                  x: (A + u / 2) * (t / u),
                  y: (r / c) * (c / 2 - b),
                }
              )
            );
          },
          x = (e, t) => {
            s() && n.postIOData("keyboard", { key: e, isDown: t });
          };
        t ||
          ((o.virtualCursor.maxX = d._xRight),
          (o.virtualCursor.minX = d._xLeft),
          (o.virtualCursor.maxY = d._yTop),
          (o.virtualCursor.minY = d._yBottom)),
          o.addEventListener("keydown", (e) => x(e.detail, !0)),
          o.addEventListener("keyup", (e) => x(e.detail, !1)),
          o.addEventListener("mousedown", (e) => {
            y(!0), C({ isDown: !0, button: e.detail });
          }),
          o.addEventListener("mouseup", (e) => {
            y(!1), C({ isDown: !1, button: e.detail });
          }),
          o.addEventListener("mousemove", (s) => {
            const { x: r, y: i } = s.detail;
            if (t) {
              const t = r - A,
                s = -(i - b);
              (A = r), (b = i);
              const o = 4,
                a = e.layersRect.width / n.runtime.stageWidth,
                d = e.layersRect.height / n.runtime.stageHeight;
              n.pointerLockMove(t * o * a, s * o * d);
            } else
              (A = r),
                (b = i),
                ((e, t) => {
                  m(!0);
                  const n = u / 2 + e - 3,
                    s = c / 2 - t - 3;
                  h.style.transform = "translate("
                    .concat(n, "px, ")
                    .concat(s, "px)");
                })(A, b),
                C({});
          }),
          t || e._overlays.appendChild(h);
      },
      A = n(136),
      b = n.n(A);
    var C = (e) => {
      let { scaffolding: t, options: n } = e;
      w(t, n.pointerlock),
        ((e) => {
          const t = document.createElement("style");
          (t.textContent = e), document.head.appendChild(t);
        })(b.a);
    };
    var x = (e) => {
      let { scaffolding: t } = e;
      const n = t._canvas,
        s = t.vm,
        r = s.runtime.ioDevices.mouse;
      let i = !1;
      const o = (e, n) => {
        const { movementX: i, movementY: o } = e,
          { width: a, height: d } = t.layersRect,
          u = r._clientX + i,
          c = r._clientY - o;
        if (
          ((r._clientX = u),
          (r._scratchX = r.runtime.stageWidth * (u / a - 0.5)),
          (r._clientY = c),
          (r._scratchY = r.runtime.stageWidth * (c / d - 0.5)),
          "boolean" == typeof n)
        ) {
          const t = { button: e.button, isDown: n };
          s.postIOData("mouse", t);
        }
      };
      document.addEventListener(
        "mousedown",
        (e) => {
          n.contains(e.target) &&
            (e.stopPropagation(), i ? o(e, !0) : n.requestPointerLock());
        },
        !0
      ),
        document.addEventListener(
          "mouseup",
          (e) => {
            e.stopPropagation(),
              i ? o(e, !1) : n.contains(e.target) && n.requestPointerLock();
          },
          !0
        ),
        document.addEventListener(
          "mousemove",
          (e) => {
            e.stopPropagation(), i && o(e);
          },
          !0
        ),
        t.addEventListener("PROJECT_RUN_START", () => {
          i || n.requestPointerLock();
        }),
        document.addEventListener("pointerlockchange", () => {
          i = document.pointerLockElement === n;
        }),
        document.addEventListener("pointerlockerror", (e) => {
          console.error("Pointer lock error", e);
        }),
        (s.pointerLockMove = (e, t) => {
          o({ movementX: e, movementY: t });
        });
      const a = s.runtime._step;
      s.runtime._step = function () {
        for (var e = arguments.length, n = new Array(e), s = 0; s < e; s++)
          n[s] = arguments[s];
        const i = a.call(this, ...n),
          { width: o, height: d } = t.layersRect;
        return (
          (r._clientX = o / 2),
          (r._clientY = d / 2),
          (r._scratchX = 0),
          (r._scratchY = 0),
          i
        );
      };
    };
    const P = ["http:", "https:", "data:", "file:", "mailto:"],
      k = (e) => {
        try {
          const t = new URL(e, location.href);
          return P.includes(t.protocol);
        } catch (e) {
          return !1;
        }
      },
      _ = (e) => {
        window.open(e);
      },
      E = (e) => {
        location.href = e;
      };
    class O {
      enable() {
        this.manager.setVariable(this, "☁ url", location.href),
          document.addEventListener("paste", (e) => {
            const t = (e.clipboardData || window.clipboardData).getData("text");
            this.manager.setVariable(this, "☁ pasted", t);
          }),
          (this.webSocketProvider = this.manager.providers.find(
            (e) => "function" == typeof e.setProjectId
          )),
          (this.initialProjectId = this.webSocketProvider
            ? this.webSocketProvider.projectId
            : null);
      }
      handleUpdateVariable(e, t) {
        if ("☁ redirect" === e)
          k(t) &&
            (((e) => {
              try {
                return "data:" === new URL(e, location.href).protocol;
              } catch (e) {
                return !1;
              }
            })(t)
              ? _(t)
              : E(t));
        else if ("☁ open link" === e)
          k(t) &&
            (((e) => {
              try {
                return "mailto:" === new URL(e, location.href).protocol;
              } catch (e) {
                return !1;
              }
            })(t)
              ? E(t)
              : _(t));
        else if ("☁ username" === e) this.manager.parent.setUsername(t);
        else if ("☁ set clipboard" === e) navigator.clipboard.writeText(t);
        else if ("☁ room id" === e && this.webSocketProvider) {
          const e = this.initialProjectId + (t ? "-".concat(t) : "");
          this.webSocketProvider.setProjectId(e);
        }
      }
    }
    var S = n(137);
    window.ScaffoldingAddons = {
      run: (e, t) => {
        const n = { scaffolding: e, options: t };
        t.gamepad && C(n),
          t.pointerlock && x(n),
          t.specialCloudBehaviors &&
            (function (e) {
              let { scaffolding: t } = e;
              const n = new O();
              t.addCloudProvider(n),
                t.addCloudProviderOverride("☁ url", n),
                t.addCloudProviderOverride("☁ redirect", n),
                t.addCloudProviderOverride("☁ open link", n),
                t.addCloudProviderOverride("☁ username", n),
                t.addCloudProviderOverride("☁ set clipboard", n),
                t.addCloudProviderOverride("☁ pasted", n),
                t.addCloudProviderOverride("☁ room id", n);
            })(n),
          t.unsafeCloudBehaviors && Object(S.a)(n),
          t.pause &&
            (function (e) {
              let { scaffolding: t } = e;
              const n = t.vm;
              let s = !1,
                r = new WeakMap(),
                i = Promise.resolve();
              const o = (e) => {
                  if (((s = e), s)) {
                    (i = i.then(() =>
                      n.runtime.audioEngine.audioContext.suspend()
                    )),
                      n.runtime.ioDevices.clock._paused ||
                        n.runtime.ioDevices.clock.pause();
                    for (const e of n.runtime.threads)
                      if (!e.updateMonitor && !r.has(e)) {
                        const t = {
                          pauseTime: n.runtime.currentMSecs,
                          status: e.status,
                        };
                        r.set(e, t), (e.status = 1);
                      }
                    n.runtime.emit("PROJECT_RUN_STOP");
                  } else {
                    (i = i.then(() =>
                      n.runtime.audioEngine.audioContext.resume()
                    )),
                      n.runtime.ioDevices.clock.resume();
                    const e = Date.now();
                    for (const t of n.runtime.threads) {
                      const n = r.get(t);
                      if (n) {
                        const s = t.peekStackFrame();
                        if (
                          s &&
                          s.executionContext &&
                          s.executionContext.timer
                        ) {
                          const t = e - n.pauseTime;
                          s.executionContext.timer.startTime += t;
                        }
                        if (t.timer) {
                          const s = e - n.pauseTime;
                          t.timer.startTime += s;
                        }
                        t.status = n.status;
                      }
                    }
                    r = new WeakMap();
                  }
                  n.emit("P4_PAUSE", s);
                },
                a = (e) => {
                  if (4 === e.status) return;
                  const t = r.get(e);
                  t &&
                    1 !== e.status &&
                    ((t.status = e.status), (e.status = 1));
                },
                d = n.runtime.sequencer.stepThreads;
              n.runtime.sequencer.stepThreads = function () {
                if (s) for (const e of this.runtime.threads) a(e);
                return d.call(this);
              };
              const u = n.runtime.greenFlag;
              n.runtime.greenFlag = function () {
                return o(!1), u.call(this);
              };
              const c = n.runtime.startHats;
              n.runtime.startHats = function () {
                if (s) return [];
                for (
                  var e = arguments.length, t = new Array(e), n = 0;
                  n < e;
                  n++
                )
                  t[n] = arguments[n];
                return c.apply(this, t);
              };
              const l = n.runtime._getMonitorThreadCount;
              (n.runtime._getMonitorThreadCount = function (e) {
                let t = l.call(this, e);
                if (s) for (const n of e) r.has(n) && t++;
                return t;
              }),
                (n.setPaused = o),
                (n.isPaused = () => s);
            })(n);
      },
    };
  },
  8: function (e, t, n) {
    "use strict";
    n.d(t, "b", function () {
      return s;
    }),
      n.d(t, "a", function () {
        return r;
      });
    class s {
      constructor() {
        this._events = {};
      }
      addEventListener(e, t) {
        this._events[e] || (this._events[e] = []), this._events[e].push(t);
      }
      removeEventListener(e, t) {
        const n = this._events[e];
        n && (this._events[e] = n.filter((e) => e !== t));
      }
      dispatchEvent(e) {
        const t = this._events[e.type];
        if (t) for (const n of t) n(e);
      }
    }
    class r {
      constructor(e, t) {
        (this.type = e), (this.detail = t ? t.detail : {});
      }
    }
  },
});
// 947e3330c85b3c27a0bbaf75312e900e17d82eb7047e7894b15b28114ba771f4 =^..^=
