import './index.scss';
import $ from 'jquery';

$(document).ready(() => {
    
  $.fn.stickyTable = function (args) {
    this.each(() => {
      const $wrapper = this;
      const $table = this.find('> table');
      const table = $table[0];
      const tableStyles = window.getComputedStyle(table);
      window.tableStyles = tableStyles;
      // const $wrapper = wrapTable($table, tableStyles);
      const wrapper = $wrapper[0];
      // const stickyElems = Array.from(table.querySelectorAll('th[class*="sticky--is-stuck"], td[class*="sticky--is-stuck"]'));
      const stickyElems = $table.find('th[class*="sticky--is-stuck"], td[class*="sticky--is-stuck"]').toArray();
      console.log('stickyElems', stickyElems);

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      positionStickyElements(stickyElems);

      // $wrapper.off('wheel.stickyTable mousewheel.stickyTable', wheelHandler).on('wheel.stickyTable mousewheel.stickyTable', function (event) {
      wrapper.addEventListener('wheel', (event) => {
        wheelEventTriggered = true;
        const { deltaX, deltaY } = event;
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight } = wrapper;
        const { width, height } = wrapper.getBoundingClientRect();

        if ( 
          ((scrollTop === 0 && deltaY > 0) || (scrollTop > 0 && scrollHeight - scrollTop - height > 0))
          ||
          ((scrollLeft === 0 && deltaX > 0) || (scrollLeft > 0 && scrollWidth - scrollLeft - width > 0))
        ) {
          event.preventDefault();
          wheelHandler({ wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, width, height });
          // wheelHandler(event, wrapper, stickyElems);
        }
      });

      $wrapper.off('scroll.stickyTable', scrollHandler).on('scroll.stickyTable', () => {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(wrapper, stickyElems);
        }
      });

      return {$table, $wrapper};
    });

    function wheelHandler({ wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, width, height }) {
      const maxWidth = scrollWidth - width;
      const maxHeight = scrollHeight - height;
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
      if (newX > 0 || newY > 0) {
        wrapper.classList.add('sticky--is-scrolling');
      } else {
        wrapper.classList.remove('sticky--is-scrolling');
      }
      positionStickyElements(stickyElems, newX, newY);
      wrapper.scrollLeft = newX;
      wrapper.scrollTop = newY;
    }

    function scrollHandler(wrapper, stickyElems) {
      requestAnimationFrame(() => {
        updateScrollPosition(wrapper, stickyElems);
      });
    }

    function updateScrollPosition(wrapper, stickyElems) {
      wrapper.setAttribute('data-scroll-left', wrapper.scrollLeft);
      wrapper.setAttribute('data-scroll-top', wrapper.scrollTop);
      positionStickyElements(stickyElems, wrapper.scrollLeft, wrapper.scrollTop);
    }

    function calculateShadow(offset) {
      let shadow = Math.ceil(offset/10);
      let max = 4;
      let min = 1;
      if (shadow > max) return max;
      if (shadow < min) return min;
      return shadow;
    }

    function positionStickyElements(elems, offsetX = 0, offsetY = 0) {
      elems.forEach((cell) => {
        let shadowX = calculateShadow(offsetX);
        let shadowY = calculateShadow(offsetY);
        let transforms = [];
        // let shadows = [];
        cell.style.boxShadow = `${shadowX}px ${shadowY}px ${Math.sqrt(shadowX + shadowY)}px rgba(0,0,0,0.3)`;
        if (!cell.classList.contains('sticky--is-stuck-y') || cell.classList.contains('sticky--is-stuck')) {
          transforms.push(`translateX(${offsetX}px)`);
          // shadows.push(`${shadowX}px ${0}px ${shadowY}px rgba(0,0,0,0.3)`);
        }
        if (!cell.classList.contains('sticky--is-stuck-x') || cell.classList.contains('sticky--is-stuck')) {
          transforms.push(`translateY(${offsetY}px)`);
          // shadows.push(`${0}px ${shadowY}px ${shadowX}px rgba(0,0,0,0.3)`);
        }
        // cell.style.boxShadow = shadows.join(',');
        cell.style.transform = transforms.join(' ');
      });
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
  
  
  $table.find('tbody tr:nth-child(n+1):nth-child(-n+5) *:nth-child(-n+3)').addClass('sticky--is-stuck-x');
  
  $table.find('tbody tr:nth-child(6) *:nth-child(-n+2)').addClass('sticky--is-stuck-x');
  $table.find('tbody tr:nth-child(7) *:nth-child(-n+1)').addClass('sticky--is-stuck-x');
  
  
  // $table.stickyTable();
  $wrapper.stickyTable();
  
});
