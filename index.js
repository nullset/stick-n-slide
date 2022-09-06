import normalizeWheel from "normalize-wheel";
import "./stick-n-slide.scss";

const tableScrollPositions = new WeakMap();

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

function wheelHandler({
  table,
  wrapper,
  stickyElems,
  pixelX,
  pixelY,
  scrollLeft,
  scrollTop,
  scrollWidth,
  scrollHeight,
  clientWidth,
  clientHeight,
  showShadow,
  callback,
}) {
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

  // Modern browsers have a nasty habit of setting scrollLeft/scrollTop not to the actual integer value you specified, but
  // rather to a sub-pixel value that is "pretty close" to what you specified. To work around that, set the scroll value
  // and then use the rendered scroll value as the left/top offset for the stuck elements.
  wrapper.scrollTo(newX, newY);
  positionStickyElements(table, wrapper.scrollLeft, wrapper.scrollTop);

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
  const rgb = window
    .getComputedStyle(cell)
    .backgroundColor.replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .map((value) => Math.round(parseInt(value, 10) * 0.3))
    .join(",");
  return `rgba(${rgb},${opacity})`;
}

function positionStickyElements(table, scrollLeft = 0, scrollTop = 0) {
  table.parentElement.style.setProperty("--sns-scroll-left", `${scrollLeft}px`);
  table.parentElement.style.setProperty("--sns-scroll-top", `${scrollTop}px`);
}

function scrollHandler(table, wrapper, callback) {
  updateScrollPosition(table, wrapper, callback);
}

function updateScrollPosition(table, wrapper, callback) {
  positionStickyElements(table, wrapper.scrollLeft, wrapper.scrollTop);
  if (callback) {
    callback(wrapper.scrollLeft, wrapper.scrollTop);
  }
}

function buildInnerCell(cell) {
  const cellStyles = window.getComputedStyle(cell);
  cell.classList.add("sns__placeholder-cell");
  let innerCell = document.createElement("div");
  innerCell.setAttribute("class", "sns__cell-inner");
  let cellContents = document.createElement("div");
  cellContents.setAttribute("class", "sns__cell-contents");
  let setStyles = true;
  while (cell.firstChild) {
    cellContents.appendChild(cell.firstChild);
    if (
      cell.firstChild &&
      cell.firstChild.classList &&
      cell.firstChild.classList.contains("sns__cell-inner")
    ) {
      while (cell.firstChild.firstChild.firstChild) {
        cellContents.appendChild(cell.firstChild.firstChild.firstChild);
      }
      innerCell.setAttribute("style", cell.firstChild.getAttribute("style"));
      innerCell.style.height = "";
      cell.firstChild.remove();
      setStyles = false;
    }
  }
  innerCell.appendChild(cellContents);
  cell.innerHTML = "";
  cell.appendChild(innerCell);

  if (setStyles) {
    ["padding", "border"].forEach((property) => {
      ["Top", "Right", "Bottom", "Left"].forEach((side) => {
        if (property === "border") {
          const borderWidth = cellStyles[`border${side}Width`];
          innerCell.style[
            `margin${altSide(side)}`
          ] = `calc(-1 * ${borderWidth})`;

          ["Width", "Color", "Style"].forEach((attr) => {
            const value = cellStyles[`${property}${side}${attr}`];
            innerCell.style[`${property}${side}${attr}`] = value;
          });
        } else {
          innerCell.style[`${property}${side}`] =
            cellStyles[`${property}${side}`];
        }
      });
      cell.style[property] = "0";
    });

    innerCell.style.display = "flex";
    innerCell.style.alignItems = verticalAlignment(cellStyles.verticalAlign);
  }
}

// Convert regular `vertical-align` CSS into flexbox friendly alternative.
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

function generateBorder({
  cell,
  isFirefox,
  scrollPositions: { left, top },
  showShadow,
}) {
  const cellStyles = window.getComputedStyle(cell);
  ["Top", "Right", "Bottom", "Left"].forEach((side) => {
    ["Width"].forEach((property) => {
      let borderWidth = cellStyles[`border${side}${property}`];
      if (isFirefox) {
        const value = borderWidth.match(/([^a-z%]+)([a-z%]+)/);
        borderWidth = `${Math.round(value[1])}${value[2]}`;
      }
      cell.style[`margin${side}`] = `-${borderWidth}`;
    });
  });
}

function cellStyles({ id, left, top }) {
  return `
  .sns.sns-${id} .sns--is-stuck {
    transform: translate(${left}px, ${top}px);
  }
  .sns.sns-${id} .sns--is-stuck-x {
    transform: translateX(${left}px);
  }
  .sns.sns-${id} .sns--is-stuck-y {
    transform: translateY(${top}px);
  }`;
}

export default function (elems, options = {}) {
  const { showShadow, callback } = options;
  // Must test for FF, because it does some seriously horrible things to the table layout.
  const userAgent = navigator.userAgent.toLowerCase();
  const isFirefox = userAgent.indexOf("firefox") > -1;

  // Convert a jQuery object to an array, or convert a single element to an array.
  if (typeof elems.toArray === "function") {
    elems = elems.toArray();
  } else if (!Array.isArray(elems)) {
    elems = [elems];
  }

  elems.forEach((table) => {
    if (!tableScrollPositions.get(table)) {
      const wrapper = table.parentElement;

      function wheelFn(event) {
        const normalized = normalizeWheel(event);
        const { pixelX, pixelY } = normalized;
        const {
          scrollLeft,
          scrollTop,
          scrollWidth,
          scrollHeight,
          clientWidth,
          clientHeight,
        } = wrapper;

        const opts = {
          table,
          wrapper,
          stickyElems,
          pixelX,
          pixelY,
          scrollLeft,
          scrollTop,
          scrollWidth,
          scrollHeight,
          clientWidth,
          clientHeight,
          showShadow,
          callback,
        };

        event.preventDefault();
        wheelHandler(opts);
      }

      wrapper.addEventListener(
        "wheel",
        (event) => {
          wheelFn(event);
          wheelEventTriggered = true;

          event.preventDefault();
        },
        { capture: true }
      );

      wrapper.addEventListener("scroll", () => {
        if (wheelEventTriggered) {
          wheelEventTriggered = false;
        } else {
          scrollHandler(table, wrapper, callback);
        }
      });

      const stickyElems = [
        "sns--is-stuck",
        "sns--is-stuck-y",
        "sns--is-stuck-x",
      ].reduce((acc, className) => {
        acc.push(table.getElementsByClassName(className));
        return acc;
      }, []);

      if (getComputedStyle(wrapper).position === "static") {
        wrapper.style.position = "relative";
      }
      table.classList.add("sns");
      table.style.position = "relative";

      ["Top", "Left"].forEach((side) => {
        if (table[`offset${side}`] > 0) {
          table.style[side.toLowerCase()] = `-${table[`offset${side}`]}px`;
        }
      });

      const scrollPositions = {
        left: wrapper.scrollLeft || 0,
        top: wrapper.scrollTop || 0,
      };
      tableScrollPositions.set(table, scrollPositions);

      for (let stickyIdx = 0; stickyIdx < stickyElems.length; stickyIdx++) {
        for (
          let typeIdx = 0;
          typeIdx < stickyElems[stickyIdx].length;
          typeIdx++
        ) {
          const cell = stickyElems[stickyIdx][typeIdx];
          generateBorder({
            cell,
            isFirefox,
            scrollPositions,
            showShadow,
          });
        }
      }

      // Variable that tracks whether "wheel" event was called.
      // Prevents both "wheel" and "scroll" events being triggered simultaneously.
      let wheelEventTriggered = false;

      // Set initial position of elements to 0.
      requestAnimationFrame(() => {
        // positionStickyElements(table, stickyElems, showShadow);
        positionStickyElements(table, wrapper.scrollLeft, wrapper.scrollTop);
      });
    }
    return;
  });
}
