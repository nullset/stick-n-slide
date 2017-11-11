import './index.scss';
import $ from 'jquery';

$(document).ready(() => {
    
  $.fn.stickyTable = function (args) {
    this.each(() => {
      const $table = this;
      const table = $table[0];
      const $wrapper = $table.parent();
      const wrapper = $wrapper[0];

      // Must test for FF, because it does some seriously horrible things to the table layout.
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

      const tableStyles = window.getComputedStyle(table);
      const stickyElems = $table.find('th[class*="sticky--is-stuck"], td[class*="sticky--is-stuck"]').toArray();

      wrapper.style.position = 'relative';
      table.style.position = 'relative';
      ['Top', 'Left'].forEach((side) => {
        if (table[`offset${side}`] > 0) {
          table.style[side.toLowerCase()] = `-${table[`offset${side}`]}px`;
        }
      });

      stickyElems.forEach((cell) => {
        const cellStyles = window.getComputedStyle(cell);        
        
        ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
          ['Width'].forEach((property) => {
            const borderWidth = cellStyles[`border${side}${property}`];

            // Use a !isFirefox because there's no reason to penalize every other browser for FF weirdness.
            if (!isFirefox) {
              cell.style[`margin${side}`] = `-${borderWidth}`;
            } else {
              // Fixes for 1 px, but nothing else :()
              cell.style[`margin${altSide(side)}`] = `calc(-1 * (${borderWidth} + ${borderWidth}))`;
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

      function altSide(side) {
        switch(side) {
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

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      positionStickyElements(table, stickyElems);

      wrapper.addEventListener('wheel', (event) => {
        wheelEventTriggered = true;
        const { deltaX, deltaY } = event;
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = wrapper;
        const { width, height } = wrapper.getBoundingClientRect();

        if ( 
          ((scrollTop === 0 && deltaY > 0) || (scrollTop > 0 && scrollHeight - scrollTop - height > 0))
          ||
          ((scrollLeft === 0 && deltaX > 0) || (scrollLeft > 0 && scrollWidth - scrollLeft - width > 0))
        ) {
          event.preventDefault();
          wheelHandler({ table, wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight });
        }
      }, {capture: true});

      wrapper.addEventListener('scroll', () => {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(table, stickyElems, wrapper);
        }
      });

      return {$table, $wrapper};
    });

    function wheelHandler({ table, wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight }) {
      const maxWidth = scrollWidth - clientWidth;
      const maxHeight = scrollHeight - clientHeight;
      let newX = scrollLeft + deltaX;
      let newY = scrollTop + deltaY;
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
      const rgb = window.getComputedStyle(cell)
        .backgroundColor
        .replace('rgb(', '')
        .replace(')', '')
        .split(',')
        .map((value) => Math.round(parseInt(value, 10) * .3))
        .join(',');
      return `rgba(${rgb},${opacity})`;
    }

    function calculateShadowOffset(value) {
      value = Math.ceil(value/10);
      if (value > 3) {
        return 3;
      } else {
        return value;
      }
    }

    function positionStickyElements(table, elems, offsetX = 0, offsetY = 0) {
      if (elems) {
        elems.forEach((cell, i) => {
          let transforms = [];
          const shadowColor = calculateShadowColor(cell, 0.4);
          let xShadow = '0 0';
          let yShadow = '0 0';
          let shadow;
          if (cell.classList.contains('sticky--is-stuck-y') || cell.classList.contains('sticky--is-stuck')) {
            transforms.push(`translateY(${offsetY}px)`);
            shadow = calculateShadowOffset(offsetY);
            yShadow = `0 ${shadow}px ${shadowColor}`;
          }
          if (cell.classList.contains('sticky--is-stuck-x') || cell.classList.contains('sticky--is-stuck')) {
            transforms.push(`translateX(${offsetX}px)`);
            shadow = calculateShadowOffset(offsetX);
            xShadow = `${shadow}px 0 ${shadowColor}`;
          }
          cell.style.transform = transforms.join(' ');
          cell.style.setProperty('--x-shadow', xShadow);
          cell.style.setProperty('--y-shadow', yShadow);
        });
      }
    }

    return this;
  };

});

// --------------------------------------------------

$(document).ready(function() {
  var $table = $('#blah');
  var $wrapper = $('#scroller');
  
  $table.find('thead th:nth-child(-n+3)').each((i, th) => {
    $(th).addClass('sticky--is-stuck');
  });
  
  $table.find('thead th:nth-child(n+4)').each((i, th) => {
    $(th).addClass('sticky--is-stuck-y');
  });
  
  
  // [5, 4, 3, 2, 1].forEach((num) => {
  //   $table.find(`tbody tr:nth-child(n+1):nth-child(-n+${num})`).each((i, row) => {
  //     $(row).find(`td:nth-child(-n+${num})`).addClass('sticky sticky-scroll-y');
  //   })  
  // });
  
  
  $table.find('tbody tr:nth-child(n+1):nth-child(-n+11) *:nth-child(-n+3)').addClass('sticky--is-stuck-x');
  
  $table.find('tbody tr:nth-child(12) *:nth-child(-n+2)').addClass('sticky--is-stuck-x');
  $table.find('tbody tr:nth-child(13) *:nth-child(-n+1)').addClass('sticky--is-stuck-x');
  
  
  // $table.stickyTable();
  $table.stickyTable();
  
});
