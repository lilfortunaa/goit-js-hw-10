import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'izitoast/dist/css/iziToast.css';

const form = document.querySelector('.form');
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const { delay, state } = event.target.elements;
  const delayValue = Number(delay.value);
  const stateValue = state.value;

  createPromise(delayValue, stateValue)
    .then(message => {
      iziToast.success({
        title: 'Success',
        message,
        position: 'topRight',
      });
    })
    .catch(message => {
      iziToast.error({
        title: 'Error',
        message,
        position: 'topRight',
      });
    });
}

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(`Fulfilled promise in ${delay}ms`);
      } else {
        reject(`Rejected promise in ${delay}ms`);
      }
    }, delay);
  });
}
