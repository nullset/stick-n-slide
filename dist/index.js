(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("stick-n-slide", [], factory);
	else if(typeof exports === 'object')
		exports["stick-n-slide"] = factory();
	else
		root["stick-n-slide"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 89);
/******/ })
/************************************************************************/
/******/ ({

/***/ 89:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stick_n_slide_scss__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stick_n_slide_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__stick_n_slide_scss__);


function altSide(side) {
  switch (side) {
    case 'Left':
      return 'Right';
    case 'Right':
      return 'Left';
    case 'Top':
      return 'Bottom';
    case 'Bottom':
      return 'Top';
  }
}

function wheelHandler(_ref) {
  var table = _ref.table,
      wrapper = _ref.wrapper,
      stickyElems = _ref.stickyElems,
      deltaX = _ref.deltaX,
      deltaY = _ref.deltaY,
      scrollLeft = _ref.scrollLeft,
      scrollTop = _ref.scrollTop,
      scrollWidth = _ref.scrollWidth,
      scrollHeight = _ref.scrollHeight,
      clientWidth = _ref.clientWidth,
      clientHeight = _ref.clientHeight,
      showShadow = _ref.showShadow,
      callback = _ref.callback;

  var maxWidth = scrollWidth - clientWidth;
  var maxHeight = scrollHeight - clientHeight;
  var newX = scrollLeft + deltaX;
  var newY = scrollTop + deltaY;
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
  positionStickyElements(table, stickyElems, showShadow, newX, newY);
  wrapper.scrollLeft = newX;
  wrapper.scrollTop = newY;
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
  var rgb = window.getComputedStyle(cell).backgroundColor.replace('rgb(', '').replace(')', '').split(',').map(function (value) {
    return Math.round(parseInt(value, 10) * .3);
  }).join(',');
  return 'rgba(' + rgb + ',' + opacity + ')';
}

function positionStickyElements(table, elems, showShadow) {
  var offsetX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var offsetY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

  if (elems) {
    elems.forEach(function (cell) {
      var transforms = [];
      if (cell.classList.contains('sns--is-stuck-y') || cell.classList.contains('sns--is-stuck')) {
        transforms.push('translateY(' + offsetY + 'px)');
      }
      if (cell.classList.contains('sns--is-stuck-x') || cell.classList.contains('sns--is-stuck')) {
        transforms.push('translateX(' + offsetX + 'px)');
      }
      cell.style.transform = transforms.join(' ');
      positionShadow(cell, showShadow, offsetX, offsetY);
    });
  }
}

function positionShadow(cell, showShadow, offsetX, offsetY) {
  if (!showShadow) return;
  var shadowColor = calculateShadowColor(cell, 0.4);
  var xShadow = '0 0';
  var yShadow = '0 0';
  var shadow = void 0;
  if (offsetY) {
    shadow = calculateShadowOffset(offsetY);
    yShadow = '0 ' + shadow + 'px ' + shadowColor;
  }
  if (offsetX) {
    shadow = calculateShadowOffset(offsetX);
    xShadow = shadow + 'px 0 ' + shadowColor;
  }
  cell.style.setProperty('--x-shadow', xShadow);
  cell.style.setProperty('--y-shadow', yShadow);
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
  cell.classList.add('sns__placeholder-cell');
  var innerCell = document.createElement('div');
  innerCell.setAttribute('class', 'sns__cell-inner');
  var cellContents = document.createElement('div');
  cellContents.setAttribute('class', 'sns__cell-contents');
  var setStyles = true;
  while (cell.firstChild) {
    cellContents.appendChild(cell.firstChild);
    if (cell.firstChild && cell.firstChild.classList && cell.firstChild.classList.contains('sns__cell-inner')) {
      while (cell.firstChild.firstChild.firstChild) {
        cellContents.appendChild(cell.firstChild.firstChild.firstChild);
      }
      innerCell.setAttribute('style', cell.firstChild.getAttribute('style'));
      innerCell.style.height = '';
      if ('removeNode' in cell.firstChild) {
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
  cell.innerHTML = '';
  cell.appendChild(innerCell);

  if (setStyles) {
    ['padding', 'border'].forEach(function (property) {
      ['Top', 'Right', 'Bottom', 'Left'].forEach(function (side) {
        if (property === 'border') {
          var borderWidth = cellStyles['border' + side + 'Width'];
          innerCell.style['margin' + altSide(side)] = 'calc(-1 * (' + borderWidth + ' / 2))';

          ['Width', 'Color', 'Style'].forEach(function (attr) {
            var value = cellStyles['' + property + side + attr];
            innerCell.style['' + property + side + attr] = value;
          });
        } else {
          innerCell.style['' + property + side] = cellStyles['' + property + side];
        }
      });
      cell.style[property] = '0';
    });

    innerCell.style.alignItems = verticalAlignment(cellStyles.verticalAlign);
  }
}

// Convert regular `vertical-align` CSS into flexbox friendly alternative.
function verticalAlignment(value) {
  switch (value) {
    case 'middle':
      return 'center';
    case 'top':
      return 'start';
    case 'bottom':
      return 'end';
    case 'baseline':
      return 'baseline';
    default:
      return '';
  }
}

function setInnerCellHeights(table) {
  Array.prototype.slice.call(table.querySelectorAll('tr')).forEach(function (row) {
    Array.prototype.slice.call(row.children).forEach(function (cell) {
      cell.style.height = '';
      requestAnimationFrame(function () {
        cell.style.height = cell.getBoundingClientRect().height + 'px';
      });
    });
  });
}

/* harmony default export */ __webpack_exports__["default"] = (function (elems) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var showShadow = options.showShadow,
      callback = options.callback;

  // Convert a jQuery object to an array, or convert a single element to an array.

  if (typeof elems.toArray === 'function') {
    elems = elems.toArray();
  } else if (!Array.isArray(elems)) {
    elems = [elems];
  }

  elems.forEach(function (table) {
    if (!table.StickNSlide) {
      table.StickNSlide = true;
      var wrapper = table.parentElement;

      // Must test for FF, because it does some seriously horrible things to the table layout.
      var userAgent = navigator.userAgent.toLowerCase();
      var isFirefox = userAgent.indexOf('firefox') > -1;
      var isIE = userAgent.indexOf('trident') > -1;
      var isIEedge = userAgent.indexOf('edge') > -1;

      var stickyElems = [];
      ['sns--is-stuck', 'sns--is-stuck-x', 'sns--is-stuck-y'].forEach(function (className) {
        stickyElems = stickyElems.concat(Array.from(table.querySelectorAll('.' + className)));
      });

      wrapper.style.position = 'relative';
      table.classList.add('sns');
      table.style.position = 'relative';

      ['Top', 'Left'].forEach(function (side) {
        if (table['offset' + side] > 0) {
          table.style[side.toLowerCase()] = '-' + table['offset' + side] + 'px';
        }
      });

      stickyElems.forEach(function (cell) {

        if (!isIE && !isIEedge) {
          // Behavior for IE11.
          buildInnerCell(cell);
        } else {
          // Everything other than IE11.
          var cellStyles = window.getComputedStyle(cell);
          ['Top', 'Right', 'Bottom', 'Left'].forEach(function (side) {
            ['Width'].forEach(function (property) {
              var borderWidth = cellStyles['border' + side + property];
              if (!isFirefox && !isIEedge) {
                cell.style['margin' + side] = '-' + borderWidth;
              } else {
                // cell.style[`margin${altSide(side)}`] = `calc(-1 * (${borderWidth}))`;
                cell.style['margin' + altSide(side)] = 'calc(-1 * (' + borderWidth + ' + ' + borderWidth + '))';
              }
            });
          });
        }

        var observer = new MutationObserver(function (mutations) {
          var mutation = mutations[0];

          // If first mutation is only mutating the style, assume it is just a transform mutation to handle scrolling and do nothing.
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            return;
          }

          var firstChild = cell.children[0];
          if (cell.childNodes.length === 1 && firstChild && firstChild.classList.contains('sns__cell-inner')) {
            // Mutation has only changed what is inside the .sns__cell-inner <div> so no rebuilding is necessary.
            requestAnimationFrame(function () {
              setInnerCellHeights(table);
            });
            return;
          } else {
            var innerCell = cell.querySelector('.sns__cell-inner');
            var cellContents = cell.querySelector('.sns__cell-contents');
            // cell.children.length > 0 && Array.prototype.slice.call(cell.children).some((node) => node.classList.contains('sns__cell-inner'))
            if (innerCell) {
              // // Mutation has added child nodes along side the .sns__cell-inner <div>, so move these new nodes inside the <div> in the proper location.
              // const contentsFirstChild = cellContents.childNodes[0];
              // const childrenLength = cellContents.childNodes.length;
              // const contentsLastChild = cellContents.childNodes[childrenLength - 1];
              // let haveHitInnerCell = false;
              // let nextNode = contentsLastChild.nextSibling;
              // while (cell.firstChild && cell.firstChild !== innerCell) {
              //   debugger;
              //   const node = cell.firstChild;
              //   // cellContents.appendChild(cell.firstChild);
              //   if (node === innerCell) {
              //     haveHitInnerCell = true;
              //   } else {
              //     if (haveHitInnerCell) {
              //       cellContents.insertBefore(node, nextNode);
              //       nextNode = node.nextSibling;
              //     } else {
              //       cellContents.insertBefore(node, contentsFirstChild);
              //     }
              //   }
              // }
              requestAnimationFrame(function () {
                buildInnerCell(cell);
                setInnerCellHeights(table);
              });

              // Array.prototype.slice.call(cell.childNodes).forEach((node) => {
              //   if (node === innerCell) {
              //     haveHitInnerCell = true;
              //   } else {
              //     if (haveHitInnerCell) {
              //       innerCell.insertBefore(node, prevNode);
              //       prevNode = node.nextSibling;
              //     } else {
              //       innerCell.insertBefore(node, contentsFirstChild);
              //     }
              //   }
              // });
            } else {
              // Mutation has removed the .sns__cell-inner <div> entirely. Rebuild the inner div using the contents of the cell.
              console.log('rebuild entirely');
              ['padding', 'border'].forEach(function (property) {
                cell.style[property] = null;
              });
              requestAnimationFrame(function () {
                buildInnerCell(cell);
                setInnerCellHeights(table);
              });
            }
          }
        });

        observer.observe(cell, {
          childList: true,
          attributes: true,
          characterData: true,
          subtree: true
        });
      });

      // stickyElems = Array.prototype.slice.call(stickyElems).map((cell) => {
      //   const elem = cell.querySelector('.sns__cell-inner');
      //   elem.classList = cell.classList;
      //   elem.classList.remove('blah');
      //   return elem;
      // });

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      var wheelEventTriggered = false;

      // Set initial position of elements to 0.
      requestAnimationFrame(function () {
        positionStickyElements(table, stickyElems, showShadow);
        setInnerCellHeights(table);
      });

      wrapper.addEventListener('wheel', function (event) {
        wheelEventTriggered = true;
        var deltaX = event.deltaX,
            deltaY = event.deltaY;
        var scrollLeft = wrapper.scrollLeft,
            scrollTop = wrapper.scrollTop,
            scrollWidth = wrapper.scrollWidth,
            scrollHeight = wrapper.scrollHeight,
            clientWidth = wrapper.clientWidth,
            clientHeight = wrapper.clientHeight;

        var _wrapper$getBoundingC = wrapper.getBoundingClientRect(),
            width = _wrapper$getBoundingC.width,
            height = _wrapper$getBoundingC.height;

        var handleWheel = wheelHandler.bind(null, { table: table, wrapper: wrapper, stickyElems: stickyElems, deltaX: deltaX, deltaY: deltaY, scrollLeft: scrollLeft, scrollTop: scrollTop, scrollWidth: scrollWidth, scrollHeight: scrollHeight, clientWidth: clientWidth, clientHeight: clientHeight, showShadow: showShadow, callback: callback });

        if (isIE || isIEedge) {
          event.preventDefault();
          event.stopPropagation();
          handleWheel();
        } else if (scrollTop === 0 && deltaY > 0 || scrollTop > 0 && scrollHeight - scrollTop - height > 0 || scrollLeft === 0 && deltaX > 0 || scrollLeft > 0 && scrollWidth - scrollLeft - width > 0) {
          event.preventDefault();
          handleWheel();
        }
      }, { capture: true });

      wrapper.addEventListener('scroll', function () {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(table, stickyElems, wrapper, showShadow, callback);
        }
      });
    }
    return;
  });

  window.addEventListener('resize', function () {
    requestAnimationFrame(function () {
      elems.forEach(function (table) {
        setInnerCellHeights(table);
      });
    });
  });
});

/***/ }),

/***/ 90:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });
});