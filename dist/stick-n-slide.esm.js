import normalizeWheel from 'normalize-wheel';

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
};

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
  setInnerCellHeights(table);
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = cellsOfType[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var cell = _step.value;
          setCellTransforms({
            cell: cell,
            showShadow: showShadow,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
    tableScrollPositions.set(table, {
      left: scrollLeft,
      top: scrollTop
    });
    table.dispatchEvent(new CustomEvent("sns:scroll", {
      detail: {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      }
    }));
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

function setInnerCellHeights(table) {
  var stickyElems = table.getElementsByClassName("sns--is-stuck sns--is-stuck-y sns--is-stuck-x");
  stickyElems.forEach(function (cell) {
    cell.style.height = "";
  });
  requestAnimationFrame(function () {
    stickyElems.forEach(function (cell) {
      cell.style.height = "".concat(cell.getBoundingClientRect().height, "px");
    });
  });
}

function processCell(_ref3) {
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

function index (elems) {
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
        var normalized = normalizeWheel(event);
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
          stickyElems: stickyElems,
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
        console.log(stickyElems.map(function (coll) {
          return Array.from(coll);
        }).flat().length);

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
          scrollHandler(table, stickyElems, wrapper, showShadow, callback);
        }
      }); // --------------------

      var stickyElems = ["sns--is-stuck", "sns--is-stuck-y", "sns--is-stuck-x"].reduce(function (acc, className) {
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
      stickyElems.forEach(function (cellsOfType) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = cellsOfType[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var cell = _step2.value;
            processCell({
              cell: cell,
              isFirefox: isFirefox,
              isIE11: isIE11,
              scrollPositions: scrollPositions,
              showShadow: showShadow
            });
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }); // processCells(stickyElems, { isFirefox, isIE11: isIE11() });
      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.

      var wheelEventTriggered = false; // Set initial position of elements to 0.

      requestAnimationFrame(function () {
        // positionStickyElements(table, stickyElems, showShadow, isIE11);
        positionStickyElements(table, stickyElems, showShadow, wrapper.scrollLeft, wrapper.scrollTop);

        if (isIE11) {
          setInnerCellHeights(table);
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
                  processCell({
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
          setInnerCellHeights(table);
        }
      });
    });
  });
}

export default index;
//# sourceMappingURL=stick-n-slide.esm.js.map
