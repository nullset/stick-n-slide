// import stickNSlide from '../src/index.js';
function randomColor() {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
}

function randomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

function backgroundColor(event) {
  event.target.style.backgroundColor = randomColor();
}

function borderColor(event) {
  event.target.style.borderColor = randomColor();
}

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
      event.target.colSpan =
        event.target.colSpan + event.target.nextElementSibling.colSpan;
      event.target.nextElementSibling.remove();
    }
  }
}

function changeContent(event) {
  if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
    fetch('http://www.randomtext.me/api/lorem/p-1/5-15')
      .then((response) => response.json())
      .then((json) => {
        event.target.innerHTML = json.text_out;
      });
  }
}

window.addEventListener('load', function () {
  const table = document.querySelector('table');
  // table.querySelectorAll(':scope b')..on('click', function () {
  //   alert();
  // });

  table.querySelectorAll(':scope thead th:nth-child(-n+3)').forEach((th) => {
    th.classList.add('sns--is-stuck');
  });

  table.querySelectorAll(':scope thead th:nth-child(n+4)').forEach((th) => {
    th.classList.add('sns--is-stuck-y');
  });

  table
    .querySelectorAll(
      ':scope tbody > tr:nth-child(n+1):nth-child(-n+11) > *:nth-child(-n+3)',
    )
    .forEach((node) => node.classList.add('sns--is-stuck-x'));

  table
    .querySelectorAll(':scope tbody > tr:nth-child(12) > *:nth-child(-n+2)')
    .forEach((node) => node.classList.add('sns--is-stuck-x'));

  table
    .querySelectorAll(':scope tbody > tr:nth-child(13) > *:nth-child(-n+1)')
    .forEach((node) => node.classList.add('sns--is-stuck-x'));

  // table.stickyTable();
  stickNSlide(table);

  document
    .getElementById('backgroundColor')
    .addEventListener('click', (event) => {
      if (event.currentTarget.dataset.active !== 'true') {
        document
          .querySelector('table')
          .addEventListener('click', backgroundColor);
      } else {
        document
          .querySelector('table')
          .removeEventListener('click', backgroundColor);
      }
      event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
    });

  document.getElementById('borderColor').addEventListener('click', (event) => {
    if (event.currentTarget.dataset.active !== 'true') {
      document.querySelector('table').addEventListener('click', borderColor);
    } else {
      document.querySelector('table').removeEventListener('click', borderColor);
    }
    event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
  });

  document.getElementById('mergeCellRow').addEventListener('click', (event) => {
    if (event.currentTarget.dataset.active !== 'true') {
      document.querySelector('table').addEventListener('click', mergeCellRow);
    } else {
      document
        .querySelector('table')
        .removeEventListener('click', mergeCellRow);
    }
    event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
  });

  document
    .getElementById('changeContent')
    .addEventListener('click', (event) => {
      if (event.currentTarget.dataset.active !== 'true') {
        document
          .querySelector('table')
          .addEventListener('click', changeContent);
      } else {
        document
          .querySelector('table')
          .removeEventListener('click', changeContent);
      }
      event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
    });
});

// $(document).ready(function () {
//   var table = $('table');
//   table.querySelectorAll(':scope b').on('click', function () {
//     alert();
//   });

//   table.querySelectorAll(':scope thead th:nth-child(-n+3)').each((i, th) => {
//     $(th).classList.add('sns--is-stuck');
//   });

//   table.querySelectorAll(':scope thead th:nth-child(n+4)').each((i, th) => {
//     $(th).classList.add('sns--is-stuck-y');
//   });

//   table
//     .querySelectorAll(':scope tbody > tr:nth-child(n+1):nth-child(-n+11) > *:nth-child(-n+3)')
//     .classList.add('sns--is-stuck-x');

//   table
//     .querySelectorAll(':scope tbody > tr:nth-child(12) > *:nth-child(-n+2)')
//     .classList.add('sns--is-stuck-x');
//   table
//     .querySelectorAll(':scope tbody > tr:nth-child(13) > *:nth-child(-n+1)')
//     .classList.add('sns--is-stuck-x');

//   // table.stickyTable();
//   stickNSlide(table);

//   document
//     .getElementById('backgroundColor')
//     .addEventListener('click', (event) => {
//       if (event.currentTarget.dataset.active !== 'true') {
//         document
//           .querySelector('table')
//           .addEventListener('click', backgroundColor);
//       } else {
//         document
//           .querySelector('table')
//           .removeEventListener('click', backgroundColor);
//       }
//       event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
//     });

//   document.getElementById('borderColor').addEventListener('click', (event) => {
//     if (event.currentTarget.dataset.active !== 'true') {
//       document.querySelector('table').addEventListener('click', borderColor);
//     } else {
//       document.querySelector('table').removeEventListener('click', borderColor);
//     }
//     event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
//   });

//   document.getElementById('mergeCellRow').addEventListener('click', (event) => {
//     if (event.currentTarget.dataset.active !== 'true') {
//       document.querySelector('table').addEventListener('click', mergeCellRow);
//     } else {
//       document
//         .querySelector('table')
//         .removeEventListener('click', mergeCellRow);
//     }
//     event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
//   });

//   document
//     .getElementById('changeContent')
//     .addEventListener('click', (event) => {
//       if (event.currentTarget.dataset.active !== 'true') {
//         document
//           .querySelector('table')
//           .addEventListener('click', changeContent);
//       } else {
//         document
//           .querySelector('table')
//           .removeEventListener('click', changeContent);
//       }
//       event.currentTarget.dataset.active = !event.currentTarget.dataset.active;
//     });

//   // setTimeout(function() {
//   //   $('b').closest('td').each(function() {
//   //     var div = $('<div>blah</div>');
//   //     $(this).prepend(div);
//   //   });
//   // }, 5000);
// });
