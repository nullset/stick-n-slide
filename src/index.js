import './stick-n-slide.scss';

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

function wheelHandler({ table, wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight, showShadow, callback }) {
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
  positionStickyElements(table, stickyElems, showShadow, newX, newY);
  wrapper.scrollLeft = newX;
  wrapper.scrollTop = newY;
  if (callback) {
    callback(newX, newY);
  }
}

function calculateShadowOffset(value) {
  value = Math.ceil(value/10);
  if (value > 2) {
    return 2;
  } else {
    return value;
  }
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

function positionStickyElements(table, elems, showShadow, offsetX = 0, offsetY = 0) {
  if (elems) {
    elems.forEach((cell) => {
      let transforms = [];
      if (cell.classList.contains('sns--is-stuck-y') || cell.classList.contains('sns--is-stuck')) {
        transforms.push(`translateY(${offsetY}px)`);
      }
      if (cell.classList.contains('sns--is-stuck-x') || cell.classList.contains('sns--is-stuck')) {
        transforms.push(`translateX(${offsetX}px)`);
      }
      cell.style.transform = transforms.join(' ');
      positionShadow(cell, showShadow, offsetX, offsetY);      
    });
  }
}

function positionShadow(cell, showShadow, offsetX, offsetY) {
  if (!showShadow) return;
  const shadowColor = calculateShadowColor(cell, 0.4);
  let xShadow = '0 0';
  let yShadow = '0 0';
  let shadow;
  if (offsetY) {
    shadow = calculateShadowOffset(offsetY);
    yShadow = `0 ${shadow}px ${shadowColor}`;
  }
  if (offsetX) {
    shadow = calculateShadowOffset(offsetX);
    xShadow = `${shadow}px 0 ${shadowColor}`;
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


export default function(elems, options = {}) {
  const { showShadow, callback } = options;

  // Convert a jQuery object to an array, or convert a single element to an array.
  if (typeof elems.toArray === 'function') {
    elems = elems.toArray();
  } else if (!Array.isArray(elems)) {
    elems = [elems];
  }

  elems.forEach((table) => {
    if (!table.StickNSlide) {
      table.StickNSlide = true;
      const wrapper = table.parentElement;

      // Must test for FF, because it does some seriously horrible things to the table layout.
      const userAgent = navigator.userAgent.toLowerCase();
      const isFirefox = userAgent.indexOf('firefox') > -1;
      const isIE = userAgent.indexOf('trident') > -1;
      const isIEedge = userAgent.indexOf('edge') > -1;

      let stickyElems = [];
      ['sns--is-stuck', 'sns--is-stuck-x', 'sns--is-stuck-y'].forEach((className) => {
        stickyElems = stickyElems.concat(Array.from(table.querySelectorAll(`.${className}`)));
      });

      wrapper.style.position = 'relative';
      table.classList.add('sns');
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
            if (!isFirefox && !isIE && !isIEedge) {
              cell.style[`margin${side}`] = `-${borderWidth}`;
            } else {
              // Fixes FF for 1 px, but nothing else :(
              cell.style[`margin${altSide(side)}`] = `calc(-1 * (${borderWidth} + ${borderWidth}))`;
            }
          });
        });
      });

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      positionStickyElements(table, stickyElems, showShadow);

      wrapper.addEventListener('wheel', (event) => {
        wheelEventTriggered = true;
        const { deltaX, deltaY } = event;
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = wrapper;
        const { width, height } = wrapper.getBoundingClientRect();

        const handleWheel = wheelHandler.bind(null, { table, wrapper, stickyElems, deltaX, deltaY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight, showShadow, callback });

        if (isIE || isIEedge) {
          event.preventDefault();
          event.stopPropagation();
          handleWheel();
        } else if ( 
          ((scrollTop === 0 && deltaY > 0) || (scrollTop > 0 && scrollHeight - scrollTop - height > 0))
          ||
          ((scrollLeft === 0 && deltaX > 0) || (scrollLeft > 0 && scrollWidth - scrollLeft - width > 0))
        ) {
          event.preventDefault();
          handleWheel();
        }
      }, {capture: true});

      wrapper.addEventListener('scroll', () => {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(table, stickyElems, wrapper, showShadow, callback);
        }
      });

    }
    return;
  });

}