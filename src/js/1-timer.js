import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

startBtn.disabled = true;
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    if (selectedDate <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

class Timer {
  constructor() {
    this.timerId = null;
  }

  start() {
    if (!userSelectedDate || this.timerId) return;

    startBtn.disabled = true;
    dateInput.disabled = true;

    this.timerId = setInterval(() => {
      const now = Date.now();
      const timeLeft = userSelectedDate - now;

      if (timeLeft <= 0) {
        clearInterval(this.timerId);
        this.timerId = null;

        this.updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        iziToast.success({
          title: 'Success!',
          message: 'Timer completed!',
          position: 'topRight',
        });

        dateInput.disabled = false;
        startBtn.disabled = true;

        return;
      }

      const time = this.convertMs(timeLeft);
      this.updateDisplay(time);
    }, 1000);
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  updateDisplay({ days, hours, minutes, seconds }) {
    daysSpan.textContent = String(days).padStart(2, '0');
    hoursSpan.textContent = String(hours).padStart(2, '0');
    minutesSpan.textContent = String(minutes).padStart(2, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
  }
}

const timer = new Timer();
startBtn.addEventListener('click', () => timer.start());
