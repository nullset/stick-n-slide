(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define("stick-n-slide", ["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["stick-n-slide"] = factory(require("jQuery"));
	else
		root["stick-n-slide"] = factory(root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_329__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 328);
/******/ })
/************************************************************************/
/******/ ({

/***/ 328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__demo_scss__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__demo_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__demo_scss__);




function randomColor() {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

function randomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

function backgroundColor(event) {
  event.target.style.backgroundColor = randomColor();
}

document.getElementById('backgroundColor').addEventListener('click', function (event) {
  if (event.currentTarget.dataset.active !== 'true') {
    document.querySelector('table').addEventListener('click', backgroundColor);
  } else {
    document.querySelector('table').removeEventListener('click', backgroundColor);
  }
  event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
});

function borderColor(event) {
  event.target.style.borderColor = randomColor();
}

document.getElementById('borderColor').addEventListener('click', function (event) {
  if (event.currentTarget.dataset.active !== 'true') {
    document.querySelector('table').addEventListener('click', borderColor);
  } else {
    document.querySelector('table').removeEventListener('click', borderColor);
  }
  event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
});

// function borderWidth(event) {
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
  if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
    if (event.target.nextElementSibling) {
      event.target.colSpan = event.target.colSpan + event.target.nextElementSibling.colSpan;
      event.target.nextElementSibling.remove();
    }
  }
}

document.getElementById('mergeCellRow').addEventListener('click', function (event) {
  if (event.currentTarget.dataset.active !== 'true') {
    document.querySelector('table').addEventListener('click', mergeCellRow);
  } else {
    document.querySelector('table').removeEventListener('click', mergeCellRow);
  }
  event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
});

function changeContent(event) {
  if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
    fetch('http://www.randomtext.me/api/lorem/p-1/5-15').then(function (response) {
      return response.json();
    }).then(function (json) {
      event.target.innerHTML = json.text_out;
    });
  }
}

document.getElementById('changeContent').addEventListener('click', function (event) {
  if (event.currentTarget.dataset.active !== 'true') {
    document.querySelector('table').addEventListener('click', changeContent);
  } else {
    document.querySelector('table').removeEventListener('click', changeContent);
  }
  event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
});

__WEBPACK_IMPORTED_MODULE_1_jquery___default()(document).ready(function () {
  var $table = __WEBPACK_IMPORTED_MODULE_1_jquery___default()('table');

  $table.find('thead th:nth-child(-n+3)').each(function (i, th) {
    __WEBPACK_IMPORTED_MODULE_1_jquery___default()(th).addClass('sns--is-stuck');
  });

  $table.find('thead th:nth-child(n+4)').each(function (i, th) {
    __WEBPACK_IMPORTED_MODULE_1_jquery___default()(th).addClass('sns--is-stuck-y');
  });

  $table.find('tbody tr:nth-child(n+1):nth-child(-n+11) *:nth-child(-n+3)').addClass('sns--is-stuck-x');

  $table.find('tbody tr:nth-child(12) *:nth-child(-n+2)').addClass('sns--is-stuck-x');
  $table.find('tbody tr:nth-child(13) *:nth-child(-n+1)').addClass('sns--is-stuck-x');

  // $table.stickyTable();
  Object(__WEBPACK_IMPORTED_MODULE_0__index__["default"])($table);
});

/***/ }),

/***/ 329:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_329__;

/***/ }),

/***/ 330:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

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
        var cellStyles = window.getComputedStyle(cell);

        ['Top', 'Right', 'Bottom', 'Left'].forEach(function (side) {
          ['Width'].forEach(function (property) {
            var borderWidth = cellStyles['border' + side + property];

            // Use a !isFirefox because there's no reason to penalize every other browser for FF weirdness.
            if (!isFirefox && !isIE && !isIEedge) {
              cell.style['margin' + side] = '-' + borderWidth;
            } else {
              // Fixes FF for 1 px, but nothing else :(
              cell.style['margin' + altSide(side)] = 'calc(-1 * (' + borderWidth + ' + ' + borderWidth + '))';
            }
          });
        });
      });

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      var wheelEventTriggered = false;

      // Set initial position of elements to 0.
      positionStickyElements(table, stickyElems, showShadow);

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
});

/***/ }),

/***/ 90:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });
});