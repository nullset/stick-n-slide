import normalizeWheel from 'normalize-wheel';
import crypto from 'crypto';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var random = createCommonjsModule(function (module) {
if (crypto.randomFillSync) {
  var buffers = { };
  module.exports = function (bytes) {
    var buffer = buffers[bytes];
    if (!buffer) {
      buffer = Buffer.allocUnsafe(bytes);
      if (bytes <= 255) buffers[bytes] = buffer;
    }
    return crypto.randomFillSync(buffer)
  };
} else {
  module.exports = crypto.randomBytes;
}
});

/**
 * URL safe symbols.
 *
 * This alphabet uses a-z A-Z 0-9 _- symbols.
 * Symbols order was changed for better gzip compression.
 *
 * @name url
 * @type {string}
 *
 * @example
 * const url = require('nanoid/url')
 * generate(url, 10) //=> "Uakgb_J5m9"
 */
var url =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * @param {number} [size=21] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * const nanoid = require('nanoid')
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 *
 * @name nanoid
 * @function
 */
var nanoid = function (size) {
  size = size || 21;
  var bytes = random(size);
  var id = '';
  while (size--) {
    id += url[bytes[size] & 63];
  }
  return id
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

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

const tableScrollPositions = new WeakMap();

const observeConfig = {
  childList: true,
  subtree: true
};

// Custom event polyfill
(function() {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();

function handleMutations(mutations, observer) {
  observer.disconnect(); // Prevent any further updates to the DOM from making the observer thrash.

  const table = closest(mutations[0].target, "sns");

  mutations.forEach(m => {
    if (!table.classList.contains("sns--pause-mutation")) {
      if (m.type === "childList") {
        Array.prototype.slice.call(m.removedNodes).forEach(removedNode => {
          if (removedNode.classList) {
            if (m.target.tagName == "TR") {
              // 0) Rebuild entire table TH/TD
              Array.prototype.slice
                .call(m.removedNodes)
                .forEach((removedNode, i) => {
                  const addedNode = m.addedNodes[i];

                  // Merge DOM attributes
                  const oldAttrs = removedNode.attributes;
                  for (let i = oldAttrs.length - 1; i >= 0; i--) {
                    const attrName = oldAttrs[i].name;
                    const attrValue = oldAttrs[i].value;
                    if (attrName === "style") {
                      const oldStyle = (
                        removedNode.getAttribute("style") || ""
                      ).replace(/;$/, "");
                      addedNode.setAttribute(
                        "style",
                        `${oldStyle}; ${addedNode.getAttribute("style")}`
                      );
                    } else if (attrName === "class") {
                      Array.prototype.slice
                        .call(removedNode.classList)
                        .forEach(className => {
                          addedNode.classList.add(className);
                        });
                    } else {
                      if (addedNode.getAttribute(attrName) === null) {
                        addedNode.setAttribute(attrName, attrValue);
                      }
                    }
                  }

                  // Build up inner cell and contents
                  const innerCell = removedNode.firstChild;
                  const contents = innerCell.firstChild;
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
        Array.prototype.slice.call(m.addedNodes).forEach(addedNode => {
          // 1) Rebuild placeholder-cell
          if (m.target.classList.contains("sns__placeholder-cell")) {
            if (m.target.innerCellStyle) {
              // 1.1 - From scratch
              const innerCell = document.createElement("div");
              innerCell.setAttribute("class", "sns__cell-inner");
              innerCell.setAttribute("style", m.target.innerCellStyle);
              delete m.target.innerCellStyle;

              const contents = document.createElement("div");
              contents.classList.add("sns__cell-contents");
              contents.appendChild(addedNode);

              innerCell.appendChild(contents);
              m.target.appendChild(innerCell);
            } else {
              // 1.2 - When a direct descendent of placeholder-cell has been created
              const innerCell = document.createElement("div");
              innerCell.setAttribute("class", "sns__cell-inner");

              const contents = document.createElement("div");
              contents.classList.add("sns__cell-contents");

              while (m.target.firstChild) {
                const child = m.target.firstChild;
                if (
                  child.classList &&
                  child.classList.contains("sns__cell-inner")
                ) {
                  innerCell.setAttribute(
                    "style",
                    m.target.firstChild.getAttribute("style")
                  );
                  while (child.firstChild.firstChild) {
                    contents.appendChild(child.firstChild.firstChild);
                  }
                  m.target.removeChild(child);
                } else {
                  contents.appendChild(child);
                }
              }

              innerCell.appendChild(contents);

              m.target.appendChild(innerCell);
            }
          }

          // 2) Rebuild cell-inner
          if (m.target.classList.contains("sns__cell-inner")) {
            const contents = document.createElement("div");
            contents.classList.add("sns__cell-contents");

            if (
              !Array.prototype.slice
                .call(m.target.children)
                .find(node => node.classList.contains("sns__cell-contents"))
            ) {
              // 2.1 - Build from scratch
              contents.appendChild(addedNode);
              m.target.appendChild(contents);
            } else {
              // 2.2 - When a direct descendent of cell-inner has been created
              while (m.target.firstChild) {
                const child = m.target.firstChild;
                if (
                  child.classList &&
                  child.classList.contains("sns__cell-contents")
                ) {
                  while (child && child.firstChild) {
                    contents.appendChild(child.firstChild);
                  }
                  m.target.removeChild(child);
                } else {
                  contents.appendChild(child);
                }
              }
              m.target.appendChild(contents);
            }
          }
        });
      }
    }
  });

  ie11SetInnerCellHeights(table, stickyElems);

  requestAnimationFrame(() => {
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

function wheelHandler({
  table,
  wrapper,
  stickyElems,
  pixelX,
  pixelY,
  scrollLeft,
  scrollTop,
  scrollWidth,
  scrollHeight,
  clientWidth,
  clientHeight,
  showShadow,
  callback,
  isIE11
}) {
  const maxWidth = scrollWidth - clientWidth;
  const maxHeight = scrollHeight - clientHeight;
  let newX = scrollLeft + pixelX;
  let newY = scrollTop + pixelY;
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
    wrapper.scrollTop = newY;

    // Modern browsers have a nasty habit of setting scrollLeft/scrollTop not to the actual integer value you specified, but
    // rather to a sub-pixel value that is "pretty close" to what you specified. To work around that, set the scroll value
    // and then use that same scroll value as the left/top offset for the stuck elements.
    positionStickyElements(
      table,
      stickyElems,
      showShadow,
      wrapper.scrollLeft,
      wrapper.scrollTop
    );
  }
  if (callback) {
    callback(newX, newY);
  }
}

// function setCellTransforms({ cell, showShadow, scrollLeft, scrollTop }) {
//   let transforms = [];
//   if (
//     cell.classList.contains("sns--is-stuck-y") ||
//     cell.classList.contains("sns--is-stuck")
//   ) {
//     transforms.push(`translateY(${scrollTop}px)`);
//   }
//   if (
//     cell.classList.contains("sns--is-stuck-x") ||
//     cell.classList.contains("sns--is-stuck")
//   ) {
//     transforms.push(`translateX(${scrollLeft}px)`);
//   }
//   cell.style.transform = transforms.join(" ");
//   positionShadow(cell, showShadow, scrollLeft, scrollTop);
// }

function positionStickyElements(
  table,
  elems,
  showShadow,
  scrollLeft = 0,
  scrollTop = 0
) {
  const { id, styleElem } = tableScrollPositions.get(table);
  styleElem.textContent = cellStyles({ id, left: scrollLeft, top: scrollTop });
  table.parentElement.dataset.snsScrollLeft = scrollLeft;
  table.parentElement.dataset.snsScrollTop = scrollTop;

  // requestAnimationFrame(() => {
  //   elems.forEach(cellsOfType => {
  //     for (let i = 0; i < cellsOfType.length; i++) {
  //       const cell = cellsOfType[i];
  //       setCellTransforms({ cell, showShadow, scrollLeft, scrollTop });
  //     }
  //   });
  //   tableScrollPositions.set(table, { left: scrollLeft, top: scrollTop });

  //   table.dispatchEvent(
  //     new CustomEvent("sns:scroll", {
  //       detail: { scrollLeft, scrollTop }
  //     })
  //   );
  // });
}

function scrollHandler(table, stickyElems, wrapper, showShadow, callback) {
  updateScrollPosition(table, stickyElems, wrapper, showShadow, callback);
}

function updateScrollPosition(
  table,
  stickyElems,
  wrapper,
  showShadow,
  callback
) {
  positionStickyElements(
    table,
    stickyElems,
    showShadow,
    wrapper.scrollLeft,
    wrapper.scrollTop
  );
  if (callback) {
    callback(wrapper.scrollLeft, wrapper.scrollTop);
  }
}

function buildInnerCell(cell) {
  const cellStyles = window.getComputedStyle(cell);
  cell.classList.add("sns__placeholder-cell");
  let innerCell = document.createElement("div");
  innerCell.setAttribute("class", "sns__cell-inner");
  let cellContents = document.createElement("div");
  cellContents.setAttribute("class", "sns__cell-contents");
  let setStyles = true;
  while (cell.firstChild) {
    cellContents.appendChild(cell.firstChild);
    if (
      cell.firstChild &&
      cell.firstChild.classList &&
      cell.firstChild.classList.contains("sns__cell-inner")
    ) {
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
    ["padding", "border"].forEach(property => {
      ["Top", "Right", "Bottom", "Left"].forEach(side => {
        if (property === "border") {
          const borderWidth = cellStyles[`border${side}Width`];
          innerCell.style[
            `margin${altSide(side)}`
          ] = `calc(-1 * ${borderWidth})`;

          ["Width", "Color", "Style"].forEach(attr => {
            const value = cellStyles[`${property}${side}${attr}`];
            innerCell.style[`${property}${side}${attr}`] = value;
          });
        } else {
          innerCell.style[`${property}${side}`] =
            cellStyles[`${property}${side}`];
        }
      });
      cell.style[property] = "0";
    });

    innerCell.style.display = "flex";
    innerCell.style.alignItems = verticalAlignment(cellStyles.verticalAlign);
  }
}

// Convert regular `vertical-align` CSS into flexbox friendly alternative.
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
  for (let stickyIdx = 0; stickyIdx < stickyElems.length; stickyIdx++) {
    for (let typeIdx = 0; typeIdx < stickyElems[stickyIdx].length; typeIdx++) {
      const cell = stickyElems[stickyIdx][typeIdx];

      cell.style.height = "";
    }
  }

  requestAnimationFrame(() => {
    for (let stickyIdx = 0; stickyIdx < stickyElems.length; stickyIdx++) {
      for (
        let typeIdx = 0;
        typeIdx < stickyElems[stickyIdx].length;
        typeIdx++
      ) {
        const cell = stickyElems[stickyIdx][typeIdx];
        cell.style.height = `${cell.getBoundingClientRect().height}px`;
      }
    }

    // stickyElems.forEach(cell => {
    //   cell.style.height = `${cell.getBoundingClientRect().height}px`;
    // });
  });
}

function generateBorder({
  cell,
  isFirefox,
  isIE11,
  scrollPositions: { left, top },
  showShadow
}) {
  if (isIE11) {
    // Behavior for IE11.
    buildInnerCell(cell);
  } else {
    // Everything other than IE11.
    const cellStyles = window.getComputedStyle(cell);
    ["Top", "Right", "Bottom", "Left"].forEach(side => {
      ["Width"].forEach(property => {
        let borderWidth = cellStyles[`border${side}${property}`];
        if (isFirefox) {
          const value = borderWidth.match(/([^a-z%]+)([a-z%]+)/);
          borderWidth = `${Math.round(value[1])}${value[2]}`;
        }
        cell.style[`margin${side}`] = `-${borderWidth}`;
      });
    });
  }
  // setCellTransforms({ cell, scrollLeft: left, scrollTop: top, showShadow });
  // cell.style.transform = `translateX(${left}px) translateY(${top}px)`;
}

function cellStyles({ id, left, top }) {
  return `
  .sns.sns-${id} .sns--is-stuck {
    transform: translate(${left}px, ${top}px);
  }
  .sns.sns-${id} .sns--is-stuck-x {
    transform: translateX(${left}px);
  }
  .sns.sns-${id} .sns--is-stuck-y {
    transform: translateY(${top}px);
  }`;
}

function index(elems, options = {}) {
  const { showShadow, callback } = options;
  // Must test for FF, because it does some seriously horrible things to the table layout.
  const userAgent = navigator.userAgent.toLowerCase();
  const isFirefox = userAgent.indexOf("firefox") > -1;
  const isIE = userAgent.indexOf("trident") > -1;
  const isIEedge = userAgent.indexOf("edge") > -1;
  const isIE11 = isIE && !isIEedge;

  // Convert a jQuery object to an array, or convert a single element to an array.
  if (typeof elems.toArray === "function") {
    elems = elems.toArray();
  } else if (!Array.isArray(elems)) {
    elems = [elems];
  }

  elems.forEach(table => {
    if (!tableScrollPositions.get(table)) {
      const wrapper = table.parentElement;
      const id = nanoid();
      // table.dataset.snsId = id;
      table.classList.add(`sns-${id}`);
      const styleElem = document.createElement("style");

      // The data-sns-scroll-left & data-sns-scroll-top attributes are attributes
      // that 3rd party libraries can use to interface with Stick-n-Slide.
      // If these values are changed, then update both the scroll position and the
      // transform positions of stuck elements.
      new MutationObserver((mutations, observer) => {
        const wrapper = mutations[0].target;
        styleElem.textContent = cellStyles({
          id,
          left: wrapper.dataset.snsScrollLeft,
          top: wrapper.dataset.snsScrollTop
        });
        wrapper.scrollLeft = wrapper.dataset.snsScrollLeft;
        wrapper.scrollTop = wrapper.dataset.snsScrollTop;
      }).observe(wrapper, {
        attributes: true,
        attributeFilter: ["data-sns-scroll-left", "data-sns-scroll-top"],
        attributeOldValue: true
      });

      wrapper.addEventListener(
        "wheel",
        event => {
          const normalized = normalizeWheel(event);
          wheelEventTriggered = true;
          const { pixelX, pixelY } = normalized;
          const {
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight
          } = wrapper;

          const opts = {
            table,
            wrapper,
            stickyElems,
            pixelX,
            pixelY,
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight,
            showShadow,
            callback,
            isIE11
          };

          if (isIE || isIEedge) {
            event.preventDefault();
            event.stopPropagation();
            wheelHandler(opts);
          } else {
            event.preventDefault();
            wheelHandler(opts);
          }
        },
        { capture: true }
      );

      wrapper.addEventListener("scroll", () => {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(table, stickyElems, wrapper, showShadow, callback);
        }
      });

      const stickyElems = [
        "sns--is-stuck",
        "sns--is-stuck-y",
        "sns--is-stuck-x"
      ].reduce((acc, className) => {
        acc.push(table.getElementsByClassName(className));
        return acc;
      }, []);

      if (getComputedStyle(wrapper).position === "static") {
        wrapper.style.position = "relative";
      }
      table.classList.add("sns");
      table.style.position = "relative";

      ["Top", "Left"].forEach(side => {
        if (table[`offset${side}`] > 0) {
          table.style[side.toLowerCase()] = `-${table[`offset${side}`]}px`;
        }
      });

      const scrollPositions = {
        id,
        styleElem,
        left: wrapper.scrollLeft || 0,
        top: wrapper.scrollTop || 0
      };
      tableScrollPositions.set(table, scrollPositions);

      styleElem.textContent = cellStyles({
        id,
        left: scrollPositions.left,
        top: scrollPositions.top
      });
      wrapper.appendChild(styleElem);

      for (let stickyIdx = 0; stickyIdx < stickyElems.length; stickyIdx++) {
        for (
          let typeIdx = 0;
          typeIdx < stickyElems[stickyIdx].length;
          typeIdx++
        ) {
          const cell = stickyElems[stickyIdx][typeIdx];
          generateBorder({
            cell,
            isFirefox,
            isIE11,
            scrollPositions,
            showShadow
          });
        }
      }

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      requestAnimationFrame(() => {
        // positionStickyElements(table, stickyElems, showShadow, isIE11);
        positionStickyElements(
          table,
          stickyElems,
          showShadow,
          wrapper.scrollLeft,
          wrapper.scrollTop
        );

        if (isIE11) {
          ie11SetInnerCellHeights(table, stickyElems);
        }

        // ----------------------------
        // Handle IE11 mutations to the table cells.
        requestAnimationFrame(() => {
          if (isIE && !isIEedge) {
            let observer = new MutationObserver(handleMutations);
            observer.observe(table, observeConfig);
          } else {
            new MutationObserver(mutations => {
              mutations.forEach(mutation => {
                if (!/^THEAD|TBODY|TFOOT|TH|TD$/.test(mutation.target.nodeName))
                  return;

                for (
                  let stickyIdx = 0;
                  stickyIdx < stickyElems.length;
                  stickyIdx++
                ) {
                  for (
                    let typeIdx = 0;
                    typeIdx < stickyElems[stickyIdx].length;
                    typeIdx++
                  ) {
                    const cell = stickyElems[stickyIdx][typeIdx];
                    generateBorder({
                      cell,
                      isFirefox,
                      isIE11,
                      scrollPositions,
                      showShadow
                    });
                  }
                }
              });
            }).observe(wrapper, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ["class"]
            });
          }
        });
      });
    }
    return;
  });

  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      elems.forEach(table => {
        if (isIE11) {
          ie11SetInnerCellHeights(table, stickyElems);
        }
      });
    });
  });
}

export default index;
//# sourceMappingURL=stick-n-slide.esm.js.map
