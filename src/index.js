import normalizeWheel from 'normalize-wheel';
import './stick-n-slide.scss';

const observeConfig = {
  childList: true,
  // attributes: true,
  // characterData: true,
  subtree: true,
};

function handleMutations(mutations, observer) {
  observer.disconnect(); // Prevent any further updates to the DOM from making the observer thrash.

  const table = closest(mutations[0].target, 'sns');

  mutations.forEach((m) => {
    if (!table.classList.contains('sns--pause-mutation')) {
      if (m.type === 'childList') {
        Array.prototype.slice.call(m.removedNodes).forEach((removedNode) => {
          if (removedNode.classList) {
            if (m.target.tagName == 'TR') {
              // 0) Rebuild entire table TH/TD
              Array.prototype.slice.call(m.removedNodes).forEach((removedNode, i) => {
                const addedNode = m.addedNodes[i];
  
                // Merge DOM attributes
                const oldAttrs = removedNode.attributes;
                for (let i = oldAttrs.length - 1; i >= 0; i--) {
                  const attrName = oldAttrs[i].name;
                  const attrValue = oldAttrs[i].value;
                  if (attrName === 'style') {
                    const oldStyle = (removedNode.getAttribute('style') || '').replace(/;$/, '');
                    addedNode.setAttribute('style', `${oldStyle}; ${addedNode.getAttribute('style')}`);
                  } else if (attrName === 'class') {
                    Array.prototype.slice.call(removedNode.classList).forEach((className) => {
                      addedNode.classList.add(className);
                    });
                  } else {
                    if (addedNode.getAttribute(attrName) === null)  {
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
  
                while(addedNode.firstChild) {
                  contents.appendChild(addedNode.firstChild);
                }
  
                addedNode.appendChild(innerCell);
              });
        
            } else if (removedNode.classList.contains('sns__cell-inner')) {
              // 1.1 - From scratch
              m.target.innerCellStyle = removedNode.getAttribute('style');
            }
          }
        });
        Array.prototype.slice.call(m.addedNodes).forEach((addedNode) => {
          // 1) Rebuild placeholder-cell
          if (m.target.classList.contains('sns__placeholder-cell')) {
            if (m.target.innerCellStyle) {
              // 1.1 - From scratch
              const innerCell = document.createElement('div');
              innerCell.setAttribute('class', 'sns__cell-inner');
              innerCell.setAttribute('style', m.target.innerCellStyle);
              delete m.target.innerCellStyle;
    
              const contents = document.createElement('div');
              contents.classList.add('sns__cell-contents');
              contents.appendChild(addedNode);
              
              innerCell.appendChild(contents);
              m.target.appendChild(innerCell);
            } else {
              // 1.2 - When a direct descendent of placeholder-cell has been created
              const innerCell = document.createElement('div');
              innerCell.setAttribute('class', 'sns__cell-inner');
  
              const contents = document.createElement('div');
              contents.classList.add('sns__cell-contents');
  
              while (m.target.firstChild) {
                const child = m.target.firstChild;
                if (child.classList && child.classList.contains('sns__cell-inner')) {
                  innerCell.setAttribute('style', m.target.firstChild.getAttribute('style'));
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
          if (m.target.classList.contains('sns__cell-inner')) {
            const contents = document.createElement('div');
            contents.classList.add('sns__cell-contents');
  
            if (!Array.prototype.slice.call(m.target.children).find((node) => node.classList.contains('sns__cell-contents'))) {
              // 2.1 - Build from scratch
              contents.appendChild(addedNode);
              m.target.appendChild(contents);  
            } else {
              // 2.2 - When a direct descendent of cell-inner has been created
              while (m.target.firstChild) {
                const child = m.target.firstChild;
                if (child.classList && child.classList.contains('sns__cell-contents')) {
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

  setInnerCellHeights(table);

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

function wheelHandler({ table, wrapper, stickyElems, pixelX, pixelY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight, showShadow, callback, isIE11 }) {
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
    positionStickyElements(table, stickyElems, showShadow, wrapper.scrollLeft, wrapper.scrollTop);
  }
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

function buildInnerCell(cell) {
  const cellStyles = window.getComputedStyle(cell);
  cell.classList.add('sns__placeholder-cell');
  let innerCell = document.createElement('div');
  innerCell.setAttribute('class', 'sns__cell-inner');
  let cellContents = document.createElement('div');
  cellContents.setAttribute('class', 'sns__cell-contents');
  let setStyles = true;
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
    ['padding', 'border'].forEach((property) => {
      ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
        if (property === 'border') {
          const borderWidth = cellStyles[`border${side}Width`];
          innerCell.style[`margin${altSide(side)}`] = `calc(-1 * ${borderWidth})`;

          ['Width', 'Color', 'Style'].forEach((attr) => {
            const value = cellStyles[`${property}${side}${attr}`];
            innerCell.style[`${property}${side}${attr}`] = value;
          });

        } else {
          innerCell.style[`${property}${side}`] = cellStyles[`${property}${side}`];
        }
      });
      cell.style[property] = '0';
    });
  
    innerCell.style.alignItems = verticalAlignment(cellStyles.verticalAlign);  
  }
}

// Convert regular `vertical-align` CSS into flexbox friendly alternative.
function verticalAlignment(value) {
  switch(value) {
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
  const stickyElems = Array.prototype.slice.call(table.querySelectorAll('.sns--is-stuck, .sns--is-stuck-y, .sns--is-stuck-x'));
  stickyElems.forEach((cell) => {
    cell.style.height = '';
  });
  requestAnimationFrame(() => {
    stickyElems.forEach((cell) => {
      cell.style.height = `${cell.getBoundingClientRect().height}px`;
    });
  });

}

export default function(elems, options = {}) {
  const { showShadow, callback } = options;
  // Must test for FF, because it does some seriously horrible things to the table layout.
  const userAgent = navigator.userAgent.toLowerCase();
  const isFirefox = userAgent.indexOf('firefox') > -1;
  const isIE = userAgent.indexOf('trident') > -1;
  const isIEedge = userAgent.indexOf('edge') > -1;

  function isIE11() {
    return isIE && !isIEedge;
  }


  // Convert a jQuery object to an array, or convert a single element to an array.
  if (typeof elems.toArray === 'function') {
    elems = elems.toArray();
  } else if (!Array.isArray(elems)) {
    elems = [elems];
  }

  elems.forEach((table) => {
    if (!table.StickNSlide) {
      table.StickNSlide = {};
      const wrapper = table.parentElement;

      wrapper.addEventListener('wheel', (event) => {
        const normalized = normalizeWheel(event);
        wheelEventTriggered = true;
        const { pixelX, pixelY } = normalized;
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = wrapper;

        const opts = {
          table, wrapper, stickyElems, pixelX, pixelY, scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight, showShadow, callback, isIE11: isIE11(),
        }

        if (isIE || isIEedge) {
          event.preventDefault();
          event.stopPropagation();
          wheelHandler(opts);
        } else {
          event.preventDefault();
          wheelHandler(opts);  
        }
      }, {capture: true});

      wrapper.addEventListener('scroll', () => {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(table, stickyElems, wrapper, showShadow, callback);
        }
      });
      
      // --------------------      

      const stickyElems = Array.prototype.slice.call(table.querySelectorAll('.sns--is-stuck, .sns--is-stuck-y, .sns--is-stuck-x'));

      wrapper.style.position = 'relative';
      table.classList.add('sns');
      table.style.position = 'relative';

      ['Top', 'Left'].forEach((side) => {
        if (table[`offset${side}`] > 0) {
          table.style[side.toLowerCase()] = `-${table[`offset${side}`]}px`;
        }
      });

      stickyElems.forEach((cell) => {

        if (isIE11()) {
          // Behavior for IE11.
          buildInnerCell(cell);
        } else {
          // Everything other than IE11.
          const cellStyles = window.getComputedStyle(cell);
          ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
            ['Width'].forEach((property) => {
              let borderWidth = cellStyles[`border${side}${property}`];
              if (isFirefox) {
                const value = borderWidth.match(/(\d\.?\d?)([a-z%]+)/);
                borderWidth = `${Math.round(value[1])}${value[2]}`;
              }
              cell.style[`margin${side}`] = `-${borderWidth}`;
            });
          });
        }
      });

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      requestAnimationFrame(() => {
        positionStickyElements(table, stickyElems, showShadow, isIE11);
        if (isIE11()) {
          setInnerCellHeights(table);
        }

        // ----------------------------
        // Handle IE11 mutations to the table cells.
        requestAnimationFrame(() => {
          if (isIE && !isIEedge) {
            let observer = new MutationObserver(handleMutations);
            observer.observe(table, observeConfig);
          }
        });
        // ============================

      });

    }
    return;
  });

  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      elems.forEach((table) => {
        if (isIE11()) {
          setInnerCellHeights(table);
        }
      });
    });
  });

}