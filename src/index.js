import './stick-n-slide.scss';

function handleMutations(mutations, observer) {
  observer.disconnect(); // Prevent any further updates to the DOM from making the observer thrash.
  mutations.forEach((m) => {
    console.log(m);
    if (m.type === 'childList') {
      m.removedNodes.forEach((removedNode) => {
        if (removedNode.classList) {
          // 1) Rebuild placeholder-cell
          if (removedNode.classList.contains('sns__cell-inner')) {
            m.target.innerCellStyle = removedNode.getAttribute('style');
          }
        }
      });
      m.addedNodes.forEach((addedNode) => {
        if (m.target.classList.contains('sns__placeholder-cell')) {
          // 1) Rebuild placeholder-cell
          if (m.target.innerCellStyle) {
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
            // 1.5) Move direct child of placeholder-cell inside cell-contents
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
          debugger
          const contents = document.createElement('div');
          contents.classList.add('sns__cell-contents');
          contents.appendChild(addedNode);
          m.target.appendChild(contents);
        }

      });
    }
    // if (m.type === 'childList' && (m.target.classList.contains('sns__placeholder-cell')) || m.target.classList.contains('sns__cell-inner') || m.target.classList.contains('sns__cell-contents')) {
    //   console.log(m.target.classList)
    //   buildInnerCell(m.target);
    // }
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
      
      // --------------------      

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

        // if (isIE && !isIEedge) {
          // Behavior for IE11.
          buildInnerCell(cell);

          // let observer = new MutationObserver((mutations) => {
          //   const mutation = mutations[0];
  
          //   // If first mutation is only mutating the style, assume it is just a transform mutation to handle scrolling and do nothing.
          //   if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          //     return;
          //   }
            
          //   const firstChild = cell.children[0];
          //   if (cell.childNodes.length === 1 && firstChild && firstChild.classList.contains('sns__cell-inner')) {
          //     // Mutation has only changed what is inside the .sns__cell-inner <div> so no rebuilding is necessary.
          //     requestAnimationFrame(() => {
          //       setInnerCellHeights(table);
          //     });
          //     return;
          //   } else {
          //     const innerCell = cell.querySelector('.sns__cell-inner');
          //     const cellContents = cell.querySelector('.sns__cell-contents');
          //     // cell.children.length > 0 && Array.prototype.slice.call(cell.children).some((node) => node.classList.contains('sns__cell-inner'))
          //     if (innerCell) {
          //       // // Mutation has added child nodes along side the .sns__cell-inner <div>, so move these new nodes inside the <div> in the proper location.
          //       requestAnimationFrame(() => {
          //         buildInnerCell(cell);
          //         setInnerCellHeights(table);
          //       });
          //     } else {
          //       // Mutation has removed the .sns__cell-inner <div> entirely. Rebuild the inner div using the contents of the cell.
          //       console.log('rebuild entirely');
          //       ['padding', 'border'].forEach((property) => {
          //         cell.style[property] = null;
          //       });
          //       requestAnimationFrame(() => {
          //         buildInnerCell(cell);
          //         setInnerCellHeights(table);
          //       });
          //     }
          //   }
          // });
    
          // observer.observe(cell, {
          //   childList: true,
          //   attributes: true,
          //   characterData: true,
          //   subtree: true,
          // });

        // } else {
        //   // Everything other than IE11.
        //   const cellStyles = window.getComputedStyle(cell);
        //   ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
        //     ['Width'].forEach((property) => {
        //       const borderWidth = cellStyles[`border${side}${property}`];
        //       cell.style[`margin${side}`] = `-${borderWidth}`;
        //     });
        //   });  
        // }        
      });

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      requestAnimationFrame(() => {
        positionStickyElements(table, stickyElems, showShadow);
        setInnerCellHeights(table);

        // ----------------------------
        const elem = table;
        let observer = new MutationObserver(handleMutations);
        // ---------------------------
        
        requestAnimationFrame(() => {
          observer.observe(table, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
          });          
            
        });

        // let observer = new MutationObserver((mutations) => {
        //   // const cells = table.querySelectorAll('.sns__placeholder-cell');
        //   // cells.forEach((cell) => {
        //   //   console.log('start')
        //   // //   if (cell.children.length === 1) {
        //   // //     const childCell = cell.children[0];
        //   // //     if (childCell.classList.contains('sns__cell-inner')) {
        //   // //       if (childCell.children.length === 1) {
        //   // //         const grandChildCell = childCell.children[0];
        //   // //         if (grandChildCell.classList.contains('sns__cell-contents')) {
        //   // //           console.log('do nothing, is in content cell');
        //   // //           return;
        //   // //         } else {
        //   // //           console.log('rebuild content');
        //   // //           // buildInnerCell(cell);
        //   // //         }
        //   // //       }
        //   // //     }
        //   // //   } else {

        //   //   // }
        //   // });

        //   // ----------------------------

        //   mutations.forEach((mutation) => {
        //     if (mutation.type === 'attributes' && mutation.attributeName === 'style' && (mutation.target.tagName.toUpperCase() === 'TH' || mutation.target.tagName.toUpperCase() === 'TD')) {
        //       return;
        //     } else if (mutation.type === 'characterData') {
        //       return;
        //     // } else if (mutation.type === 'childList' && mutation.target.classList.contains('sns__cell-contents')) {
        //     //   return;
        //     } else {
        //       let contentCell = closest(mutation.target, 'sns__cell-contents');
        //       if (contentCell) {
        //         // Mutation has only changed what is inside the .sns__cell-inner <div> so no rebuilding is necessary.
        //         console.log('Do nothing');
        //         return;
        //       }

        //       // if (mutation.target.classList.contains('sns__placeholder-cell')) {
        //       //   const cellInnerRemoved = Array.prototype.slice.call(mutation.removedNodes).find((x) => x.classList.contains('sns__cell-inner'));
        //       //   let cellInner;
        //       //   debugger;
        //       //   if (cellInnerRemoved) {
        //       //     cellInner = document.createElement('div');
        //       //     cellInner.classList.add('sns__cell-inner');
        //       //     while (mutation.target.firstChild) {
        //       //       cellInner.appendChild(mutation.target.firstChild);
        //       //     }
        //       //     mutation.target.appendChild(cellInner);
        //       //   } else {
        //       //     ''
        //       //   }
        //       // }

        //       if (mutation.target.classList.contains('sns__cell-inner')) {
        //         let contentCell = mutation.target.querySelector('.sns__cell-contents');
        //         if (!contentCell) {
        //           contentCell = document.createElement('div');
        //           contentCell.classList.add('sns__cell-contents');
        //           mutation.target.appendChild(contentCell);
        //         }
        //         while (mutation.target.childNodes.length > 0 && mutation.target.firstChild !== contentCell) {
        //           contentCell.appendChild(mutation.target.firstChild);
        //         }
        //         // } else {
        //         //   contentCell = document.createElement('div');
        //         //   contentCell.classList.add('sns__cell-contents');
        //         //   while (mutation.target.firstChild) {
        //         //     contentCell.appendChild(mutation.target.firstChild);
        //         //   }
        //         //   mutation.target.appendChild(contentCell);
        //         //   debugger;
        //         // }
        //       } else {
        //         let innerCell = mutation.target.querySelector('.sns__cell-inner');
        //         let contentCell = mutation.target.querySelector('.sns__cell-contents');
        //         if (!innerCell) {
        //           const oldInnerCell = Array.prototype.slice.call(mutation.removedNodes).find((x) => x.classList.contains('sns__cell-inner'));

        //           innerCell = document.createElement('div');
        //           innerCell.classList.add('sns__cell-inner');
        //           innerCell.setAttribute('style', oldInnerCell.getAttribute('style'));

        //           contentCell = document.createElement('div');
        //           contentCell.classList.add('sns__cell-contents');
        //           innerCell.appendChild(contentCell);

        //           mutation.target.appendChild(innerCell);
        //         }

        //         const childNodes = Array.prototype.slice.call(mutation.target.childNodes);
        //         const innerCellPosition = childNodes.indexOf(innerCell);
                
        //         // while (mutation.target.childNodes.length > 1 && mutation.target.firstChild !== innerCell) {
        //         childNodes.forEach((node, position) => {
        //           if (node === innerCell) {
        //             return;
        //           }
        //           if (position < innerCellPosition) {
        //             debugger;
        //             contentCell.insertBefore(node, contentCell.childNodes[innerCellPosition - 1]);
        //           } else {
        //             debugger;
        //             contentCell.appendChild(node);
        //           }
        //         })                           
        //       }

        //       // let innerCell = closest(mutation.target, 'sns__cell-inner');
        //       // let tableCell = closest(mutation.target, 'sns__placeholder-cell');

        //       // if (tableCell.children.length === 0) {
        //       //   if (tableCell.children[0] === innerCell) {
        //       //     debugger
        //       //   } else {
        //       //     debugger
        //       //   }
        //       // } else {
        //       //   if (innerCell) {
        //       //     debugger;
        //       //     if (innerCell.children.length === 1) {
        //       //       if (innerCell.children[0] === contentCell) {
        //       //         console.log('do nothing 2');
        //       //       } else {
        //       //         buildInnerCell(tableCell);
        //       //       }
        //       //     }
        //       //   } else {
        //       //     debugger;
        //       //   }
        //       // }
              
        //       // debugger
        //       // if (innerCell && tableCell) {
        //       //   // Mutation has added child nodes along side the .sns__cell-inner <div>, so move these new nodes inside the <div> in the proper location.
        //       //   console.log('Move inside cell-inner');
        //       //   requestAnimationFrame(() => {
        //       //     buildInnerCell(tableCell);
        //       //     setInnerCellHeights(table);
        //       //   });  
        //       // } else {
        //       //   // Mutation has removed the .sns__cell-inner <div> entirely. Rebuild the inner div using the contents of the cell.
        //       //   console.log('rebuild entirely');
        //       //   ['padding', 'border'].forEach((property) => {
        //       //     tableCell.style[property] = null;
        //       //   });
        //       //   requestAnimationFrame(() => {
        //       //     buildInnerCell(tableCell);
        //       //     setInnerCellHeights(table);
        //       //   });

        //       // }
              


        //       // debugger;
        //     }
        //   });
        // });
        // observer.observe(table, {
        //   childList: true,
        //   attributes: true,
        //   characterData: true,
        //   subtree: true,
        // });
      });

    }
    return;
  });

  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      elems.forEach((table) => {
        setInnerCellHeights(table);
      });
    });
  });

}