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

function buildInnerCell(cell) {
  const cellStyles = window.getComputedStyle(cell);
  cell.classList.add('blah');
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
          innerCell.style[`margin${altSide(side)}`] = `calc(-1 * (${borderWidth} / 2))`;
  
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
  Array.prototype.slice.call(table.querySelectorAll('tr')).forEach((row) => {
    Array.prototype.slice.call(row.children).forEach((cell) => {
      cell.style.height = '';
      requestAnimationFrame(() => {
        cell.style.height = `${cell.getBoundingClientRect().height}px`;
      });
    // if (cell) {
      
      // Array.prototype.slice.call(row.querySelectorAll('.sns__cell-inner')).forEach((innerCell) => {
      //   // innerCell.style.height = `${cell.getBoundingClientRect().height}px`;
      // });
    });
  });
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

        // Behavior for IE11.
        // if (isIE && !isIEedge) {
          buildInnerCell(cell);

        // Everything other than IE11.
        // } else {
        //   const cellStyles = window.getComputedStyle(cell);
        //   ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
        //     ['Width'].forEach((property) => {
        //       const borderWidth = cellStyles[`border${side}${property}`];
        //       if (!isFirefox && !isIEedge) {
        //         cell.style[`margin${side}`] = `-${borderWidth}`;
        //       } else {
        //         // cell.style[`margin${altSide(side)}`] = `calc(-1 * (${borderWidth}))`;
        //         cell.style[`margin${altSide(side)}`] = `calc(-1 * (${borderWidth} + ${borderWidth}))`;
        //       }
        //     });
        //   });  
        // }        

        let observer = new MutationObserver((mutations) => {
          const mutation = mutations[0];

          // If first mutation is only mutating the style, assume it is just a transform mutation to handle scrolling and do nothing.
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            return;
          }
          
          const firstChild = cell.children[0];
          if (cell.childNodes.length === 1 && firstChild && firstChild.classList.contains('sns__cell-inner')) {
            // Mutation has only changed what is inside the .sns__cell-inner <div> so no rebuilding is necessary.
            requestAnimationFrame(() => {
              setInnerCellHeights(table);
            });
            return;
          } else {
            const innerCell = cell.querySelector('.sns__cell-inner');
            const cellContents = cell.querySelector('.sns__cell-contents');
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
              requestAnimationFrame(() => {
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
              ['padding', 'border'].forEach((property) => {
                cell.style[property] = null;
              });
              requestAnimationFrame(() => {
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
          subtree: true,
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
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      requestAnimationFrame(() => {
        positionStickyElements(table, stickyElems, showShadow);
        setInnerCellHeights(table);
      });

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