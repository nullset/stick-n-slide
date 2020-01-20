(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  /**
   * Copyright 2004-present Facebook. All Rights Reserved.
   *
   * @providesModule UserAgent_DEPRECATED
   */

  /**
   *  Provides entirely client-side User Agent and OS detection. You should prefer
   *  the non-deprecated UserAgent module when possible, which exposes our
   *  authoritative server-side PHP-based detection to the client.
   *
   *  Usage is straightforward:
   *
   *    if (UserAgent_DEPRECATED.ie()) {
   *      //  IE
   *    }
   *
   *  You can also do version checks:
   *
   *    if (UserAgent_DEPRECATED.ie() >= 7) {
   *      //  IE7 or better
   *    }
   *
   *  The browser functions will return NaN if the browser does not match, so
   *  you can also do version compares the other way:
   *
   *    if (UserAgent_DEPRECATED.ie() < 7) {
   *      //  IE6 or worse
   *    }
   *
   *  Note that the version is a float and may include a minor version number,
   *  so you should always use range operators to perform comparisons, not
   *  strict equality.
   *
   *  **Note:** You should **strongly** prefer capability detection to browser
   *  version detection where it's reasonable:
   *
   *    http://www.quirksmode.org/js/support.html
   *
   *  Further, we have a large number of mature wrapper functions and classes
   *  which abstract away many browser irregularities. Check the documentation,
   *  grep for things, or ask on javascript@lists.facebook.com before writing yet
   *  another copy of "event || window.event".
   *
   */
  var _populated = false; // Browsers

  var _ie, _firefox, _opera, _webkit, _chrome; // Actual IE browser for compatibility mode


  var _ie_real_version; // Platforms


  var _osx, _windows, _linux, _android; // Architectures


  var _win64; // Devices


  var _iphone, _ipad, _native;

  var _mobile;

  function _populate() {
    if (_populated) {
      return;
    }

    _populated = true; // To work around buggy JS libraries that can't handle multi-digit
    // version numbers, Opera 10's user agent string claims it's Opera
    // 9, then later includes a Version/X.Y field:
    //
    // Opera/9.80 (foo) Presto/2.2.15 Version/10.10

    var uas = navigator.userAgent;
    var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
    var os = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);
    _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
    _ipad = /\b(iP[ao]d)/.exec(uas);
    _android = /Android/i.exec(uas);
    _native = /FBAN\/\w+;/i.exec(uas);
    _mobile = /Mobile/i.exec(uas); // Note that the IE team blog would have you believe you should be checking
    // for 'Win64; x64'.  But MSDN then reveals that you can actually be coming
    // from either x64 or ia64;  so ultimately, you should just check for Win64
    // as in indicator of whether you're in 64-bit IE.  32-bit IE on 64-bit
    // Windows will send 'WOW64' instead.

    _win64 = !!/Win64/.exec(uas);

    if (agent) {
      _ie = agent[1] ? parseFloat(agent[1]) : agent[5] ? parseFloat(agent[5]) : NaN; // IE compatibility mode

      if (_ie && document && document.documentMode) {
        _ie = document.documentMode;
      } // grab the "true" ie version from the trident token if available


      var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
      _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;
      _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
      _opera = agent[3] ? parseFloat(agent[3]) : NaN;
      _webkit = agent[4] ? parseFloat(agent[4]) : NaN;

      if (_webkit) {
        // We do not add the regexp to the above test, because it will always
        // match 'safari' only since 'AppleWebKit' appears before 'Chrome' in
        // the userAgent string.
        agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
        _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
      } else {
        _chrome = NaN;
      }
    } else {
      _ie = _firefox = _opera = _chrome = _webkit = NaN;
    }

    if (os) {
      if (os[1]) {
        // Detect OS X version.  If no version number matches, set _osx to true.
        // Version examples:  10, 10_6_1, 10.7
        // Parses version number as a float, taking only first two sets of
        // digits.  If only one set of digits is found, returns just the major
        // version number.
        var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);
        _osx = ver ? parseFloat(ver[1].replace('_', '.')) : true;
      } else {
        _osx = false;
      }

      _windows = !!os[2];
      _linux = !!os[3];
    } else {
      _osx = _windows = _linux = false;
    }
  }

  var UserAgent_DEPRECATED = {
    /**
     *  Check if the UA is Internet Explorer.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    ie: function ie() {
      return _populate() || _ie;
    },

    /**
     * Check if we're in Internet Explorer compatibility mode.
     *
     * @return bool true if in compatibility mode, false if
     * not compatibility mode or not ie
     */
    ieCompatibilityMode: function ieCompatibilityMode() {
      return _populate() || _ie_real_version > _ie;
    },

    /**
     * Whether the browser is 64-bit IE.  Really, this is kind of weak sauce;  we
     * only need this because Skype can't handle 64-bit IE yet.  We need to remove
     * this when we don't need it -- tracked by #601957.
     */
    ie64: function ie64() {
      return UserAgent_DEPRECATED.ie() && _win64;
    },

    /**
     *  Check if the UA is Firefox.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    firefox: function firefox() {
      return _populate() || _firefox;
    },

    /**
     *  Check if the UA is Opera.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    opera: function opera() {
      return _populate() || _opera;
    },

    /**
     *  Check if the UA is WebKit.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    webkit: function webkit() {
      return _populate() || _webkit;
    },

    /**
     *  For Push
     *  WILL BE REMOVED VERY SOON. Use UserAgent_DEPRECATED.webkit
     */
    safari: function safari() {
      return UserAgent_DEPRECATED.webkit();
    },

    /**
     *  Check if the UA is a Chrome browser.
     *
     *
     *  @return float|NaN Version number (if match) or NaN.
     */
    chrome: function chrome() {
      return _populate() || _chrome;
    },

    /**
     *  Check if the user is running Windows.
     *
     *  @return bool `true' if the user's OS is Windows.
     */
    windows: function windows() {
      return _populate() || _windows;
    },

    /**
     *  Check if the user is running Mac OS X.
     *
     *  @return float|bool   Returns a float if a version number is detected,
     *                       otherwise true/false.
     */
    osx: function osx() {
      return _populate() || _osx;
    },

    /**
     * Check if the user is running Linux.
     *
     * @return bool `true' if the user's OS is some flavor of Linux.
     */
    linux: function linux() {
      return _populate() || _linux;
    },

    /**
     * Check if the user is running on an iPhone or iPod platform.
     *
     * @return bool `true' if the user is running some flavor of the
     *    iPhone OS.
     */
    iphone: function iphone() {
      return _populate() || _iphone;
    },
    mobile: function mobile() {
      return _populate() || _iphone || _ipad || _android || _mobile;
    },
    nativeApp: function nativeApp() {
      // webviews inside of the native apps
      return _populate() || _native;
    },
    android: function android() {
      return _populate() || _android;
    },
    ipad: function ipad() {
      return _populate() || _ipad;
    }
  };
  var UserAgent_DEPRECATED_1 = UserAgent_DEPRECATED;

  /**
   * Copyright (c) 2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ExecutionEnvironment
   */

  var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
  /**
   * Simple, lightweight module assisting with the detection and context of
   * Worker. Helps avoid circular dependencies and allows code to reason about
   * whether or not they are in a Worker, even if they never include the main
   * `ReactWorker` dependency.
   */

  var ExecutionEnvironment = {
    canUseDOM: canUseDOM,
    canUseWorkers: typeof Worker !== 'undefined',
    canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
    canUseViewport: canUseDOM && !!window.screen,
    isInWorker: !canUseDOM // For now, this is true - might change in the future.

  };
  var ExecutionEnvironment_1 = ExecutionEnvironment;

  var useHasFeature;

  if (ExecutionEnvironment_1.canUseDOM) {
    useHasFeature = document.implementation && document.implementation.hasFeature && // always returns true in newer browsers as per the standard.
    // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
    document.implementation.hasFeature('', '') !== true;
  }
  /**
   * Checks if an event is supported in the current execution environment.
   *
   * NOTE: This will not work correctly for non-generic events such as `change`,
   * `reset`, `load`, `error`, and `select`.
   *
   * Borrows from Modernizr.
   *
   * @param {string} eventNameSuffix Event name, e.g. "click".
   * @param {?boolean} capture Check if the capture phase is supported.
   * @return {boolean} True if the event is supported.
   * @internal
   * @license Modernizr 3.0.0pre (Custom Build) | MIT
   */


  function isEventSupported(eventNameSuffix, capture) {
    if (!ExecutionEnvironment_1.canUseDOM || capture && !('addEventListener' in document)) {
      return false;
    }

    var eventName = 'on' + eventNameSuffix;
    var isSupported = eventName in document;

    if (!isSupported) {
      var element = document.createElement('div');
      element.setAttribute(eventName, 'return;');
      isSupported = typeof element[eventName] === 'function';
    }

    if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
      // This is the only way to test support for the `wheel` event in IE9+.
      isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
    }

    return isSupported;
  }

  var isEventSupported_1 = isEventSupported;

  var PIXEL_STEP = 10;
  var LINE_HEIGHT = 40;
  var PAGE_HEIGHT = 800;
  /**
   * Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
   * complicated, thus this doc is long and (hopefully) detailed enough to answer
   * your questions.
   *
   * If you need to react to the mouse wheel in a predictable way, this code is
   * like your bestest friend. * hugs *
   *
   * As of today, there are 4 DOM event types you can listen to:
   *
   *   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
   *   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
   *   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
   *   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
   *
   * So what to do?  The is the best:
   *
   *   normalizeWheel.getEventType();
   *
   * In your event callback, use this code to get sane interpretation of the
   * deltas.  This code will return an object with properties:
   *
   *   spinX   -- normalized spin speed (use for zoom) - x plane
   *   spinY   -- " - y plane
   *   pixelX  -- normalized distance (to pixels) - x plane
   *   pixelY  -- " - y plane
   *
   * Wheel values are provided by the browser assuming you are using the wheel to
   * scroll a web page by a number of lines or pixels (or pages).  Values can vary
   * significantly on different platforms and browsers, forgetting that you can
   * scroll at different speeds.  Some devices (like trackpads) emit more events
   * at smaller increments with fine granularity, and some emit massive jumps with
   * linear speed or acceleration.
   *
   * This code does its best to normalize the deltas for you:
   *
   *   - spin is trying to normalize how far the wheel was spun (or trackpad
   *     dragged).  This is super useful for zoom support where you want to
   *     throw away the chunky scroll steps on the PC and make those equal to
   *     the slow and smooth tiny steps on the Mac. Key data: This code tries to
   *     resolve a single slow step on a wheel to 1.
   *
   *   - pixel is normalizing the desired scroll delta in pixel units.  You'll
   *     get the crazy differences between browsers, but at least it'll be in
   *     pixels!
   *
   *   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
   *     should translate to positive value zooming IN, negative zooming OUT.
   *     This matches the newer 'wheel' event.
   *
   * Why are there spinX, spinY (or pixels)?
   *
   *   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
   *     with a mouse.  It results in side-scrolling in the browser by default.
   *
   *   - spinY is what you expect -- it's the classic axis of a mouse wheel.
   *
   *   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
   *     probably is by browsers in conjunction with fancy 3D controllers .. but
   *     you know.
   *
   * Implementation info:
   *
   * Examples of 'wheel' event if you scroll slowly (down) by one step with an
   * average mouse:
   *
   *   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
   *   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
   *   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
   *   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
   *   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
   *
   * On the trackpad:
   *
   *   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
   *   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
   *
   * On other/older browsers.. it's more complicated as there can be multiple and
   * also missing delta values.
   *
   * The 'wheel' event is more standard:
   *
   * http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
   *
   * The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
   * deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
   * backward compatibility with older events.  Those other values help us
   * better normalize spin speed.  Example of what the browsers provide:
   *
   *                          | event.wheelDelta | event.detail
   *        ------------------+------------------+--------------
   *          Safari v5/OS X  |       -120       |       0
   *          Safari v5/Win7  |       -120       |       0
   *         Chrome v17/OS X  |       -120       |       0
   *         Chrome v17/Win7  |       -120       |       0
   *                IE9/Win7  |       -120       |   undefined
   *         Firefox v4/OS X  |     undefined    |       1
   *         Firefox v4/Win7  |     undefined    |       3
   *
   */

  function normalizeWheel(
  /*object*/
  event)
  /*object*/
  {
    var sX = 0,
        sY = 0,
        // spinX, spinY
    pX = 0,
        pY = 0; // pixelX, pixelY
    // Legacy

    if ('detail' in event) {
      sY = event.detail;
    }

    if ('wheelDelta' in event) {
      sY = -event.wheelDelta / 120;
    }

    if ('wheelDeltaY' in event) {
      sY = -event.wheelDeltaY / 120;
    }

    if ('wheelDeltaX' in event) {
      sX = -event.wheelDeltaX / 120;
    } // side scrolling on FF with DOMMouseScroll


    if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in event) {
      pY = event.deltaY;
    }

    if ('deltaX' in event) {
      pX = event.deltaX;
    }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode == 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    } // Fall-back if spin cannot be determined


    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }

    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }
  /**
   * The best combination if you prefer spinX + spinY normalization.  It favors
   * the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
   * 'wheel' event, making spin speed determination impossible.
   */


  normalizeWheel.getEventType = function ()
  /*string*/
  {
    return UserAgent_DEPRECATED_1.firefox() ? 'DOMMouseScroll' : isEventSupported_1('wheel') ? 'wheel' : 'mousewheel';
  };

  var normalizeWheel_1 = normalizeWheel;

  var normalizeWheel$1 = normalizeWheel_1;

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "@charset \"UTF-8\";\ntable.sns {\n  box-sizing: border-box;\n}\ntable.sns * {\n  box-sizing: border-box;\n}\ntable.sns tbody:first-child {\n  /* If a table does *not* start with a <thead>, ensure that cells within the <tbody> secondary <tr> do not have a top border. */\n}\ntable.sns tbody:first-child tr:not(:first-child) th,\ntable.sns tbody:first-child tr:not(:first-child) td {\n  border-top-width: 0;\n}\ntable.sns thead *[class*=sns--is-stuck],\ntable.sns tbody *[class*=sns--is-stuck] {\n  position: relative;\n  transition: box-shadow 0.1s;\n  /*\n    Add a zero-width space character to any empty stuck element. This prevents an issue in IE where\n    cells with no content are collapsed.\n  */\n  /*\n    Because transform removes our <th> from the normal flow of the page, it loses its top and bottom borders\n    (as, from the rendering engine perspective, it is no longer a part of the table).\n    We need to add these borders back via some css generated elements.\n  */\n  /*\n    Elements like input, select, textarea, button can be rendered by tho OS rather than the browser.\n    Because of this, clicking on these elements once they have been \"translated\" via translate()\n    can become impossible. By positioning them and adding a z-index, we force the browser to handle rendering\n    which fixes the issue.\n  */\n}\ntable.sns thead *[class*=sns--is-stuck]:empty:after,\ntable.sns tbody *[class*=sns--is-stuck]:empty:after {\n  content: \"​\";\n}\ntable.sns thead *[class*=sns--is-stuck]:not(.sns__placeholder-cell) b,\ntable.sns tbody *[class*=sns--is-stuck]:not(.sns__placeholder-cell) b {\n  position: relative;\n  z-index: 1;\n}\ntable.sns thead *[class*=sns--is-stuck]:not(.sns__placeholder-cell):before,\ntable.sns tbody *[class*=sns--is-stuck]:not(.sns__placeholder-cell):before {\n  content: \"\";\n  position: absolute;\n  border: inherit;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: inherit;\n  transition: box-shadow 0.1s;\n  box-shadow: var(--x-shadow, 0), var(--y-shadow, 0);\n  z-index: 0;\n}\ntable.sns thead *[class*=sns--is-stuck] .sns__placeholder-cell,\ntable.sns tbody *[class*=sns--is-stuck] .sns__placeholder-cell {\n  position: relative;\n}\ntable.sns thead *[class*=sns--is-stuck] .sns__cell-inner,\ntable.sns tbody *[class*=sns--is-stuck] .sns__cell-inner {\n  position: relative;\n  height: inherit;\n}\ntable.sns thead *[class*=sns--is-stuck] > *,\ntable.sns tbody *[class*=sns--is-stuck] > * {\n  position: relative;\n  z-index: 1;\n}\ntable.sns thead *.sns--is-stuck,\ntable.sns tbody *.sns--is-stuck {\n  z-index: 100;\n}\ntable.sns thead *.sns--is-stuck-x,\ntable.sns tbody *.sns--is-stuck-x {\n  z-index: 80;\n}\ntable.sns thead *.sns--is-stuck-y,\ntable.sns tbody *.sns--is-stuck-y {\n  z-index: 90;\n}\n\n@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n  table.sns {\n    margin-top: -2px;\n    margin-left: -1px;\n  }\n}";
  styleInject(css);

  var tableScrollPositions = new WeakMap();
  var observeConfig = {
    childList: true,
    subtree: true
  }; // // Custom event polyfill
  // (function() {
  //   if (typeof window.CustomEvent === "function") return false;
  //   function CustomEvent(event, params) {
  //     params = params || { bubbles: false, cancelable: false, detail: null };
  //     var evt = document.createEvent("CustomEvent");
  //     evt.initCustomEvent(
  //       event,
  //       params.bubbles,
  //       params.cancelable,
  //       params.detail
  //     );
  //     return evt;
  //   }
  //   window.CustomEvent = CustomEvent;
  // })();

  function handleMutations(mutations, observer) {
    observer.disconnect(); // Prevent any further updates to the DOM from making the observer thrash.

    var table = closest(mutations[0].target, "sns");
    mutations.forEach(function (m) {
      if (!table.classList.contains("sns--pause-mutation")) {
        if (m.type === "childList") {
          Array.prototype.slice.call(m.removedNodes).forEach(function (removedNode) {
            if (removedNode.classList) {
              if (m.target.tagName == "TR") {
                // 0) Rebuild entire table TH/TD
                Array.prototype.slice.call(m.removedNodes).forEach(function (removedNode, i) {
                  var addedNode = m.addedNodes[i]; // Merge DOM attributes

                  var oldAttrs = removedNode.attributes;

                  for (var _i = oldAttrs.length - 1; _i >= 0; _i--) {
                    var attrName = oldAttrs[_i].name;
                    var attrValue = oldAttrs[_i].value;

                    if (attrName === "style") {
                      var oldStyle = (removedNode.getAttribute("style") || "").replace(/;$/, "");
                      addedNode.setAttribute("style", "".concat(oldStyle, "; ").concat(addedNode.getAttribute("style")));
                    } else if (attrName === "class") {
                      Array.prototype.slice.call(removedNode.classList).forEach(function (className) {
                        addedNode.classList.add(className);
                      });
                    } else {
                      if (addedNode.getAttribute(attrName) === null) {
                        addedNode.setAttribute(attrName, attrValue);
                      }
                    }
                  } // Build up inner cell and contents


                  var innerCell = removedNode.firstChild;
                  var contents = innerCell.firstChild;

                  while (contents.firstChild) {
                    contents.removeChild(contents.firstChild);
                  }

                  while (addedNode.firstChild) {
                    contents.appendChild(addedNode.firstChild);
                  }

                  addedNode.appendChild(innerCell);
                });
              } else if (removedNode.classList.contains("sns__cell-inner")) {
                // 1.1 - From scratch
                m.target.innerCellStyle = removedNode.getAttribute("style");
              }
            }
          });
          Array.prototype.slice.call(m.addedNodes).forEach(function (addedNode) {
            // 1) Rebuild placeholder-cell
            if (m.target.classList.contains("sns__placeholder-cell")) {
              if (m.target.innerCellStyle) {
                // 1.1 - From scratch
                var innerCell = document.createElement("div");
                innerCell.setAttribute("class", "sns__cell-inner");
                innerCell.setAttribute("style", m.target.innerCellStyle);
                delete m.target.innerCellStyle;
                var contents = document.createElement("div");
                contents.classList.add("sns__cell-contents");
                contents.appendChild(addedNode);
                innerCell.appendChild(contents);
                m.target.appendChild(innerCell);
              } else {
                // 1.2 - When a direct descendent of placeholder-cell has been created
                var _innerCell = document.createElement("div");

                _innerCell.setAttribute("class", "sns__cell-inner");

                var _contents = document.createElement("div");

                _contents.classList.add("sns__cell-contents");

                while (m.target.firstChild) {
                  var child = m.target.firstChild;

                  if (child.classList && child.classList.contains("sns__cell-inner")) {
                    _innerCell.setAttribute("style", m.target.firstChild.getAttribute("style"));

                    while (child.firstChild.firstChild) {
                      _contents.appendChild(child.firstChild.firstChild);
                    }

                    m.target.removeChild(child);
                  } else {
                    _contents.appendChild(child);
                  }
                }

                _innerCell.appendChild(_contents);

                m.target.appendChild(_innerCell);
              }
            } // 2) Rebuild cell-inner


            if (m.target.classList.contains("sns__cell-inner")) {
              var _contents2 = document.createElement("div");

              _contents2.classList.add("sns__cell-contents");

              if (!Array.prototype.slice.call(m.target.children).find(function (node) {
                return node.classList.contains("sns__cell-contents");
              })) {
                // 2.1 - Build from scratch
                _contents2.appendChild(addedNode);

                m.target.appendChild(_contents2);
              } else {
                // 2.2 - When a direct descendent of cell-inner has been created
                while (m.target.firstChild) {
                  var _child = m.target.firstChild;

                  if (_child.classList && _child.classList.contains("sns__cell-contents")) {
                    while (_child && _child.firstChild) {
                      _contents2.appendChild(_child.firstChild);
                    }

                    m.target.removeChild(_child);
                  } else {
                    _contents2.appendChild(_child);
                  }
                }

                m.target.appendChild(_contents2);
              }
            }
          });
        }
      }
    });
    ie11SetInnerCellHeights(table, stickyElems);
    requestAnimationFrame(function () {
      observer.observe(table, observeConfig);
    });
  }

  function closest(elem, classMatcher) {
    if (elem.classList) {
      if (elem.classList.contains(classMatcher)) {
        return elem;
      } else {
        if (elem.parentElement) {
          return closest(elem.parentElement, classMatcher);
        } else {
          return;
        }
      }
    } else {
      return closest(elem.parentElement, classMatcher);
    }
  }

  function altSide(side) {
    switch (side) {
      case "Left":
        return "Right";

      case "Right":
        return "Left";

      case "Top":
        return "Bottom";

      case "Bottom":
        return "Top";
    }
  }

  function wheelHandler(_ref) {
    var table = _ref.table,
        wrapper = _ref.wrapper,
        stickyElems = _ref.stickyElems,
        pixelX = _ref.pixelX,
        pixelY = _ref.pixelY,
        scrollLeft = _ref.scrollLeft,
        scrollTop = _ref.scrollTop,
        scrollWidth = _ref.scrollWidth,
        scrollHeight = _ref.scrollHeight,
        clientWidth = _ref.clientWidth,
        clientHeight = _ref.clientHeight,
        showShadow = _ref.showShadow,
        callback = _ref.callback,
        isIE11 = _ref.isIE11;
    var maxWidth = scrollWidth - clientWidth;
    var maxHeight = scrollHeight - clientHeight;
    var newX = scrollLeft + pixelX;
    var newY = scrollTop + pixelY;

    if (newX >= maxWidth) {
      newX = maxWidth;
    }

    if (newX <= 0) {
      newX = 0;
    }

    if (newY >= maxHeight) {
      newY = maxHeight;
    }

    if (newY <= 0) {
      newY = 0;
    }

    if (isIE11) {
      positionStickyElements(table, stickyElems, showShadow, newX, newY);
      wrapper.scrollLeft = newX;
      wrapper.scrollTop = newY;
    } else {
      wrapper.scrollLeft = newX;
      wrapper.scrollTop = newY; // Modern browsers have a nasty habit of setting scrollLeft/scrollTop not to the actual integer value you specified, but
      // rather to a sub-pixel value that is "pretty close" to what you specified. To work around that, set the scroll value
      // and then use that same scroll value as the left/top offset for the stuck elements.

      positionStickyElements(table, stickyElems, showShadow, wrapper.scrollLeft, wrapper.scrollTop);
    }

    if (callback) {
      callback(newX, newY);
    }
  }

  function calculateShadowOffset(value) {
    value = Math.ceil(value / 10);

    if (value > 2) {
      return 2;
    } else {
      return value;
    }
  }

  function calculateShadowColor(cell, opacity) {
    var rgb = window.getComputedStyle(cell).backgroundColor.replace("rgb(", "").replace(")", "").split(",").map(function (value) {
      return Math.round(parseInt(value, 10) * 0.3);
    }).join(",");
    return "rgba(".concat(rgb, ",").concat(opacity, ")");
  }

  function setCellTransforms(_ref2) {
    var cell = _ref2.cell,
        showShadow = _ref2.showShadow,
        scrollLeft = _ref2.scrollLeft,
        scrollTop = _ref2.scrollTop;
    var transforms = [];

    if (cell.classList.contains("sns--is-stuck-y") || cell.classList.contains("sns--is-stuck")) {
      transforms.push("translateY(".concat(scrollTop, "px)"));
    }

    if (cell.classList.contains("sns--is-stuck-x") || cell.classList.contains("sns--is-stuck")) {
      transforms.push("translateX(".concat(scrollLeft, "px)"));
    }

    cell.style.transform = transforms.join(" ");
    positionShadow(cell, showShadow, scrollLeft, scrollTop);
  }

  function positionStickyElements(table, elems, showShadow) {
    var scrollLeft = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var scrollTop = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    requestAnimationFrame(function () {
      elems.forEach(function (cellsOfType) {
        for (var i = 0; i < cellsOfType.length; i++) {
          var cell = cellsOfType[i];
          setCellTransforms({
            cell: cell,
            showShadow: showShadow,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop
          });
        }
      });
      tableScrollPositions.set(table, {
        left: scrollLeft,
        top: scrollTop
      }); // TODO: Must polyfill for IE11
      // table.dispatchEvent(
      //   new CustomEvent("sns:scroll", {
      //     detail: { scrollLeft, scrollTop }
      //   })
      // );
    });
  }

  function positionShadow(cell, showShadow, offsetX, offsetY) {
    if (!showShadow) return;
    var shadowColor = calculateShadowColor(cell, 0.4);
    var xShadow = "0 0";
    var yShadow = "0 0";
    var shadow;

    if (offsetY) {
      shadow = calculateShadowOffset(offsetY);
      yShadow = "0 ".concat(shadow, "px ").concat(shadowColor);
    }

    if (offsetX) {
      shadow = calculateShadowOffset(offsetX);
      xShadow = "".concat(shadow, "px 0 ").concat(shadowColor);
    }

    cell.style.setProperty("--x-shadow", xShadow);
    cell.style.setProperty("--y-shadow", yShadow);
  }

  function scrollHandler(table, stickyElems, wrapper, showShadow, callback) {
    updateScrollPosition(table, stickyElems, wrapper, showShadow, callback);
  }

  function updateScrollPosition(table, stickyElems, wrapper, showShadow, callback) {
    positionStickyElements(table, stickyElems, showShadow, wrapper.scrollLeft, wrapper.scrollTop);

    if (callback) {
      callback(wrapper.scrollLeft, wrapper.scrollTop);
    }
  }

  function buildInnerCell(cell) {
    var cellStyles = window.getComputedStyle(cell);
    cell.classList.add("sns__placeholder-cell");
    var innerCell = document.createElement("div");
    innerCell.setAttribute("class", "sns__cell-inner");
    var cellContents = document.createElement("div");
    cellContents.setAttribute("class", "sns__cell-contents");
    var setStyles = true;

    while (cell.firstChild) {
      cellContents.appendChild(cell.firstChild);

      if (cell.firstChild && cell.firstChild.classList && cell.firstChild.classList.contains("sns__cell-inner")) {
        while (cell.firstChild.firstChild.firstChild) {
          cellContents.appendChild(cell.firstChild.firstChild.firstChild);
        }

        innerCell.setAttribute("style", cell.firstChild.getAttribute("style"));
        innerCell.style.height = "";

        if ("removeNode" in cell.firstChild) {
          // IE11 specific method.
          cell.firstChild.removeNode(true);
        } else {
          // All other browsers ... technically not needed (since this code path only deals with IE11) but good to have for testing in other browsers.
          cell.firstChild.remove();
        }

        setStyles = false;
      }
    }

    innerCell.appendChild(cellContents);
    cell.innerHTML = "";
    cell.appendChild(innerCell);

    if (setStyles) {
      ["padding", "border"].forEach(function (property) {
        ["Top", "Right", "Bottom", "Left"].forEach(function (side) {
          if (property === "border") {
            var borderWidth = cellStyles["border".concat(side, "Width")];
            innerCell.style["margin".concat(altSide(side))] = "calc(-1 * ".concat(borderWidth, ")");
            ["Width", "Color", "Style"].forEach(function (attr) {
              var value = cellStyles["".concat(property).concat(side).concat(attr)];
              innerCell.style["".concat(property).concat(side).concat(attr)] = value;
            });
          } else {
            innerCell.style["".concat(property).concat(side)] = cellStyles["".concat(property).concat(side)];
          }
        });
        cell.style[property] = "0";
      });
      innerCell.style.display = "flex";
      innerCell.style.alignItems = verticalAlignment(cellStyles.verticalAlign);
    }
  } // Convert regular `vertical-align` CSS into flexbox friendly alternative.


  function verticalAlignment(value) {
    switch (value) {
      case "middle":
        return "center";

      case "top":
        return "start";

      case "bottom":
        return "end";

      case "baseline":
        return "baseline";

      default:
        return "";
    }
  }

  function ie11SetInnerCellHeights(table, stickyElems) {
    // const stickyElems = table.getElementsByClassName(
    //   "sns--is-stuck sns--is-stuck-y sns--is-stuck-x"
    // );
    for (var stickyIdx = 0; stickyIdx < stickyElems.length; stickyIdx++) {
      for (var typeIdx = 0; typeIdx < stickyElems[stickyIdx].length; typeIdx++) {
        var cell = stickyElems[stickyIdx][typeIdx];
        cell.style.height = "";
      }
    } // stickyElems.forEach(cell => {
    //   cell.style.height = "";
    // });


    requestAnimationFrame(function () {
      for (var _stickyIdx = 0; _stickyIdx < stickyElems.length; _stickyIdx++) {
        for (var _typeIdx = 0; _typeIdx < stickyElems[_stickyIdx].length; _typeIdx++) {
          var _cell = stickyElems[_stickyIdx][_typeIdx];
          _cell.style.height = "".concat(_cell.getBoundingClientRect().height, "px");
        }
      } // stickyElems.forEach(cell => {
      //   cell.style.height = `${cell.getBoundingClientRect().height}px`;
      // });

    });
  }

  function generateBorder(_ref3) {
    var cell = _ref3.cell,
        isFirefox = _ref3.isFirefox,
        isIE11 = _ref3.isIE11,
        _ref3$scrollPositions = _ref3.scrollPositions,
        left = _ref3$scrollPositions.left,
        top = _ref3$scrollPositions.top,
        showShadow = _ref3.showShadow;

    if (isIE11) {
      // Behavior for IE11.
      buildInnerCell(cell);
    } else {
      // Everything other than IE11.
      var cellStyles = window.getComputedStyle(cell);
      ["Top", "Right", "Bottom", "Left"].forEach(function (side) {
        ["Width"].forEach(function (property) {
          var borderWidth = cellStyles["border".concat(side).concat(property)];

          if (isFirefox) {
            var value = borderWidth.match(/([^a-z%]+)([a-z%]+)/);
            borderWidth = "".concat(Math.round(value[1])).concat(value[2]);
          }

          cell.style["margin".concat(side)] = "-".concat(borderWidth);
        });
      });
    }

    setCellTransforms({
      cell: cell,
      scrollLeft: left,
      scrollTop: top,
      showShadow: showShadow
    }); // cell.style.transform = `translateX(${left}px) translateY(${top}px)`;
  }

  function stickNSlide (elems) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var showShadow = options.showShadow,
        callback = options.callback; // Must test for FF, because it does some seriously horrible things to the table layout.

    var userAgent = navigator.userAgent.toLowerCase();
    var isFirefox = userAgent.indexOf("firefox") > -1;
    var isIE = userAgent.indexOf("trident") > -1;
    var isIEedge = userAgent.indexOf("edge") > -1;
    var isIE11 = isIE && !isIEedge; // Convert a jQuery object to an array, or convert a single element to an array.

    if (typeof elems.toArray === "function") {
      elems = elems.toArray();
    } else if (!Array.isArray(elems)) {
      elems = [elems];
    }

    elems.forEach(function (table) {
      if (!table.StickNSlide) {
        table.StickNSlide = {};
        var wrapper = table.parentElement;
        wrapper.addEventListener("wheel", function (event) {
          var normalized = normalizeWheel$1(event);
          wheelEventTriggered = true;
          var pixelX = normalized.pixelX,
              pixelY = normalized.pixelY;
          var scrollLeft = wrapper.scrollLeft,
              scrollTop = wrapper.scrollTop,
              scrollWidth = wrapper.scrollWidth,
              scrollHeight = wrapper.scrollHeight,
              clientWidth = wrapper.clientWidth,
              clientHeight = wrapper.clientHeight;
          var opts = {
            table: table,
            wrapper: wrapper,
            stickyElems: _stickyElems,
            pixelX: pixelX,
            pixelY: pixelY,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            scrollWidth: scrollWidth,
            scrollHeight: scrollHeight,
            clientWidth: clientWidth,
            clientHeight: clientHeight,
            showShadow: showShadow,
            callback: callback,
            isIE11: isIE11
          };

          if (isIE || isIEedge) {
            event.preventDefault();
            event.stopPropagation();
            wheelHandler(opts);
          } else {
            event.preventDefault();
            wheelHandler(opts);
          }
        }, {
          capture: true
        });
        wrapper.addEventListener("scroll", function () {
          if (wheelEventTriggered) {
            wheelEventTriggered = false;
          } else {
            scrollHandler(table, _stickyElems, wrapper, showShadow, callback);
          }
        }); // --------------------

        var _stickyElems = ["sns--is-stuck", "sns--is-stuck-y", "sns--is-stuck-x"].reduce(function (acc, className) {
          acc.push(table.getElementsByClassName(className));
          return acc;
        }, []);

        if (getComputedStyle(wrapper).position === "static") {
          wrapper.style.position = "relative";
        }

        table.classList.add("sns");
        table.style.position = "relative";
        ["Top", "Left"].forEach(function (side) {
          if (table["offset".concat(side)] > 0) {
            table.style[side.toLowerCase()] = "-".concat(table["offset".concat(side)], "px");
          }
        }); // stickyElems.forEach(cell => {
        //   if (isIE11()) {
        //     // Behavior for IE11.
        //     buildInnerCell(cell);
        //   } else {
        //     // Everything other than IE11.
        //     const cellStyles = window.getComputedStyle(cell);
        //     ["Top", "Right", "Bottom", "Left"].forEach(side => {
        //       ["Width"].forEach(property => {
        //         let borderWidth = cellStyles[`border${side}${property}`];
        //         if (isFirefox) {
        //           const value = borderWidth.match(/([^a-z%]+)([a-z%]+)/);
        //           borderWidth = `${Math.round(value[1])}${value[2]}`;
        //         }
        //         cell.style[`margin${side}`] = `-${borderWidth}`;
        //       });
        //     });
        //   }
        // });

        var scrollPositions = {
          left: wrapper.scrollLeft,
          top: wrapper.scrollTop
        };
        tableScrollPositions.set(table, scrollPositions);

        for (var stickyIdx = 0; stickyIdx < _stickyElems.length; stickyIdx++) {
          for (var typeIdx = 0; typeIdx < _stickyElems[stickyIdx].length; typeIdx++) {
            var cell = _stickyElems[stickyIdx][typeIdx];
            generateBorder({
              cell: cell,
              isFirefox: isFirefox,
              isIE11: isIE11,
              scrollPositions: scrollPositions,
              showShadow: showShadow
            });
          }
        } // stickyElems.forEach(cellsOfType => {
        //   debugger;
        //   for (let i = 0; i < cellsOfType.length; i++) {
        //     const cell = cellsOfType[i];
        //     generateBorder({ cell, isFirefox, isIE11, scrollPositions, showShadow });
        //   }
        // });
        // generateBorders(stickyElems, { isFirefox, isIE11: isIE11() });
        // Variable that tracks whether "wheel" event was called.
        // Prevents both "wheel" and "scroll" events being triggered simultaneously.


        var wheelEventTriggered = false; // Set initial position of elements to 0.

        requestAnimationFrame(function () {
          // positionStickyElements(table, stickyElems, showShadow, isIE11);
          positionStickyElements(table, _stickyElems, showShadow, wrapper.scrollLeft, wrapper.scrollTop);

          if (isIE11) {
            ie11SetInnerCellHeights(table, _stickyElems);
          } // ----------------------------
          // Handle IE11 mutations to the table cells.


          requestAnimationFrame(function () {
            if (isIE && !isIEedge) {
              var observer = new MutationObserver(handleMutations);
              observer.observe(table, observeConfig);
            } else {
              new MutationObserver(function (mutations) {
                var _tableScrollPositions = tableScrollPositions.get(table),
                    left = _tableScrollPositions.left,
                    top = _tableScrollPositions.top;

                mutations.forEach(function (mutation) {
                  var cell = mutation.target;
                  debugger;
                  var classList = cell.classList;

                  if (classList.contains("sns--is-stuck") || classList.contains("sns--is-stuck-x") || classList.contains("sns--is-stuck-y")) {
                    generateBorder({
                      cell: cell,
                      isFirefox: isFirefox,
                      isIE11: isIE11,
                      scrollPositions: tableScrollPositions.get(table),
                      showShadow: showShadow
                    });
                  } else {
                    cell.style.margin = "";
                    cell.style.transform = "";
                  }
                });
              }).observe(table, {
                // childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["class"]
              });
            }
          }); // ============================
        });
      }

      return;
    });
    window.addEventListener("resize", function () {
      requestAnimationFrame(function () {
        elems.forEach(function (table) {
          if (isIE11) {
            ie11SetInnerCellHeights(table, stickyElems);
          }
        });
      });
    });
  }

  var css$1 = ".wrapper {\n  display: inline-block;\n  overflow: auto;\n  max-width: 100%;\n  max-height: 500px;\n  box-sizing: border-box;\n  border: 1px solid red;\n}\n\ntable {\n  border-collapse: collapse;\n  max-height: 400px;\n  max-width: 100%;\n}\ntable thead tr {\n  background: yellow;\n}\ntable thead th {\n  background: #6698f5;\n  padding: 30px;\n  border: 1px solid #4f74b9;\n  transform-origin: 0 0;\n}\ntable tbody tr:nth-child(2n+1) th, table tbody tr:nth-child(2n+1) td {\n  background: #fff;\n}\ntable tbody tr:nth-child(2n) th, table tbody tr:nth-child(2n) td {\n  background: #efefef;\n}\ntable tbody th, table tbody td {\n  padding: 50px 30px;\n  border: 1px solid lightgray;\n}\ntable .sns--is-stuck-x {\n  background: #e5eeff !important;\n}\n\nbutton[data-active=true] {\n  background: lime;\n}\n\ncode {\n  background: #ddd;\n}";
  styleInject(css$1);

  function randomColor() {
    return "#" + (Math.random() * 0xffffff << 0).toString(16);
  }

  function backgroundColor(event) {
    event.target.style.backgroundColor = randomColor();
  }

  function borderColor(event) {
    event.target.style.borderColor = randomColor();
  } // function borderWidth(event) {
  //   event.target.style.borderWidth = randomNumber() + 'px';
  // }
  // document.getElementById('borderWidth').addEventListener('click', (event)=> {
  //   event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
  //   if (event.currentTarget.dataset.active) {
  //     document.querySelector('table').addEventListener('click', borderWidth);
  //   } else {
  //     document.querySelector('table').removeEventListener('click', borderWidth);
  //   }
  // });


  function mergeCellRow(event) {
    if (event.target.tagName === "TD" || event.target.tagName === "TH") {
      if (event.target.nextElementSibling) {
        event.target.colSpan = event.target.colSpan + event.target.nextElementSibling.colSpan;
        event.target.nextElementSibling.remove();
      }
    }
  }

  function changeContent(event) {
    if (event.target.tagName === "TD" || event.target.tagName === "TH") {
      fetch("http://www.randomtext.me/api/lorem/p-1/5-15").then(function (response) {
        return response.json();
      }).then(function (json) {
        event.target.innerHTML = json.text_out;
      });
    }
  }

  $(document).ready(function () {
    var $table = $("table");
    $table.find("b").on("click", function () {
      alert();
    });
    $table.find("thead th:nth-child(-n+3)").each(function (i, th) {
      $(th).addClass("sns--is-stuck");
    });
    $table.find("thead th:nth-child(n+4)").each(function (i, th) {
      $(th).addClass("sns--is-stuck-y");
    });
    $table.find("tbody > tr:nth-child(n+1):nth-child(-n+11) > *:nth-child(-n+3)").addClass("sns--is-stuck-x");
    $table.find("tbody > tr:nth-child(12) > *:nth-child(-n+2)").addClass("sns--is-stuck-x");
    $table.find("tbody > tr:nth-child(13) > *:nth-child(-n+1)").addClass("sns--is-stuck-x"); // $table.stickyTable();

    stickNSlide($table);
    document.getElementById("backgroundColor").addEventListener("click", function (event) {
      if (event.currentTarget.dataset.active !== "true") {
        document.querySelector("table").addEventListener("click", backgroundColor);
      } else {
        document.querySelector("table").removeEventListener("click", backgroundColor);
      }

      event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
    });
    document.getElementById("borderColor").addEventListener("click", function (event) {
      if (event.currentTarget.dataset.active !== "true") {
        document.querySelector("table").addEventListener("click", borderColor);
      } else {
        document.querySelector("table").removeEventListener("click", borderColor);
      }

      event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
    });
    document.getElementById("mergeCellRow").addEventListener("click", function (event) {
      if (event.currentTarget.dataset.active !== "true") {
        document.querySelector("table").addEventListener("click", mergeCellRow);
      } else {
        document.querySelector("table").removeEventListener("click", mergeCellRow);
      }

      event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
    });
    document.getElementById("changeContent").addEventListener("click", function (event) {
      if (event.currentTarget.dataset.active !== "true") {
        document.querySelector("table").addEventListener("click", changeContent);
      } else {
        document.querySelector("table").removeEventListener("click", changeContent);
      }

      event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
    }); // setTimeout(function() {
    //   $('b').closest('td').each(function() {
    //     var div = $('<div>blah</div>');
    //     $(this).prepend(div);
    //   });
    // }, 5000);
  });

})));
//# sourceMappingURL=demo.js.map
