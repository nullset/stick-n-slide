(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// import './stick-n-slide.scss';
// // import jQuery from 'jquery';

// require('./stick-n-slide.scss');
// var $ = require('jquery');

// // (function ($) {
// $.fn.stickNSlide = function () {
//   this.each(() => {
//     const $table = this;
//     const table = $table[0];
//     const $wrapper = $table.parent();
//     const wrapper = $wrapper[0];


//     // Must test for FF, because it does some seriously horrible things to the table layout.
//     const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

//     const stickyElems = $table.find('th[class*="Stick-n-Slide--is-stuck"], td[class*="Stick-n-Slide--is-stuck"]').toArray();

//     wrapper.style.position = 'relative';
//     table.classList.add('Stick-n-Slide');
//     table.style.position = 'relative';

//     ['Top', 'Left'].forEach((side) => {
//       if (table[`offset${side}`] > 0) {
//         table.style[side.toLowerCase()] = `-${table[`offset${side}`]}px`;
//       }
//     });

//     stickyElems.forEach((cell) => {
//       const cellStyles = window.getComputedStyle(cell);        

//       ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
//         ['Width'].forEach((property) => {
//           const borderWidth = cellStyles[`border${side}${property}`];

//           // Use a !isFirefox because there's no reason to penalize every other browser for FF weirdness.
//           if (!isFirefox) {
//             cell.style[`margin${side}`] = `-${borderWidth}`;
//           } else {
//             // Fixes for 1 px, but nothing else :()
//             cell.style[`margin${altSide(side)}`] = `calc(-1 * (${borderWidth} + ${borderWidth}))`;
//           }


//           // let tableOffset = 0;
//           // if (side === 'Top' || side === 'Bottom') {
//           //   tableOffset = tableStyles.borderTopWidth;
//           // } else {
//           //   tableOffset = tableStyles.borderLeftWidth;
//           // }
//           // if (side === 'Right' || side === 'Bottom') {
//           //   tableOffset = `-${tableOffset}`;
//           // }
//           // cell.style[`margin${side}`] = `calc(-1 * (${borderWidth} + ${tableOffset}))`;
//         });
//       });
//     });

//     function altSide(side) {
//       switch(side) {
//       case 'Left':
//         return 'Right';
//       case 'Right':
//         return 'Left';
//       case 'Top':
//         return 'Bottom';
//       case 'Bottom':
//         return 'Top';
//       }
//     }

//     // Variable that tracks whether "wheel" event was called.
//     // Prevents both "wheel" and "scroll" events being triggered simultaneously.
//     let wheelEventTriggered = false;

//     // Set initial position of elements to 0.
//     positionStickyElements(table, stickyElems);

//     wrapper.addEventListener('wheel', (event) => {
//       wheelEventTriggered = true;
//       const { deltaX, deltaY } = event;
//       const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = wrapper;
//       const { width, height } = wrapper.getBoundingClientRect();

//       if ( 
//         ((scrollTop === 0 && deltaY > 0) || (scrollTop > 0 && scrollHeight - scrollTop - height > 0))
//         ||
//         ((scrollLeft === 0 && deltaX > 0) || (scrollLeft > 0 && scrollWidth - scrollLeft - width > 0))
//       ) {
//         event.preventDefault();
//         wheelHandler({ table, wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight });
//       }
//     }, {capture: true});

//     wrapper.addEventListener('scroll', () => {
//       if (wheelEventTriggered) {
//         wheelEventTriggered = false;
//       } else {
//         scrollHandler(table, stickyElems, wrapper);
//       }
//     });

//     return {$table, $wrapper};
//   });

//   function wheelHandler({ table, wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight }) {
//     const maxWidth = scrollWidth - clientWidth;
//     const maxHeight = scrollHeight - clientHeight;
//     let newX = scrollLeft + deltaX;
//     let newY = scrollTop + deltaY;
//     if (newX >= maxWidth) {
//       newX = maxWidth;
//     }
//     if (newX <= 0) {
//       newX = 0;
//     }
//     if (newY >= maxHeight) {
//       newY = maxHeight;
//     }
//     if (newY <= 0) {
//       newY = 0;
//     }
//     positionStickyElements(table, stickyElems, newX, newY);
//     wrapper.scrollLeft = newX;
//     wrapper.scrollTop = newY;
//   }

//   function scrollHandler(table, stickyElems, wrapper) {
//     updateScrollPosition(table, stickyElems, wrapper);
//   }

//   function updateScrollPosition(table, stickyElems, wrapper) {
//     positionStickyElements(table, stickyElems, wrapper.scrollLeft, wrapper.scrollTop);
//   }

//   function calculateShadowColor(cell, opacity) {
//     const rgb = window.getComputedStyle(cell)
//       .backgroundColor
//       .replace('rgb(', '')
//       .replace(')', '')
//       .split(',')
//       .map((value) => Math.round(parseInt(value, 10) * .3))
//       .join(',');
//     return `rgba(${rgb},${opacity})`;
//   }

//   function calculateShadowOffset(value) {
//     value = Math.ceil(value/10);
//     if (value > 3) {
//       return 3;
//     } else {
//       return value;
//     }
//   }

//   function positionStickyElements(table, elems, offsetX = 0, offsetY = 0) {
//     if (elems) {
//       elems.forEach((cell, i) => {
//         let transforms = [];
//         const shadowColor = calculateShadowColor(cell, 0.4);
//         let xShadow = '0 0';
//         let yShadow = '0 0';
//         let shadow;
//         if (cell.classList.contains('Stick-n-Slide--is-stuck-y') || cell.classList.contains('Stick-n-Slide--is-stuck')) {
//           transforms.push(`translateY(${offsetY}px)`);
//           shadow = calculateShadowOffset(offsetY);
//           yShadow = `0 ${shadow}px ${shadowColor}`;
//         }
//         if (cell.classList.contains('Stick-n-Slide--is-stuck-x') || cell.classList.contains('Stick-n-Slide--is-stuck')) {
//           transforms.push(`translateX(${offsetX}px)`);
//           shadow = calculateShadowOffset(offsetX);
//           xShadow = `${shadow}px 0 ${shadowColor}`;
//         }
//         cell.style.transform = transforms.join(' ');
//         cell.style.setProperty('--x-shadow', xShadow);
//         cell.style.setProperty('--y-shadow', yShadow);
//       });
//     }
//   }

//   return this;
// };
// // })(jQuery);


module.exports = function (elems) {
  if (!Array.isArray(elems)) {
    elems = [elems];
  }

  elems.forEach(function (table) {
    if (!table.StickNSlide) {
      table.StickNSlide = true;
      var wrapper = table.parentElement;

      // Must test for FF, because it does some seriously horrible things to the table layout.
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

      var stickyElems = [];
      ['Stick-n-Slide--is-stuck', 'Stick-n-Slide--is-stuck-x', 'Stick-n-Slide--is-stuck-y'].forEach(function (className) {
        stickyElems = stickyElems.concat(Array.from(table.querySelectorAll('.' + className)));
      });

      // const stickyElems = $table.find('th[class*="Stick-n-Slide--is-stuck"], td[class*="Stick-n-Slide--is-stuck"]').toArray();

      wrapper.style.position = 'relative';
      table.classList.add('Stick-n-Slide');
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
            if (!isFirefox) {
              cell.style['margin' + side] = '-' + borderWidth;
            } else {
              // Fixes for 1 px, but nothing else :()
              cell.style['margin' + altSide(side)] = 'calc(-1 * (' + borderWidth + ' + ' + borderWidth + '))';
            }

            // let tableOffset = 0;
            // if (side === 'Top' || side === 'Bottom') {
            //   tableOffset = tableStyles.borderTopWidth;
            // } else {
            //   tableOffset = tableStyles.borderLeftWidth;
            // }
            // if (side === 'Right' || side === 'Bottom') {
            //   tableOffset = `-${tableOffset}`;
            // }
            // cell.style[`margin${side}`] = `calc(-1 * (${borderWidth} + ${tableOffset}))`;
          });
        });
      });

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      var wheelEventTriggered = false;

      // Set initial position of elements to 0.
      positionStickyElements(table, stickyElems);

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

        if (scrollTop === 0 && deltaY > 0 || scrollTop > 0 && scrollHeight - scrollTop - height > 0 || scrollLeft === 0 && deltaX > 0 || scrollLeft > 0 && scrollWidth - scrollLeft - width > 0) {
          event.preventDefault();
          wheelHandler({ table: table, wrapper: wrapper, stickyElems: stickyElems, deltaX: deltaX, deltaY: deltaY, scrollLeft: scrollLeft, scrollTop: scrollTop, scrollWidth: scrollWidth, scrollHeight: scrollHeight, clientWidth: clientWidth, clientHeight: clientHeight });
        }
      }, { capture: true });

      wrapper.addEventListener('scroll', function () {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(table, stickyElems, wrapper);
        }
      });
    }
    return;
  });

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
        clientHeight = _ref.clientHeight;

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
    positionStickyElements(table, stickyElems, newX, newY);
    wrapper.scrollLeft = newX;
    wrapper.scrollTop = newY;
  }

  function scrollHandler(table, stickyElems, wrapper) {
    updateScrollPosition(table, stickyElems, wrapper);
  }

  function updateScrollPosition(table, stickyElems, wrapper) {
    positionStickyElements(table, stickyElems, wrapper.scrollLeft, wrapper.scrollTop);
  }

  function calculateShadowColor(cell, opacity) {
    var rgb = window.getComputedStyle(cell).backgroundColor.replace('rgb(', '').replace(')', '').split(',').map(function (value) {
      return Math.round(parseInt(value, 10) * .3);
    }).join(',');
    return 'rgba(' + rgb + ',' + opacity + ')';
  }

  function calculateShadowOffset(value) {
    value = Math.ceil(value / 10);
    if (value > 3) {
      return 3;
    } else {
      return value;
    }
  }

  function positionStickyElements(table, elems) {
    var offsetX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var offsetY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (elems) {
      elems.forEach(function (cell, i) {
        var transforms = [];
        var shadowColor = calculateShadowColor(cell, 0.4);
        var xShadow = '0 0';
        var yShadow = '0 0';
        var shadow = void 0;
        if (cell.classList.contains('Stick-n-Slide--is-stuck-y') || cell.classList.contains('Stick-n-Slide--is-stuck')) {
          transforms.push('translateY(' + offsetY + 'px)');
          shadow = calculateShadowOffset(offsetY);
          yShadow = '0 ' + shadow + 'px ' + shadowColor;
        }
        if (cell.classList.contains('Stick-n-Slide--is-stuck-x') || cell.classList.contains('Stick-n-Slide--is-stuck')) {
          transforms.push('translateX(' + offsetX + 'px)');
          shadow = calculateShadowOffset(offsetX);
          xShadow = shadow + 'px 0 ' + shadowColor;
        }
        cell.style.transform = transforms.join(' ');
        cell.style.setProperty('--x-shadow', xShadow);
        cell.style.setProperty('--y-shadow', yShadow);
      });
    }
  }
};

/***/ })
/******/ ]);
});