import {
  ADDON_CONTROLS_ID,
  STORYBOOK_ADDON_ONBOARDING_CHANNEL
} from "./chunk-B266DSPW.js";
import {
  __commonJS,
  __name,
  __toESM
} from "./chunk-CBI7MY27.js";

// ../../node_modules/scroll/index.js
var require_scroll = __commonJS({
  "../../node_modules/scroll/index.js"(exports, module) {
    var E_NOSCROLL = new Error("Element already at target scroll position");
    var E_CANCELLED = new Error("Scroll cancelled");
    var min = Math.min;
    var ms = Date.now;
    module.exports = {
      left: make("scrollLeft"),
      top: make("scrollTop")
    };
    function make(prop) {
      return /* @__PURE__ */ __name(function scroll2(el, to, opts, cb) {
        opts = opts || {};
        if (typeof opts == "function") cb = opts, opts = {};
        if (typeof cb != "function") cb = noop3;
        var start = ms();
        var from = el[prop];
        var ease = opts.ease || inOutSine;
        var duration = !isNaN(opts.duration) ? +opts.duration : 350;
        var cancelled = false;
        return from === to ? cb(E_NOSCROLL, el[prop]) : requestAnimationFrame(animate), cancel;
        function cancel() {
          cancelled = true;
        }
        __name(cancel, "cancel");
        function animate(timestamp) {
          if (cancelled) return cb(E_CANCELLED, el[prop]);
          var now = ms();
          var time = min(1, (now - start) / duration);
          var eased = ease(time);
          el[prop] = eased * (to - from) + from;
          time < 1 ? requestAnimationFrame(animate) : requestAnimationFrame(function() {
            cb(null, el[prop]);
          });
        }
        __name(animate, "animate");
      }, "scroll");
    }
    __name(make, "make");
    function inOutSine(n2) {
      return 0.5 * (1 - Math.cos(Math.PI * n2));
    }
    __name(inOutSine, "inOutSine");
    function noop3() {
    }
    __name(noop3, "noop");
  }
});

// ../../node_modules/scrollparent/scrollparent.js
var require_scrollparent = __commonJS({
  "../../node_modules/scrollparent/scrollparent.js"(exports, module) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
      } else {
        root.Scrollparent = factory();
      }
    })(exports, function() {
      function isScrolling(node) {
        var overflow = getComputedStyle(node, null).getPropertyValue("overflow");
        return overflow.indexOf("scroll") > -1 || overflow.indexOf("auto") > -1;
      }
      __name(isScrolling, "isScrolling");
      function scrollParent2(node) {
        if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
          return void 0;
        }
        var current = node.parentNode;
        while (current.parentNode) {
          if (isScrolling(current)) {
            return current;
          }
          current = current.parentNode;
        }
        return document.scrollingElement || document.documentElement;
      }
      __name(scrollParent2, "scrollParent");
      return scrollParent2;
    });
  }
});

// ../../node_modules/react-innertext/index.js
var require_react_innertext = __commonJS({
  "../../node_modules/react-innertext/index.js"(exports, module) {
    "use strict";
    var hasProps = /* @__PURE__ */ __name(function(jsx) {
      return Object.prototype.hasOwnProperty.call(jsx, "props");
    }, "hasProps");
    var reduceJsxToString = /* @__PURE__ */ __name(function(previous, current) {
      return previous + innerText2(current);
    }, "reduceJsxToString");
    var innerText2 = /* @__PURE__ */ __name(function(jsx) {
      if (jsx === null || typeof jsx === "boolean" || typeof jsx === "undefined") {
        return "";
      }
      if (typeof jsx === "number") {
        return jsx.toString();
      }
      if (typeof jsx === "string") {
        return jsx;
      }
      if (Array.isArray(jsx)) {
        return jsx.reduce(reduceJsxToString, "");
      }
      if (hasProps(jsx) && Object.prototype.hasOwnProperty.call(jsx.props, "children")) {
        return innerText2(jsx.props.children);
      }
      return "";
    }, "innerText");
    innerText2.default = innerText2;
    module.exports = innerText2;
  }
});

// ../../node_modules/deepmerge/dist/cjs.js
var require_cjs = __commonJS({
  "../../node_modules/deepmerge/dist/cjs.js"(exports, module) {
    "use strict";
    var isMergeableObject = /* @__PURE__ */ __name(function isMergeableObject2(value) {
      return isNonNullObject(value) && !isSpecial(value);
    }, "isMergeableObject");
    function isNonNullObject(value) {
      return !!value && typeof value === "object";
    }
    __name(isNonNullObject, "isNonNullObject");
    function isSpecial(value) {
      var stringValue = Object.prototype.toString.call(value);
      return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
    }
    __name(isSpecial, "isSpecial");
    var canUseSymbol = typeof Symbol === "function" && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
    function isReactElement(value) {
      return value.$$typeof === REACT_ELEMENT_TYPE;
    }
    __name(isReactElement, "isReactElement");
    function emptyTarget(val) {
      return Array.isArray(val) ? [] : {};
    }
    __name(emptyTarget, "emptyTarget");
    function cloneUnlessOtherwiseSpecified(value, options) {
      return options.clone !== false && options.isMergeableObject(value) ? deepmerge4(emptyTarget(value), value, options) : value;
    }
    __name(cloneUnlessOtherwiseSpecified, "cloneUnlessOtherwiseSpecified");
    function defaultArrayMerge(target, source, options) {
      return target.concat(source).map(function(element) {
        return cloneUnlessOtherwiseSpecified(element, options);
      });
    }
    __name(defaultArrayMerge, "defaultArrayMerge");
    function getMergeFunction(key, options) {
      if (!options.customMerge) {
        return deepmerge4;
      }
      var customMerge = options.customMerge(key);
      return typeof customMerge === "function" ? customMerge : deepmerge4;
    }
    __name(getMergeFunction, "getMergeFunction");
    function getEnumerableOwnPropertySymbols(target) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
        return Object.propertyIsEnumerable.call(target, symbol);
      }) : [];
    }
    __name(getEnumerableOwnPropertySymbols, "getEnumerableOwnPropertySymbols");
    function getKeys(target) {
      return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
    }
    __name(getKeys, "getKeys");
    function propertyIsOnObject(object, property) {
      try {
        return property in object;
      } catch (_2) {
        return false;
      }
    }
    __name(propertyIsOnObject, "propertyIsOnObject");
    function propertyIsUnsafe(target, key) {
      return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
    }
    __name(propertyIsUnsafe, "propertyIsUnsafe");
    function mergeObject(target, source, options) {
      var destination = {};
      if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function(key) {
          destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
      }
      getKeys(source).forEach(function(key) {
        if (propertyIsUnsafe(target, key)) {
          return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
          destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        } else {
          destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
      });
      return destination;
    }
    __name(mergeObject, "mergeObject");
    function deepmerge4(target, source, options) {
      options = options || {};
      options.arrayMerge = options.arrayMerge || defaultArrayMerge;
      options.isMergeableObject = options.isMergeableObject || isMergeableObject;
      options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
      var sourceIsArray = Array.isArray(source);
      var targetIsArray = Array.isArray(target);
      var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
      if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
      } else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
      } else {
        return mergeObject(target, source, options);
      }
    }
    __name(deepmerge4, "deepmerge");
    deepmerge4.all = /* @__PURE__ */ __name(function deepmergeAll(array, options) {
      if (!Array.isArray(array)) {
        throw new Error("first argument should be an array");
      }
      return array.reduce(function(prev, next) {
        return deepmerge4(prev, next, options);
      }, {});
    }, "deepmergeAll");
    var deepmerge_1 = deepmerge4;
    module.exports = deepmerge_1;
  }
});

// ../../node_modules/react-is/cjs/react-is.production.min.js
var require_react_is_production_min = __commonJS({
  "../../node_modules/react-is/cjs/react-is.production.min.js"(exports) {
    "use strict";
    var b2 = "function" === typeof Symbol && Symbol.for;
    var c2 = b2 ? Symbol.for("react.element") : 60103;
    var d2 = b2 ? Symbol.for("react.portal") : 60106;
    var e2 = b2 ? Symbol.for("react.fragment") : 60107;
    var f2 = b2 ? Symbol.for("react.strict_mode") : 60108;
    var g2 = b2 ? Symbol.for("react.profiler") : 60114;
    var h2 = b2 ? Symbol.for("react.provider") : 60109;
    var k2 = b2 ? Symbol.for("react.context") : 60110;
    var l2 = b2 ? Symbol.for("react.async_mode") : 60111;
    var m2 = b2 ? Symbol.for("react.concurrent_mode") : 60111;
    var n2 = b2 ? Symbol.for("react.forward_ref") : 60112;
    var p2 = b2 ? Symbol.for("react.suspense") : 60113;
    var q = b2 ? Symbol.for("react.suspense_list") : 60120;
    var r2 = b2 ? Symbol.for("react.memo") : 60115;
    var t2 = b2 ? Symbol.for("react.lazy") : 60116;
    var v2 = b2 ? Symbol.for("react.block") : 60121;
    var w2 = b2 ? Symbol.for("react.fundamental") : 60117;
    var x2 = b2 ? Symbol.for("react.responder") : 60118;
    var y2 = b2 ? Symbol.for("react.scope") : 60119;
    function z2(a2) {
      if ("object" === typeof a2 && null !== a2) {
        var u2 = a2.$$typeof;
        switch (u2) {
          case c2:
            switch (a2 = a2.type, a2) {
              case l2:
              case m2:
              case e2:
              case g2:
              case f2:
              case p2:
                return a2;
              default:
                switch (a2 = a2 && a2.$$typeof, a2) {
                  case k2:
                  case n2:
                  case t2:
                  case r2:
                  case h2:
                    return a2;
                  default:
                    return u2;
                }
            }
          case d2:
            return u2;
        }
      }
    }
    __name(z2, "z");
    function A2(a2) {
      return z2(a2) === m2;
    }
    __name(A2, "A");
    exports.AsyncMode = l2;
    exports.ConcurrentMode = m2;
    exports.ContextConsumer = k2;
    exports.ContextProvider = h2;
    exports.Element = c2;
    exports.ForwardRef = n2;
    exports.Fragment = e2;
    exports.Lazy = t2;
    exports.Memo = r2;
    exports.Portal = d2;
    exports.Profiler = g2;
    exports.StrictMode = f2;
    exports.Suspense = p2;
    exports.isAsyncMode = function(a2) {
      return A2(a2) || z2(a2) === l2;
    };
    exports.isConcurrentMode = A2;
    exports.isContextConsumer = function(a2) {
      return z2(a2) === k2;
    };
    exports.isContextProvider = function(a2) {
      return z2(a2) === h2;
    };
    exports.isElement = function(a2) {
      return "object" === typeof a2 && null !== a2 && a2.$$typeof === c2;
    };
    exports.isForwardRef = function(a2) {
      return z2(a2) === n2;
    };
    exports.isFragment = function(a2) {
      return z2(a2) === e2;
    };
    exports.isLazy = function(a2) {
      return z2(a2) === t2;
    };
    exports.isMemo = function(a2) {
      return z2(a2) === r2;
    };
    exports.isPortal = function(a2) {
      return z2(a2) === d2;
    };
    exports.isProfiler = function(a2) {
      return z2(a2) === g2;
    };
    exports.isStrictMode = function(a2) {
      return z2(a2) === f2;
    };
    exports.isSuspense = function(a2) {
      return z2(a2) === p2;
    };
    exports.isValidElementType = function(a2) {
      return "string" === typeof a2 || "function" === typeof a2 || a2 === e2 || a2 === m2 || a2 === g2 || a2 === f2 || a2 === p2 || a2 === q || "object" === typeof a2 && null !== a2 && (a2.$$typeof === t2 || a2.$$typeof === r2 || a2.$$typeof === h2 || a2.$$typeof === k2 || a2.$$typeof === n2 || a2.$$typeof === w2 || a2.$$typeof === x2 || a2.$$typeof === y2 || a2.$$typeof === v2);
    };
    exports.typeOf = z2;
  }
});

// ../../node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  "../../node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    if (process.env.NODE_ENV !== "production") {
      (function() {
        "use strict";
        var hasSymbol = typeof Symbol === "function" && Symbol.for;
        var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
        var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
        var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
        var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
        var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
        var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
        var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
        var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
        var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
        var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
        var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
        var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
        var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
        var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
        var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
        var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
        var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
        var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
        function isValidElementType(type) {
          return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
          type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
        }
        __name(isValidElementType, "isValidElementType");
        function typeOf(object) {
          if (typeof object === "object" && object !== null) {
            var $$typeof = object.$$typeof;
            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;
                switch (type) {
                  case REACT_ASYNC_MODE_TYPE:
                  case REACT_CONCURRENT_MODE_TYPE:
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                    return type;
                  default:
                    var $$typeofType = type && type.$$typeof;
                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;
                      default:
                        return $$typeof;
                    }
                }
              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }
          return void 0;
        }
        __name(typeOf, "typeOf");
        var AsyncMode = REACT_ASYNC_MODE_TYPE;
        var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
            }
          }
          return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
        }
        __name(isAsyncMode, "isAsyncMode");
        function isConcurrentMode(object) {
          return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
        }
        __name(isConcurrentMode, "isConcurrentMode");
        function isContextConsumer(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        __name(isContextConsumer, "isContextConsumer");
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        __name(isContextProvider, "isContextProvider");
        function isElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        __name(isElement, "isElement");
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        __name(isForwardRef, "isForwardRef");
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        __name(isFragment, "isFragment");
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        __name(isLazy, "isLazy");
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        __name(isMemo, "isMemo");
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        __name(isPortal, "isPortal");
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        __name(isProfiler, "isProfiler");
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        __name(isStrictMode, "isStrictMode");
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        __name(isSuspense, "isSuspense");
        exports.AsyncMode = AsyncMode;
        exports.ConcurrentMode = ConcurrentMode;
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isValidElementType = isValidElementType;
        exports.typeOf = typeOf;
      })();
    }
  }
});

// ../../node_modules/react-is/index.js
var require_react_is = __commonJS({
  "../../node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_is_production_min();
    } else {
      module.exports = require_react_is_development();
    }
  }
});

// ../../node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "../../node_modules/object-assign/index.js"(exports, module) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    __name(toObject, "toObject");
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i2 = 0; i2 < 10; i2++) {
          test2["_" + String.fromCharCode(i2)] = i2;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
          return test2[n2];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    __name(shouldUseNative, "shouldUseNative");
    module.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s2 = 1; s2 < arguments.length; s2++) {
        from = Object(arguments[s2]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i2 = 0; i2 < symbols.length; i2++) {
            if (propIsEnumerable.call(from, symbols[i2])) {
              to[symbols[i2]] = from[symbols[i2]];
            }
          }
        }
      }
      return to;
    };
  }
});

// ../../node_modules/prop-types/lib/ReactPropTypesSecret.js
var require_ReactPropTypesSecret = __commonJS({
  "../../node_modules/prop-types/lib/ReactPropTypesSecret.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    module.exports = ReactPropTypesSecret;
  }
});

// ../../node_modules/prop-types/lib/has.js
var require_has = __commonJS({
  "../../node_modules/prop-types/lib/has.js"(exports, module) {
    module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
  }
});

// ../../node_modules/prop-types/checkPropTypes.js
var require_checkPropTypes = __commonJS({
  "../../node_modules/prop-types/checkPropTypes.js"(exports, module) {
    "use strict";
    var printWarning = /* @__PURE__ */ __name(function() {
    }, "printWarning");
    if (process.env.NODE_ENV !== "production") {
      ReactPropTypesSecret = require_ReactPropTypesSecret();
      loggedTypeFailures = {};
      has = require_has();
      printWarning = /* @__PURE__ */ __name(function(text) {
        var message = "Warning: " + text;
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x2) {
        }
      }, "printWarning");
    }
    var ReactPropTypesSecret;
    var loggedTypeFailures;
    var has;
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
      if (process.env.NODE_ENV !== "production") {
        for (var typeSpecName in typeSpecs) {
          if (has(typeSpecs, typeSpecName)) {
            var error;
            try {
              if (typeof typeSpecs[typeSpecName] !== "function") {
                var err = Error(
                  (componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                );
                err.name = "Invariant Violation";
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning(
                (componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
              );
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              loggedTypeFailures[error.message] = true;
              var stack = getStack ? getStack() : "";
              printWarning(
                "Failed " + location + " type: " + error.message + (stack != null ? stack : "")
              );
            }
          }
        }
      }
    }
    __name(checkPropTypes, "checkPropTypes");
    checkPropTypes.resetWarningCache = function() {
      if (process.env.NODE_ENV !== "production") {
        loggedTypeFailures = {};
      }
    };
    module.exports = checkPropTypes;
  }
});

// ../../node_modules/prop-types/factoryWithTypeCheckers.js
var require_factoryWithTypeCheckers = __commonJS({
  "../../node_modules/prop-types/factoryWithTypeCheckers.js"(exports, module) {
    "use strict";
    var ReactIs = require_react_is();
    var assign = require_object_assign();
    var ReactPropTypesSecret = require_ReactPropTypesSecret();
    var has = require_has();
    var checkPropTypes = require_checkPropTypes();
    var printWarning = /* @__PURE__ */ __name(function() {
    }, "printWarning");
    if (process.env.NODE_ENV !== "production") {
      printWarning = /* @__PURE__ */ __name(function(text) {
        var message = "Warning: " + text;
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x2) {
        }
      }, "printWarning");
    }
    function emptyFunctionThatReturnsNull() {
      return null;
    }
    __name(emptyFunctionThatReturnsNull, "emptyFunctionThatReturnsNull");
    module.exports = function(isValidElement2, throwOnDirectAccess) {
      var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === "function") {
          return iteratorFn;
        }
      }
      __name(getIteratorFn, "getIteratorFn");
      var ANONYMOUS = "<<anonymous>>";
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker("array"),
        bigint: createPrimitiveTypeChecker("bigint"),
        bool: createPrimitiveTypeChecker("boolean"),
        func: createPrimitiveTypeChecker("function"),
        number: createPrimitiveTypeChecker("number"),
        object: createPrimitiveTypeChecker("object"),
        string: createPrimitiveTypeChecker("string"),
        symbol: createPrimitiveTypeChecker("symbol"),
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        elementType: createElementTypeTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker
      };
      function is4(x2, y2) {
        if (x2 === y2) {
          return x2 !== 0 || 1 / x2 === 1 / y2;
        } else {
          return x2 !== x2 && y2 !== y2;
        }
      }
      __name(is4, "is");
      function PropTypeError(message, data) {
        this.message = message;
        this.data = data && typeof data === "object" ? data : {};
        this.stack = "";
      }
      __name(PropTypeError, "PropTypeError");
      PropTypeError.prototype = Error.prototype;
      function createChainableTypeChecker(validate) {
        if (process.env.NODE_ENV !== "production") {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;
          if (secret !== ReactPropTypesSecret) {
            if (throwOnDirectAccess) {
              var err = new Error(
                "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
              );
              err.name = "Invariant Violation";
              throw err;
            } else if (process.env.NODE_ENV !== "production" && typeof console !== "undefined") {
              var cacheKey = componentName + ":" + propName;
              if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
              manualPropTypeWarningCount < 3) {
                printWarning(
                  "You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
                );
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
              }
              return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }
        __name(checkType, "checkType");
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
        return chainedCheckType;
      }
      __name(createChainableTypeChecker, "createChainableTypeChecker");
      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            var preciseType = getPreciseType(propValue);
            return new PropTypeError(
              "Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."),
              { expectedType }
            );
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createPrimitiveTypeChecker, "createPrimitiveTypeChecker");
      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunctionThatReturnsNull);
      }
      __name(createAnyTypeChecker, "createAnyTypeChecker");
      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== "function") {
            return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
          }
          for (var i2 = 0; i2 < propValue.length; i2++) {
            var error = typeChecker(propValue, i2, componentName, location, propFullName + "[" + i2 + "]", ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createArrayOfTypeChecker, "createArrayOfTypeChecker");
      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement2(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createElementTypeChecker, "createElementTypeChecker");
      function createElementTypeTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!ReactIs.isValidElementType(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createElementTypeTypeChecker, "createElementTypeTypeChecker");
      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createInstanceTypeChecker, "createInstanceTypeChecker");
      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          if (process.env.NODE_ENV !== "production") {
            if (arguments.length > 1) {
              printWarning(
                "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
              );
            } else {
              printWarning("Invalid argument supplied to oneOf, expected an array.");
            }
          }
          return emptyFunctionThatReturnsNull;
        }
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i2 = 0; i2 < expectedValues.length; i2++) {
            if (is4(propValue, expectedValues[i2])) {
              return null;
            }
          }
          var valuesString = JSON.stringify(expectedValues, /* @__PURE__ */ __name(function replacer(key, value) {
            var type = getPreciseType(value);
            if (type === "symbol") {
              return String(value);
            }
            return value;
          }, "replacer"));
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createEnumTypeChecker, "createEnumTypeChecker");
      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== "function") {
            return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
          }
          for (var key in propValue) {
            if (has(propValue, key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createObjectOfTypeChecker, "createObjectOfTypeChecker");
      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          process.env.NODE_ENV !== "production" ? printWarning("Invalid argument supplied to oneOfType, expected an instance of array.") : void 0;
          return emptyFunctionThatReturnsNull;
        }
        for (var i2 = 0; i2 < arrayOfTypeCheckers.length; i2++) {
          var checker = arrayOfTypeCheckers[i2];
          if (typeof checker !== "function") {
            printWarning(
              "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i2 + "."
            );
            return emptyFunctionThatReturnsNull;
          }
        }
        function validate(props, propName, componentName, location, propFullName) {
          var expectedTypes = [];
          for (var i3 = 0; i3 < arrayOfTypeCheckers.length; i3++) {
            var checker2 = arrayOfTypeCheckers[i3];
            var checkerResult = checker2(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
            if (checkerResult == null) {
              return null;
            }
            if (checkerResult.data && has(checkerResult.data, "expectedType")) {
              expectedTypes.push(checkerResult.data.expectedType);
            }
          }
          var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createUnionTypeChecker, "createUnionTypeChecker");
      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createNodeChecker, "createNodeChecker");
      function invalidValidatorError(componentName, location, propFullName, key, type) {
        return new PropTypeError(
          (componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`."
        );
      }
      __name(invalidValidatorError, "invalidValidatorError");
      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (typeof checker !== "function") {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createShapeTypeChecker, "createShapeTypeChecker");
      function createStrictShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
          }
          var allKeys = assign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (has(shapeTypes, key) && typeof checker !== "function") {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            if (!checker) {
              return new PropTypeError(
                "Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  ")
              );
            }
            var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        __name(validate, "validate");
        return createChainableTypeChecker(validate);
      }
      __name(createStrictShapeTypeChecker, "createStrictShapeTypeChecker");
      function isNode(propValue) {
        switch (typeof propValue) {
          case "number":
          case "string":
          case "undefined":
            return true;
          case "boolean":
            return !propValue;
          case "object":
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement2(propValue)) {
              return true;
            }
            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }
            return true;
          default:
            return false;
        }
      }
      __name(isNode, "isNode");
      function isSymbol(propType, propValue) {
        if (propType === "symbol") {
          return true;
        }
        if (!propValue) {
          return false;
        }
        if (propValue["@@toStringTag"] === "Symbol") {
          return true;
        }
        if (typeof Symbol === "function" && propValue instanceof Symbol) {
          return true;
        }
        return false;
      }
      __name(isSymbol, "isSymbol");
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return "array";
        }
        if (propValue instanceof RegExp) {
          return "object";
        }
        if (isSymbol(propType, propValue)) {
          return "symbol";
        }
        return propType;
      }
      __name(getPropType, "getPropType");
      function getPreciseType(propValue) {
        if (typeof propValue === "undefined" || propValue === null) {
          return "" + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === "object") {
          if (propValue instanceof Date) {
            return "date";
          } else if (propValue instanceof RegExp) {
            return "regexp";
          }
        }
        return propType;
      }
      __name(getPreciseType, "getPreciseType");
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case "array":
          case "object":
            return "an " + type;
          case "boolean":
          case "date":
          case "regexp":
            return "a " + type;
          default:
            return type;
        }
      }
      __name(getPostfixForTypeWarning, "getPostfixForTypeWarning");
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }
      __name(getClassName, "getClassName");
      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
  }
});

// ../../node_modules/prop-types/factoryWithThrowingShims.js
var require_factoryWithThrowingShims = __commonJS({
  "../../node_modules/prop-types/factoryWithThrowingShims.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = require_ReactPropTypesSecret();
    function emptyFunction() {
    }
    __name(emptyFunction, "emptyFunction");
    function emptyFunctionWithReset() {
    }
    __name(emptyFunctionWithReset, "emptyFunctionWithReset");
    emptyFunctionWithReset.resetWarningCache = emptyFunction;
    module.exports = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          return;
        }
        var err = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        err.name = "Invariant Violation";
        throw err;
      }
      __name(shim, "shim");
      ;
      shim.isRequired = shim;
      function getShim() {
        return shim;
      }
      __name(getShim, "getShim");
      ;
      var ReactPropTypes = {
        array: shim,
        bigint: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,
        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
  }
});

// ../../node_modules/prop-types/index.js
var require_prop_types = __commonJS({
  "../../node_modules/prop-types/index.js"(exports, module) {
    if (process.env.NODE_ENV !== "production") {
      ReactIs = require_react_is();
      throwOnDirectAccess = true;
      module.exports = require_factoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
    } else {
      module.exports = require_factoryWithThrowingShims()();
    }
    var ReactIs;
    var throwOnDirectAccess;
  }
});

// src/Onboarding.tsx
import React15, { useCallback as useCallback2, useEffect as useEffect5, useState as useState4 } from "react";
import { SyntaxHighlighter } from "storybook/internal/components";
import { SAVE_STORY_RESPONSE } from "storybook/internal/core-events";
import { ThemeProvider, convert, styled as styled6, themes } from "storybook/theming";

// src/components/Confetti/Confetti.tsx
import React from "react";

// ../../node_modules/@neoconfetti/react/dist/min/index.js
import { createElement as z, useEffect as A, useRef as H } from "react";
var e = '@keyframes Bc2PgW_ya{to{translate:0 var(--sh)}}@keyframes Bc2PgW_xa{to{translate:var(--xlp)0}}@keyframes Bc2PgW_r{50%{rotate:var(--hr)180deg}to{rotate:var(--r)360deg}}.Bc2PgW_c{z-index:1200;width:0;height:0;position:relative;overflow:visible}.Bc2PgW_p{animation:xa var(--dc)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:Bc2PgW_xa}.Bc2PgW_p>div{animation:ya var(--dc)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--w);height:var(--h);animation-name:Bc2PgW_ya;position:absolute;top:0;left:0}.Bc2PgW_p>div:before{content:"";background-color:var(--bgc);animation:r var(--rd)infinite linear;border-radius:var(--br);width:100%;height:100%;animation-name:Bc2PgW_r;display:block}';
var t = "Bc2PgW_p";
var r = "Bc2PgW_c";
var a = ["#FFC700", "#FF0000", "#2E3191", "#41BBC7"];
var o = 3500;
var n = 0.5;
var i = 150;
var c = "mix";
var s = 12;
var l = "";
var d = true;
var p = 800;
var u = 1600;
function y(y2, z2 = {}) {
  let { colors: A2 = a, duration: H2 = o, force: F2 = n, particleCount: O = i, particleShape: j = c, particleSize: E = s, particleClass: $ = l, destroyAfterDone: q = d, stageHeight: D = p, stageWidth: J = u } = z2;
  !function(e2) {
    if (document.querySelector("style[data-neoconfetti]")) return;
    const t2 = W("style");
    t2.dataset.neoconfetti = "", t2.textContent = e2, _(document.head, t2);
  }(e), y2.classList.add(r), y2.style.setProperty("--sh", D + "px");
  let I = [], G = [];
  const K = /* @__PURE__ */ __name(() => P(b() * (N - 1)), "K"), Q = /* @__PURE__ */ __name((e2, t2) => "rectangles" !== j && ("circles" === e2 || k(t2)), "Q");
  function R(e2, t2) {
    const r2 = K(), a2 = Q(j, r2), o2 = /* @__PURE__ */ __name((t3, r3) => e2.style.setProperty(t3, r3 + ""), "o");
    o2("--xlp", C(x(L(t2, 90) - 180), 0, 180, -J / 2, J / 2) + "px"), o2("--dc", H2 - P(1e3 * b()) + "ms");
    const n2 = b() < m ? w(b() * h, 2) : 0;
    o2("--x1", n2), o2("--x2", -1 * n2), o2("--x3", n2), o2("--x4", w(x(C(x(L(t2, 90) - 180), 0, 180, -1, 1)), 4)), o2("--y1", w(b() * v, 4)), o2("--y2", w(b() * F2 * (M() ? 1 : -1), 4)), o2("--y3", v), o2("--y4", w(B(C(x(t2 - 180), 0, 180, F2, -F2), 0), 4)), o2("--w", (a2 ? E : P(4 * b()) + E / 2) + "px"), o2("--h", (a2 ? E : P(2 * b()) + E) + "px");
    const i2 = r2.toString(2).padStart(3, "0").split("");
    o2("--hr", i2.map((e3) => +e3 / 2 + "").join(" ")), o2("--r", i2.join(" ")), o2("--rd", w(b() * (g - f) + f) + "ms"), o2("--br", a2 ? "50%" : 0);
  }
  __name(R, "R");
  let U;
  function V() {
    y2.innerHTML = "", clearTimeout(U), I = S(O, A2), G = function(e2, r2 = [], a2) {
      const o2 = [];
      for (const { color: n2 } of r2) {
        const r3 = W("div");
        r3.className = `${t} ${a2}`, r3.style.setProperty("--bgc", n2);
        const i2 = W("div");
        _(r3, i2), _(e2, r3), o2.push(r3);
      }
      return o2;
    }(y2, I, $);
    for (const [e2, t2] of T(G)) R(t2, I[+e2].degree);
    U = setTimeout(() => {
      q && (y2.innerHTML = "");
    }, H2);
  }
  __name(V, "V");
  return V(), { update(e2) {
    const r2 = e2.particleCount ?? i, f2 = e2.particleShape ?? c, g2 = e2.particleSize ?? s, m2 = e2.particleClass ?? l, h2 = e2.colors ?? a, v2 = e2.stageHeight ?? p, x2 = e2.duration ?? o, b2 = e2.force ?? n, P2 = e2.stageWidth ?? u, B2 = e2.destroyAfterDone ?? d;
    I = S(r2, h2);
    let W2 = false;
    if (r2 === O) {
      G = Array.from(y2.querySelectorAll(`.${t}`));
      for (const [e3, { color: t2 }] of T(I)) {
        const r3 = G[+e3];
        JSON.stringify(A2) !== JSON.stringify(h2) && r3.style.setProperty("--bgc", t2), f2 !== j && r3.style.setProperty("--br", Q(f2, K()) ? "50%" : "0"), m2 !== $ && ($ && r3.classList.remove($), m2 && r3.classList.add(m2));
      }
    } else W2 = true;
    q && !B2 && clearTimeout(U), y2.style.setProperty("--sh", v2 + "px"), H2 = x2, A2 = h2, F2 = b2, O = r2, j = f2, E = g2, $ = m2, q = B2, D = v2, J = P2, W2 && V();
  }, destroy() {
    y2.innerHTML = "", clearTimeout(U);
  } };
}
__name(y, "y");
var f = 200;
var g = 800;
var m = 0.1;
var h = 0.3;
var v = 0.5;
var x = Math.abs;
var b = Math.random;
var P = Math.round;
var B = Math.max;
var W = /* @__PURE__ */ __name((e2) => document.createElement(e2), "W");
var _ = /* @__PURE__ */ __name((e2, t2) => e2.appendChild(t2), "_");
var S = /* @__PURE__ */ __name((e2, t2) => Array.from({ length: e2 }, (r2, a2) => ({ color: t2[a2 % t2.length], degree: 360 * a2 / e2 })), "S");
var w = /* @__PURE__ */ __name((e2, t2 = 2) => P((e2 + Number.EPSILON) * 10 ** t2) / 10 ** t2, "w");
var C = /* @__PURE__ */ __name((e2, t2, r2, a2, o2) => (e2 - t2) * (o2 - a2) / (r2 - t2) + a2, "C");
var L = /* @__PURE__ */ __name((e2, t2) => e2 + t2 > 360 ? e2 + t2 - 360 : e2 + t2, "L");
var M = /* @__PURE__ */ __name(() => b() > 0.5, "M");
var T = Object.entries;
var N = 6;
var k = /* @__PURE__ */ __name((e2) => 1 !== e2 && M(), "k");
function F({ class: e2, ...t2 }) {
  const r2 = H(null), a2 = H();
  return A(() => {
    if ("undefined" != typeof window && r2.current) {
      if (a2.current) return a2.current.update(t2), a2.current.destroy;
      a2.current = y(r2.current, t2);
    }
  }, [t2]), z("div", { ref: r2, className: e2 });
}
__name(F, "F");

// src/components/Confetti/Confetti.tsx
import { styled } from "storybook/theming";
var Wrapper = styled.div({
  zIndex: 9999,
  position: "fixed",
  top: 0,
  left: "50%",
  width: "50%",
  height: "100%",
  pointerEvents: "none"
});
var Confetti = React.memo(/* @__PURE__ */ __name(function Confetti2({
  timeToFade = 5e3,
  colors = ["#CA90FF", "#FC521F", "#66BF3C", "#FF4785", "#FFAE00", "#1EA7FD"],
  ...confettiProps
}) {
  return React.createElement(Wrapper, null, React.createElement(
    F,
    {
      colors,
      particleCount: 200,
      duration: 5e3,
      stageHeight: window.innerHeight,
      stageWidth: window.innerWidth,
      destroyAfterDone: true,
      ...confettiProps
    }
  ));
}, "Confetti"));

// src/components/HighlightElement/HighlightElement.tsx
import { useEffect } from "react";
function HighlightElement({
  targetSelector,
  pulsating = false
}) {
  useEffect(() => {
    const element = document.querySelector(targetSelector);
    if (element) {
      if (pulsating) {
        element.style.animation = "pulsate 3s infinite";
        element.style.transformOrigin = "center";
        element.style.animationTimingFunction = "ease-in-out";
        const keyframes2 = `
        @keyframes pulsate {
          0% {
            box-shadow: rgba(2,156,253,1) 0 0 2px 1px, 0 0 0 0 rgba(2, 156, 253, 0.7), 0 0 0 0 rgba(2, 156, 253, 0.4);
          }
          50% {
            box-shadow: rgba(2,156,253,1) 0 0 2px 1px, 0 0 0 20px rgba(2, 156, 253, 0), 0 0 0 40px rgba(2, 156, 253, 0);
          }
          100% {
            box-shadow: rgba(2,156,253,1) 0 0 2px 1px, 0 0 0 0 rgba(2, 156, 253, 0), 0 0 0 0 rgba(2, 156, 253, 0);
          }
        }
      `;
        const style = document.createElement("style");
        style.id = "sb-onboarding-pulsating-effect";
        style.innerHTML = keyframes2;
        document.head.appendChild(style);
      } else {
        element.style.boxShadow = "rgba(2,156,253,1) 0 0 2px 1px";
      }
    }
    return () => {
      const styleElement = document.querySelector("#sb-onboarding-pulsating-effect");
      if (styleElement) {
        styleElement.remove();
      }
      if (element) {
        element.style.animation = "";
        element.style.boxShadow = "";
      }
    };
  }, [targetSelector, pulsating]);
  return null;
}
__name(HighlightElement, "HighlightElement");

// src/features/GuidedTour/GuidedTour.tsx
import React12, { useEffect as useEffect3, useState } from "react";

// ../../node_modules/react-joyride/dist/index.mjs
import * as React9 from "react";

// ../../node_modules/@gilbarbara/deep-equal/dist/index.mjs
function isOfType(type) {
  return (value) => typeof value === type;
}
__name(isOfType, "isOfType");
var isFunction = isOfType("function");
var isNull = /* @__PURE__ */ __name((value) => {
  return value === null;
}, "isNull");
var isRegex = /* @__PURE__ */ __name((value) => {
  return Object.prototype.toString.call(value).slice(8, -1) === "RegExp";
}, "isRegex");
var isObject = /* @__PURE__ */ __name((value) => {
  return !isUndefined(value) && !isNull(value) && (isFunction(value) || typeof value === "object");
}, "isObject");
var isUndefined = isOfType("undefined");
function equalArray(left, right) {
  const { length } = left;
  if (length !== right.length) {
    return false;
  }
  for (let index = length; index-- !== 0; ) {
    if (!equal(left[index], right[index])) {
      return false;
    }
  }
  return true;
}
__name(equalArray, "equalArray");
function equalArrayBuffer(left, right) {
  if (left.byteLength !== right.byteLength) {
    return false;
  }
  const view1 = new DataView(left.buffer);
  const view2 = new DataView(right.buffer);
  let index = left.byteLength;
  while (index--) {
    if (view1.getUint8(index) !== view2.getUint8(index)) {
      return false;
    }
  }
  return true;
}
__name(equalArrayBuffer, "equalArrayBuffer");
function equalMap(left, right) {
  if (left.size !== right.size) {
    return false;
  }
  for (const index of left.entries()) {
    if (!right.has(index[0])) {
      return false;
    }
  }
  for (const index of left.entries()) {
    if (!equal(index[1], right.get(index[0]))) {
      return false;
    }
  }
  return true;
}
__name(equalMap, "equalMap");
function equalSet(left, right) {
  if (left.size !== right.size) {
    return false;
  }
  for (const index of left.entries()) {
    if (!right.has(index[0])) {
      return false;
    }
  }
  return true;
}
__name(equalSet, "equalSet");
function equal(left, right) {
  if (left === right) {
    return true;
  }
  if (left && isObject(left) && right && isObject(right)) {
    if (left.constructor !== right.constructor) {
      return false;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      return equalArray(left, right);
    }
    if (left instanceof Map && right instanceof Map) {
      return equalMap(left, right);
    }
    if (left instanceof Set && right instanceof Set) {
      return equalSet(left, right);
    }
    if (ArrayBuffer.isView(left) && ArrayBuffer.isView(right)) {
      return equalArrayBuffer(left, right);
    }
    if (isRegex(left) && isRegex(right)) {
      return left.source === right.source && left.flags === right.flags;
    }
    if (left.valueOf !== Object.prototype.valueOf) {
      return left.valueOf() === right.valueOf();
    }
    if (left.toString !== Object.prototype.toString) {
      return left.toString() === right.toString();
    }
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
      return false;
    }
    for (let index = leftKeys.length; index-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(right, leftKeys[index])) {
        return false;
      }
    }
    for (let index = leftKeys.length; index-- !== 0; ) {
      const key = leftKeys[index];
      if (key === "_owner" && left.$$typeof) {
        continue;
      }
      if (!equal(left[key], right[key])) {
        return false;
      }
    }
    return true;
  }
  if (Number.isNaN(left) && Number.isNaN(right)) {
    return true;
  }
  return left === right;
}
__name(equal, "equal");

// ../../node_modules/is-lite/dist/index.mjs
var objectTypes = [
  "Array",
  "ArrayBuffer",
  "AsyncFunction",
  "AsyncGenerator",
  "AsyncGeneratorFunction",
  "Date",
  "Error",
  "Function",
  "Generator",
  "GeneratorFunction",
  "HTMLElement",
  "Map",
  "Object",
  "Promise",
  "RegExp",
  "Set",
  "WeakMap",
  "WeakSet"
];
var primitiveTypes = [
  "bigint",
  "boolean",
  "null",
  "number",
  "string",
  "symbol",
  "undefined"
];
function getObjectType(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (/HTML\w+Element/.test(objectTypeName)) {
    return "HTMLElement";
  }
  if (isObjectType(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}
__name(getObjectType, "getObjectType");
function isObjectOfType(type) {
  return (value) => getObjectType(value) === type;
}
__name(isObjectOfType, "isObjectOfType");
function isObjectType(name) {
  return objectTypes.includes(name);
}
__name(isObjectType, "isObjectType");
function isOfType2(type) {
  return (value) => typeof value === type;
}
__name(isOfType2, "isOfType");
function isPrimitiveType(name) {
  return primitiveTypes.includes(name);
}
__name(isPrimitiveType, "isPrimitiveType");
var DOM_PROPERTIES_TO_CHECK = [
  "innerHTML",
  "ownerDocument",
  "style",
  "attributes",
  "nodeValue"
];
function is(value) {
  if (value === null) {
    return "null";
  }
  switch (typeof value) {
    case "bigint":
      return "bigint";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "symbol":
      return "symbol";
    case "undefined":
      return "undefined";
    default:
  }
  if (is.array(value)) {
    return "Array";
  }
  if (is.plainFunction(value)) {
    return "Function";
  }
  const tagType = getObjectType(value);
  if (tagType) {
    return tagType;
  }
  return "Object";
}
__name(is, "is");
is.array = Array.isArray;
is.arrayOf = (target, predicate) => {
  if (!is.array(target) && !is.function(predicate)) {
    return false;
  }
  return target.every((d2) => predicate(d2));
};
is.asyncGeneratorFunction = (value) => getObjectType(value) === "AsyncGeneratorFunction";
is.asyncFunction = isObjectOfType("AsyncFunction");
is.bigint = isOfType2("bigint");
is.boolean = (value) => {
  return value === true || value === false;
};
is.date = isObjectOfType("Date");
is.defined = (value) => !is.undefined(value);
is.domElement = (value) => {
  return is.object(value) && !is.plainObject(value) && value.nodeType === 1 && is.string(value.nodeName) && DOM_PROPERTIES_TO_CHECK.every((property) => property in value);
};
is.empty = (value) => {
  return is.string(value) && value.length === 0 || is.array(value) && value.length === 0 || is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0 || is.set(value) && value.size === 0 || is.map(value) && value.size === 0;
};
is.error = isObjectOfType("Error");
is.function = isOfType2("function");
is.generator = (value) => {
  return is.iterable(value) && is.function(value.next) && is.function(value.throw);
};
is.generatorFunction = isObjectOfType("GeneratorFunction");
is.instanceOf = (instance, class_) => {
  if (!instance || !class_) {
    return false;
  }
  return Object.getPrototypeOf(instance) === class_.prototype;
};
is.iterable = (value) => {
  return !is.nullOrUndefined(value) && is.function(value[Symbol.iterator]);
};
is.map = isObjectOfType("Map");
is.nan = (value) => {
  return Number.isNaN(value);
};
is.null = (value) => {
  return value === null;
};
is.nullOrUndefined = (value) => {
  return is.null(value) || is.undefined(value);
};
is.number = (value) => {
  return isOfType2("number")(value) && !is.nan(value);
};
is.numericString = (value) => {
  return is.string(value) && value.length > 0 && !Number.isNaN(Number(value));
};
is.object = (value) => {
  return !is.nullOrUndefined(value) && (is.function(value) || typeof value === "object");
};
is.oneOf = (target, value) => {
  if (!is.array(target)) {
    return false;
  }
  return target.indexOf(value) > -1;
};
is.plainFunction = isObjectOfType("Function");
is.plainObject = (value) => {
  if (getObjectType(value) !== "Object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.getPrototypeOf({});
};
is.primitive = (value) => is.null(value) || isPrimitiveType(typeof value);
is.promise = isObjectOfType("Promise");
is.propertyOf = (target, key, predicate) => {
  if (!is.object(target) || !key) {
    return false;
  }
  const value = target[key];
  if (is.function(predicate)) {
    return predicate(value);
  }
  return is.defined(value);
};
is.regexp = isObjectOfType("RegExp");
is.set = isObjectOfType("Set");
is.string = isOfType2("string");
is.symbol = isOfType2("symbol");
is.undefined = isOfType2("undefined");
is.weakMap = isObjectOfType("WeakMap");
is.weakSet = isObjectOfType("WeakSet");
var src_default = is;

// ../../node_modules/react-joyride/node_modules/tree-changes/dist/index.mjs
function canHaveLength(...arguments_) {
  return arguments_.every((d2) => src_default.string(d2) || src_default.array(d2) || src_default.plainObject(d2));
}
__name(canHaveLength, "canHaveLength");
function checkEquality(left, right, value) {
  if (!isSameType(left, right)) {
    return false;
  }
  if ([left, right].every(src_default.array)) {
    return !left.some(hasValue(value)) && right.some(hasValue(value));
  }
  if ([left, right].every(src_default.plainObject)) {
    return !Object.entries(left).some(hasEntry(value)) && Object.entries(right).some(hasEntry(value));
  }
  return right === value;
}
__name(checkEquality, "checkEquality");
function compareNumbers(previousData, data, options) {
  const { actual, key, previous, type } = options;
  const left = nested(previousData, key);
  const right = nested(data, key);
  let changed = [left, right].every(src_default.number) && (type === "increased" ? left < right : left > right);
  if (!src_default.undefined(actual)) {
    changed = changed && right === actual;
  }
  if (!src_default.undefined(previous)) {
    changed = changed && left === previous;
  }
  return changed;
}
__name(compareNumbers, "compareNumbers");
function compareValues(previousData, data, options) {
  const { key, type, value } = options;
  const left = nested(previousData, key);
  const right = nested(data, key);
  const primary = type === "added" ? left : right;
  const secondary = type === "added" ? right : left;
  if (!src_default.nullOrUndefined(value)) {
    if (src_default.defined(primary)) {
      if (src_default.array(primary) || src_default.plainObject(primary)) {
        return checkEquality(primary, secondary, value);
      }
    } else {
      return equal(secondary, value);
    }
    return false;
  }
  if ([left, right].every(src_default.array)) {
    return !secondary.every(isEqualPredicate(primary));
  }
  if ([left, right].every(src_default.plainObject)) {
    return hasExtraKeys(Object.keys(primary), Object.keys(secondary));
  }
  return ![left, right].every((d2) => src_default.primitive(d2) && src_default.defined(d2)) && (type === "added" ? !src_default.defined(left) && src_default.defined(right) : src_default.defined(left) && !src_default.defined(right));
}
__name(compareValues, "compareValues");
function getIterables(previousData, data, { key } = {}) {
  let left = nested(previousData, key);
  let right = nested(data, key);
  if (!isSameType(left, right)) {
    throw new TypeError("Inputs have different types");
  }
  if (!canHaveLength(left, right)) {
    throw new TypeError("Inputs don't have length");
  }
  if ([left, right].every(src_default.plainObject)) {
    left = Object.keys(left);
    right = Object.keys(right);
  }
  return [left, right];
}
__name(getIterables, "getIterables");
function hasEntry(input) {
  return ([key, value]) => {
    if (src_default.array(input)) {
      return equal(input, value) || input.some((d2) => equal(d2, value) || src_default.array(value) && isEqualPredicate(value)(d2));
    }
    if (src_default.plainObject(input) && input[key]) {
      return !!input[key] && equal(input[key], value);
    }
    return equal(input, value);
  };
}
__name(hasEntry, "hasEntry");
function hasExtraKeys(left, right) {
  return right.some((d2) => !left.includes(d2));
}
__name(hasExtraKeys, "hasExtraKeys");
function hasValue(input) {
  return (value) => {
    if (src_default.array(input)) {
      return input.some((d2) => equal(d2, value) || src_default.array(value) && isEqualPredicate(value)(d2));
    }
    return equal(input, value);
  };
}
__name(hasValue, "hasValue");
function includesOrEqualsTo(previousValue, value) {
  return src_default.array(previousValue) ? previousValue.some((d2) => equal(d2, value)) : equal(previousValue, value);
}
__name(includesOrEqualsTo, "includesOrEqualsTo");
function isEqualPredicate(data) {
  return (value) => data.some((d2) => equal(d2, value));
}
__name(isEqualPredicate, "isEqualPredicate");
function isSameType(...arguments_) {
  return arguments_.every(src_default.array) || arguments_.every(src_default.number) || arguments_.every(src_default.plainObject) || arguments_.every(src_default.string);
}
__name(isSameType, "isSameType");
function nested(data, property) {
  if (src_default.plainObject(data) || src_default.array(data)) {
    if (src_default.string(property)) {
      const props = property.split(".");
      return props.reduce((acc, d2) => acc && acc[d2], data);
    }
    if (src_default.number(property)) {
      return data[property];
    }
    return data;
  }
  return data;
}
__name(nested, "nested");
function treeChanges(previousData, data) {
  if ([previousData, data].some(src_default.nullOrUndefined)) {
    throw new Error("Missing required parameters");
  }
  if (![previousData, data].every((d2) => src_default.plainObject(d2) || src_default.array(d2))) {
    throw new Error("Expected plain objects or array");
  }
  const added = /* @__PURE__ */ __name((key, value) => {
    try {
      return compareValues(previousData, data, { key, type: "added", value });
    } catch {
      return false;
    }
  }, "added");
  const changed = /* @__PURE__ */ __name((key, actual, previous) => {
    try {
      const left = nested(previousData, key);
      const right = nested(data, key);
      const hasActual = src_default.defined(actual);
      const hasPrevious = src_default.defined(previous);
      if (hasActual || hasPrevious) {
        const leftComparator = hasPrevious ? includesOrEqualsTo(previous, left) : !includesOrEqualsTo(actual, left);
        const rightComparator = includesOrEqualsTo(actual, right);
        return leftComparator && rightComparator;
      }
      if ([left, right].every(src_default.array) || [left, right].every(src_default.plainObject)) {
        return !equal(left, right);
      }
      return left !== right;
    } catch {
      return false;
    }
  }, "changed");
  const changedFrom = /* @__PURE__ */ __name((key, previous, actual) => {
    if (!src_default.defined(key)) {
      return false;
    }
    try {
      const left = nested(previousData, key);
      const right = nested(data, key);
      const hasActual = src_default.defined(actual);
      return includesOrEqualsTo(previous, left) && (hasActual ? includesOrEqualsTo(actual, right) : !hasActual);
    } catch {
      return false;
    }
  }, "changedFrom");
  const decreased = /* @__PURE__ */ __name((key, actual, previous) => {
    if (!src_default.defined(key)) {
      return false;
    }
    try {
      return compareNumbers(previousData, data, { key, actual, previous, type: "decreased" });
    } catch {
      return false;
    }
  }, "decreased");
  const emptied = /* @__PURE__ */ __name((key) => {
    try {
      const [left, right] = getIterables(previousData, data, { key });
      return !!left.length && !right.length;
    } catch {
      return false;
    }
  }, "emptied");
  const filled = /* @__PURE__ */ __name((key) => {
    try {
      const [left, right] = getIterables(previousData, data, { key });
      return !left.length && !!right.length;
    } catch {
      return false;
    }
  }, "filled");
  const increased = /* @__PURE__ */ __name((key, actual, previous) => {
    if (!src_default.defined(key)) {
      return false;
    }
    try {
      return compareNumbers(previousData, data, { key, actual, previous, type: "increased" });
    } catch {
      return false;
    }
  }, "increased");
  const removed = /* @__PURE__ */ __name((key, value) => {
    try {
      return compareValues(previousData, data, { key, type: "removed", value });
    } catch {
      return false;
    }
  }, "removed");
  return { added, changed, changedFrom, decreased, emptied, filled, increased, removed };
}
__name(treeChanges, "treeChanges");

// ../../node_modules/react-joyride/dist/index.mjs
var import_scroll = __toESM(require_scroll(), 1);
var import_scrollparent = __toESM(require_scrollparent(), 1);
var import_react_innertext = __toESM(require_react_innertext(), 1);
import { cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";
var import_deepmerge2 = __toESM(require_cjs(), 1);
var import_deepmerge3 = __toESM(require_cjs(), 1);
import * as React22 from "react";
import * as React3 from "react";
import * as React32 from "react";
import * as ReactDOM2 from "react-dom";
import * as React8 from "react";

// ../../node_modules/react-floater/es/index.js
var import_prop_types = __toESM(require_prop_types());
import React2 from "react";

// ../../node_modules/popper.js/dist/esm/popper.js
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && typeof navigator !== "undefined";
var timeoutDuration = function() {
  var longerTimeoutBrowsers = ["Edge", "Trident", "Firefox"];
  for (var i2 = 0; i2 < longerTimeoutBrowsers.length; i2 += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i2]) >= 0) {
      return 1;
    }
  }
  return 0;
}();
function microtaskDebounce(fn) {
  var called = false;
  return function() {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function() {
      called = false;
      fn();
    });
  };
}
__name(microtaskDebounce, "microtaskDebounce");
function taskDebounce(fn) {
  var scheduled = false;
  return function() {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function() {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}
__name(taskDebounce, "taskDebounce");
var supportsMicroTasks = isBrowser && window.Promise;
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;
function isFunction2(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
}
__name(isFunction2, "isFunction");
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  var window2 = element.ownerDocument.defaultView;
  var css = window2.getComputedStyle(element, null);
  return property ? css[property] : css;
}
__name(getStyleComputedProperty, "getStyleComputedProperty");
function getParentNode(element) {
  if (element.nodeName === "HTML") {
    return element;
  }
  return element.parentNode || element.host;
}
__name(getParentNode, "getParentNode");
function getScrollParent(element) {
  if (!element) {
    return document.body;
  }
  switch (element.nodeName) {
    case "HTML":
    case "BODY":
      return element.ownerDocument.body;
    case "#document":
      return element.body;
  }
  var _getStyleComputedProp = getStyleComputedProperty(element), overflow = _getStyleComputedProp.overflow, overflowX = _getStyleComputedProp.overflowX, overflowY = _getStyleComputedProp.overflowY;
  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }
  return getScrollParent(getParentNode(element));
}
__name(getScrollParent, "getScrollParent");
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}
__name(getReferenceNode, "getReferenceNode");
var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}
__name(isIE, "isIE");
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }
  var noOffsetParent = isIE(10) ? document.body : null;
  var offsetParent = element.offsetParent || null;
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }
  var nodeName = offsetParent && offsetParent.nodeName;
  if (!nodeName || nodeName === "BODY" || nodeName === "HTML") {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }
  if (["TH", "TD", "TABLE"].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, "position") === "static") {
    return getOffsetParent(offsetParent);
  }
  return offsetParent;
}
__name(getOffsetParent, "getOffsetParent");
function isOffsetContainer(element) {
  var nodeName = element.nodeName;
  if (nodeName === "BODY") {
    return false;
  }
  return nodeName === "HTML" || getOffsetParent(element.firstElementChild) === element;
}
__name(isOffsetContainer, "isOffsetContainer");
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }
  return node;
}
__name(getRoot, "getRoot");
function findCommonOffsetParent(element1, element2) {
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;
  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }
    return getOffsetParent(commonAncestorContainer);
  }
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}
__name(findCommonOffsetParent, "findCommonOffsetParent");
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "top";
  var upperSide = side === "top" ? "scrollTop" : "scrollLeft";
  var nodeName = element.nodeName;
  if (nodeName === "BODY" || nodeName === "HTML") {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }
  return element[upperSide];
}
__name(getScroll, "getScroll");
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var scrollTop = getScroll(element, "top");
  var scrollLeft = getScroll(element, "left");
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}
__name(includeScroll, "includeScroll");
function getBordersSize(styles, axis) {
  var sideA = axis === "x" ? "Left" : "Top";
  var sideB = sideA === "Left" ? "Right" : "Bottom";
  return parseFloat(styles["border" + sideA + "Width"]) + parseFloat(styles["border" + sideB + "Width"]);
}
__name(getBordersSize, "getBordersSize");
function getSize(axis, body, html, computedStyle) {
  return Math.max(body["offset" + axis], body["scroll" + axis], html["client" + axis], html["offset" + axis], html["scroll" + axis], isIE(10) ? parseInt(html["offset" + axis]) + parseInt(computedStyle["margin" + (axis === "Height" ? "Top" : "Left")]) + parseInt(computedStyle["margin" + (axis === "Height" ? "Bottom" : "Right")]) : 0);
}
__name(getSize, "getSize");
function getWindowSizes(document2) {
  var body = document2.body;
  var html = document2.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);
  return {
    height: getSize("Height", body, html, computedStyle),
    width: getSize("Width", body, html, computedStyle)
  };
}
__name(getWindowSizes, "getWindowSizes");
var classCallCheck = /* @__PURE__ */ __name(function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}, "classCallCheck");
var createClass = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i2 = 0; i2 < props.length; i2++) {
      var descriptor = props[i2];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  __name(defineProperties, "defineProperties");
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var defineProperty = /* @__PURE__ */ __name(function(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}, "defineProperty");
var _extends = Object.assign || function(target) {
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source = arguments[i2];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}
__name(getClientRect, "getClientRect");
function getBoundingClientRect(element) {
  var rect = {};
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, "top");
      var scrollLeft = getScroll(element, "left");
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e2) {
  }
  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };
  var sizes = element.nodeName === "HTML" ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;
  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, "x");
    vertScrollbar -= getBordersSize(styles, "y");
    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }
  return getClientRect(result);
}
__name(getBoundingClientRect, "getBoundingClientRect");
function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var isIE102 = isIE(10);
  var isHTML = parent.nodeName === "HTML";
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent2 = getScrollParent(children);
  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth);
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;
  if (!isIE102 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);
    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }
  if (isIE102 && !fixedPosition ? parent.contains(scrollParent2) : parent === scrollParent2 && scrollParent2.nodeName !== "BODY") {
    offsets = includeScroll(offsets, parent);
  }
  return offsets;
}
__name(getOffsetRectRelativeToArbitraryNode, "getOffsetRectRelativeToArbitraryNode");
function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);
  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, "left") : 0;
  var offset2 = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width,
    height
  };
  return getClientRect(offset2);
}
__name(getViewportOffsetRectRelativeToArtbitraryNode, "getViewportOffsetRectRelativeToArtbitraryNode");
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === "BODY" || nodeName === "HTML") {
    return false;
  }
  if (getStyleComputedProperty(element, "position") === "fixed") {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}
__name(isFixed, "isFixed");
function getFixedPositionOffsetParent(element) {
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, "transform") === "none") {
    el = el.parentElement;
  }
  return el || document.documentElement;
}
__name(getFixedPositionOffsetParent, "getFixedPositionOffsetParent");
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  if (boundariesElement === "viewport") {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    var boundariesNode = void 0;
    if (boundariesElement === "scrollParent") {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === "BODY") {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === "window") {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }
    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);
    if (boundariesNode.nodeName === "HTML" && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument), height = _getWindowSizes.height, width = _getWindowSizes.width;
      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      boundaries = offsets;
    }
  }
  padding = padding || 0;
  var isPaddingNumber = typeof padding === "number";
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;
  return boundaries;
}
__name(getBoundaries, "getBoundaries");
function getArea(_ref) {
  var width = _ref.width, height = _ref.height;
  return width * height;
}
__name(getArea, "getArea");
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 0;
  if (placement.indexOf("auto") === -1) {
    return placement;
  }
  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);
  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };
  var sortedAreas = Object.keys(rects).map(function(key) {
    return _extends({
      key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function(a2, b2) {
    return b2.area - a2.area;
  });
  var filteredAreas = sortedAreas.filter(function(_ref2) {
    var width = _ref2.width, height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });
  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;
  var variation = placement.split("-")[1];
  return computedPlacement + (variation ? "-" + variation : "");
}
__name(computeAutoPlacement, "computeAutoPlacement");
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}
__name(getReferenceOffsets, "getReferenceOffsets");
function getOuterSizes(element) {
  var window2 = element.ownerDocument.defaultView;
  var styles = window2.getComputedStyle(element);
  var x2 = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y2 = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y2,
    height: element.offsetHeight + x2
  };
  return result;
}
__name(getOuterSizes, "getOuterSizes");
function getOppositePlacement(placement) {
  var hash = { left: "right", right: "left", bottom: "top", top: "bottom" };
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}
__name(getOppositePlacement, "getOppositePlacement");
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split("-")[0];
  var popperRect = getOuterSizes(popper);
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };
  var isHoriz = ["right", "left"].indexOf(placement) !== -1;
  var mainSide = isHoriz ? "top" : "left";
  var secondarySide = isHoriz ? "left" : "top";
  var measurement = isHoriz ? "height" : "width";
  var secondaryMeasurement = !isHoriz ? "height" : "width";
  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }
  return popperOffsets;
}
__name(getPopperOffsets, "getPopperOffsets");
function find(arr, check) {
  if (Array.prototype.find) {
    return arr.find(check);
  }
  return arr.filter(check)[0];
}
__name(find, "find");
function findIndex(arr, prop, value) {
  if (Array.prototype.findIndex) {
    return arr.findIndex(function(cur) {
      return cur[prop] === value;
    });
  }
  var match = find(arr, function(obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}
__name(findIndex, "findIndex");
function runModifiers(modifiers2, data, ends) {
  var modifiersToRun = ends === void 0 ? modifiers2 : modifiers2.slice(0, findIndex(modifiers2, "name", ends));
  modifiersToRun.forEach(function(modifier) {
    if (modifier["function"]) {
      console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
    }
    var fn = modifier["function"] || modifier.fn;
    if (modifier.enabled && isFunction2(fn)) {
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);
      data = fn(data, modifier);
    }
  });
  return data;
}
__name(runModifiers, "runModifiers");
function update() {
  if (this.state.isDestroyed) {
    return;
  }
  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);
  data.originalPlacement = data.placement;
  data.positionFixed = this.options.positionFixed;
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute";
  data = runModifiers(this.modifiers, data);
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}
__name(update, "update");
function isModifierEnabled(modifiers2, modifierName) {
  return modifiers2.some(function(_ref) {
    var name = _ref.name, enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}
__name(isModifierEnabled, "isModifierEnabled");
function getSupportedPropertyName(property) {
  var prefixes = [false, "ms", "Webkit", "Moz", "O"];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);
  for (var i2 = 0; i2 < prefixes.length; i2++) {
    var prefix = prefixes[i2];
    var toCheck = prefix ? "" + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== "undefined") {
      return toCheck;
    }
  }
  return null;
}
__name(getSupportedPropertyName, "getSupportedPropertyName");
function destroy() {
  this.state.isDestroyed = true;
  if (isModifierEnabled(this.modifiers, "applyStyle")) {
    this.popper.removeAttribute("x-placement");
    this.popper.style.position = "";
    this.popper.style.top = "";
    this.popper.style.left = "";
    this.popper.style.right = "";
    this.popper.style.bottom = "";
    this.popper.style.willChange = "";
    this.popper.style[getSupportedPropertyName("transform")] = "";
  }
  this.disableEventListeners();
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}
__name(destroy, "destroy");
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}
__name(getWindow, "getWindow");
function attachToScrollParents(scrollParent2, event, callback, scrollParents) {
  var isBody = scrollParent2.nodeName === "BODY";
  var target = isBody ? scrollParent2.ownerDocument.defaultView : scrollParent2;
  target.addEventListener(event, callback, { passive: true });
  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}
__name(attachToScrollParents, "attachToScrollParents");
function setupEventListeners(reference, options, state, updateBound) {
  state.updateBound = updateBound;
  getWindow(reference).addEventListener("resize", state.updateBound, { passive: true });
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, "scroll", state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;
  return state;
}
__name(setupEventListeners, "setupEventListeners");
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}
__name(enableEventListeners, "enableEventListeners");
function removeEventListeners(reference, state) {
  getWindow(reference).removeEventListener("resize", state.updateBound);
  state.scrollParents.forEach(function(target) {
    target.removeEventListener("scroll", state.updateBound);
  });
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}
__name(removeEventListeners, "removeEventListeners");
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}
__name(disableEventListeners, "disableEventListeners");
function isNumeric(n2) {
  return n2 !== "" && !isNaN(parseFloat(n2)) && isFinite(n2);
}
__name(isNumeric, "isNumeric");
function setStyles(element, styles) {
  Object.keys(styles).forEach(function(prop) {
    var unit = "";
    if (["width", "height", "top", "right", "bottom", "left"].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = "px";
    }
    element.style[prop] = styles[prop] + unit;
  });
}
__name(setStyles, "setStyles");
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function(prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}
__name(setAttributes, "setAttributes");
function applyStyle(data) {
  setStyles(data.instance.popper, data.styles);
  setAttributes(data.instance.popper, data.attributes);
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }
  return data;
}
__name(applyStyle, "applyStyle");
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);
  popper.setAttribute("x-placement", placement);
  setStyles(popper, { position: options.positionFixed ? "fixed" : "absolute" });
  return options;
}
__name(applyStyleOnLoad, "applyStyleOnLoad");
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var round = Math.round, floor = Math.floor;
  var noRound = /* @__PURE__ */ __name(function noRound2(v2) {
    return v2;
  }, "noRound");
  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);
  var isVertical = ["left", "right"].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf("-") !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;
  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;
  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}
__name(getRoundedOffsets, "getRoundedOffsets");
var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);
function computeStyle(data, options) {
  var x2 = options.x, y2 = options.y;
  var popper = data.offsets.popper;
  var legacyGpuAccelerationOption = find(data.instance.modifiers, function(modifier) {
    return modifier.name === "applyStyle";
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== void 0) {
    console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== void 0 ? legacyGpuAccelerationOption : options.gpuAcceleration;
  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);
  var styles = {
    position: popper.position
  };
  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);
  var sideA = x2 === "bottom" ? "top" : "bottom";
  var sideB = y2 === "right" ? "left" : "right";
  var prefixedProperty = getSupportedPropertyName("transform");
  var left = void 0, top = void 0;
  if (sideA === "bottom") {
    if (offsetParent.nodeName === "HTML") {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === "right") {
    if (offsetParent.nodeName === "HTML") {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = "translate3d(" + left + "px, " + top + "px, 0)";
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = "transform";
  } else {
    var invertTop = sideA === "bottom" ? -1 : 1;
    var invertLeft = sideB === "right" ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ", " + sideB;
  }
  var attributes = {
    "x-placement": data.placement
  };
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);
  return data;
}
__name(computeStyle, "computeStyle");
function isModifierRequired(modifiers2, requestingName, requestedName) {
  var requesting = find(modifiers2, function(_ref) {
    var name = _ref.name;
    return name === requestingName;
  });
  var isRequired = !!requesting && modifiers2.some(function(modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });
  if (!isRequired) {
    var _requesting = "`" + requestingName + "`";
    var requested = "`" + requestedName + "`";
    console.warn(requested + " modifier is required by " + _requesting + " modifier in order to work, be sure to include it before " + _requesting + "!");
  }
  return isRequired;
}
__name(isModifierRequired, "isModifierRequired");
function arrow(data, options) {
  var _data$offsets$arrow;
  if (!isModifierRequired(data.instance.modifiers, "arrow", "keepTogether")) {
    return data;
  }
  var arrowElement = options.element;
  if (typeof arrowElement === "string") {
    arrowElement = data.instance.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return data;
    }
  } else {
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn("WARNING: `arrow.element` must be child of its popper element!");
      return data;
    }
  }
  var placement = data.placement.split("-")[0];
  var _data$offsets = data.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var isVertical = ["left", "right"].indexOf(placement) !== -1;
  var len = isVertical ? "height" : "width";
  var sideCapitalized = isVertical ? "Top" : "Left";
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? "left" : "top";
  var opSide = isVertical ? "bottom" : "right";
  var arrowElementSize = getOuterSizes(arrowElement)[len];
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css["margin" + sideCapitalized]);
  var popperBorderSide = parseFloat(css["border" + sideCapitalized + "Width"]);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);
  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ""), _data$offsets$arrow);
  return data;
}
__name(arrow, "arrow");
function getOppositeVariation(variation) {
  if (variation === "end") {
    return "start";
  } else if (variation === "start") {
    return "end";
  }
  return variation;
}
__name(getOppositeVariation, "getOppositeVariation");
var placements = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"];
var validPlacements = placements.slice(3);
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}
__name(clockwise, "clockwise");
var BEHAVIORS = {
  FLIP: "flip",
  CLOCKWISE: "clockwise",
  COUNTERCLOCKWISE: "counterclockwise"
};
function flip(data, options) {
  if (isModifierEnabled(data.instance.modifiers, "inner")) {
    return data;
  }
  if (data.flipped && data.placement === data.originalPlacement) {
    return data;
  }
  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);
  var placement = data.placement.split("-")[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split("-")[1] || "";
  var flipOrder = [];
  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }
  flipOrder.forEach(function(step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }
    placement = data.placement.split("-")[0];
    placementOpposite = getOppositePlacement(placement);
    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;
    var floor = Math.floor;
    var overlapsRef = placement === "left" && floor(popperOffsets.right) > floor(refOffsets.left) || placement === "right" && floor(popperOffsets.left) < floor(refOffsets.right) || placement === "top" && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === "bottom" && floor(popperOffsets.top) < floor(refOffsets.bottom);
    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);
    var overflowsBoundaries = placement === "left" && overflowsLeft || placement === "right" && overflowsRight || placement === "top" && overflowsTop || placement === "bottom" && overflowsBottom;
    var isVertical = ["top", "bottom"].indexOf(placement) !== -1;
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === "start" && overflowsLeft || isVertical && variation === "end" && overflowsRight || !isVertical && variation === "start" && overflowsTop || !isVertical && variation === "end" && overflowsBottom);
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === "start" && overflowsRight || isVertical && variation === "end" && overflowsLeft || !isVertical && variation === "start" && overflowsBottom || !isVertical && variation === "end" && overflowsTop);
    var flippedVariation = flippedVariationByRef || flippedVariationByContent;
    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      data.flipped = true;
      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }
      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }
      data.placement = placement + (variation ? "-" + variation : "");
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));
      data = runModifiers(data.instance.modifiers, data, "flip");
    }
  });
  return data;
}
__name(flip, "flip");
function keepTogether(data) {
  var _data$offsets = data.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var placement = data.placement.split("-")[0];
  var floor = Math.floor;
  var isVertical = ["top", "bottom"].indexOf(placement) !== -1;
  var side = isVertical ? "right" : "bottom";
  var opSide = isVertical ? "left" : "top";
  var measurement = isVertical ? "width" : "height";
  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }
  return data;
}
__name(keepTogether, "keepTogether");
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];
  if (!value) {
    return str;
  }
  if (unit.indexOf("%") === 0) {
    var element = void 0;
    switch (unit) {
      case "%p":
        element = popperOffsets;
        break;
      case "%":
      case "%r":
      default:
        element = referenceOffsets;
    }
    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === "vh" || unit === "vw") {
    var size = void 0;
    if (unit === "vh") {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    return value;
  }
}
__name(toValue, "toValue");
function parseOffset(offset2, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];
  var useHeight = ["right", "left"].indexOf(basePlacement) !== -1;
  var fragments = offset2.split(/(\+|\-)/).map(function(frag) {
    return frag.trim();
  });
  var divider = fragments.indexOf(find(fragments, function(frag) {
    return frag.search(/,|\s/) !== -1;
  }));
  if (fragments[divider] && fragments[divider].indexOf(",") === -1) {
    console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
  }
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];
  ops = ops.map(function(op, index) {
    var measurement = (index === 1 ? !useHeight : useHeight) ? "height" : "width";
    var mergeWithPrevious = false;
    return op.reduce(function(a2, b2) {
      if (a2[a2.length - 1] === "" && ["+", "-"].indexOf(b2) !== -1) {
        a2[a2.length - 1] = b2;
        mergeWithPrevious = true;
        return a2;
      } else if (mergeWithPrevious) {
        a2[a2.length - 1] += b2;
        mergeWithPrevious = false;
        return a2;
      } else {
        return a2.concat(b2);
      }
    }, []).map(function(str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });
  ops.forEach(function(op, index) {
    op.forEach(function(frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === "-" ? -1 : 1);
      }
    });
  });
  return offsets;
}
__name(parseOffset, "parseOffset");
function offset(data, _ref) {
  var offset2 = _ref.offset;
  var placement = data.placement, _data$offsets = data.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var basePlacement = placement.split("-")[0];
  var offsets = void 0;
  if (isNumeric(+offset2)) {
    offsets = [+offset2, 0];
  } else {
    offsets = parseOffset(offset2, popper, reference, basePlacement);
  }
  if (basePlacement === "left") {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === "right") {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === "top") {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === "bottom") {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }
  data.popper = popper;
  return data;
}
__name(offset, "offset");
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }
  var transformProp = getSupportedPropertyName("transform");
  var popperStyles = data.instance.popper.style;
  var top = popperStyles.top, left = popperStyles.left, transform = popperStyles[transformProp];
  popperStyles.top = "";
  popperStyles.left = "";
  popperStyles[transformProp] = "";
  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;
  options.boundaries = boundaries;
  var order = options.priority;
  var popper = data.offsets.popper;
  var check = {
    primary: /* @__PURE__ */ __name(function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    }, "primary"),
    secondary: /* @__PURE__ */ __name(function secondary(placement) {
      var mainSide = placement === "right" ? "left" : "top";
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === "right" ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }, "secondary")
  };
  order.forEach(function(placement) {
    var side = ["left", "top"].indexOf(placement) !== -1 ? "primary" : "secondary";
    popper = _extends({}, popper, check[side](placement));
  });
  data.offsets.popper = popper;
  return data;
}
__name(preventOverflow, "preventOverflow");
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split("-")[0];
  var shiftvariation = placement.split("-")[1];
  if (shiftvariation) {
    var _data$offsets = data.offsets, reference = _data$offsets.reference, popper = _data$offsets.popper;
    var isVertical = ["bottom", "top"].indexOf(basePlacement) !== -1;
    var side = isVertical ? "left" : "top";
    var measurement = isVertical ? "width" : "height";
    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };
    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }
  return data;
}
__name(shift, "shift");
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, "hide", "preventOverflow")) {
    return data;
  }
  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function(modifier) {
    return modifier.name === "preventOverflow";
  }).boundaries;
  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    if (data.hide === true) {
      return data;
    }
    data.hide = true;
    data.attributes["x-out-of-boundaries"] = "";
  } else {
    if (data.hide === false) {
      return data;
    }
    data.hide = false;
    data.attributes["x-out-of-boundaries"] = false;
  }
  return data;
}
__name(hide, "hide");
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split("-")[0];
  var _data$offsets = data.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var isHoriz = ["left", "right"].indexOf(basePlacement) !== -1;
  var subtractLength = ["top", "left"].indexOf(basePlacement) === -1;
  popper[isHoriz ? "left" : "top"] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? "width" : "height"] : 0);
  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);
  return data;
}
__name(inner, "inner");
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },
  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },
  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ["left", "right", "top", "bottom"],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: "scrollParent"
  },
  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },
  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: "[x-arrow]"
  },
  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: "flip",
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: "viewport",
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },
  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },
  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },
  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: "bottom",
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: "right"
  },
  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: void 0
  }
};
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: "bottom",
  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,
  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,
  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,
  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: /* @__PURE__ */ __name(function onCreate() {
  }, "onCreate"),
  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: /* @__PURE__ */ __name(function onUpdate() {
  }, "onUpdate"),
  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers
};
var Popper = function() {
  function Popper2(reference, popper) {
    var _this = this;
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    classCallCheck(this, Popper2);
    this.scheduleUpdate = function() {
      return requestAnimationFrame(_this.update);
    };
    this.update = debounce(this.update.bind(this));
    this.options = _extends({}, Popper2.Defaults, options);
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper2.Defaults.modifiers, options.modifiers)).forEach(function(name) {
      _this.options.modifiers[name] = _extends({}, Popper2.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });
    this.modifiers = Object.keys(this.options.modifiers).map(function(name) {
      return _extends({
        name
      }, _this.options.modifiers[name]);
    }).sort(function(a2, b2) {
      return a2.order - b2.order;
    });
    this.modifiers.forEach(function(modifierOptions) {
      if (modifierOptions.enabled && isFunction2(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });
    this.update();
    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      this.enableEventListeners();
    }
    this.state.eventsEnabled = eventsEnabled;
  }
  __name(Popper2, "Popper");
  createClass(Popper2, [{
    key: "update",
    value: /* @__PURE__ */ __name(function update$$1() {
      return update.call(this);
    }, "update$$1")
  }, {
    key: "destroy",
    value: /* @__PURE__ */ __name(function destroy$$1() {
      return destroy.call(this);
    }, "destroy$$1")
  }, {
    key: "enableEventListeners",
    value: /* @__PURE__ */ __name(function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }, "enableEventListeners$$1")
  }, {
    key: "disableEventListeners",
    value: /* @__PURE__ */ __name(function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }, "disableEventListeners$$1")
    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */
    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */
  }]);
  return Popper2;
}();
Popper.Utils = (typeof window !== "undefined" ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;
var popper_default = Popper;

// ../../node_modules/react-floater/es/index.js
var import_deepmerge = __toESM(require_cjs());

// ../../node_modules/react-floater/node_modules/is-lite/esm/index.js
var DOM_PROPERTIES_TO_CHECK2 = [
  "innerHTML",
  "ownerDocument",
  "style",
  "attributes",
  "nodeValue"
];
var objectTypes2 = [
  "Array",
  "ArrayBuffer",
  "AsyncFunction",
  "AsyncGenerator",
  "AsyncGeneratorFunction",
  "Date",
  "Error",
  "Function",
  "Generator",
  "GeneratorFunction",
  "HTMLElement",
  "Map",
  "Object",
  "Promise",
  "RegExp",
  "Set",
  "WeakMap",
  "WeakSet"
];
var primitiveTypes2 = [
  "bigint",
  "boolean",
  "null",
  "number",
  "string",
  "symbol",
  "undefined"
];
function getObjectType2(value) {
  var objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (/HTML\w+Element/.test(objectTypeName)) {
    return "HTMLElement";
  }
  if (isObjectType2(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}
__name(getObjectType2, "getObjectType");
function isObjectOfType2(type) {
  return function(value) {
    return getObjectType2(value) === type;
  };
}
__name(isObjectOfType2, "isObjectOfType");
function isObjectType2(name) {
  return objectTypes2.includes(name);
}
__name(isObjectType2, "isObjectType");
function isOfType3(type) {
  return function(value) {
    return typeof value === type;
  };
}
__name(isOfType3, "isOfType");
function isPrimitiveType2(name) {
  return primitiveTypes2.includes(name);
}
__name(isPrimitiveType2, "isPrimitiveType");
function is2(value) {
  if (value === null) {
    return "null";
  }
  switch (typeof value) {
    case "bigint":
      return "bigint";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "symbol":
      return "symbol";
    case "undefined":
      return "undefined";
    default:
  }
  if (is2.array(value)) {
    return "Array";
  }
  if (is2.plainFunction(value)) {
    return "Function";
  }
  var tagType = getObjectType2(value);
  if (tagType) {
    return tagType;
  }
  return "Object";
}
__name(is2, "is");
is2.array = Array.isArray;
is2.arrayOf = function(target, predicate) {
  if (!is2.array(target) && !is2.function(predicate)) {
    return false;
  }
  return target.every(function(d2) {
    return predicate(d2);
  });
};
is2.asyncGeneratorFunction = function(value) {
  return getObjectType2(value) === "AsyncGeneratorFunction";
};
is2.asyncFunction = isObjectOfType2("AsyncFunction");
is2.bigint = isOfType3("bigint");
is2.boolean = function(value) {
  return value === true || value === false;
};
is2.date = isObjectOfType2("Date");
is2.defined = function(value) {
  return !is2.undefined(value);
};
is2.domElement = function(value) {
  return is2.object(value) && !is2.plainObject(value) && value.nodeType === 1 && is2.string(value.nodeName) && DOM_PROPERTIES_TO_CHECK2.every(function(property) {
    return property in value;
  });
};
is2.empty = function(value) {
  return is2.string(value) && value.length === 0 || is2.array(value) && value.length === 0 || is2.object(value) && !is2.map(value) && !is2.set(value) && Object.keys(value).length === 0 || is2.set(value) && value.size === 0 || is2.map(value) && value.size === 0;
};
is2.error = isObjectOfType2("Error");
is2.function = isOfType3("function");
is2.generator = function(value) {
  return is2.iterable(value) && is2.function(value.next) && is2.function(value.throw);
};
is2.generatorFunction = isObjectOfType2("GeneratorFunction");
is2.instanceOf = function(instance, class_) {
  if (!instance || !class_) {
    return false;
  }
  return Object.getPrototypeOf(instance) === class_.prototype;
};
is2.iterable = function(value) {
  return !is2.nullOrUndefined(value) && is2.function(value[Symbol.iterator]);
};
is2.map = isObjectOfType2("Map");
is2.nan = function(value) {
  return Number.isNaN(value);
};
is2.null = function(value) {
  return value === null;
};
is2.nullOrUndefined = function(value) {
  return is2.null(value) || is2.undefined(value);
};
is2.number = function(value) {
  return isOfType3("number")(value) && !is2.nan(value);
};
is2.numericString = function(value) {
  return is2.string(value) && value.length > 0 && !Number.isNaN(Number(value));
};
is2.object = function(value) {
  return !is2.nullOrUndefined(value) && (is2.function(value) || typeof value === "object");
};
is2.oneOf = function(target, value) {
  if (!is2.array(target)) {
    return false;
  }
  return target.indexOf(value) > -1;
};
is2.plainFunction = isObjectOfType2("Function");
is2.plainObject = function(value) {
  if (getObjectType2(value) !== "Object") {
    return false;
  }
  var prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.getPrototypeOf({});
};
is2.primitive = function(value) {
  return is2.null(value) || isPrimitiveType2(typeof value);
};
is2.promise = isObjectOfType2("Promise");
is2.propertyOf = function(target, key, predicate) {
  if (!is2.object(target) || !key) {
    return false;
  }
  var value = target[key];
  if (is2.function(predicate)) {
    return predicate(value);
  }
  return is2.defined(value);
};
is2.regexp = isObjectOfType2("RegExp");
is2.set = isObjectOfType2("Set");
is2.string = isOfType3("string");
is2.symbol = isOfType3("symbol");
is2.undefined = isOfType3("undefined");
is2.weakMap = isObjectOfType2("WeakMap");
is2.weakSet = isObjectOfType2("WeakSet");
var esm_default = is2;

// ../../node_modules/tree-changes/node_modules/@gilbarbara/deep-equal/esm/helpers.js
function isOfType4(type) {
  return function(value) {
    return typeof value === type;
  };
}
__name(isOfType4, "isOfType");
var isFunction3 = isOfType4("function");
var isNull2 = /* @__PURE__ */ __name(function(value) {
  return value === null;
}, "isNull");
var isRegex2 = /* @__PURE__ */ __name(function(value) {
  return Object.prototype.toString.call(value).slice(8, -1) === "RegExp";
}, "isRegex");
var isObject2 = /* @__PURE__ */ __name(function(value) {
  return !isUndefined2(value) && !isNull2(value) && (isFunction3(value) || typeof value === "object");
}, "isObject");
var isUndefined2 = isOfType4("undefined");

// ../../node_modules/tree-changes/node_modules/@gilbarbara/deep-equal/esm/index.js
var __values = function(o2) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o2[s2], i2 = 0;
  if (m2) return m2.call(o2);
  if (o2 && typeof o2.length === "number") return {
    next: /* @__PURE__ */ __name(function() {
      if (o2 && i2 >= o2.length) o2 = void 0;
      return { value: o2 && o2[i2++], done: !o2 };
    }, "next")
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function equalArray2(left, right) {
  var length = left.length;
  if (length !== right.length) {
    return false;
  }
  for (var index = length; index-- !== 0; ) {
    if (!equal2(left[index], right[index])) {
      return false;
    }
  }
  return true;
}
__name(equalArray2, "equalArray");
function equalArrayBuffer2(left, right) {
  if (left.byteLength !== right.byteLength) {
    return false;
  }
  var view1 = new DataView(left.buffer);
  var view2 = new DataView(right.buffer);
  var index = left.byteLength;
  while (index--) {
    if (view1.getUint8(index) !== view2.getUint8(index)) {
      return false;
    }
  }
  return true;
}
__name(equalArrayBuffer2, "equalArrayBuffer");
function equalMap2(left, right) {
  var e_1, _a9, e_2, _b;
  if (left.size !== right.size) {
    return false;
  }
  try {
    for (var _c = __values(left.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
      var index = _d.value;
      if (!right.has(index[0])) {
        return false;
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_d && !_d.done && (_a9 = _c.return)) _a9.call(_c);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  try {
    for (var _e = __values(left.entries()), _f = _e.next(); !_f.done; _f = _e.next()) {
      var index = _f.value;
      if (!equal2(index[1], right.get(index[0]))) {
        return false;
      }
    }
  } catch (e_2_1) {
    e_2 = { error: e_2_1 };
  } finally {
    try {
      if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
    } finally {
      if (e_2) throw e_2.error;
    }
  }
  return true;
}
__name(equalMap2, "equalMap");
function equalSet2(left, right) {
  var e_3, _a9;
  if (left.size !== right.size) {
    return false;
  }
  try {
    for (var _b = __values(left.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
      var index = _c.value;
      if (!right.has(index[0])) {
        return false;
      }
    }
  } catch (e_3_1) {
    e_3 = { error: e_3_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a9 = _b.return)) _a9.call(_b);
    } finally {
      if (e_3) throw e_3.error;
    }
  }
  return true;
}
__name(equalSet2, "equalSet");
function equal2(left, right) {
  if (left === right) {
    return true;
  }
  if (left && isObject2(left) && right && isObject2(right)) {
    if (left.constructor !== right.constructor) {
      return false;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      return equalArray2(left, right);
    }
    if (left instanceof Map && right instanceof Map) {
      return equalMap2(left, right);
    }
    if (left instanceof Set && right instanceof Set) {
      return equalSet2(left, right);
    }
    if (ArrayBuffer.isView(left) && ArrayBuffer.isView(right)) {
      return equalArrayBuffer2(left, right);
    }
    if (isRegex2(left) && isRegex2(right)) {
      return left.source === right.source && left.flags === right.flags;
    }
    if (left.valueOf !== Object.prototype.valueOf) {
      return left.valueOf() === right.valueOf();
    }
    if (left.toString !== Object.prototype.toString) {
      return left.toString() === right.toString();
    }
    var leftKeys = Object.keys(left);
    var rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
      return false;
    }
    for (var index = leftKeys.length; index-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(right, leftKeys[index])) {
        return false;
      }
    }
    for (var index = leftKeys.length; index-- !== 0; ) {
      var key = leftKeys[index];
      if (key === "_owner" && left.$$typeof) {
        continue;
      }
      if (!equal2(left[key], right[key])) {
        return false;
      }
    }
    return true;
  }
  if (Number.isNaN(left) && Number.isNaN(right)) {
    return true;
  }
  return left === right;
}
__name(equal2, "equal");

// ../../node_modules/tree-changes/node_modules/is-lite/esm/index.js
var DOM_PROPERTIES_TO_CHECK3 = [
  "innerHTML",
  "ownerDocument",
  "style",
  "attributes",
  "nodeValue"
];
var objectTypes3 = [
  "Array",
  "ArrayBuffer",
  "AsyncFunction",
  "AsyncGenerator",
  "AsyncGeneratorFunction",
  "Date",
  "Error",
  "Function",
  "Generator",
  "GeneratorFunction",
  "HTMLElement",
  "Map",
  "Object",
  "Promise",
  "RegExp",
  "Set",
  "WeakMap",
  "WeakSet"
];
var primitiveTypes3 = [
  "bigint",
  "boolean",
  "null",
  "number",
  "string",
  "symbol",
  "undefined"
];
function getObjectType3(value) {
  var objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (/HTML\w+Element/.test(objectTypeName)) {
    return "HTMLElement";
  }
  if (isObjectType3(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}
__name(getObjectType3, "getObjectType");
function isObjectOfType3(type) {
  return function(value) {
    return getObjectType3(value) === type;
  };
}
__name(isObjectOfType3, "isObjectOfType");
function isObjectType3(name) {
  return objectTypes3.includes(name);
}
__name(isObjectType3, "isObjectType");
function isOfType5(type) {
  return function(value) {
    return typeof value === type;
  };
}
__name(isOfType5, "isOfType");
function isPrimitiveType3(name) {
  return primitiveTypes3.includes(name);
}
__name(isPrimitiveType3, "isPrimitiveType");
function is3(value) {
  if (value === null) {
    return "null";
  }
  switch (typeof value) {
    case "bigint":
      return "bigint";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "symbol":
      return "symbol";
    case "undefined":
      return "undefined";
    default:
  }
  if (is3.array(value)) {
    return "Array";
  }
  if (is3.plainFunction(value)) {
    return "Function";
  }
  var tagType = getObjectType3(value);
  if (tagType) {
    return tagType;
  }
  return "Object";
}
__name(is3, "is");
is3.array = Array.isArray;
is3.arrayOf = function(target, predicate) {
  if (!is3.array(target) && !is3.function(predicate)) {
    return false;
  }
  return target.every(function(d2) {
    return predicate(d2);
  });
};
is3.asyncGeneratorFunction = function(value) {
  return getObjectType3(value) === "AsyncGeneratorFunction";
};
is3.asyncFunction = isObjectOfType3("AsyncFunction");
is3.bigint = isOfType5("bigint");
is3.boolean = function(value) {
  return value === true || value === false;
};
is3.date = isObjectOfType3("Date");
is3.defined = function(value) {
  return !is3.undefined(value);
};
is3.domElement = function(value) {
  return is3.object(value) && !is3.plainObject(value) && value.nodeType === 1 && is3.string(value.nodeName) && DOM_PROPERTIES_TO_CHECK3.every(function(property) {
    return property in value;
  });
};
is3.empty = function(value) {
  return is3.string(value) && value.length === 0 || is3.array(value) && value.length === 0 || is3.object(value) && !is3.map(value) && !is3.set(value) && Object.keys(value).length === 0 || is3.set(value) && value.size === 0 || is3.map(value) && value.size === 0;
};
is3.error = isObjectOfType3("Error");
is3.function = isOfType5("function");
is3.generator = function(value) {
  return is3.iterable(value) && is3.function(value.next) && is3.function(value.throw);
};
is3.generatorFunction = isObjectOfType3("GeneratorFunction");
is3.instanceOf = function(instance, class_) {
  if (!instance || !class_) {
    return false;
  }
  return Object.getPrototypeOf(instance) === class_.prototype;
};
is3.iterable = function(value) {
  return !is3.nullOrUndefined(value) && is3.function(value[Symbol.iterator]);
};
is3.map = isObjectOfType3("Map");
is3.nan = function(value) {
  return Number.isNaN(value);
};
is3.null = function(value) {
  return value === null;
};
is3.nullOrUndefined = function(value) {
  return is3.null(value) || is3.undefined(value);
};
is3.number = function(value) {
  return isOfType5("number")(value) && !is3.nan(value);
};
is3.numericString = function(value) {
  return is3.string(value) && value.length > 0 && !Number.isNaN(Number(value));
};
is3.object = function(value) {
  return !is3.nullOrUndefined(value) && (is3.function(value) || typeof value === "object");
};
is3.oneOf = function(target, value) {
  if (!is3.array(target)) {
    return false;
  }
  return target.indexOf(value) > -1;
};
is3.plainFunction = isObjectOfType3("Function");
is3.plainObject = function(value) {
  if (getObjectType3(value) !== "Object") {
    return false;
  }
  var prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.getPrototypeOf({});
};
is3.primitive = function(value) {
  return is3.null(value) || isPrimitiveType3(typeof value);
};
is3.promise = isObjectOfType3("Promise");
is3.propertyOf = function(target, key, predicate) {
  if (!is3.object(target) || !key) {
    return false;
  }
  var value = target[key];
  if (is3.function(predicate)) {
    return predicate(value);
  }
  return is3.defined(value);
};
is3.regexp = isObjectOfType3("RegExp");
is3.set = isObjectOfType3("Set");
is3.string = isOfType5("string");
is3.symbol = isOfType5("symbol");
is3.undefined = isOfType5("undefined");
is3.weakMap = isObjectOfType3("WeakMap");
is3.weakSet = isObjectOfType3("WeakSet");
var esm_default2 = is3;

// ../../node_modules/tree-changes/esm/helpers.js
function canHaveLength2() {
  var arguments_ = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    arguments_[_i] = arguments[_i];
  }
  return arguments_.every(function(d2) {
    return esm_default2.string(d2) || esm_default2.array(d2) || esm_default2.plainObject(d2);
  });
}
__name(canHaveLength2, "canHaveLength");
function checkEquality2(left, right, value) {
  if (!isSameType2(left, right)) {
    return false;
  }
  if ([left, right].every(esm_default2.array)) {
    return !left.some(hasValue2(value)) && right.some(hasValue2(value));
  }
  if ([left, right].every(esm_default2.plainObject)) {
    return !Object.entries(left).some(hasEntry2(value)) && Object.entries(right).some(hasEntry2(value));
  }
  return right === value;
}
__name(checkEquality2, "checkEquality");
function compareNumbers2(previousData, data, options) {
  var actual = options.actual, key = options.key, previous = options.previous, type = options.type;
  var left = nested2(previousData, key);
  var right = nested2(data, key);
  var changed = [left, right].every(esm_default2.number) && (type === "increased" ? left < right : left > right);
  if (!esm_default2.undefined(actual)) {
    changed = changed && right === actual;
  }
  if (!esm_default2.undefined(previous)) {
    changed = changed && left === previous;
  }
  return changed;
}
__name(compareNumbers2, "compareNumbers");
function compareValues2(previousData, data, options) {
  var key = options.key, type = options.type, value = options.value;
  var left = nested2(previousData, key);
  var right = nested2(data, key);
  var primary = type === "added" ? left : right;
  var secondary = type === "added" ? right : left;
  if (!esm_default2.nullOrUndefined(value)) {
    if (esm_default2.defined(primary)) {
      if (esm_default2.array(primary) || esm_default2.plainObject(primary)) {
        return checkEquality2(primary, secondary, value);
      }
    } else {
      return equal2(secondary, value);
    }
    return false;
  }
  if ([left, right].every(esm_default2.array)) {
    return !secondary.every(isEqualPredicate2(primary));
  }
  if ([left, right].every(esm_default2.plainObject)) {
    return hasExtraKeys2(Object.keys(primary), Object.keys(secondary));
  }
  return ![left, right].every(function(d2) {
    return esm_default2.primitive(d2) && esm_default2.defined(d2);
  }) && (type === "added" ? !esm_default2.defined(left) && esm_default2.defined(right) : esm_default2.defined(left) && !esm_default2.defined(right));
}
__name(compareValues2, "compareValues");
function getIterables2(previousData, data, _a9) {
  var _b = _a9 === void 0 ? {} : _a9, key = _b.key;
  var left = nested2(previousData, key);
  var right = nested2(data, key);
  if (!isSameType2(left, right)) {
    throw new TypeError("Inputs have different types");
  }
  if (!canHaveLength2(left, right)) {
    throw new TypeError("Inputs don't have length");
  }
  if ([left, right].every(esm_default2.plainObject)) {
    left = Object.keys(left);
    right = Object.keys(right);
  }
  return [left, right];
}
__name(getIterables2, "getIterables");
function hasEntry2(input) {
  return function(_a9) {
    var key = _a9[0], value = _a9[1];
    if (esm_default2.array(input)) {
      return equal2(input, value) || input.some(function(d2) {
        return equal2(d2, value) || esm_default2.array(value) && isEqualPredicate2(value)(d2);
      });
    }
    if (esm_default2.plainObject(input) && input[key]) {
      return !!input[key] && equal2(input[key], value);
    }
    return equal2(input, value);
  };
}
__name(hasEntry2, "hasEntry");
function hasExtraKeys2(left, right) {
  return right.some(function(d2) {
    return !left.includes(d2);
  });
}
__name(hasExtraKeys2, "hasExtraKeys");
function hasValue2(input) {
  return function(value) {
    if (esm_default2.array(input)) {
      return input.some(function(d2) {
        return equal2(d2, value) || esm_default2.array(value) && isEqualPredicate2(value)(d2);
      });
    }
    return equal2(input, value);
  };
}
__name(hasValue2, "hasValue");
function includesOrEqualsTo2(previousValue, value) {
  return esm_default2.array(previousValue) ? previousValue.some(function(d2) {
    return equal2(d2, value);
  }) : equal2(previousValue, value);
}
__name(includesOrEqualsTo2, "includesOrEqualsTo");
function isEqualPredicate2(data) {
  return function(value) {
    return data.some(function(d2) {
      return equal2(d2, value);
    });
  };
}
__name(isEqualPredicate2, "isEqualPredicate");
function isSameType2() {
  var arguments_ = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    arguments_[_i] = arguments[_i];
  }
  return arguments_.every(esm_default2.array) || arguments_.every(esm_default2.number) || arguments_.every(esm_default2.plainObject) || arguments_.every(esm_default2.string);
}
__name(isSameType2, "isSameType");
function nested2(data, property) {
  if (esm_default2.plainObject(data) || esm_default2.array(data)) {
    if (esm_default2.string(property)) {
      var props = property.split(".");
      return props.reduce(function(acc, d2) {
        return acc && acc[d2];
      }, data);
    }
    if (esm_default2.number(property)) {
      return data[property];
    }
    return data;
  }
  return data;
}
__name(nested2, "nested");

// ../../node_modules/tree-changes/esm/index.js
function treeChanges2(previousData, data) {
  if ([previousData, data].some(esm_default2.nullOrUndefined)) {
    throw new Error("Missing required parameters");
  }
  if (![previousData, data].every(function(d2) {
    return esm_default2.plainObject(d2) || esm_default2.array(d2);
  })) {
    throw new Error("Expected plain objects or array");
  }
  var added = /* @__PURE__ */ __name(function(key, value) {
    try {
      return compareValues2(previousData, data, { key, type: "added", value });
    } catch (_a9) {
      return false;
    }
  }, "added");
  var changed = /* @__PURE__ */ __name(function(key, actual, previous) {
    try {
      var left = nested2(previousData, key);
      var right = nested2(data, key);
      var hasActual = esm_default2.defined(actual);
      var hasPrevious = esm_default2.defined(previous);
      if (hasActual || hasPrevious) {
        var leftComparator = hasPrevious ? includesOrEqualsTo2(previous, left) : !includesOrEqualsTo2(actual, left);
        var rightComparator = includesOrEqualsTo2(actual, right);
        return leftComparator && rightComparator;
      }
      if ([left, right].every(esm_default2.array) || [left, right].every(esm_default2.plainObject)) {
        return !equal2(left, right);
      }
      return left !== right;
    } catch (_a9) {
      return false;
    }
  }, "changed");
  var changedFrom = /* @__PURE__ */ __name(function(key, previous, actual) {
    if (!esm_default2.defined(key)) {
      return false;
    }
    try {
      var left = nested2(previousData, key);
      var right = nested2(data, key);
      var hasActual = esm_default2.defined(actual);
      return includesOrEqualsTo2(previous, left) && (hasActual ? includesOrEqualsTo2(actual, right) : !hasActual);
    } catch (_a9) {
      return false;
    }
  }, "changedFrom");
  var changedTo = /* @__PURE__ */ __name(function(key, actual) {
    if (!esm_default2.defined(key)) {
      return false;
    }
    if (process.env.NODE_ENV === "development") {
      console.warn("`changedTo` is deprecated! Replace it with `change`");
    }
    return changed(key, actual);
  }, "changedTo");
  var decreased = /* @__PURE__ */ __name(function(key, actual, previous) {
    if (!esm_default2.defined(key)) {
      return false;
    }
    try {
      return compareNumbers2(previousData, data, { key, actual, previous, type: "decreased" });
    } catch (_a9) {
      return false;
    }
  }, "decreased");
  var emptied = /* @__PURE__ */ __name(function(key) {
    try {
      var _a9 = getIterables2(previousData, data, { key }), left = _a9[0], right = _a9[1];
      return !!left.length && !right.length;
    } catch (_b) {
      return false;
    }
  }, "emptied");
  var filled = /* @__PURE__ */ __name(function(key) {
    try {
      var _a9 = getIterables2(previousData, data, { key }), left = _a9[0], right = _a9[1];
      return !left.length && !!right.length;
    } catch (_b) {
      return false;
    }
  }, "filled");
  var increased = /* @__PURE__ */ __name(function(key, actual, previous) {
    if (!esm_default2.defined(key)) {
      return false;
    }
    try {
      return compareNumbers2(previousData, data, { key, actual, previous, type: "increased" });
    } catch (_a9) {
      return false;
    }
  }, "increased");
  var removed = /* @__PURE__ */ __name(function(key, value) {
    try {
      return compareValues2(previousData, data, { key, type: "removed", value });
    } catch (_a9) {
      return false;
    }
  }, "removed");
  return { added, changed, changedFrom, changedTo, decreased, emptied, filled, increased, removed };
}
__name(treeChanges2, "treeChanges");

// ../../node_modules/react-floater/es/index.js
import ReactDOM from "react-dom";
function ownKeys(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
__name(ownKeys, "ownKeys");
function _objectSpread2(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
__name(_objectSpread2, "_objectSpread2");
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
__name(_classCallCheck, "_classCallCheck");
function _defineProperties(target, props) {
  for (var i2 = 0; i2 < props.length; i2++) {
    var descriptor = props[i2];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
__name(_defineProperties, "_defineProperties");
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
__name(_createClass, "_createClass");
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
__name(_defineProperty, "_defineProperty");
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
__name(_inherits, "_inherits");
function _getPrototypeOf(o2) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : /* @__PURE__ */ __name(function _getPrototypeOf2(o3) {
    return o3.__proto__ || Object.getPrototypeOf(o3);
  }, "_getPrototypeOf");
  return _getPrototypeOf(o2);
}
__name(_getPrototypeOf, "_getPrototypeOf");
function _setPrototypeOf(o2, p2) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o3, p3) {
    o3.__proto__ = p3;
    return o3;
  }, "_setPrototypeOf");
  return _setPrototypeOf(o2, p2);
}
__name(_setPrototypeOf, "_setPrototypeOf");
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e2) {
    return false;
  }
}
__name(_isNativeReflectConstruct, "_isNativeReflectConstruct");
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i2;
  for (i2 = 0; i2 < sourceKeys.length; i2++) {
    key = sourceKeys[i2];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
__name(_objectWithoutPropertiesLoose, "_objectWithoutPropertiesLoose");
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i2;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i2 = 0; i2 < sourceSymbolKeys.length; i2++) {
      key = sourceSymbolKeys[i2];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
__name(_objectWithoutProperties, "_objectWithoutProperties");
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
__name(_assertThisInitialized, "_assertThisInitialized");
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
__name(_possibleConstructorReturn, "_possibleConstructorReturn");
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return /* @__PURE__ */ __name(function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  }, "_createSuperInternal");
}
__name(_createSuper, "_createSuper");
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
__name(_toPrimitive, "_toPrimitive");
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
__name(_toPropertyKey, "_toPropertyKey");
var DEFAULTS = { flip: { padding: 20 }, preventOverflow: { padding: 10 } };
var VALIDATOR_ARG_ERROR_MESSAGE = "The typeValidator argument must be a function with the signature function(props, propName, componentName).";
var MESSAGE_ARG_ERROR_MESSAGE = "The error message is optional, but must be a string if provided.";
function propIsRequired(condition, props, propName, componentName) {
  if (typeof condition === "boolean") {
    return condition;
  }
  if (typeof condition === "function") {
    return condition(props, propName, componentName);
  }
  if (Boolean(condition) === true) {
    return Boolean(condition);
  }
  return false;
}
__name(propIsRequired, "propIsRequired");
function propExists(props, propName) {
  return Object.hasOwnProperty.call(props, propName);
}
__name(propExists, "propExists");
function missingPropError(props, propName, componentName, message) {
  if (message) {
    return new Error(message);
  }
  return new Error("Required ".concat(props[propName], " `").concat(propName, "` was not specified in `").concat(componentName, "`."));
}
__name(missingPropError, "missingPropError");
function guardAgainstInvalidArgTypes(typeValidator, message) {
  if (typeof typeValidator !== "function") {
    throw new TypeError(VALIDATOR_ARG_ERROR_MESSAGE);
  }
  if (Boolean(message) && typeof message !== "string") {
    throw new TypeError(MESSAGE_ARG_ERROR_MESSAGE);
  }
}
__name(guardAgainstInvalidArgTypes, "guardAgainstInvalidArgTypes");
function isRequiredIf(typeValidator, condition, message) {
  guardAgainstInvalidArgTypes(typeValidator, message);
  return function(props, propName, componentName) {
    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }
    if (propIsRequired(condition, props, propName, componentName)) {
      if (propExists(props, propName)) {
        return typeValidator.apply(void 0, [props, propName, componentName].concat(rest));
      }
      return missingPropError(props, propName, componentName, message);
    }
    return typeValidator.apply(void 0, [props, propName, componentName].concat(rest));
  };
}
__name(isRequiredIf, "isRequiredIf");
var STATUS = { INIT: "init", IDLE: "idle", OPENING: "opening", OPEN: "open", CLOSING: "closing", ERROR: "error" };
var isReact16 = ReactDOM.createPortal !== void 0;
function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
__name(canUseDOM, "canUseDOM");
function isMobile() {
  return "ontouchstart" in window && /Mobi/.test(navigator.userAgent);
}
__name(isMobile, "isMobile");
function log(_ref) {
  var title = _ref.title, data = _ref.data, _ref$warn = _ref.warn, warn = _ref$warn === void 0 ? false : _ref$warn, _ref$debug = _ref.debug, debug = _ref$debug === void 0 ? false : _ref$debug;
  var logFn = warn ? console.warn || console.error : console.log;
  if (debug && title && data) {
    console.groupCollapsed("%creact-floater: ".concat(title), "color: #9b00ff; font-weight: bold; font-size: 12px;");
    if (Array.isArray(data)) {
      data.forEach(function(d2) {
        if (esm_default.plainObject(d2) && d2.key) {
          logFn.apply(console, [d2.key, d2.value]);
        } else {
          logFn.apply(console, [d2]);
        }
      });
    } else {
      logFn.apply(console, [data]);
    }
    console.groupEnd();
  }
}
__name(log, "log");
function on(element, event, cb) {
  var capture = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  element.addEventListener(event, cb, capture);
}
__name(on, "on");
function off(element, event, cb) {
  var capture = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  element.removeEventListener(event, cb, capture);
}
__name(off, "off");
function once(element, event, cb) {
  var capture = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  var _nextCB;
  _nextCB = /* @__PURE__ */ __name(function nextCB(e2) {
    cb(e2);
    off(element, event, _nextCB);
  }, "nextCB");
  on(element, event, _nextCB, capture);
}
__name(once, "once");
function noop() {
}
__name(noop, "noop");
var ReactFloaterPortal = function(_React$Component) {
  _inherits(ReactFloaterPortal2, _React$Component);
  var _super = _createSuper(ReactFloaterPortal2);
  function ReactFloaterPortal2() {
    _classCallCheck(this, ReactFloaterPortal2);
    return _super.apply(this, arguments);
  }
  __name(ReactFloaterPortal2, "ReactFloaterPortal");
  _createClass(ReactFloaterPortal2, [{ key: "componentDidMount", value: /* @__PURE__ */ __name(function componentDidMount() {
    if (!canUseDOM()) return;
    if (!this.node) {
      this.appendNode();
    }
    if (!isReact16) {
      this.renderPortal();
    }
  }, "componentDidMount") }, { key: "componentDidUpdate", value: /* @__PURE__ */ __name(function componentDidUpdate() {
    if (!canUseDOM()) return;
    if (!isReact16) {
      this.renderPortal();
    }
  }, "componentDidUpdate") }, { key: "componentWillUnmount", value: /* @__PURE__ */ __name(function componentWillUnmount() {
    if (!canUseDOM() || !this.node) return;
    if (!isReact16) {
      ReactDOM.unmountComponentAtNode(this.node);
    }
    if (this.node && this.node.parentNode === document.body) {
      document.body.removeChild(this.node);
      this.node = void 0;
    }
  }, "componentWillUnmount") }, { key: "appendNode", value: /* @__PURE__ */ __name(function appendNode() {
    var _this$props = this.props, id = _this$props.id, zIndex = _this$props.zIndex;
    if (!this.node) {
      this.node = document.createElement("div");
      if (id) {
        this.node.id = id;
      }
      if (zIndex) {
        this.node.style.zIndex = zIndex;
      }
      document.body.appendChild(this.node);
    }
  }, "appendNode") }, { key: "renderPortal", value: /* @__PURE__ */ __name(function renderPortal() {
    if (!canUseDOM()) return null;
    var _this$props2 = this.props, children = _this$props2.children, setRef = _this$props2.setRef;
    if (!this.node) {
      this.appendNode();
    }
    if (isReact16) {
      return ReactDOM.createPortal(children, this.node);
    }
    var portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, children.length > 1 ? React2.createElement("div", null, children) : children[0], this.node);
    setRef(portal);
    return null;
  }, "renderPortal") }, { key: "renderReact16", value: /* @__PURE__ */ __name(function renderReact16() {
    var _this$props3 = this.props, hasChildren = _this$props3.hasChildren, placement = _this$props3.placement, target = _this$props3.target;
    if (!hasChildren) {
      if (target || placement === "center") {
        return this.renderPortal();
      }
      return null;
    }
    return this.renderPortal();
  }, "renderReact16") }, { key: "render", value: /* @__PURE__ */ __name(function render() {
    if (!isReact16) {
      return null;
    }
    return this.renderReact16();
  }, "render") }]);
  return ReactFloaterPortal2;
}(React2.Component);
_defineProperty(ReactFloaterPortal, "propTypes", { children: import_prop_types.default.oneOfType([import_prop_types.default.element, import_prop_types.default.array]), hasChildren: import_prop_types.default.bool, id: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.number]), placement: import_prop_types.default.string, setRef: import_prop_types.default.func.isRequired, target: import_prop_types.default.oneOfType([import_prop_types.default.object, import_prop_types.default.string]), zIndex: import_prop_types.default.number });
var FloaterArrow = function(_React$Component) {
  _inherits(FloaterArrow2, _React$Component);
  var _super = _createSuper(FloaterArrow2);
  function FloaterArrow2() {
    _classCallCheck(this, FloaterArrow2);
    return _super.apply(this, arguments);
  }
  __name(FloaterArrow2, "FloaterArrow");
  _createClass(FloaterArrow2, [{ key: "parentStyle", get: /* @__PURE__ */ __name(function get() {
    var _this$props = this.props, placement = _this$props.placement, styles = _this$props.styles;
    var length = styles.arrow.length;
    var arrow2 = { pointerEvents: "none", position: "absolute", width: "100%" };
    if (placement.startsWith("top")) {
      arrow2.bottom = 0;
      arrow2.left = 0;
      arrow2.right = 0;
      arrow2.height = length;
    } else if (placement.startsWith("bottom")) {
      arrow2.left = 0;
      arrow2.right = 0;
      arrow2.top = 0;
      arrow2.height = length;
    } else if (placement.startsWith("left")) {
      arrow2.right = 0;
      arrow2.top = 0;
      arrow2.bottom = 0;
    } else if (placement.startsWith("right")) {
      arrow2.left = 0;
      arrow2.top = 0;
    }
    return arrow2;
  }, "get") }, { key: "render", value: /* @__PURE__ */ __name(function render() {
    var _this$props2 = this.props, placement = _this$props2.placement, setArrowRef = _this$props2.setArrowRef, styles = _this$props2.styles;
    var _styles$arrow = styles.arrow, color2 = _styles$arrow.color, display = _styles$arrow.display, length = _styles$arrow.length, margin = _styles$arrow.margin, position = _styles$arrow.position, spread = _styles$arrow.spread;
    var arrowStyles = { display, position };
    var points;
    var x2 = spread;
    var y2 = length;
    if (placement.startsWith("top")) {
      points = "0,0 ".concat(x2 / 2, ",").concat(y2, " ").concat(x2, ",0");
      arrowStyles.bottom = 0;
      arrowStyles.marginLeft = margin;
      arrowStyles.marginRight = margin;
    } else if (placement.startsWith("bottom")) {
      points = "".concat(x2, ",").concat(y2, " ").concat(x2 / 2, ",0 0,").concat(y2);
      arrowStyles.top = 0;
      arrowStyles.marginLeft = margin;
      arrowStyles.marginRight = margin;
    } else if (placement.startsWith("left")) {
      y2 = spread;
      x2 = length;
      points = "0,0 ".concat(x2, ",").concat(y2 / 2, " 0,").concat(y2);
      arrowStyles.right = 0;
      arrowStyles.marginTop = margin;
      arrowStyles.marginBottom = margin;
    } else if (placement.startsWith("right")) {
      y2 = spread;
      x2 = length;
      points = "".concat(x2, ",").concat(y2, " ").concat(x2, ",0 0,").concat(y2 / 2);
      arrowStyles.left = 0;
      arrowStyles.marginTop = margin;
      arrowStyles.marginBottom = margin;
    }
    return React2.createElement("div", { className: "__floater__arrow", style: this.parentStyle }, React2.createElement("span", { ref: setArrowRef, style: arrowStyles }, React2.createElement("svg", { width: x2, height: y2, version: "1.1", xmlns: "http://www.w3.org/2000/svg" }, React2.createElement("polygon", { points, fill: color2 }))));
  }, "render") }]);
  return FloaterArrow2;
}(React2.Component);
_defineProperty(FloaterArrow, "propTypes", { placement: import_prop_types.default.string.isRequired, setArrowRef: import_prop_types.default.func.isRequired, styles: import_prop_types.default.object.isRequired });
var _excluded$1 = ["color", "height", "width"];
function FloaterCloseBtn(_ref) {
  var handleClick = _ref.handleClick, styles = _ref.styles;
  var color2 = styles.color, height = styles.height, width = styles.width, style = _objectWithoutProperties(styles, _excluded$1);
  return React2.createElement("button", { "aria-label": "close", onClick: handleClick, style, type: "button" }, React2.createElement("svg", { width: "".concat(width, "px"), height: "".concat(height, "px"), viewBox: "0 0 18 18", version: "1.1", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid" }, React2.createElement("g", null, React2.createElement("path", { d: "M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z", fill: color2 }))));
}
__name(FloaterCloseBtn, "FloaterCloseBtn");
FloaterCloseBtn.propTypes = { handleClick: import_prop_types.default.func.isRequired, styles: import_prop_types.default.object.isRequired };
function FloaterContainer(_ref) {
  var content = _ref.content, footer = _ref.footer, handleClick = _ref.handleClick, open = _ref.open, positionWrapper = _ref.positionWrapper, showCloseButton = _ref.showCloseButton, title = _ref.title, styles = _ref.styles;
  var output = { content: React2.isValidElement(content) ? content : React2.createElement("div", { className: "__floater__content", style: styles.content }, content) };
  if (title) {
    output.title = React2.isValidElement(title) ? title : React2.createElement("div", { className: "__floater__title", style: styles.title }, title);
  }
  if (footer) {
    output.footer = React2.isValidElement(footer) ? footer : React2.createElement("div", { className: "__floater__footer", style: styles.footer }, footer);
  }
  if ((showCloseButton || positionWrapper) && !esm_default["boolean"](open)) {
    output.close = React2.createElement(FloaterCloseBtn, { styles: styles.close, handleClick });
  }
  return React2.createElement("div", { className: "__floater__container", style: styles.container }, output.close, output.title, output.content, output.footer);
}
__name(FloaterContainer, "FloaterContainer");
FloaterContainer.propTypes = { content: import_prop_types.default.node.isRequired, footer: import_prop_types.default.node, handleClick: import_prop_types.default.func.isRequired, open: import_prop_types.default.bool, positionWrapper: import_prop_types.default.bool.isRequired, showCloseButton: import_prop_types.default.bool.isRequired, styles: import_prop_types.default.object.isRequired, title: import_prop_types.default.node };
var Floater = function(_React$Component) {
  _inherits(Floater2, _React$Component);
  var _super = _createSuper(Floater2);
  function Floater2() {
    _classCallCheck(this, Floater2);
    return _super.apply(this, arguments);
  }
  __name(Floater2, "Floater");
  _createClass(Floater2, [{ key: "style", get: /* @__PURE__ */ __name(function get() {
    var _this$props = this.props, disableAnimation = _this$props.disableAnimation, component = _this$props.component, placement = _this$props.placement, hideArrow = _this$props.hideArrow, status = _this$props.status, styles = _this$props.styles;
    var length = styles.arrow.length, floater = styles.floater, floaterCentered = styles.floaterCentered, floaterClosing = styles.floaterClosing, floaterOpening = styles.floaterOpening, floaterWithAnimation = styles.floaterWithAnimation, floaterWithComponent = styles.floaterWithComponent;
    var element = {};
    if (!hideArrow) {
      if (placement.startsWith("top")) {
        element.padding = "0 0 ".concat(length, "px");
      } else if (placement.startsWith("bottom")) {
        element.padding = "".concat(length, "px 0 0");
      } else if (placement.startsWith("left")) {
        element.padding = "0 ".concat(length, "px 0 0");
      } else if (placement.startsWith("right")) {
        element.padding = "0 0 0 ".concat(length, "px");
      }
    }
    if ([STATUS.OPENING, STATUS.OPEN].indexOf(status) !== -1) {
      element = _objectSpread2(_objectSpread2({}, element), floaterOpening);
    }
    if (status === STATUS.CLOSING) {
      element = _objectSpread2(_objectSpread2({}, element), floaterClosing);
    }
    if (status === STATUS.OPEN && !disableAnimation) {
      element = _objectSpread2(_objectSpread2({}, element), floaterWithAnimation);
    }
    if (placement === "center") {
      element = _objectSpread2(_objectSpread2({}, element), floaterCentered);
    }
    if (component) {
      element = _objectSpread2(_objectSpread2({}, element), floaterWithComponent);
    }
    return _objectSpread2(_objectSpread2({}, floater), element);
  }, "get") }, { key: "render", value: /* @__PURE__ */ __name(function render() {
    var _this$props2 = this.props, component = _this$props2.component, closeFn = _this$props2.handleClick, hideArrow = _this$props2.hideArrow, setFloaterRef = _this$props2.setFloaterRef, status = _this$props2.status;
    var output = {};
    var classes = ["__floater"];
    if (component) {
      if (React2.isValidElement(component)) {
        output.content = React2.cloneElement(component, { closeFn });
      } else {
        output.content = component({ closeFn });
      }
    } else {
      output.content = React2.createElement(FloaterContainer, this.props);
    }
    if (status === STATUS.OPEN) {
      classes.push("__floater__open");
    }
    if (!hideArrow) {
      output.arrow = React2.createElement(FloaterArrow, this.props);
    }
    return React2.createElement("div", { ref: setFloaterRef, className: classes.join(" "), style: this.style }, React2.createElement("div", { className: "__floater__body" }, output.content, output.arrow));
  }, "render") }]);
  return Floater2;
}(React2.Component);
_defineProperty(Floater, "propTypes", { component: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.element]), content: import_prop_types.default.node, disableAnimation: import_prop_types.default.bool.isRequired, footer: import_prop_types.default.node, handleClick: import_prop_types.default.func.isRequired, hideArrow: import_prop_types.default.bool.isRequired, open: import_prop_types.default.bool, placement: import_prop_types.default.string.isRequired, positionWrapper: import_prop_types.default.bool.isRequired, setArrowRef: import_prop_types.default.func.isRequired, setFloaterRef: import_prop_types.default.func.isRequired, showCloseButton: import_prop_types.default.bool, status: import_prop_types.default.string.isRequired, styles: import_prop_types.default.object.isRequired, title: import_prop_types.default.node });
var ReactFloaterWrapper = function(_React$Component) {
  _inherits(ReactFloaterWrapper2, _React$Component);
  var _super = _createSuper(ReactFloaterWrapper2);
  function ReactFloaterWrapper2() {
    _classCallCheck(this, ReactFloaterWrapper2);
    return _super.apply(this, arguments);
  }
  __name(ReactFloaterWrapper2, "ReactFloaterWrapper");
  _createClass(ReactFloaterWrapper2, [{ key: "render", value: /* @__PURE__ */ __name(function render() {
    var _this$props = this.props, children = _this$props.children, handleClick = _this$props.handleClick, handleMouseEnter = _this$props.handleMouseEnter, handleMouseLeave = _this$props.handleMouseLeave, setChildRef = _this$props.setChildRef, setWrapperRef = _this$props.setWrapperRef, style = _this$props.style, styles = _this$props.styles;
    var element;
    if (children) {
      if (React2.Children.count(children) === 1) {
        if (!React2.isValidElement(children)) {
          element = React2.createElement("span", null, children);
        } else {
          var refProp = esm_default["function"](children.type) ? "innerRef" : "ref";
          element = React2.cloneElement(React2.Children.only(children), _defineProperty({}, refProp, setChildRef));
        }
      } else {
        element = children;
      }
    }
    if (!element) {
      return null;
    }
    return React2.createElement("span", { ref: setWrapperRef, style: _objectSpread2(_objectSpread2({}, styles), style), onClick: handleClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, element);
  }, "render") }]);
  return ReactFloaterWrapper2;
}(React2.Component);
_defineProperty(ReactFloaterWrapper, "propTypes", { children: import_prop_types.default.node, handleClick: import_prop_types.default.func.isRequired, handleMouseEnter: import_prop_types.default.func.isRequired, handleMouseLeave: import_prop_types.default.func.isRequired, setChildRef: import_prop_types.default.func.isRequired, setWrapperRef: import_prop_types.default.func.isRequired, style: import_prop_types.default.object, styles: import_prop_types.default.object.isRequired });
var defaultOptions = { zIndex: 100 };
function getStyles(styles) {
  var options = (0, import_deepmerge.default)(defaultOptions, styles.options || {});
  return { wrapper: { cursor: "help", display: "inline-flex", flexDirection: "column", zIndex: options.zIndex }, wrapperPosition: { left: -1e3, position: "absolute", top: -1e3, visibility: "hidden" }, floater: { display: "inline-block", filter: "drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))", maxWidth: 300, opacity: 0, position: "relative", transition: "opacity 0.3s", visibility: "hidden", zIndex: options.zIndex }, floaterOpening: { opacity: 1, visibility: "visible" }, floaterWithAnimation: { opacity: 1, transition: "opacity 0.3s, transform 0.2s", visibility: "visible" }, floaterWithComponent: { maxWidth: "100%" }, floaterClosing: { opacity: 0, visibility: "visible" }, floaterCentered: { left: "50%", position: "fixed", top: "50%", transform: "translate(-50%, -50%)" }, container: { backgroundColor: "#fff", color: "#666", minHeight: 60, minWidth: 200, padding: 20, position: "relative", zIndex: 10 }, title: { borderBottom: "1px solid #555", color: "#555", fontSize: 18, marginBottom: 5, paddingBottom: 6, paddingRight: 18 }, content: { fontSize: 15 }, close: { backgroundColor: "transparent", border: 0, borderRadius: 0, color: "#555", fontSize: 0, height: 15, outline: "none", padding: 10, position: "absolute", right: 0, top: 0, width: 15, WebkitAppearance: "none" }, footer: { borderTop: "1px solid #ccc", fontSize: 13, marginTop: 10, paddingTop: 5 }, arrow: { color: "#fff", display: "inline-flex", length: 16, margin: 8, position: "absolute", spread: 32 }, options };
}
__name(getStyles, "getStyles");
var _excluded = ["arrow", "flip", "offset"];
var POSITIONING_PROPS = ["position", "top", "right", "bottom", "left"];
var ReactFloater = function(_React$Component) {
  _inherits(ReactFloater2, _React$Component);
  var _super = _createSuper(ReactFloater2);
  function ReactFloater2(props) {
    var _this;
    _classCallCheck(this, ReactFloater2);
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "setArrowRef", function(ref) {
      _this.arrowRef = ref;
    });
    _defineProperty(_assertThisInitialized(_this), "setChildRef", function(ref) {
      _this.childRef = ref;
    });
    _defineProperty(_assertThisInitialized(_this), "setFloaterRef", function(ref) {
      _this.floaterRef = ref;
    });
    _defineProperty(_assertThisInitialized(_this), "setWrapperRef", function(ref) {
      _this.wrapperRef = ref;
    });
    _defineProperty(_assertThisInitialized(_this), "handleTransitionEnd", function() {
      var status = _this.state.status;
      var callback = _this.props.callback;
      if (_this.wrapperPopper) {
        _this.wrapperPopper.instance.update();
      }
      _this.setState({ status: status === STATUS.OPENING ? STATUS.OPEN : STATUS.IDLE }, function() {
        var newStatus = _this.state.status;
        callback(newStatus === STATUS.OPEN ? "open" : "close", _this.props);
      });
    });
    _defineProperty(_assertThisInitialized(_this), "handleClick", function() {
      var _this$props = _this.props, event = _this$props.event, open = _this$props.open;
      if (esm_default["boolean"](open)) return;
      var _this$state = _this.state, positionWrapper = _this$state.positionWrapper, status = _this$state.status;
      if (_this.event === "click" || _this.event === "hover" && positionWrapper) {
        log({ title: "click", data: [{ event, status: status === STATUS.OPEN ? "closing" : "opening" }], debug: _this.debug });
        _this.toggle();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseEnter", function() {
      var _this$props2 = _this.props, event = _this$props2.event, open = _this$props2.open;
      if (esm_default["boolean"](open) || isMobile()) return;
      var status = _this.state.status;
      if (_this.event === "hover" && status === STATUS.IDLE) {
        log({ title: "mouseEnter", data: [{ key: "originalEvent", value: event }], debug: _this.debug });
        clearTimeout(_this.eventDelayTimeout);
        _this.toggle();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseLeave", function() {
      var _this$props3 = _this.props, event = _this$props3.event, eventDelay = _this$props3.eventDelay, open = _this$props3.open;
      if (esm_default["boolean"](open) || isMobile()) return;
      var _this$state2 = _this.state, status = _this$state2.status, positionWrapper = _this$state2.positionWrapper;
      if (_this.event === "hover") {
        log({ title: "mouseLeave", data: [{ key: "originalEvent", value: event }], debug: _this.debug });
        if (!eventDelay) {
          _this.toggle(STATUS.IDLE);
        } else if ([STATUS.OPENING, STATUS.OPEN].indexOf(status) !== -1 && !positionWrapper && !_this.eventDelayTimeout) {
          _this.eventDelayTimeout = setTimeout(function() {
            delete _this.eventDelayTimeout;
            _this.toggle();
          }, eventDelay * 1e3);
        }
      }
    });
    _this.state = { currentPlacement: props.placement, needsUpdate: false, positionWrapper: props.wrapperOptions.position && !!props.target, status: STATUS.INIT, statusWrapper: STATUS.INIT };
    _this._isMounted = false;
    _this.hasMounted = false;
    if (canUseDOM()) {
      window.addEventListener("load", function() {
        if (_this.popper) {
          _this.popper.instance.update();
        }
        if (_this.wrapperPopper) {
          _this.wrapperPopper.instance.update();
        }
      });
    }
    return _this;
  }
  __name(ReactFloater2, "ReactFloater");
  _createClass(ReactFloater2, [{ key: "componentDidMount", value: /* @__PURE__ */ __name(function componentDidMount() {
    if (!canUseDOM()) return;
    var positionWrapper = this.state.positionWrapper;
    var _this$props5 = this.props, children = _this$props5.children, open = _this$props5.open, target = _this$props5.target;
    this._isMounted = true;
    log({ title: "init", data: { hasChildren: !!children, hasTarget: !!target, isControlled: esm_default["boolean"](open), positionWrapper, target: this.target, floater: this.floaterRef }, debug: this.debug });
    if (!this.hasMounted) {
      this.initPopper();
      this.hasMounted = true;
    }
    if (!children && target && !esm_default["boolean"](open)) ;
  }, "componentDidMount") }, { key: "componentDidUpdate", value: /* @__PURE__ */ __name(function componentDidUpdate(prevProps, prevState) {
    if (!canUseDOM()) return;
    var _this$props6 = this.props, autoOpen = _this$props6.autoOpen, open = _this$props6.open, target = _this$props6.target, wrapperOptions = _this$props6.wrapperOptions;
    var _treeChanges = treeChanges2(prevState, this.state), changedFrom = _treeChanges.changedFrom, changed = _treeChanges.changed;
    if (prevProps.open !== open) {
      var forceStatus;
      if (esm_default["boolean"](open)) {
        forceStatus = open ? STATUS.OPENING : STATUS.CLOSING;
      }
      this.toggle(forceStatus);
    }
    if (prevProps.wrapperOptions.position !== wrapperOptions.position || prevProps.target !== target) {
      this.changeWrapperPosition(this.props);
    }
    if (changed("status", STATUS.IDLE) && open) {
      this.toggle(STATUS.OPEN);
    } else if (changedFrom("status", STATUS.INIT, STATUS.IDLE) && autoOpen) {
      this.toggle(STATUS.OPEN);
    }
    if (this.popper && changed("status", STATUS.OPENING)) {
      this.popper.instance.update();
    }
    if (this.floaterRef && (changed("status", STATUS.OPENING) || changed("status", STATUS.CLOSING))) {
      once(this.floaterRef, "transitionend", this.handleTransitionEnd);
    }
    if (changed("needsUpdate", true)) {
      this.rebuildPopper();
    }
  }, "componentDidUpdate") }, { key: "componentWillUnmount", value: /* @__PURE__ */ __name(function componentWillUnmount() {
    if (!canUseDOM()) return;
    this._isMounted = false;
    if (this.popper) {
      this.popper.instance.destroy();
    }
    if (this.wrapperPopper) {
      this.wrapperPopper.instance.destroy();
    }
  }, "componentWillUnmount") }, { key: "initPopper", value: /* @__PURE__ */ __name(function initPopper() {
    var _this2 = this;
    var target = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.target;
    var positionWrapper = this.state.positionWrapper;
    var _this$props7 = this.props, disableFlip = _this$props7.disableFlip, getPopper = _this$props7.getPopper, hideArrow = _this$props7.hideArrow, offset2 = _this$props7.offset, placement = _this$props7.placement, wrapperOptions = _this$props7.wrapperOptions;
    var flipBehavior = placement === "top" || placement === "bottom" ? "flip" : ["right", "bottom-end", "top-end", "left", "top-start", "bottom-start"];
    if (placement === "center") {
      this.setState({ status: STATUS.IDLE });
    } else if (target && this.floaterRef) {
      var _this$options = this.options, arrow2 = _this$options.arrow, flip2 = _this$options.flip, offsetOptions = _this$options.offset, rest = _objectWithoutProperties(_this$options, _excluded);
      new popper_default(target, this.floaterRef, { placement, modifiers: _objectSpread2({ arrow: _objectSpread2({ enabled: !hideArrow, element: this.arrowRef }, arrow2), flip: _objectSpread2({ enabled: !disableFlip, behavior: flipBehavior }, flip2), offset: _objectSpread2({ offset: "0, ".concat(offset2, "px") }, offsetOptions) }, rest), onCreate: /* @__PURE__ */ __name(function onCreate2(data) {
        var _this2$floaterRef;
        _this2.popper = data;
        if (!((_this2$floaterRef = _this2.floaterRef) !== null && _this2$floaterRef !== void 0 && _this2$floaterRef.isConnected)) {
          _this2.setState({ needsUpdate: true });
          return;
        }
        getPopper(data, "floater");
        if (_this2._isMounted) {
          _this2.setState({ currentPlacement: data.placement, status: STATUS.IDLE });
        }
        if (placement !== data.placement) {
          setTimeout(function() {
            data.instance.update();
          }, 1);
        }
      }, "onCreate"), onUpdate: /* @__PURE__ */ __name(function onUpdate2(data) {
        _this2.popper = data;
        var currentPlacement = _this2.state.currentPlacement;
        if (_this2._isMounted && data.placement !== currentPlacement) {
          _this2.setState({ currentPlacement: data.placement });
        }
      }, "onUpdate") });
    }
    if (positionWrapper) {
      var wrapperOffset = !esm_default.undefined(wrapperOptions.offset) ? wrapperOptions.offset : 0;
      new popper_default(this.target, this.wrapperRef, { placement: wrapperOptions.placement || placement, modifiers: { arrow: { enabled: false }, offset: { offset: "0, ".concat(wrapperOffset, "px") }, flip: { enabled: false } }, onCreate: /* @__PURE__ */ __name(function onCreate2(data) {
        _this2.wrapperPopper = data;
        if (_this2._isMounted) {
          _this2.setState({ statusWrapper: STATUS.IDLE });
        }
        getPopper(data, "wrapper");
        if (placement !== data.placement) {
          setTimeout(function() {
            data.instance.update();
          }, 1);
        }
      }, "onCreate") });
    }
  }, "initPopper") }, { key: "rebuildPopper", value: /* @__PURE__ */ __name(function rebuildPopper() {
    var _this3 = this;
    this.floaterRefInterval = setInterval(function() {
      var _this3$floaterRef;
      if ((_this3$floaterRef = _this3.floaterRef) !== null && _this3$floaterRef !== void 0 && _this3$floaterRef.isConnected) {
        clearInterval(_this3.floaterRefInterval);
        _this3.setState({ needsUpdate: false });
        _this3.initPopper();
      }
    }, 50);
  }, "rebuildPopper") }, { key: "changeWrapperPosition", value: /* @__PURE__ */ __name(function changeWrapperPosition(_ref) {
    var target = _ref.target, wrapperOptions = _ref.wrapperOptions;
    this.setState({ positionWrapper: wrapperOptions.position && !!target });
  }, "changeWrapperPosition") }, { key: "toggle", value: /* @__PURE__ */ __name(function toggle(forceStatus) {
    var status = this.state.status;
    var nextStatus = status === STATUS.OPEN ? STATUS.CLOSING : STATUS.OPENING;
    if (!esm_default.undefined(forceStatus)) {
      nextStatus = forceStatus;
    }
    this.setState({ status: nextStatus });
  }, "toggle") }, { key: "debug", get: /* @__PURE__ */ __name(function get() {
    var debug = this.props.debug;
    return debug || canUseDOM() && "ReactFloaterDebug" in window && !!window.ReactFloaterDebug;
  }, "get") }, { key: "event", get: /* @__PURE__ */ __name(function get() {
    var _this$props8 = this.props, disableHoverToClick = _this$props8.disableHoverToClick, event = _this$props8.event;
    if (event === "hover" && isMobile() && !disableHoverToClick) {
      return "click";
    }
    return event;
  }, "get") }, { key: "options", get: /* @__PURE__ */ __name(function get() {
    var options = this.props.options;
    return (0, import_deepmerge.default)(DEFAULTS, options || {});
  }, "get") }, { key: "styles", get: /* @__PURE__ */ __name(function get() {
    var _this4 = this;
    var _this$state3 = this.state, status = _this$state3.status, positionWrapper = _this$state3.positionWrapper, statusWrapper = _this$state3.statusWrapper;
    var styles = this.props.styles;
    var nextStyles = (0, import_deepmerge.default)(getStyles(styles), styles);
    if (positionWrapper) {
      var wrapperStyles;
      if (!([STATUS.IDLE].indexOf(status) !== -1) || !([STATUS.IDLE].indexOf(statusWrapper) !== -1)) {
        wrapperStyles = nextStyles.wrapperPosition;
      } else {
        wrapperStyles = this.wrapperPopper.styles;
      }
      nextStyles.wrapper = _objectSpread2(_objectSpread2({}, nextStyles.wrapper), wrapperStyles);
    }
    if (this.target) {
      var targetStyles = window.getComputedStyle(this.target);
      if (this.wrapperStyles) {
        nextStyles.wrapper = _objectSpread2(_objectSpread2({}, nextStyles.wrapper), this.wrapperStyles);
      } else if (!(["relative", "static"].indexOf(targetStyles.position) !== -1)) {
        this.wrapperStyles = {};
        if (!positionWrapper) {
          POSITIONING_PROPS.forEach(function(d2) {
            _this4.wrapperStyles[d2] = targetStyles[d2];
          });
          nextStyles.wrapper = _objectSpread2(_objectSpread2({}, nextStyles.wrapper), this.wrapperStyles);
          this.target.style.position = "relative";
          this.target.style.top = "auto";
          this.target.style.right = "auto";
          this.target.style.bottom = "auto";
          this.target.style.left = "auto";
        }
      }
    }
    return nextStyles;
  }, "get") }, { key: "target", get: /* @__PURE__ */ __name(function get() {
    if (!canUseDOM()) return null;
    var target = this.props.target;
    if (target) {
      if (esm_default.domElement(target)) {
        return target;
      }
      return document.querySelector(target);
    }
    return this.childRef || this.wrapperRef;
  }, "get") }, { key: "render", value: /* @__PURE__ */ __name(function render() {
    var _this$state4 = this.state, currentPlacement = _this$state4.currentPlacement, positionWrapper = _this$state4.positionWrapper, status = _this$state4.status;
    var _this$props9 = this.props, children = _this$props9.children, component = _this$props9.component, content = _this$props9.content, disableAnimation = _this$props9.disableAnimation, footer = _this$props9.footer, hideArrow = _this$props9.hideArrow, id = _this$props9.id, open = _this$props9.open, showCloseButton = _this$props9.showCloseButton, style = _this$props9.style, target = _this$props9.target, title = _this$props9.title;
    var wrapper = React2.createElement(ReactFloaterWrapper, { handleClick: this.handleClick, handleMouseEnter: this.handleMouseEnter, handleMouseLeave: this.handleMouseLeave, setChildRef: this.setChildRef, setWrapperRef: this.setWrapperRef, style, styles: this.styles.wrapper }, children);
    var output = {};
    if (positionWrapper) {
      output.wrapperInPortal = wrapper;
    } else {
      output.wrapperAsChildren = wrapper;
    }
    return React2.createElement("span", null, React2.createElement(ReactFloaterPortal, { hasChildren: !!children, id, placement: currentPlacement, setRef: this.setFloaterRef, target, zIndex: this.styles.options.zIndex }, React2.createElement(Floater, { component, content, disableAnimation, footer, handleClick: this.handleClick, hideArrow: hideArrow || currentPlacement === "center", open, placement: currentPlacement, positionWrapper, setArrowRef: this.setArrowRef, setFloaterRef: this.setFloaterRef, showCloseButton, status, styles: this.styles, title }), output.wrapperInPortal), output.wrapperAsChildren);
  }, "render") }]);
  return ReactFloater2;
}(React2.Component);
_defineProperty(ReactFloater, "propTypes", { autoOpen: import_prop_types.default.bool, callback: import_prop_types.default.func, children: import_prop_types.default.node, component: isRequiredIf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.element]), function(props) {
  return !props.content;
}), content: isRequiredIf(import_prop_types.default.node, function(props) {
  return !props.component;
}), debug: import_prop_types.default.bool, disableAnimation: import_prop_types.default.bool, disableFlip: import_prop_types.default.bool, disableHoverToClick: import_prop_types.default.bool, event: import_prop_types.default.oneOf(["hover", "click"]), eventDelay: import_prop_types.default.number, footer: import_prop_types.default.node, getPopper: import_prop_types.default.func, hideArrow: import_prop_types.default.bool, id: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.number]), offset: import_prop_types.default.number, open: import_prop_types.default.bool, options: import_prop_types.default.object, placement: import_prop_types.default.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end", "auto", "center"]), showCloseButton: import_prop_types.default.bool, style: import_prop_types.default.object, styles: import_prop_types.default.object, target: import_prop_types.default.oneOfType([import_prop_types.default.object, import_prop_types.default.string]), title: import_prop_types.default.node, wrapperOptions: import_prop_types.default.shape({ offset: import_prop_types.default.number, placement: import_prop_types.default.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end", "auto"]), position: import_prop_types.default.bool }) });
_defineProperty(ReactFloater, "defaultProps", { autoOpen: false, callback: noop, debug: false, disableAnimation: false, disableFlip: false, disableHoverToClick: false, event: "click", eventDelay: 0.4, getPopper: noop, hideArrow: false, offset: 15, placement: "bottom", showCloseButton: false, styles: {}, target: null, wrapperOptions: { position: false } });

// ../../node_modules/react-joyride/dist/index.mjs
import * as React4 from "react";
import * as React7 from "react";
import * as React6 from "react";
import React5 from "react";
var __defProp = Object.defineProperty;
var __defNormalProp = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __publicField = /* @__PURE__ */ __name((obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value), "__publicField");
var ACTIONS = {
  INIT: "init",
  START: "start",
  STOP: "stop",
  RESET: "reset",
  PREV: "prev",
  NEXT: "next",
  GO: "go",
  CLOSE: "close",
  SKIP: "skip",
  UPDATE: "update"
};
var EVENTS = {
  TOUR_START: "tour:start",
  STEP_BEFORE: "step:before",
  BEACON: "beacon",
  TOOLTIP: "tooltip",
  STEP_AFTER: "step:after",
  TOUR_END: "tour:end",
  TOUR_STATUS: "tour:status",
  TARGET_NOT_FOUND: "error:target_not_found",
  ERROR: "error"
};
var LIFECYCLE = {
  INIT: "init",
  READY: "ready",
  BEACON: "beacon",
  TOOLTIP: "tooltip",
  COMPLETE: "complete",
  ERROR: "error"
};
var STATUS2 = {
  IDLE: "idle",
  READY: "ready",
  WAITING: "waiting",
  RUNNING: "running",
  PAUSED: "paused",
  SKIPPED: "skipped",
  FINISHED: "finished",
  ERROR: "error"
};
function canUseDOM2() {
  var _a9;
  return !!(typeof window !== "undefined" && ((_a9 = window.document) == null ? void 0 : _a9.createElement));
}
__name(canUseDOM2, "canUseDOM");
function getClientRect2(element) {
  if (!element) {
    return null;
  }
  return element.getBoundingClientRect();
}
__name(getClientRect2, "getClientRect");
function getDocumentHeight(median = false) {
  const { body, documentElement } = document;
  if (!body || !documentElement) {
    return 0;
  }
  if (median) {
    const heights = [
      body.scrollHeight,
      body.offsetHeight,
      documentElement.clientHeight,
      documentElement.scrollHeight,
      documentElement.offsetHeight
    ].sort((a2, b2) => a2 - b2);
    const middle = Math.floor(heights.length / 2);
    if (heights.length % 2 === 0) {
      return (heights[middle - 1] + heights[middle]) / 2;
    }
    return heights[middle];
  }
  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    documentElement.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight
  );
}
__name(getDocumentHeight, "getDocumentHeight");
function getElement(element) {
  if (typeof element === "string") {
    try {
      return document.querySelector(element);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
      return null;
    }
  }
  return element;
}
__name(getElement, "getElement");
function getStyleComputedProperty2(el) {
  if (!el || el.nodeType !== 1) {
    return null;
  }
  return getComputedStyle(el);
}
__name(getStyleComputedProperty2, "getStyleComputedProperty");
function getScrollParent2(element, skipFix, forListener) {
  if (!element) {
    return scrollDocument();
  }
  const parent = (0, import_scrollparent.default)(element);
  if (parent) {
    if (parent.isSameNode(scrollDocument())) {
      if (forListener) {
        return document;
      }
      return scrollDocument();
    }
    const hasScrolling = parent.scrollHeight > parent.offsetHeight;
    if (!hasScrolling && !skipFix) {
      parent.style.overflow = "initial";
      return scrollDocument();
    }
  }
  return parent;
}
__name(getScrollParent2, "getScrollParent");
function hasCustomScrollParent(element, skipFix) {
  if (!element) {
    return false;
  }
  const parent = getScrollParent2(element, skipFix);
  return parent ? !parent.isSameNode(scrollDocument()) : false;
}
__name(hasCustomScrollParent, "hasCustomScrollParent");
function hasCustomOffsetParent(element) {
  return element.offsetParent !== document.body;
}
__name(hasCustomOffsetParent, "hasCustomOffsetParent");
function hasPosition(el, type = "fixed") {
  if (!el || !(el instanceof HTMLElement)) {
    return false;
  }
  const { nodeName } = el;
  const styles = getStyleComputedProperty2(el);
  if (nodeName === "BODY" || nodeName === "HTML") {
    return false;
  }
  if (styles && styles.position === type) {
    return true;
  }
  if (!el.parentNode) {
    return false;
  }
  return hasPosition(el.parentNode, type);
}
__name(hasPosition, "hasPosition");
function isElementVisible(element) {
  var _a9;
  if (!element) {
    return false;
  }
  let parentElement = element;
  while (parentElement) {
    if (parentElement === document.body) {
      break;
    }
    if (parentElement instanceof HTMLElement) {
      const { display, visibility } = getComputedStyle(parentElement);
      if (display === "none" || visibility === "hidden") {
        return false;
      }
    }
    parentElement = (_a9 = parentElement.parentElement) != null ? _a9 : null;
  }
  return true;
}
__name(isElementVisible, "isElementVisible");
function getElementPosition(element, offset2, skipFix) {
  var _a9, _b, _c;
  const elementRect = getClientRect2(element);
  const parent = getScrollParent2(element, skipFix);
  const hasScrollParent = hasCustomScrollParent(element, skipFix);
  const isFixedTarget = hasPosition(element);
  let parentTop = 0;
  let top = (_a9 = elementRect == null ? void 0 : elementRect.top) != null ? _a9 : 0;
  if (hasScrollParent && isFixedTarget) {
    const offsetTop = (_b = element == null ? void 0 : element.offsetTop) != null ? _b : 0;
    const parentScrollTop = (_c = parent == null ? void 0 : parent.scrollTop) != null ? _c : 0;
    top = offsetTop - parentScrollTop;
  } else if (parent instanceof HTMLElement) {
    parentTop = parent.scrollTop;
    if (!hasScrollParent && !hasPosition(element)) {
      top += parentTop;
    }
    if (!parent.isSameNode(scrollDocument())) {
      top += scrollDocument().scrollTop;
    }
  }
  return Math.floor(top - offset2);
}
__name(getElementPosition, "getElementPosition");
function getScrollTo(element, offset2, skipFix) {
  var _a9;
  if (!element) {
    return 0;
  }
  const { offsetTop = 0, scrollTop = 0 } = (_a9 = (0, import_scrollparent.default)(element)) != null ? _a9 : {};
  let top = element.getBoundingClientRect().top + scrollTop;
  if (!!offsetTop && (hasCustomScrollParent(element, skipFix) || hasCustomOffsetParent(element))) {
    top -= offsetTop;
  }
  const output = Math.floor(top - offset2);
  return output < 0 ? 0 : output;
}
__name(getScrollTo, "getScrollTo");
function scrollDocument() {
  var _a9;
  return (_a9 = document.scrollingElement) != null ? _a9 : document.documentElement;
}
__name(scrollDocument, "scrollDocument");
function scrollTo(value, options) {
  const { duration, element } = options;
  return new Promise((resolve, reject) => {
    const { scrollTop } = element;
    const limit = value > scrollTop ? value - scrollTop : scrollTop - value;
    import_scroll.default.top(element, value, { duration: limit < 100 ? 50 : duration }, (error) => {
      if (error && error.message !== "Element already at target scroll position") {
        return reject(error);
      }
      return resolve();
    });
  });
}
__name(scrollTo, "scrollTo");
var isReact162 = createPortal !== void 0;
function getBrowser(userAgent = navigator.userAgent) {
  let browser = userAgent;
  if (typeof window === "undefined") {
    browser = "node";
  } else if (document.documentMode) {
    browser = "ie";
  } else if (/Edge/.test(userAgent)) {
    browser = "edge";
  } else if (Boolean(window.opera) || userAgent.includes(" OPR/")) {
    browser = "opera";
  } else if (typeof window.InstallTrigger !== "undefined") {
    browser = "firefox";
  } else if (window.chrome) {
    browser = "chrome";
  } else if (/(Version\/([\d._]+).*Safari|CriOS|FxiOS| Mobile\/)/.test(userAgent)) {
    browser = "safari";
  }
  return browser;
}
__name(getBrowser, "getBrowser");
function getObjectType4(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
__name(getObjectType4, "getObjectType");
function getReactNodeText(input, options = {}) {
  const { defaultValue, step, steps } = options;
  let text = (0, import_react_innertext.default)(input);
  if (!text) {
    if (isValidElement(input) && !Object.values(input.props).length && getObjectType4(input.type) === "function") {
      const component = input.type({});
      text = getReactNodeText(component, options);
    } else {
      text = (0, import_react_innertext.default)(defaultValue);
    }
  } else if ((text.includes("{step}") || text.includes("{steps}")) && step && steps) {
    text = text.replace("{step}", step.toString()).replace("{steps}", steps.toString());
  }
  return text;
}
__name(getReactNodeText, "getReactNodeText");
function hasValidKeys(object, keys) {
  if (!src_default.plainObject(object) || !src_default.array(keys)) {
    return false;
  }
  return Object.keys(object).every((d2) => keys.includes(d2));
}
__name(hasValidKeys, "hasValidKeys");
function hexToRGB(hex) {
  const shorthandRegex = /^#?([\da-f])([\da-f])([\da-f])$/i;
  const properHex = hex.replace(shorthandRegex, (_m, r2, g2, b2) => r2 + r2 + g2 + g2 + b2 + b2);
  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(properHex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [];
}
__name(hexToRGB, "hexToRGB");
function hideBeacon(step) {
  return step.disableBeacon || step.placement === "center";
}
__name(hideBeacon, "hideBeacon");
function isLegacy() {
  return !["chrome", "safari", "firefox", "opera"].includes(getBrowser());
}
__name(isLegacy, "isLegacy");
function log2({ data, debug = false, title, warn = false }) {
  const logFn = warn ? console.warn || console.error : console.log;
  if (debug) {
    if (title && data) {
      console.groupCollapsed(
        `%creact-joyride: ${title}`,
        "color: #ff0044; font-weight: bold; font-size: 12px;"
      );
      if (Array.isArray(data)) {
        data.forEach((d2) => {
          if (src_default.plainObject(d2) && d2.key) {
            logFn.apply(console, [d2.key, d2.value]);
          } else {
            logFn.apply(console, [d2]);
          }
        });
      } else {
        logFn.apply(console, [data]);
      }
      console.groupEnd();
    } else {
      console.error("Missing title or data props");
    }
  }
}
__name(log2, "log");
function noop2() {
  return void 0;
}
__name(noop2, "noop");
function objectKeys(input) {
  return Object.keys(input);
}
__name(objectKeys, "objectKeys");
function omit(input, ...filter) {
  if (!src_default.plainObject(input)) {
    throw new TypeError("Expected an object");
  }
  const output = {};
  for (const key in input) {
    if ({}.hasOwnProperty.call(input, key)) {
      if (!filter.includes(key)) {
        output[key] = input[key];
      }
    }
  }
  return output;
}
__name(omit, "omit");
function pick(input, ...filter) {
  if (!src_default.plainObject(input)) {
    throw new TypeError("Expected an object");
  }
  if (!filter.length) {
    return input;
  }
  const output = {};
  for (const key in input) {
    if ({}.hasOwnProperty.call(input, key)) {
      if (filter.includes(key)) {
        output[key] = input[key];
      }
    }
  }
  return output;
}
__name(pick, "pick");
function replaceLocaleContent(input, step, steps) {
  const replacer = /* @__PURE__ */ __name((text) => text.replace("{step}", String(step)).replace("{steps}", String(steps)), "replacer");
  if (getObjectType4(input) === "string") {
    return replacer(input);
  }
  if (!isValidElement(input)) {
    return input;
  }
  const { children } = input.props;
  if (getObjectType4(children) === "string" && children.includes("{step}")) {
    return cloneElement(input, {
      children: replacer(children)
    });
  }
  if (Array.isArray(children)) {
    return cloneElement(input, {
      children: children.map((child) => {
        if (typeof child === "string") {
          return replacer(child);
        }
        return replaceLocaleContent(child, step, steps);
      })
    });
  }
  if (getObjectType4(input.type) === "function" && !Object.values(input.props).length) {
    const component = input.type({});
    return replaceLocaleContent(component, step, steps);
  }
  return input;
}
__name(replaceLocaleContent, "replaceLocaleContent");
function shouldScroll(options) {
  const { isFirstStep, lifecycle, previousLifecycle, scrollToFirstStep, step, target } = options;
  return !step.disableScrolling && (!isFirstStep || scrollToFirstStep || lifecycle === LIFECYCLE.TOOLTIP) && step.placement !== "center" && (!step.isFixed || !hasPosition(target)) && // fixed steps don't need to scroll
  previousLifecycle !== lifecycle && [LIFECYCLE.BEACON, LIFECYCLE.TOOLTIP].includes(lifecycle);
}
__name(shouldScroll, "shouldScroll");
var defaultFloaterProps = {
  options: {
    preventOverflow: {
      boundariesElement: "scrollParent"
    }
  },
  wrapperOptions: {
    offset: -18,
    position: true
  }
};
var defaultLocale = {
  back: "Back",
  close: "Close",
  last: "Last",
  next: "Next",
  nextLabelWithProgress: "Next (Step {step} of {steps})",
  open: "Open the dialog",
  skip: "Skip"
};
var defaultStep = {
  event: "click",
  placement: "bottom",
  offset: 10,
  disableBeacon: false,
  disableCloseOnEsc: false,
  disableOverlay: false,
  disableOverlayClose: false,
  disableScrollParentFix: false,
  disableScrolling: false,
  hideBackButton: false,
  hideCloseButton: false,
  hideFooter: false,
  isFixed: false,
  locale: defaultLocale,
  showProgress: false,
  showSkipButton: false,
  spotlightClicks: false,
  spotlightPadding: 10
};
var defaultProps = {
  continuous: false,
  debug: false,
  disableCloseOnEsc: false,
  disableOverlay: false,
  disableOverlayClose: false,
  disableScrolling: false,
  disableScrollParentFix: false,
  getHelpers: noop2(),
  hideBackButton: false,
  run: true,
  scrollOffset: 20,
  scrollDuration: 300,
  scrollToFirstStep: false,
  showSkipButton: false,
  showProgress: false,
  spotlightClicks: false,
  spotlightPadding: 10,
  steps: []
};
var defaultOptions2 = {
  arrowColor: "#fff",
  backgroundColor: "#fff",
  beaconSize: 36,
  overlayColor: "rgba(0, 0, 0, 0.5)",
  primaryColor: "#f04",
  spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
  textColor: "#333",
  width: 380,
  zIndex: 100
};
var buttonBase = {
  backgroundColor: "transparent",
  border: 0,
  borderRadius: 0,
  color: "#555",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
  padding: 8,
  WebkitAppearance: "none"
};
var spotlight = {
  borderRadius: 4,
  position: "absolute"
};
function getStyles2(props, step) {
  var _a9, _b, _c, _d, _e;
  const { floaterProps, styles } = props;
  const mergedFloaterProps = (0, import_deepmerge3.default)((_a9 = step.floaterProps) != null ? _a9 : {}, floaterProps != null ? floaterProps : {});
  const mergedStyles = (0, import_deepmerge3.default)(styles != null ? styles : {}, (_b = step.styles) != null ? _b : {});
  const options = (0, import_deepmerge3.default)(defaultOptions2, mergedStyles.options || {});
  const hideBeacon2 = step.placement === "center" || step.disableBeacon;
  let { width } = options;
  if (window.innerWidth > 480) {
    width = 380;
  }
  if ("width" in options) {
    width = typeof options.width === "number" && window.innerWidth < options.width ? window.innerWidth - 30 : options.width;
  }
  const overlay = {
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: options.zIndex
  };
  const defaultStyles = {
    beacon: {
      ...buttonBase,
      display: hideBeacon2 ? "none" : "inline-block",
      height: options.beaconSize,
      position: "relative",
      width: options.beaconSize,
      zIndex: options.zIndex
    },
    beaconInner: {
      animation: "joyride-beacon-inner 1.2s infinite ease-in-out",
      backgroundColor: options.primaryColor,
      borderRadius: "50%",
      display: "block",
      height: "50%",
      left: "50%",
      opacity: 0.7,
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "50%"
    },
    beaconOuter: {
      animation: "joyride-beacon-outer 1.2s infinite ease-in-out",
      backgroundColor: `rgba(${hexToRGB(options.primaryColor).join(",")}, 0.2)`,
      border: `2px solid ${options.primaryColor}`,
      borderRadius: "50%",
      boxSizing: "border-box",
      display: "block",
      height: "100%",
      left: 0,
      opacity: 0.9,
      position: "absolute",
      top: 0,
      transformOrigin: "center",
      width: "100%"
    },
    tooltip: {
      backgroundColor: options.backgroundColor,
      borderRadius: 5,
      boxSizing: "border-box",
      color: options.textColor,
      fontSize: 16,
      maxWidth: "100%",
      padding: 15,
      position: "relative",
      width
    },
    tooltipContainer: {
      lineHeight: 1.4,
      textAlign: "center"
    },
    tooltipTitle: {
      fontSize: 18,
      margin: 0
    },
    tooltipContent: {
      padding: "20px 10px"
    },
    tooltipFooter: {
      alignItems: "center",
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 15
    },
    tooltipFooterSpacer: {
      flex: 1
    },
    buttonNext: {
      ...buttonBase,
      backgroundColor: options.primaryColor,
      borderRadius: 4,
      color: "#fff"
    },
    buttonBack: {
      ...buttonBase,
      color: options.primaryColor,
      marginLeft: "auto",
      marginRight: 5
    },
    buttonClose: {
      ...buttonBase,
      color: options.textColor,
      height: 14,
      padding: 15,
      position: "absolute",
      right: 0,
      top: 0,
      width: 14
    },
    buttonSkip: {
      ...buttonBase,
      color: options.textColor,
      fontSize: 14
    },
    overlay: {
      ...overlay,
      backgroundColor: options.overlayColor,
      mixBlendMode: "hard-light"
    },
    overlayLegacy: {
      ...overlay
    },
    overlayLegacyCenter: {
      ...overlay,
      backgroundColor: options.overlayColor
    },
    spotlight: {
      ...spotlight,
      backgroundColor: "gray"
    },
    spotlightLegacy: {
      ...spotlight,
      boxShadow: `0 0 0 9999px ${options.overlayColor}, ${options.spotlightShadow}`
    },
    floaterStyles: {
      arrow: {
        color: (_e = (_d = (_c = mergedFloaterProps == null ? void 0 : mergedFloaterProps.styles) == null ? void 0 : _c.arrow) == null ? void 0 : _d.color) != null ? _e : options.arrowColor
      },
      options: {
        zIndex: options.zIndex + 100
      }
    },
    options
  };
  return (0, import_deepmerge3.default)(defaultStyles, mergedStyles);
}
__name(getStyles2, "getStyles");
function getTourProps(props) {
  return pick(
    props,
    "beaconComponent",
    "disableCloseOnEsc",
    "disableOverlay",
    "disableOverlayClose",
    "disableScrolling",
    "disableScrollParentFix",
    "floaterProps",
    "hideBackButton",
    "hideCloseButton",
    "locale",
    "showProgress",
    "showSkipButton",
    "spotlightClicks",
    "spotlightPadding",
    "styles",
    "tooltipComponent"
  );
}
__name(getTourProps, "getTourProps");
function getMergedStep(props, currentStep) {
  var _a9, _b, _c, _d, _e, _f;
  const step = currentStep != null ? currentStep : {};
  const mergedStep = import_deepmerge2.default.all([defaultStep, getTourProps(props), step], {
    isMergeableObject: src_default.plainObject
  });
  const mergedStyles = getStyles2(props, mergedStep);
  const scrollParent2 = hasCustomScrollParent(
    getElement(mergedStep.target),
    mergedStep.disableScrollParentFix
  );
  const floaterProps = import_deepmerge2.default.all([
    defaultFloaterProps,
    (_a9 = props.floaterProps) != null ? _a9 : {},
    (_b = mergedStep.floaterProps) != null ? _b : {}
  ]);
  floaterProps.offset = mergedStep.offset;
  floaterProps.styles = (0, import_deepmerge2.default)((_c = floaterProps.styles) != null ? _c : {}, mergedStyles.floaterStyles);
  floaterProps.offset += (_e = (_d = props.spotlightPadding) != null ? _d : mergedStep.spotlightPadding) != null ? _e : 0;
  if (mergedStep.placementBeacon && floaterProps.wrapperOptions) {
    floaterProps.wrapperOptions.placement = mergedStep.placementBeacon;
  }
  if (scrollParent2 && floaterProps.options.preventOverflow) {
    floaterProps.options.preventOverflow.boundariesElement = "window";
  }
  return {
    ...mergedStep,
    locale: import_deepmerge2.default.all([defaultLocale, (_f = props.locale) != null ? _f : {}, mergedStep.locale || {}]),
    floaterProps,
    styles: omit(mergedStyles, "floaterStyles")
  };
}
__name(getMergedStep, "getMergedStep");
function validateStep(step, debug = false) {
  if (!src_default.plainObject(step)) {
    log2({
      title: "validateStep",
      data: "step must be an object",
      warn: true,
      debug
    });
    return false;
  }
  if (!step.target) {
    log2({
      title: "validateStep",
      data: "target is missing from the step",
      warn: true,
      debug
    });
    return false;
  }
  return true;
}
__name(validateStep, "validateStep");
function validateSteps(steps, debug = false) {
  if (!src_default.array(steps)) {
    log2({
      title: "validateSteps",
      data: "steps must be an array",
      warn: true,
      debug
    });
    return false;
  }
  return steps.every((d2) => validateStep(d2, debug));
}
__name(validateSteps, "validateSteps");
var defaultState = {
  action: "init",
  controlled: false,
  index: 0,
  lifecycle: LIFECYCLE.INIT,
  origin: null,
  size: 0,
  status: STATUS2.IDLE
};
var validKeys = objectKeys(omit(defaultState, "controlled", "size"));
var _a;
var Store = (_a = class {
  constructor(options) {
    __publicField(this, "beaconPopper");
    __publicField(this, "tooltipPopper");
    __publicField(this, "data", /* @__PURE__ */ new Map());
    __publicField(this, "listener");
    __publicField(this, "store", /* @__PURE__ */ new Map());
    __publicField(this, "addListener", (listener) => {
      this.listener = listener;
    });
    __publicField(this, "setSteps", (steps2) => {
      const { size, status } = this.getState();
      const state = {
        size: steps2.length,
        status
      };
      this.data.set("steps", steps2);
      if (status === STATUS2.WAITING && !size && steps2.length) {
        state.status = STATUS2.RUNNING;
      }
      this.setState(state);
    });
    __publicField(this, "getPopper", (name) => {
      if (name === "beacon") {
        return this.beaconPopper;
      }
      return this.tooltipPopper;
    });
    __publicField(this, "setPopper", (name, popper) => {
      if (name === "beacon") {
        this.beaconPopper = popper;
      } else {
        this.tooltipPopper = popper;
      }
    });
    __publicField(this, "cleanupPoppers", () => {
      this.beaconPopper = null;
      this.tooltipPopper = null;
    });
    __publicField(this, "close", (origin = null) => {
      const { index, status } = this.getState();
      if (status !== STATUS2.RUNNING) {
        return;
      }
      this.setState({
        ...this.getNextState({ action: ACTIONS.CLOSE, index: index + 1, origin })
      });
    });
    __publicField(this, "go", (nextIndex) => {
      const { controlled, status } = this.getState();
      if (controlled || status !== STATUS2.RUNNING) {
        return;
      }
      const step = this.getSteps()[nextIndex];
      this.setState({
        ...this.getNextState({ action: ACTIONS.GO, index: nextIndex }),
        status: step ? status : STATUS2.FINISHED
      });
    });
    __publicField(this, "info", () => this.getState());
    __publicField(this, "next", () => {
      const { index, status } = this.getState();
      if (status !== STATUS2.RUNNING) {
        return;
      }
      this.setState(this.getNextState({ action: ACTIONS.NEXT, index: index + 1 }));
    });
    __publicField(this, "open", () => {
      const { status } = this.getState();
      if (status !== STATUS2.RUNNING) {
        return;
      }
      this.setState({
        ...this.getNextState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.TOOLTIP })
      });
    });
    __publicField(this, "prev", () => {
      const { index, status } = this.getState();
      if (status !== STATUS2.RUNNING) {
        return;
      }
      this.setState({
        ...this.getNextState({ action: ACTIONS.PREV, index: index - 1 })
      });
    });
    __publicField(this, "reset", (restart = false) => {
      const { controlled } = this.getState();
      if (controlled) {
        return;
      }
      this.setState({
        ...this.getNextState({ action: ACTIONS.RESET, index: 0 }),
        status: restart ? STATUS2.RUNNING : STATUS2.READY
      });
    });
    __publicField(this, "skip", () => {
      const { status } = this.getState();
      if (status !== STATUS2.RUNNING) {
        return;
      }
      this.setState({
        action: ACTIONS.SKIP,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS2.SKIPPED
      });
    });
    __publicField(this, "start", (nextIndex) => {
      const { index, size } = this.getState();
      this.setState({
        ...this.getNextState(
          {
            action: ACTIONS.START,
            index: src_default.number(nextIndex) ? nextIndex : index
          },
          true
        ),
        status: size ? STATUS2.RUNNING : STATUS2.WAITING
      });
    });
    __publicField(this, "stop", (advance = false) => {
      const { index, status } = this.getState();
      if ([STATUS2.FINISHED, STATUS2.SKIPPED].includes(status)) {
        return;
      }
      this.setState({
        ...this.getNextState({ action: ACTIONS.STOP, index: index + (advance ? 1 : 0) }),
        status: STATUS2.PAUSED
      });
    });
    __publicField(this, "update", (state) => {
      var _a9, _b;
      if (!hasValidKeys(state, validKeys)) {
        throw new Error(`State is not valid. Valid keys: ${validKeys.join(", ")}`);
      }
      this.setState({
        ...this.getNextState(
          {
            ...this.getState(),
            ...state,
            action: (_a9 = state.action) != null ? _a9 : ACTIONS.UPDATE,
            origin: (_b = state.origin) != null ? _b : null
          },
          true
        )
      });
    });
    const { continuous = false, stepIndex, steps = [] } = options != null ? options : {};
    this.setState(
      {
        action: ACTIONS.INIT,
        controlled: src_default.number(stepIndex),
        continuous,
        index: src_default.number(stepIndex) ? stepIndex : 0,
        lifecycle: LIFECYCLE.INIT,
        origin: null,
        status: steps.length ? STATUS2.READY : STATUS2.IDLE
      },
      true
    );
    this.beaconPopper = null;
    this.tooltipPopper = null;
    this.listener = null;
    this.setSteps(steps);
  }
  getState() {
    if (!this.store.size) {
      return { ...defaultState };
    }
    return {
      action: this.store.get("action") || "",
      controlled: this.store.get("controlled") || false,
      index: parseInt(this.store.get("index"), 10),
      lifecycle: this.store.get("lifecycle") || "",
      origin: this.store.get("origin") || null,
      size: this.store.get("size") || 0,
      status: this.store.get("status") || ""
    };
  }
  getNextState(state, force = false) {
    var _a9, _b, _c, _d, _e;
    const { action, controlled, index, size, status } = this.getState();
    const newIndex = src_default.number(state.index) ? state.index : index;
    const nextIndex = controlled && !force ? index : Math.min(Math.max(newIndex, 0), size);
    return {
      action: (_a9 = state.action) != null ? _a9 : action,
      controlled,
      index: nextIndex,
      lifecycle: (_b = state.lifecycle) != null ? _b : LIFECYCLE.INIT,
      origin: (_c = state.origin) != null ? _c : null,
      size: (_d = state.size) != null ? _d : size,
      status: nextIndex === size ? STATUS2.FINISHED : (_e = state.status) != null ? _e : status
    };
  }
  getSteps() {
    const steps = this.data.get("steps");
    return Array.isArray(steps) ? steps : [];
  }
  hasUpdatedState(oldState) {
    const before = JSON.stringify(oldState);
    const after = JSON.stringify(this.getState());
    return before !== after;
  }
  setState(nextState, initial = false) {
    const state = this.getState();
    const {
      action,
      index,
      lifecycle,
      origin = null,
      size,
      status
    } = {
      ...state,
      ...nextState
    };
    this.store.set("action", action);
    this.store.set("index", index);
    this.store.set("lifecycle", lifecycle);
    this.store.set("origin", origin);
    this.store.set("size", size);
    this.store.set("status", status);
    if (initial) {
      this.store.set("controlled", nextState.controlled);
      this.store.set("continuous", nextState.continuous);
    }
    if (this.listener && this.hasUpdatedState(state)) {
      this.listener(this.getState());
    }
  }
  getHelpers() {
    return {
      close: this.close,
      go: this.go,
      info: this.info,
      next: this.next,
      open: this.open,
      prev: this.prev,
      reset: this.reset,
      skip: this.skip
    };
  }
}, __name(_a, "Store"), _a);
function createStore(options) {
  return new Store(options);
}
__name(createStore, "createStore");
function JoyrideSpotlight({ styles }) {
  return React3.createElement(
    "div",
    {
      key: "JoyrideSpotlight",
      className: "react-joyride__spotlight",
      "data-test-id": "spotlight",
      style: styles
    }
  );
}
__name(JoyrideSpotlight, "JoyrideSpotlight");
var Spotlight_default = JoyrideSpotlight;
var _a2;
var JoyrideOverlay = (_a2 = class extends React22.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "isActive", false);
    __publicField(this, "resizeTimeout");
    __publicField(this, "scrollTimeout");
    __publicField(this, "scrollParent");
    __publicField(this, "state", {
      isScrolling: false,
      mouseOverSpotlight: false,
      showSpotlight: true
    });
    __publicField(this, "hideSpotlight", () => {
      const { continuous, disableOverlay, lifecycle } = this.props;
      const hiddenLifecycles = [
        LIFECYCLE.INIT,
        LIFECYCLE.BEACON,
        LIFECYCLE.COMPLETE,
        LIFECYCLE.ERROR
      ];
      return disableOverlay || (continuous ? hiddenLifecycles.includes(lifecycle) : lifecycle !== LIFECYCLE.TOOLTIP);
    });
    __publicField(this, "handleMouseMove", (event) => {
      const { mouseOverSpotlight } = this.state;
      const { height, left, position, top, width } = this.spotlightStyles;
      const offsetY = position === "fixed" ? event.clientY : event.pageY;
      const offsetX = position === "fixed" ? event.clientX : event.pageX;
      const inSpotlightHeight = offsetY >= top && offsetY <= top + height;
      const inSpotlightWidth = offsetX >= left && offsetX <= left + width;
      const inSpotlight = inSpotlightWidth && inSpotlightHeight;
      if (inSpotlight !== mouseOverSpotlight) {
        this.updateState({ mouseOverSpotlight: inSpotlight });
      }
    });
    __publicField(this, "handleScroll", () => {
      const { target } = this.props;
      const element = getElement(target);
      if (this.scrollParent !== document) {
        const { isScrolling } = this.state;
        if (!isScrolling) {
          this.updateState({ isScrolling: true, showSpotlight: false });
        }
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = window.setTimeout(() => {
          this.updateState({ isScrolling: false, showSpotlight: true });
        }, 50);
      } else if (hasPosition(element, "sticky")) {
        this.updateState({});
      }
    });
    __publicField(this, "handleResize", () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(() => {
        if (!this.isActive) {
          return;
        }
        this.forceUpdate();
      }, 100);
    });
  }
  componentDidMount() {
    const { debug, disableScrolling, disableScrollParentFix = false, target } = this.props;
    const element = getElement(target);
    this.scrollParent = getScrollParent2(element != null ? element : document.body, disableScrollParentFix, true);
    this.isActive = true;
    if (process.env.NODE_ENV !== "production") {
      if (!disableScrolling && hasCustomScrollParent(element, true)) {
        log2({
          title: "step has a custom scroll parent and can cause trouble with scrolling",
          data: [{ key: "parent", value: this.scrollParent }],
          debug
        });
      }
    }
    window.addEventListener("resize", this.handleResize);
  }
  componentDidUpdate(previousProps) {
    var _a9;
    const { disableScrollParentFix, lifecycle, spotlightClicks, target } = this.props;
    const { changed } = treeChanges(previousProps, this.props);
    if (changed("target") || changed("disableScrollParentFix")) {
      const element = getElement(target);
      this.scrollParent = getScrollParent2(element != null ? element : document.body, disableScrollParentFix, true);
    }
    if (changed("lifecycle", LIFECYCLE.TOOLTIP)) {
      (_a9 = this.scrollParent) == null ? void 0 : _a9.addEventListener("scroll", this.handleScroll, { passive: true });
      setTimeout(() => {
        const { isScrolling } = this.state;
        if (!isScrolling) {
          this.updateState({ showSpotlight: true });
        }
      }, 100);
    }
    if (changed("spotlightClicks") || changed("disableOverlay") || changed("lifecycle")) {
      if (spotlightClicks && lifecycle === LIFECYCLE.TOOLTIP) {
        window.addEventListener("mousemove", this.handleMouseMove, false);
      } else if (lifecycle !== LIFECYCLE.TOOLTIP) {
        window.removeEventListener("mousemove", this.handleMouseMove);
      }
    }
  }
  componentWillUnmount() {
    var _a9;
    this.isActive = false;
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleResize);
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.scrollTimeout);
    (_a9 = this.scrollParent) == null ? void 0 : _a9.removeEventListener("scroll", this.handleScroll);
  }
  get overlayStyles() {
    const { mouseOverSpotlight } = this.state;
    const { disableOverlayClose, placement, styles } = this.props;
    let baseStyles = styles.overlay;
    if (isLegacy()) {
      baseStyles = placement === "center" ? styles.overlayLegacyCenter : styles.overlayLegacy;
    }
    return {
      cursor: disableOverlayClose ? "default" : "pointer",
      height: getDocumentHeight(),
      pointerEvents: mouseOverSpotlight ? "none" : "auto",
      ...baseStyles
    };
  }
  get spotlightStyles() {
    var _a9, _b, _c;
    const { showSpotlight } = this.state;
    const {
      disableScrollParentFix = false,
      spotlightClicks,
      spotlightPadding = 0,
      styles,
      target
    } = this.props;
    const element = getElement(target);
    const elementRect = getClientRect2(element);
    const isFixedTarget = hasPosition(element);
    const top = getElementPosition(element, spotlightPadding, disableScrollParentFix);
    return {
      ...isLegacy() ? styles.spotlightLegacy : styles.spotlight,
      height: Math.round(((_a9 = elementRect == null ? void 0 : elementRect.height) != null ? _a9 : 0) + spotlightPadding * 2),
      left: Math.round(((_b = elementRect == null ? void 0 : elementRect.left) != null ? _b : 0) - spotlightPadding),
      opacity: showSpotlight ? 1 : 0,
      pointerEvents: spotlightClicks ? "none" : "auto",
      position: isFixedTarget ? "fixed" : "absolute",
      top,
      transition: "opacity 0.2s",
      width: Math.round(((_c = elementRect == null ? void 0 : elementRect.width) != null ? _c : 0) + spotlightPadding * 2)
    };
  }
  updateState(state) {
    if (!this.isActive) {
      return;
    }
    this.setState((previousState) => ({ ...previousState, ...state }));
  }
  render() {
    const { showSpotlight } = this.state;
    const { onClickOverlay, placement } = this.props;
    const { hideSpotlight, overlayStyles, spotlightStyles } = this;
    if (hideSpotlight()) {
      return null;
    }
    let spotlight2 = placement !== "center" && showSpotlight && React22.createElement(Spotlight_default, { styles: spotlightStyles });
    if (getBrowser() === "safari") {
      const { mixBlendMode, zIndex, ...safariOverlay } = overlayStyles;
      spotlight2 = React22.createElement("div", { style: { ...safariOverlay } }, spotlight2);
      delete overlayStyles.backgroundColor;
    }
    return React22.createElement(
      "div",
      {
        className: "react-joyride__overlay",
        "data-test-id": "overlay",
        onClick: onClickOverlay,
        role: "presentation",
        style: overlayStyles
      },
      spotlight2
    );
  }
}, __name(_a2, "JoyrideOverlay"), _a2);
var _a3;
var JoyridePortal = (_a3 = class extends React32.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "node", null);
  }
  componentDidMount() {
    const { id } = this.props;
    if (!canUseDOM2()) {
      return;
    }
    this.node = document.createElement("div");
    this.node.id = id;
    document.body.appendChild(this.node);
    if (!isReact162) {
      this.renderReact15();
    }
  }
  componentDidUpdate() {
    if (!canUseDOM2()) {
      return;
    }
    if (!isReact162) {
      this.renderReact15();
    }
  }
  componentWillUnmount() {
    if (!canUseDOM2() || !this.node) {
      return;
    }
    if (!isReact162) {
      ReactDOM2.unmountComponentAtNode(this.node);
    }
    if (this.node.parentNode === document.body) {
      document.body.removeChild(this.node);
      this.node = null;
    }
  }
  renderReact15() {
    if (!canUseDOM2()) {
      return;
    }
    const { children } = this.props;
    if (this.node) {
      ReactDOM2.unstable_renderSubtreeIntoContainer(this, children, this.node);
    }
  }
  renderReact16() {
    if (!canUseDOM2() || !isReact162) {
      return null;
    }
    const { children } = this.props;
    if (!this.node) {
      return null;
    }
    return ReactDOM2.createPortal(children, this.node);
  }
  render() {
    if (!isReact162) {
      return null;
    }
    return this.renderReact16();
  }
}, __name(_a3, "JoyridePortal"), _a3);
var _a4;
var Scope = (_a4 = class {
  constructor(element, options) {
    __publicField(this, "element");
    __publicField(this, "options");
    __publicField(this, "canBeTabbed", (element2) => {
      const { tabIndex } = element2;
      if (tabIndex === null || tabIndex < 0) {
        return false;
      }
      return this.canHaveFocus(element2);
    });
    __publicField(this, "canHaveFocus", (element2) => {
      const validTabNodes = /input|select|textarea|button|object/;
      const nodeName = element2.nodeName.toLowerCase();
      const isValid = validTabNodes.test(nodeName) && !element2.getAttribute("disabled") || nodeName === "a" && !!element2.getAttribute("href");
      return isValid && this.isVisible(element2);
    });
    __publicField(this, "findValidTabElements", () => [].slice.call(this.element.querySelectorAll("*"), 0).filter(this.canBeTabbed));
    __publicField(this, "handleKeyDown", (event) => {
      const { code = "Tab" } = this.options;
      if (event.code === code) {
        this.interceptTab(event);
      }
    });
    __publicField(this, "interceptTab", (event) => {
      event.preventDefault();
      const elements = this.findValidTabElements();
      const { shiftKey } = event;
      if (!elements.length) {
        return;
      }
      let x2 = document.activeElement ? elements.indexOf(document.activeElement) : 0;
      if (x2 === -1 || !shiftKey && x2 + 1 === elements.length) {
        x2 = 0;
      } else if (shiftKey && x2 === 0) {
        x2 = elements.length - 1;
      } else {
        x2 += shiftKey ? -1 : 1;
      }
      elements[x2].focus();
    });
    __publicField(this, "isHidden", (element2) => {
      const noSize = element2.offsetWidth <= 0 && element2.offsetHeight <= 0;
      const style = window.getComputedStyle(element2);
      if (noSize && !element2.innerHTML) {
        return true;
      }
      return noSize && style.getPropertyValue("overflow") !== "visible" || style.getPropertyValue("display") === "none";
    });
    __publicField(this, "isVisible", (element2) => {
      let parentElement = element2;
      while (parentElement) {
        if (parentElement instanceof HTMLElement) {
          if (parentElement === document.body) {
            break;
          }
          if (this.isHidden(parentElement)) {
            return false;
          }
          parentElement = parentElement.parentNode;
        }
      }
      return true;
    });
    __publicField(this, "removeScope", () => {
      window.removeEventListener("keydown", this.handleKeyDown);
    });
    __publicField(this, "checkFocus", (target) => {
      if (document.activeElement !== target) {
        target.focus();
        window.requestAnimationFrame(() => this.checkFocus(target));
      }
    });
    __publicField(this, "setFocus", () => {
      const { selector } = this.options;
      if (!selector) {
        return;
      }
      const target = this.element.querySelector(selector);
      if (target) {
        window.requestAnimationFrame(() => this.checkFocus(target));
      }
    });
    if (!(element instanceof HTMLElement)) {
      throw new TypeError("Invalid parameter: element must be an HTMLElement");
    }
    this.element = element;
    this.options = options;
    window.addEventListener("keydown", this.handleKeyDown, false);
    this.setFocus();
  }
}, __name(_a4, "Scope"), _a4);
var _a5;
var JoyrideBeacon = (_a5 = class extends React4.Component {
  constructor(props) {
    super(props);
    __publicField(this, "beacon", null);
    __publicField(this, "setBeaconRef", (c2) => {
      this.beacon = c2;
    });
    if (props.beaconComponent) {
      return;
    }
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.id = "joyride-beacon-animation";
    if (props.nonce) {
      style.setAttribute("nonce", props.nonce);
    }
    const css = `
        @keyframes joyride-beacon-inner {
          20% {
            opacity: 0.9;
          }
        
          90% {
            opacity: 0.7;
          }
        }
        
        @keyframes joyride-beacon-outer {
          0% {
            transform: scale(1);
          }
        
          45% {
            opacity: 0.7;
            transform: scale(0.75);
          }
        
          100% {
            opacity: 0.9;
            transform: scale(1);
          }
        }
      `;
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }
  componentDidMount() {
    const { shouldFocus } = this.props;
    if (process.env.NODE_ENV !== "production") {
      if (!src_default.domElement(this.beacon)) {
        console.warn("beacon is not a valid DOM element");
      }
    }
    setTimeout(() => {
      if (src_default.domElement(this.beacon) && shouldFocus) {
        this.beacon.focus();
      }
    }, 0);
  }
  componentWillUnmount() {
    const style = document.getElementById("joyride-beacon-animation");
    if (style == null ? void 0 : style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }
  render() {
    const {
      beaconComponent,
      continuous,
      index,
      isLastStep,
      locale,
      onClickOrHover,
      size,
      step,
      styles
    } = this.props;
    const title = getReactNodeText(locale.open);
    const sharedProps = {
      "aria-label": title,
      onClick: onClickOrHover,
      onMouseEnter: onClickOrHover,
      ref: this.setBeaconRef,
      title
    };
    let component;
    if (beaconComponent) {
      const BeaconComponent = beaconComponent;
      component = React4.createElement(
        BeaconComponent,
        {
          continuous,
          index,
          isLastStep,
          size,
          step,
          ...sharedProps
        }
      );
    } else {
      component = React4.createElement(
        "button",
        {
          key: "JoyrideBeacon",
          className: "react-joyride__beacon",
          "data-test-id": "button-beacon",
          style: styles.beacon,
          type: "button",
          ...sharedProps
        },
        React4.createElement("span", { style: styles.beaconInner }),
        React4.createElement("span", { style: styles.beaconOuter })
      );
    }
    return component;
  }
}, __name(_a5, "JoyrideBeacon"), _a5);
function JoyrideTooltipCloseButton({ styles, ...props }) {
  const { color: color2, height, width, ...style } = styles;
  return React5.createElement("button", { style, type: "button", ...props }, React5.createElement(
    "svg",
    {
      height: typeof height === "number" ? `${height}px` : height,
      preserveAspectRatio: "xMidYMid",
      version: "1.1",
      viewBox: "0 0 18 18",
      width: typeof width === "number" ? `${width}px` : width,
      xmlns: "http://www.w3.org/2000/svg"
    },
    React5.createElement("g", null, React5.createElement(
      "path",
      {
        d: "M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z",
        fill: color2
      }
    ))
  ));
}
__name(JoyrideTooltipCloseButton, "JoyrideTooltipCloseButton");
var CloseButton_default = JoyrideTooltipCloseButton;
function JoyrideTooltipContainer(props) {
  const { backProps, closeProps, index, isLastStep, primaryProps, skipProps, step, tooltipProps } = props;
  const { content, hideBackButton, hideCloseButton, hideFooter, showSkipButton, styles, title } = step;
  const output = {};
  output.primary = React6.createElement(
    "button",
    {
      "data-test-id": "button-primary",
      style: styles.buttonNext,
      type: "button",
      ...primaryProps
    }
  );
  if (showSkipButton && !isLastStep) {
    output.skip = React6.createElement(
      "button",
      {
        "aria-live": "off",
        "data-test-id": "button-skip",
        style: styles.buttonSkip,
        type: "button",
        ...skipProps
      }
    );
  }
  if (!hideBackButton && index > 0) {
    output.back = React6.createElement("button", { "data-test-id": "button-back", style: styles.buttonBack, type: "button", ...backProps });
  }
  output.close = !hideCloseButton && React6.createElement(CloseButton_default, { "data-test-id": "button-close", styles: styles.buttonClose, ...closeProps });
  return React6.createElement(
    "div",
    {
      key: "JoyrideTooltip",
      "aria-label": getReactNodeText(title != null ? title : content),
      className: "react-joyride__tooltip",
      style: styles.tooltip,
      ...tooltipProps
    },
    React6.createElement("div", { style: styles.tooltipContainer }, title && React6.createElement("h1", { "aria-label": getReactNodeText(title), style: styles.tooltipTitle }, title), React6.createElement("div", { style: styles.tooltipContent }, content)),
    !hideFooter && React6.createElement("div", { style: styles.tooltipFooter }, React6.createElement("div", { style: styles.tooltipFooterSpacer }, output.skip), output.back, output.primary),
    output.close
  );
}
__name(JoyrideTooltipContainer, "JoyrideTooltipContainer");
var Container_default = JoyrideTooltipContainer;
var _a6;
var JoyrideTooltip = (_a6 = class extends React7.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "handleClickBack", (event) => {
      event.preventDefault();
      const { helpers } = this.props;
      helpers.prev();
    });
    __publicField(this, "handleClickClose", (event) => {
      event.preventDefault();
      const { helpers } = this.props;
      helpers.close("button_close");
    });
    __publicField(this, "handleClickPrimary", (event) => {
      event.preventDefault();
      const { continuous, helpers } = this.props;
      if (!continuous) {
        helpers.close("button_primary");
        return;
      }
      helpers.next();
    });
    __publicField(this, "handleClickSkip", (event) => {
      event.preventDefault();
      const { helpers } = this.props;
      helpers.skip();
    });
    __publicField(this, "getElementsProps", () => {
      const { continuous, index, isLastStep, setTooltipRef, size, step } = this.props;
      const { back, close, last, next, nextLabelWithProgress, skip } = step.locale;
      const backText = getReactNodeText(back);
      const closeText = getReactNodeText(close);
      const lastText = getReactNodeText(last);
      const nextText = getReactNodeText(next);
      const skipText = getReactNodeText(skip);
      let primary = close;
      let primaryText = closeText;
      if (continuous) {
        primary = next;
        primaryText = nextText;
        if (step.showProgress && !isLastStep) {
          const labelWithProgress = getReactNodeText(nextLabelWithProgress, {
            step: index + 1,
            steps: size
          });
          primary = replaceLocaleContent(nextLabelWithProgress, index + 1, size);
          primaryText = labelWithProgress;
        }
        if (isLastStep) {
          primary = last;
          primaryText = lastText;
        }
      }
      return {
        backProps: {
          "aria-label": backText,
          children: back,
          "data-action": "back",
          onClick: this.handleClickBack,
          role: "button",
          title: backText
        },
        closeProps: {
          "aria-label": closeText,
          children: close,
          "data-action": "close",
          onClick: this.handleClickClose,
          role: "button",
          title: closeText
        },
        primaryProps: {
          "aria-label": primaryText,
          children: primary,
          "data-action": "primary",
          onClick: this.handleClickPrimary,
          role: "button",
          title: primaryText
        },
        skipProps: {
          "aria-label": skipText,
          children: skip,
          "data-action": "skip",
          onClick: this.handleClickSkip,
          role: "button",
          title: skipText
        },
        tooltipProps: {
          "aria-modal": true,
          ref: setTooltipRef,
          role: "alertdialog"
        }
      };
    });
  }
  render() {
    const { continuous, index, isLastStep, setTooltipRef, size, step } = this.props;
    const { beaconComponent, tooltipComponent, ...cleanStep } = step;
    let component;
    if (tooltipComponent) {
      const renderProps = {
        ...this.getElementsProps(),
        continuous,
        index,
        isLastStep,
        size,
        step: cleanStep,
        setTooltipRef
      };
      const TooltipComponent = tooltipComponent;
      component = React7.createElement(TooltipComponent, { ...renderProps });
    } else {
      component = React7.createElement(
        Container_default,
        {
          ...this.getElementsProps(),
          continuous,
          index,
          isLastStep,
          size,
          step
        }
      );
    }
    return component;
  }
}, __name(_a6, "JoyrideTooltip"), _a6);
var _a7;
var JoyrideStep = (_a7 = class extends React8.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "scope", null);
    __publicField(this, "tooltip", null);
    __publicField(this, "handleClickHoverBeacon", (event) => {
      const { step, store } = this.props;
      if (event.type === "mouseenter" && step.event !== "hover") {
        return;
      }
      store.update({ lifecycle: LIFECYCLE.TOOLTIP });
    });
    __publicField(this, "setTooltipRef", (element) => {
      this.tooltip = element;
    });
    __publicField(this, "setPopper", (popper, type) => {
      var _a9;
      const { action, lifecycle, step, store } = this.props;
      if (type === "wrapper") {
        store.setPopper("beacon", popper);
      } else {
        store.setPopper("tooltip", popper);
      }
      if (store.getPopper("beacon") && (store.getPopper("tooltip") || step.placement === "center") && lifecycle === LIFECYCLE.INIT) {
        store.update({
          action,
          lifecycle: LIFECYCLE.READY
        });
      }
      if ((_a9 = step.floaterProps) == null ? void 0 : _a9.getPopper) {
        step.floaterProps.getPopper(popper, type);
      }
    });
    __publicField(this, "renderTooltip", (renderProps) => {
      const { continuous, helpers, index, size, step } = this.props;
      return React8.createElement(
        JoyrideTooltip,
        {
          continuous,
          helpers,
          index,
          isLastStep: index + 1 === size,
          setTooltipRef: this.setTooltipRef,
          size,
          step,
          ...renderProps
        }
      );
    });
  }
  componentDidMount() {
    const { debug, index } = this.props;
    log2({
      title: `step:${index}`,
      data: [{ key: "props", value: this.props }],
      debug
    });
  }
  componentDidUpdate(previousProps) {
    var _a9;
    const {
      action,
      callback,
      continuous,
      controlled,
      debug,
      helpers,
      index,
      lifecycle,
      shouldScroll: shouldScroll2,
      status,
      step,
      store
    } = this.props;
    const { changed, changedFrom } = treeChanges(previousProps, this.props);
    const state = helpers.info();
    const skipBeacon = continuous && action !== ACTIONS.CLOSE && (index > 0 || action === ACTIONS.PREV);
    const hasStoreChanged = changed("action") || changed("index") || changed("lifecycle") || changed("status");
    const isInitial = changedFrom("lifecycle", [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT);
    const isAfterAction = changed("action", [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE
    ]);
    const isControlled = controlled && index === previousProps.index;
    if (isAfterAction && (isInitial || isControlled)) {
      callback({
        ...state,
        index: previousProps.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: previousProps.step,
        type: EVENTS.STEP_AFTER
      });
    }
    if (step.placement === "center" && status === STATUS2.RUNNING && changed("index") && action !== ACTIONS.START && lifecycle === LIFECYCLE.INIT) {
      store.update({ lifecycle: LIFECYCLE.READY });
    }
    if (hasStoreChanged) {
      const element = getElement(step.target);
      const elementExists = !!element;
      const hasRenderedTarget = elementExists && isElementVisible(element);
      if (hasRenderedTarget) {
        if (changedFrom("status", STATUS2.READY, STATUS2.RUNNING) || changedFrom("lifecycle", LIFECYCLE.INIT, LIFECYCLE.READY)) {
          callback({
            ...state,
            step,
            type: EVENTS.STEP_BEFORE
          });
        }
      } else {
        console.warn(elementExists ? "Target not visible" : "Target not mounted", step);
        callback({
          ...state,
          type: EVENTS.TARGET_NOT_FOUND,
          step
        });
        if (!controlled) {
          store.update({ index: index + (action === ACTIONS.PREV ? -1 : 1) });
        }
      }
    }
    if (changedFrom("lifecycle", LIFECYCLE.INIT, LIFECYCLE.READY)) {
      store.update({
        lifecycle: hideBeacon(step) || skipBeacon ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON
      });
    }
    if (changed("index")) {
      log2({
        title: `step:${lifecycle}`,
        data: [{ key: "props", value: this.props }],
        debug
      });
    }
    if (changed("lifecycle", LIFECYCLE.BEACON)) {
      callback({
        ...state,
        step,
        type: EVENTS.BEACON
      });
    }
    if (changed("lifecycle", LIFECYCLE.TOOLTIP)) {
      callback({
        ...state,
        step,
        type: EVENTS.TOOLTIP
      });
      if (shouldScroll2 && this.tooltip) {
        this.scope = new Scope(this.tooltip, { selector: "[data-action=primary]" });
        this.scope.setFocus();
      }
    }
    if (changedFrom("lifecycle", [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
      (_a9 = this.scope) == null ? void 0 : _a9.removeScope();
      store.cleanupPoppers();
    }
  }
  componentWillUnmount() {
    var _a9;
    (_a9 = this.scope) == null ? void 0 : _a9.removeScope();
  }
  get open() {
    const { lifecycle, step } = this.props;
    return hideBeacon(step) || lifecycle === LIFECYCLE.TOOLTIP;
  }
  render() {
    const { continuous, debug, index, nonce, shouldScroll: shouldScroll2, size, step } = this.props;
    const target = getElement(step.target);
    if (!validateStep(step) || !src_default.domElement(target)) {
      return null;
    }
    return React8.createElement("div", { key: `JoyrideStep-${index}`, className: "react-joyride__step" }, React8.createElement(
      ReactFloater,
      {
        ...step.floaterProps,
        component: this.renderTooltip,
        debug,
        getPopper: this.setPopper,
        id: `react-joyride-step-${index}`,
        open: this.open,
        placement: step.placement,
        target: step.target
      },
      React8.createElement(
        JoyrideBeacon,
        {
          beaconComponent: step.beaconComponent,
          continuous,
          index,
          isLastStep: index + 1 === size,
          locale: step.locale,
          nonce,
          onClickOrHover: this.handleClickHoverBeacon,
          shouldFocus: shouldScroll2,
          size,
          step,
          styles: step.styles
        }
      )
    ));
  }
}, __name(_a7, "JoyrideStep"), _a7);
var _a8;
var Joyride = (_a8 = class extends React9.Component {
  constructor(props) {
    super(props);
    __publicField(this, "helpers");
    __publicField(this, "store");
    __publicField(this, "callback", (data) => {
      const { callback } = this.props;
      if (src_default.function(callback)) {
        callback(data);
      }
    });
    __publicField(this, "handleKeyboard", (event) => {
      const { index, lifecycle } = this.state;
      const { steps } = this.props;
      const step = steps[index];
      if (lifecycle === LIFECYCLE.TOOLTIP) {
        if (event.code === "Escape" && step && !step.disableCloseOnEsc) {
          this.store.close("keyboard");
        }
      }
    });
    __publicField(this, "handleClickOverlay", () => {
      const { index } = this.state;
      const { steps } = this.props;
      const step = getMergedStep(this.props, steps[index]);
      if (!step.disableOverlayClose) {
        this.helpers.close("overlay");
      }
    });
    __publicField(this, "syncState", (state) => {
      this.setState(state);
    });
    const { debug, getHelpers, run = true, stepIndex } = props;
    this.store = createStore({
      ...props,
      controlled: run && src_default.number(stepIndex)
    });
    this.helpers = this.store.getHelpers();
    const { addListener } = this.store;
    log2({
      title: "init",
      data: [
        { key: "props", value: this.props },
        { key: "state", value: this.state }
      ],
      debug
    });
    addListener(this.syncState);
    if (getHelpers) {
      getHelpers(this.helpers);
    }
    this.state = this.store.getState();
  }
  componentDidMount() {
    if (!canUseDOM2()) {
      return;
    }
    const { debug, disableCloseOnEsc, run, steps } = this.props;
    const { start } = this.store;
    if (validateSteps(steps, debug) && run) {
      start();
    }
    if (!disableCloseOnEsc) {
      document.body.addEventListener("keydown", this.handleKeyboard, { passive: true });
    }
  }
  componentDidUpdate(previousProps, previousState) {
    if (!canUseDOM2()) {
      return;
    }
    const { action, controlled, index, status } = this.state;
    const { debug, run, stepIndex, steps } = this.props;
    const { stepIndex: previousStepIndex, steps: previousSteps } = previousProps;
    const { reset, setSteps, start, stop, update: update2 } = this.store;
    const { changed: changedProps } = treeChanges(previousProps, this.props);
    const { changed, changedFrom } = treeChanges(previousState, this.state);
    const step = getMergedStep(this.props, steps[index]);
    const stepsChanged = !equal(previousSteps, steps);
    const stepIndexChanged = src_default.number(stepIndex) && changedProps("stepIndex");
    const target = getElement(step.target);
    if (stepsChanged) {
      if (validateSteps(steps, debug)) {
        setSteps(steps);
      } else {
        console.warn("Steps are not valid", steps);
      }
    }
    if (changedProps("run")) {
      if (run) {
        start(stepIndex);
      } else {
        stop();
      }
    }
    if (stepIndexChanged) {
      let nextAction = src_default.number(previousStepIndex) && previousStepIndex < stepIndex ? ACTIONS.NEXT : ACTIONS.PREV;
      if (action === ACTIONS.STOP) {
        nextAction = ACTIONS.START;
      }
      if (![STATUS2.FINISHED, STATUS2.SKIPPED].includes(status)) {
        update2({
          action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : nextAction,
          index: stepIndex,
          lifecycle: LIFECYCLE.INIT
        });
      }
    }
    if (!controlled && status === STATUS2.RUNNING && index === 0 && !target) {
      this.store.update({ index: index + 1 });
      this.callback({
        ...this.state,
        type: EVENTS.TARGET_NOT_FOUND,
        step
      });
    }
    const callbackData = {
      ...this.state,
      index,
      step
    };
    const isAfterAction = changed("action", [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE
    ]);
    if (isAfterAction && changed("status", STATUS2.PAUSED)) {
      const previousStep = getMergedStep(this.props, steps[previousState.index]);
      this.callback({
        ...callbackData,
        index: previousState.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: previousStep,
        type: EVENTS.STEP_AFTER
      });
    }
    if (changed("status", [STATUS2.FINISHED, STATUS2.SKIPPED])) {
      const previousStep = getMergedStep(this.props, steps[previousState.index]);
      if (!controlled) {
        this.callback({
          ...callbackData,
          index: previousState.index,
          lifecycle: LIFECYCLE.COMPLETE,
          step: previousStep,
          type: EVENTS.STEP_AFTER
        });
      }
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_END,
        // Return the last step when the tour is finished
        step: previousStep,
        index: previousState.index
      });
      reset();
    } else if (changedFrom("status", [STATUS2.IDLE, STATUS2.READY], STATUS2.RUNNING)) {
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_START
      });
    } else if (changed("status") || changed("action", ACTIONS.RESET)) {
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_STATUS
      });
    }
    this.scrollToStep(previousState);
  }
  componentWillUnmount() {
    const { disableCloseOnEsc } = this.props;
    if (!disableCloseOnEsc) {
      document.body.removeEventListener("keydown", this.handleKeyboard);
    }
  }
  scrollToStep(previousState) {
    const { index, lifecycle, status } = this.state;
    const {
      debug,
      disableScrollParentFix = false,
      scrollDuration,
      scrollOffset = 20,
      scrollToFirstStep = false,
      steps
    } = this.props;
    const step = getMergedStep(this.props, steps[index]);
    const target = getElement(step.target);
    const shouldScrollToStep = shouldScroll({
      isFirstStep: index === 0,
      lifecycle,
      previousLifecycle: previousState.lifecycle,
      scrollToFirstStep,
      step,
      target
    });
    if (status === STATUS2.RUNNING && shouldScrollToStep) {
      const hasCustomScroll = hasCustomScrollParent(target, disableScrollParentFix);
      const scrollParent2 = getScrollParent2(target, disableScrollParentFix);
      let scrollY = Math.floor(getScrollTo(target, scrollOffset, disableScrollParentFix)) || 0;
      log2({
        title: "scrollToStep",
        data: [
          { key: "index", value: index },
          { key: "lifecycle", value: lifecycle },
          { key: "status", value: status }
        ],
        debug
      });
      const beaconPopper = this.store.getPopper("beacon");
      const tooltipPopper = this.store.getPopper("tooltip");
      if (lifecycle === LIFECYCLE.BEACON && beaconPopper) {
        const { offsets, placement } = beaconPopper;
        if (!["bottom"].includes(placement) && !hasCustomScroll) {
          scrollY = Math.floor(offsets.popper.top - scrollOffset);
        }
      } else if (lifecycle === LIFECYCLE.TOOLTIP && tooltipPopper) {
        const { flipped, offsets, placement } = tooltipPopper;
        if (["top", "right", "left"].includes(placement) && !flipped && !hasCustomScroll) {
          scrollY = Math.floor(offsets.popper.top - scrollOffset);
        } else {
          scrollY -= step.spotlightPadding;
        }
      }
      scrollY = scrollY >= 0 ? scrollY : 0;
      if (status === STATUS2.RUNNING) {
        scrollTo(scrollY, { element: scrollParent2, duration: scrollDuration }).then(
          () => {
            setTimeout(() => {
              var _a9;
              (_a9 = this.store.getPopper("tooltip")) == null ? void 0 : _a9.instance.update();
            }, 10);
          }
        );
      }
    }
  }
  render() {
    if (!canUseDOM2()) {
      return null;
    }
    const { index, lifecycle, status } = this.state;
    const {
      continuous = false,
      debug = false,
      nonce,
      scrollToFirstStep = false,
      steps
    } = this.props;
    const isRunning = status === STATUS2.RUNNING;
    const content = {};
    if (isRunning && steps[index]) {
      const step = getMergedStep(this.props, steps[index]);
      content.step = React9.createElement(
        JoyrideStep,
        {
          ...this.state,
          callback: this.callback,
          continuous,
          debug,
          helpers: this.helpers,
          nonce,
          shouldScroll: !step.disableScrolling && (index !== 0 || scrollToFirstStep),
          step,
          store: this.store
        }
      );
      content.overlay = React9.createElement(JoyridePortal, { id: "react-joyride-portal" }, React9.createElement(
        JoyrideOverlay,
        {
          ...step,
          continuous,
          debug,
          lifecycle,
          onClickOverlay: this.handleClickOverlay
        }
      ));
    }
    return React9.createElement("div", { className: "react-joyride" }, content.step, content.overlay);
  }
}, __name(_a8, "Joyride"), _a8);
__publicField(Joyride, "defaultProps", defaultProps);
var components_default = Joyride;

// src/features/GuidedTour/GuidedTour.tsx
import { useTheme } from "storybook/theming";

// src/features/GuidedTour/Tooltip.tsx
import React11, { useEffect as useEffect2 } from "react";
import { IconButton } from "storybook/internal/components";
import { CloseAltIcon } from "@storybook/icons";
import { color, styled as styled3 } from "storybook/theming";

// src/components/Button/Button.tsx
import React10, { forwardRef } from "react";
import { styled as styled2 } from "storybook/theming";
var StyledButton = styled2.button`
  all: unset;
  box-sizing: border-box;
  border: 0;
  border-radius: 0.25rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  background: ${({ theme: theme2, variant }) => {
  if (variant === "primary") {
    return theme2.color.secondary;
  }
  if (variant === "secondary") {
    return theme2.color.lighter;
  }
  if (variant === "outline") {
    return "transparent";
  }
  if (variant === "white") {
    return theme2.color.lightest;
  }
  return theme2.color.secondary;
}};
  color: ${({ theme: theme2, variant }) => {
  if (variant === "primary") {
    return theme2.color.lightest;
  }
  if (variant === "secondary") {
    return theme2.darkest;
  }
  if (variant === "outline") {
    return theme2.darkest;
  }
  if (variant === "white") {
    return theme2.color.secondary;
  }
  return theme2.color.lightest;
}};
  box-shadow: ${({ variant }) => {
  if (variant === "secondary") {
    return "#D9E8F2 0 0 0 1px inset";
  }
  if (variant === "outline") {
    return "#D9E8F2 0 0 0 1px inset";
  }
  return "none";
}};
  height: 32px;
  font-size: 0.8125rem;
  font-weight: 700;
  font-family: ${({ theme: theme2 }) => theme2.typography.fonts.base};
  transition: background-color, box-shadow, color, opacity;
  transition-duration: 0.16s;
  transition-timing-function: ease-in-out;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme: theme2, variant }) => {
  if (variant === "primary") {
    return "#0b94eb";
  }
  if (variant === "secondary") {
    return "#eef4f9";
  }
  if (variant === "outline") {
    return "transparent";
  }
  if (variant === "white") {
    return theme2.color.lightest;
  }
  return "#0b94eb";
}};
    color: ${({ theme: theme2, variant }) => {
  if (variant === "primary") {
    return theme2.color.lightest;
  }
  if (variant === "secondary") {
    return theme2.darkest;
  }
  if (variant === "outline") {
    return theme2.darkest;
  }
  if (variant === "white") {
    return theme2.color.darkest;
  }
  return theme2.color.lightest;
}};
  }

  &:focus {
    box-shadow: ${({ variant }) => {
  if (variant === "primary") {
    return "inset 0 0 0 1px rgba(0, 0, 0, 0.2)";
  }
  if (variant === "secondary") {
    return "inset 0 0 0 1px #0b94eb";
  }
  if (variant === "outline") {
    return "inset 0 0 0 1px #0b94eb";
  }
  if (variant === "white") {
    return "none";
  }
  return "inset 0 0 0 2px rgba(0, 0, 0, 0.1)";
}};
  }
`;
var Button = forwardRef(/* @__PURE__ */ __name(function Button2({ children, onClick, variant = "primary", ...rest }, ref) {
  return React10.createElement(StyledButton, { ref, onClick, variant, ...rest }, children);
}, "Button"));

// src/features/GuidedTour/Tooltip.tsx
var TooltipBody = styled3.div`
  padding: 15px;
  border-radius: 5px;
`;
var Wrapper2 = styled3.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
var TooltipHeader = styled3.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  margin: -5px -5px 5px 0;
`;
var TooltipTitle = styled3.div`
  line-height: 18px;
  font-weight: 700;
  font-size: 14px;
  margin: 5px 5px 5px 0;
`;
var TooltipContent = styled3.p`
  font-size: 14px;
  line-height: 18px;
  text-align: start;
  text-wrap: balance;
  margin: 0;
  margin-top: 5px;
`;
var TooltipFooter = styled3.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
`;
var Count = styled3.span`
  font-size: 13px;
`;
var Tooltip = /* @__PURE__ */ __name(({
  index,
  size,
  step,
  closeProps,
  primaryProps,
  tooltipProps
}) => {
  useEffect2(() => {
    const style = document.createElement("style");
    style.id = "#sb-onboarding-arrow-style";
    style.innerHTML = `
      .__floater__arrow { container-type: size; }
      .__floater__arrow span { background: ${color.secondary}; }
      .__floater__arrow span::before, .__floater__arrow span::after {
        content: '';
        display: block;
        width: 2px;
        height: 2px;
        background: ${color.secondary};
        box-shadow: 0 0 0 2px ${color.secondary};
        border-radius: 3px;
        flex: 0 0 2px;
      }
      @container (min-height: 1px) {
        .__floater__arrow span { flex-direction: column; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const styleElement = document.querySelector("#sb-onboarding-arrow-style");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
  return React11.createElement(TooltipBody, { ...tooltipProps, style: step.styles?.tooltip }, React11.createElement(Wrapper2, null, React11.createElement(TooltipHeader, null, step.title && React11.createElement(TooltipTitle, null, step.title), React11.createElement(IconButton, { ...closeProps, onClick: closeProps.onClick, variant: "solid" }, React11.createElement(CloseAltIcon, null))), React11.createElement(TooltipContent, null, step.content)), React11.createElement(TooltipFooter, { id: "buttonNext" }, React11.createElement(Count, null, index + 1, " of ", size), !step.hideNextButton && React11.createElement(
    Button,
    {
      ...primaryProps,
      onClick: step.onNextButtonClick || primaryProps.onClick,
      variant: "white"
    },
    index + 1 === size ? "Done" : "Next"
  )));
}, "Tooltip");

// src/features/GuidedTour/GuidedTour.tsx
function GuidedTour({
  step,
  steps,
  onClose,
  onComplete
}) {
  const [stepIndex, setStepIndex] = useState(null);
  const theme2 = useTheme();
  useEffect3(() => {
    let timeout;
    setStepIndex((current) => {
      const index = steps.findIndex(({ key }) => key === step);
      if (index === -1) {
        return null;
      }
      if (index === current) {
        return current;
      }
      timeout = setTimeout(setStepIndex, 500, index);
      return null;
    });
    return () => clearTimeout(timeout);
  }, [step, steps]);
  if (stepIndex === null) {
    return null;
  }
  return React12.createElement(
    components_default,
    {
      continuous: true,
      steps,
      stepIndex,
      spotlightPadding: 0,
      disableCloseOnEsc: true,
      disableOverlayClose: true,
      disableScrolling: true,
      callback: (data) => {
        if (data.action === ACTIONS.CLOSE) {
          onClose();
        }
        if (data.action === ACTIONS.NEXT && data.index === data.size - 1) {
          onComplete();
        }
      },
      floaterProps: {
        disableAnimation: true,
        styles: {
          arrow: {
            length: 20,
            spread: 2
          },
          floater: {
            filter: theme2.base === "light" ? "drop-shadow(0px 5px 5px rgba(0,0,0,0.05)) drop-shadow(0 1px 3px rgba(0,0,0,0.1))" : "drop-shadow(#fff5 0px 0px 0.5px) drop-shadow(#fff5 0px 0px 0.5px)"
          }
        }
      },
      tooltipComponent: Tooltip,
      styles: {
        overlay: {
          mixBlendMode: "unset",
          backgroundColor: steps[stepIndex]?.target === "body" ? "rgba(27, 28, 29, 0.2)" : "none"
        },
        spotlight: {
          backgroundColor: "none",
          border: `solid 2px ${theme2.color.secondary}`,
          boxShadow: "0px 0px 0px 9999px rgba(27, 28, 29, 0.2)"
        },
        tooltip: {
          width: 280,
          color: theme2.color.lightest,
          background: theme2.color.secondary
        },
        options: {
          zIndex: 9998,
          primaryColor: theme2.color.secondary,
          arrowColor: theme2.color.secondary
        }
      }
    }
  );
}
__name(GuidedTour, "GuidedTour");

// src/features/IntentSurvey/IntentSurvey.tsx
import React13, { useState as useState2 } from "react";
import { Button as Button3, Form, Modal } from "storybook/internal/components";
import { styled as styled4 } from "storybook/theming";

// ../../.storybook/isChromatic.ts
function isChromatic(windowArg) {
  const windowToCheck = windowArg || typeof window !== "undefined" && window;
  return !!(windowToCheck && (windowToCheck.navigator.userAgent.match(/Chromatic/) || windowToCheck.location.href.match(/chromatic=true/)));
}
__name(isChromatic, "isChromatic");

// src/features/IntentSurvey/IntentSurvey.tsx
var Content = styled4(Modal.Content)(({ theme: theme2 }) => ({
  fontSize: theme2.typography.size.s2,
  color: theme2.color.defaultText,
  gap: 8
}));
var Row = styled4.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  marginBottom: 8
});
var Question = styled4.div(({ theme: theme2 }) => ({
  marginTop: 8,
  marginBottom: 2,
  fontWeight: theme2.typography.weight.bold
}));
var Label = styled4.label({
  display: "flex",
  gap: 8,
  '&:has(input[type="checkbox"]:not(:disabled), input[type="radio"]:not(:disabled))': {
    cursor: "pointer"
  }
});
var Actions = styled4(Modal.Actions)({
  marginTop: 8
});
var Checkbox = styled4(Form.Checkbox)({
  margin: 2
});
var IntentSurvey = /* @__PURE__ */ __name(({
  onComplete,
  onDismiss
}) => {
  const [isSubmitting, setIsSubmitting] = useState2(false);
  const [formFields, setFormFields] = useState2({
    building: {
      label: "What are you building?",
      type: "checkbox",
      required: true,
      options: shuffleObject({
        "design-system": { label: "Design system" },
        "application-ui": { label: "Application UI" }
      }),
      values: {
        "design-system": false,
        "application-ui": false
      }
    },
    interest: {
      label: "Which of these are you interested in?",
      type: "checkbox",
      required: true,
      options: shuffleObject({
        "ui-documentation": { label: "Generating UI docs" },
        "functional-testing": { label: "Functional testing" },
        "accessibility-testing": { label: "Accessibility testing" },
        "visual-testing": { label: "Visual testing" },
        "ai-augmented-development": { label: "Building UI with AI" },
        "team-collaboration": { label: "Team collaboration" },
        "design-handoff": { label: "Design handoff" }
      }),
      values: {
        "ui-documentation": false,
        "functional-testing": false,
        "accessibility-testing": false,
        "visual-testing": false,
        "ai-augmented-development": false,
        "team-collaboration": false,
        "design-handoff": false
      }
    },
    referrer: {
      label: "How did you discover Storybook?",
      type: "select",
      required: true,
      options: shuffleObject({
        "we-use-it-at-work": { label: "We use it at work" },
        "via-friend-or-colleague": { label: "Via friend or colleague" },
        "via-social-media": { label: "Via social media" },
        youtube: { label: "YouTube" },
        "web-search": { label: "Web Search" },
        "ai-agent": { label: "AI Agent (e.g. ChatGPT)" }
      }),
      values: {
        "we-use-it-at-work": false,
        "via-friend-or-colleague": false,
        "via-social-media": false,
        youtube: false,
        "web-search": false,
        "ai-agent": false
      }
    }
  });
  const updateFormData = /* @__PURE__ */ __name((key, optionOrValue, value) => {
    const field = formFields[key];
    setFormFields((fields) => {
      if (field.type === "checkbox") {
        const values = { ...field.values, [optionOrValue]: !!value };
        return { ...fields, [key]: { ...field, values } };
      }
      if (field.type === "select") {
        const values = Object.fromEntries(
          Object.entries(field.values).map(([opt]) => [opt, opt === optionOrValue])
        );
        return { ...fields, [key]: { ...field, values } };
      }
      return fields;
    });
  }, "updateFormData");
  const isValid = Object.values(formFields).every((field) => {
    if (!field.required) {
      return true;
    }
    return Object.values(field.values).some((value) => value === true);
  });
  const onSubmitForm = /* @__PURE__ */ __name((e2) => {
    if (!isValid) {
      return;
    }
    e2.preventDefault();
    setIsSubmitting(true);
    onComplete(
      Object.fromEntries(Object.entries(formFields).map(([key, field]) => [key, field.values]))
    );
  }, "onSubmitForm");
  return React13.createElement(Modal, { defaultOpen: true, width: 420, onEscapeKeyDown: onDismiss }, React13.createElement(Form, { onSubmit: onSubmitForm, id: "intent-survey-form" }, React13.createElement(Content, null, React13.createElement(Modal.Header, null, React13.createElement(Modal.Title, null, "Help improve Storybook")), Object.keys(formFields).map((key) => {
    const field = formFields[key];
    return React13.createElement(React13.Fragment, { key }, React13.createElement(Question, null, field.label), field.type === "checkbox" && React13.createElement(Row, null, Object.entries(field.options).map(([opt, option]) => {
      const id = `${key}:${opt}`;
      return React13.createElement("div", { key: id }, React13.createElement(Label, { htmlFor: id }, React13.createElement(
        Checkbox,
        {
          name: id,
          id,
          checked: field.values[opt],
          disabled: isSubmitting,
          onChange: (e2) => updateFormData(key, opt, e2.target.checked)
        }
      ), option.label));
    })), field.type === "select" && React13.createElement(
      Form.Select,
      {
        name: key,
        id: key,
        value: Object.entries(field.values).find(([, isSelected]) => isSelected)?.[0] || "",
        required: field.required,
        disabled: isSubmitting,
        onChange: (e2) => updateFormData(key, e2.target.value)
      },
      React13.createElement("option", { disabled: true, hidden: true, value: "" }, "Select an option..."),
      Object.entries(field.options).map(([opt, option]) => React13.createElement("option", { key: opt, value: opt }, option.label))
    ));
  }), React13.createElement(Actions, null, React13.createElement(Button3, { disabled: isSubmitting || !isValid, size: "medium", type: "submit", variant: "solid" }, "Submit")))));
}, "IntentSurvey");
function shuffle(array) {
  for (let i2 = array.length - 1; i2 > 0; i2--) {
    const j = Math.floor(Math.random() * (i2 + 1));
    [array[i2], array[j]] = [array[j], array[i2]];
  }
  return array;
}
__name(shuffle, "shuffle");
function shuffleObject(object) {
  return isChromatic() ? object : Object.fromEntries(shuffle(Object.entries(object)));
}
__name(shuffleObject, "shuffleObject");

// src/features/SplashScreen/SplashScreen.tsx
import React14, { useCallback, useEffect as useEffect4, useState as useState3 } from "react";
import { ArrowRightIcon } from "@storybook/icons";
import { keyframes, styled as styled5 } from "storybook/theming";
var fadeIn = keyframes({
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
});
var slideIn = keyframes({
  from: {
    transform: "translate(0, 20px)",
    opacity: 0
  },
  to: {
    transform: "translate(0, 0)",
    opacity: 1
  }
});
var scaleIn = keyframes({
  from: {
    opacity: 0,
    transform: "scale(0.8)"
  },
  to: {
    opacity: 1,
    transform: "scale(1)"
  }
});
var rotate = keyframes({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
var Wrapper3 = styled5.div(({ visible }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  opacity: visible ? 1 : 0,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1e3,
  transition: "opacity 1s 0.5s"
}));
var Backdrop = styled5.div({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  animation: `${fadeIn} 2s`,
  background: `
    radial-gradient(90% 90%, #ff4785 0%, #db5698 30%, #1ea7fdcc 100%),
    radial-gradient(circle, #ff4785 0%, transparent 80%),
    radial-gradient(circle at 30% 40%, #fc521f99 0%, #fc521f66 20%, transparent 40%),
    radial-gradient(circle at 75% 75%, #fc521f99 0%, #fc521f77 18%, transparent 30%)`,
  "&::before": {
    opacity: 0.5,
    background: `
      radial-gradient(circle at 30% 40%, #fc521f99 0%, #fc521f66 10%, transparent 20%),
      radial-gradient(circle at 75% 75%, #fc521f99 0%, #fc521f77 8%, transparent 20%)`,
    content: '""',
    position: "absolute",
    top: "-50vw",
    left: "-50vh",
    transform: "translate(-50%, -50%)",
    width: "calc(100vw + 100vh)",
    height: "calc(100vw + 100vh)",
    animation: `${rotate} 12s linear infinite`
  }
});
var Content2 = styled5.div(({ visible }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  textAlign: "center",
  width: "90vw",
  minWidth: 290,
  maxWidth: 410,
  opacity: visible ? 1 : 0,
  transition: "opacity 0.5s",
  h1: {
    fontSize: 45,
    fontWeight: "bold",
    animation: `${slideIn} 1.5s 1s backwards`
  }
}));
var Features = styled5.div({
  display: "flex",
  marginTop: 40,
  div: {
    display: "flex",
    flexBasis: "33.33%",
    flexDirection: "column",
    alignItems: "center",
    animation: `${slideIn} 1s backwards`,
    "&:nth-child(1)": {
      animationDelay: "2s"
    },
    "&:nth-child(2)": {
      animationDelay: "2.5s"
    },
    "&:nth-child(3)": {
      animationDelay: "3s"
    }
  },
  svg: {
    marginBottom: 10
  }
});
var RadialButton = styled5.button({
  display: "inline-flex",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 40,
  width: 48,
  height: 48,
  padding: 0,
  borderRadius: "50%",
  border: 0,
  outline: "none",
  background: "rgba(255, 255, 255, 0.3)",
  cursor: "pointer",
  transition: "background 0.2s",
  animation: `${scaleIn} 1.5s 4s backwards`,
  "&:hover, &:focus": {
    background: "rgba(255, 255, 255, 0.4)"
  }
});
var ArrowIcon = styled5(ArrowRightIcon)({
  width: 30,
  color: "white"
});
var ProgressCircle = styled5.svg(({ progress }) => ({
  position: "absolute",
  top: -1,
  left: -1,
  width: `50px!important`,
  height: `50px!important`,
  transform: "rotate(-90deg)",
  color: "white",
  circle: {
    r: "24",
    cx: "25",
    cy: "25",
    fill: "transparent",
    stroke: progress ? "currentColor" : "transparent",
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeDasharray: Math.PI * 48
  }
}));
var SplashScreen = /* @__PURE__ */ __name(({ onDismiss, duration = 6e3 }) => {
  const [progress, setProgress] = useState3(-4e3 * 100 / duration);
  const [visible, setVisible] = useState3(true);
  const ready = progress >= 100;
  const dismiss = useCallback(() => {
    setVisible(false);
    const timeout = setTimeout(onDismiss, 1500);
    return () => clearTimeout(timeout);
  }, [onDismiss]);
  useEffect4(() => {
    if (!duration) {
      return;
    }
    const framelength = 1e3 / 50;
    const increment = 100 / (duration / framelength);
    const interval = setInterval(() => setProgress((prev) => prev + increment), framelength);
    return () => clearInterval(interval);
  }, [duration]);
  useEffect4(() => {
    if (ready) {
      dismiss();
    }
  }, [ready, dismiss]);
  return React14.createElement(Wrapper3, { visible }, React14.createElement(Backdrop, null), React14.createElement(Content2, { visible }, React14.createElement("h1", null, "Meet your new frontend workshop"), React14.createElement(Features, null, React14.createElement("div", null, React14.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "33", height: "32" }, React14.createElement(
    "path",
    {
      d: "M4.06 0H32.5v28.44h-3.56V32H.5V3.56h3.56V0Zm21.33 7.11H4.06v21.33h21.33V7.11Z",
      fill: "currentColor"
    }
  )), "Development"), React14.createElement("div", null, React14.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "32", height: "32" }, React14.createElement(
    "path",
    {
      d: "M15.95 32c-1.85 0-3.1-1.55-3.1-3.54 0-1.1.45-2.78 1.35-5.03.9-2.3 1.35-4.51 1.35-6.81a22.21 22.21 0 0 0-5.1 3.67c-2.5 2.47-4.95 4.9-7.55 4.9-1.6 0-2.9-1.1-2.9-2.43 0-1.46 1.35-2.91 4.3-3.62 1.45-.36 3.1-.75 4.95-1.06 1.8-.31 3.8-1.02 5.9-2.08a23.77 23.77 0 0 0-6.1-2.12C5.3 13.18 2.3 12.6 1 11.28.35 10.6 0 9.9 0 9.14 0 7.82 1.2 6.8 2.95 6.8c2.65 0 5.75 3.1 7.95 5.3 1.1 1.1 2.65 2.21 4.65 3.27v-.57c0-1.77-.15-3.23-.55-4.3-.8-2.11-2.05-5.43-2.05-6.97 0-2.04 1.3-3.54 3.1-3.54 1.75 0 3.1 1.41 3.1 3.54 0 1.06-.45 2.78-1.35 5.12-.9 2.35-1.35 4.6-1.35 6.72 2.85-1.59 2.5-1.41 4.95-3.5 2.35-2.29 4-3.7 4.9-4.23.95-.58 1.9-.84 2.9-.84 1.6 0 2.8.97 2.8 2.34 0 1.5-1.25 2.78-4.15 3.62-1.4.4-3.05.75-4.9 1.1-1.9.36-3.9 1.07-6.1 2.13a23.3 23.3 0 0 0 5.95 2.08c3.65.7 6.75 1.32 8.15 2.6.7.67 1.05 1.33 1.05 2.08 0 1.33-1.2 2.43-2.95 2.43-2.95 0-6.75-4.15-8.2-5.61-.7-.7-2.2-1.72-4.4-2.96v.57c0 1.9.45 4.03 1.3 6.32.85 2.3 1.3 3.94 1.3 4.95 0 2.08-1.35 3.54-3.1 3.54Z",
      fill: "currentColor"
    }
  )), "Testing"), React14.createElement("div", null, React14.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "33", height: "32" }, React14.createElement(
    "path",
    {
      d: "M.5 16a16 16 0 1 1 32 0 16 16 0 0 1-32 0Zm16 12.44A12.44 12.44 0 0 1 4.3 13.53a8 8 0 1 0 9.73-9.73 12.44 12.44 0 1 1 2.47 24.64ZM12.06 16a4.44 4.44 0 1 1 0-8.89 4.44 4.44 0 0 1 0 8.89Z",
      fill: "currentColor",
      fillRule: "evenodd"
    }
  )), "Documentation")), React14.createElement(RadialButton, { onClick: dismiss }, React14.createElement(ArrowIcon, null), React14.createElement(ProgressCircle, { xmlns: "http://www.w3.org/2000/svg" }, React14.createElement("circle", null)), React14.createElement(ProgressCircle, { xmlns: "http://www.w3.org/2000/svg", progress: true }, React14.createElement(
    "circle",
    {
      strokeDashoffset: Math.PI * 48 * (1 - Math.max(0, Math.min(progress, 100)) / 100)
    }
  )))));
}, "SplashScreen");

// src/Onboarding.tsx
var SpanHighlight = styled6.span(({ theme: theme2 }) => ({
  display: "inline-flex",
  borderRadius: 3,
  padding: "0 5px",
  marginBottom: -2,
  opacity: 0.8,
  fontFamily: theme2.typography.fonts.mono,
  fontSize: 11,
  border: theme2.base === "dark" ? theme2.color.darkest : theme2.color.lightest,
  color: theme2.base === "dark" ? theme2.color.lightest : theme2.color.darkest,
  backgroundColor: theme2.base === "dark" ? "black" : theme2.color.light,
  boxSizing: "border-box",
  lineHeight: "17px"
}));
var CodeWrapper = styled6.div(({ theme: theme2 }) => ({
  background: theme2.background.content,
  borderRadius: 3,
  marginTop: 15,
  padding: 10,
  fontSize: theme2.typography.size.s1,
  ".linenumber": {
    opacity: 0.5
  }
}));
var theme = convert();
function Onboarding({ api }) {
  const [enabled, setEnabled] = useState4(true);
  const [showConfetti, setShowConfetti] = useState4(false);
  const [step, setStep] = useState4("1:Intro");
  const [primaryControl, setPrimaryControl] = useState4();
  const [saveFromControls, setSaveFromControls] = useState4();
  const [createNewStoryForm, setCreateNewStoryForm] = useState4();
  const [createdStory, setCreatedStory] = useState4();
  const userAgent = globalThis?.navigator?.userAgent;
  const selectStory = useCallback2(
    (storyId) => {
      try {
        const { id, refId } = api.getCurrentStoryData() || {};
        if (id !== storyId || refId !== void 0) {
          api.selectStory(storyId);
        }
      } catch (e2) {
      }
    },
    [api]
  );
  const disableOnboarding = useCallback2(() => {
    const url = new URL(window.location.href);
    const path = decodeURIComponent(url.searchParams.get("path"));
    url.search = `?path=${path}&onboarding=false`;
    history.replaceState({}, "", url.href);
    api.setQueryParams({ onboarding: "false" });
    setEnabled(false);
  }, [api, setEnabled]);
  const completeOnboarding = useCallback2(
    (answers) => {
      api.emit(STORYBOOK_ADDON_ONBOARDING_CHANNEL, {
        step: "7:FinishedOnboarding",
        type: "telemetry",
        userAgent
      });
      api.emit(STORYBOOK_ADDON_ONBOARDING_CHANNEL, {
        answers,
        type: "survey",
        userAgent
      });
      selectStory("configure-your-project--docs");
      disableOnboarding();
    },
    [api, selectStory, disableOnboarding, userAgent]
  );
  useEffect5(() => {
    api.setQueryParams({ onboarding: "true" });
    selectStory("example-button--primary");
    api.togglePanel(true);
    api.togglePanelPosition("bottom");
    api.setSelectedPanel(ADDON_CONTROLS_ID);
  }, [api, selectStory]);
  useEffect5(() => {
    const observer = new MutationObserver(() => {
      setPrimaryControl(document.getElementById("control-primary"));
      setSaveFromControls(document.getElementById("save-from-controls"));
      setCreateNewStoryForm(document.getElementById("create-new-story-form"));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  useEffect5(() => {
    setStep((current) => {
      if (["1:Intro", "5:StoryCreated", "6:IntentSurvey", "7:FinishedOnboarding"].includes(current)) {
        return current;
      }
      if (createNewStoryForm) {
        return "4:CreateStory";
      }
      if (saveFromControls) {
        return "3:SaveFromControls";
      }
      if (primaryControl) {
        return "2:Controls";
      }
      return "1:Intro";
    });
  }, [createNewStoryForm, primaryControl, saveFromControls]);
  useEffect5(() => {
    return api.on(SAVE_STORY_RESPONSE, ({ payload, success }) => {
      if (!success || !payload?.newStoryName) {
        return;
      }
      setCreatedStory(payload);
      setShowConfetti(true);
      setStep("5:StoryCreated");
      setTimeout(() => api.clearNotification("save-story-success"));
      setTimeout(() => setShowConfetti(false), 1e4);
    });
  }, [api]);
  useEffect5(
    () => api.emit(STORYBOOK_ADDON_ONBOARDING_CHANNEL, { step, type: "telemetry", userAgent }),
    [api, step, userAgent]
  );
  if (!enabled) {
    return null;
  }
  const source = createdStory?.sourceFileContent;
  const startIndex = source?.lastIndexOf(`export const ${createdStory?.newStoryExportName}`);
  const snippet = source?.slice(startIndex).trim();
  const startingLineNumber = source?.slice(0, startIndex).split("\n").length;
  const steps = [
    {
      key: "2:Controls",
      target: "#control-primary",
      title: "Interactive story playground",
      content: React15.createElement(React15.Fragment, null, "See how a story renders with different data and state without touching code. Try it out by toggling this button.", React15.createElement(HighlightElement, { targetSelector: "#control-primary", pulsating: true })),
      offset: 20,
      placement: "right",
      disableBeacon: true,
      disableOverlay: true,
      spotlightClicks: true,
      onNextButtonClick: /* @__PURE__ */ __name(() => {
        const input = document.querySelector("#control-primary");
        input.click();
      }, "onNextButtonClick")
    },
    {
      key: "3:SaveFromControls",
      target: 'button[aria-label="Create new story with these settings"]',
      title: "Save your changes as a new story",
      content: React15.createElement(React15.Fragment, null, "Great! Storybook stories represent the key states of each of your components. After modifying a story, you can save your changes from here or reset it.", React15.createElement(HighlightElement, { targetSelector: "button[aria-label='Create new story with these settings']" })),
      offset: 6,
      placement: "top",
      disableBeacon: true,
      disableOverlay: true,
      spotlightClicks: true,
      onNextButtonClick: /* @__PURE__ */ __name(() => {
        const button = document.querySelector(
          'button[aria-label="Create new story with these settings"]'
        );
        button.click();
      }, "onNextButtonClick"),
      styles: {
        tooltip: {
          width: 400
        }
      }
    },
    {
      key: "5:StoryCreated",
      target: '#storybook-explorer-tree [data-selected="true"]',
      title: "You just added your first story!",
      content: React15.createElement(React15.Fragment, null, "Well done! You just created your first story from the Storybook manager. This automatically added a few lines of code in", " ", React15.createElement(SpanHighlight, null, createdStory?.sourceFileName), ".", snippet && React15.createElement(ThemeProvider, { theme: convert(themes.dark) }, React15.createElement(CodeWrapper, null, React15.createElement(
        SyntaxHighlighter,
        {
          language: "jsx",
          showLineNumbers: true,
          startingLineNumber
        },
        snippet
      )))),
      offset: 12,
      placement: "right",
      disableBeacon: true,
      disableOverlay: true,
      styles: {
        tooltip: {
          width: 400
        }
      }
    }
  ];
  return React15.createElement(ThemeProvider, { theme }, showConfetti && React15.createElement(Confetti, null), step === "1:Intro" ? React15.createElement(SplashScreen, { onDismiss: () => setStep("2:Controls") }) : step === "6:IntentSurvey" ? React15.createElement(IntentSurvey, { onComplete: completeOnboarding, onDismiss: disableOnboarding }) : React15.createElement(
    GuidedTour,
    {
      step,
      steps,
      onClose: disableOnboarding,
      onComplete: () => setStep("6:IntentSurvey")
    }
  ));
}
__name(Onboarding, "Onboarding");
export {
  Onboarding as default
};
