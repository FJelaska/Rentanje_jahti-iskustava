const pricePerNight = 2500;

const checkinInput  = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const nightsSpan    = document.getElementById('booking-nights');
const totalSpan     = document.getElementById('booking-total');
const clearBtn      = document.getElementById('clear-dates');
const reserveBtn    = document.getElementById('reserve-btn');

const popup         = document.getElementById('booking-popup');
const popupClose    = document.getElementById('popup-close');

function toISODates(d) {
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0,10);
}

const todayStr = toISODates(new Date());
checkinInput.min = todayStr;
checkoutInput.min = todayStr;

function getNights() {
  if (!checkinInput.value || !checkoutInput.value) return 0;

  const checkin  = new Date(checkinInput.value);
  const checkout = new Date(checkoutInput.value);

  const diffMs   = checkout - checkin;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays;
}

function updateSummary() {
  const nights = getNights();
  console.log('Noćenja:', nights);

  if (nights <= 0) {
    nightsSpan.textContent = '0 noćenja';
    totalSpan.textContent  = 'Ukupno: 0 €';
    reserveBtn.disabled = true;
    reserveBtn.classList.remove('enabled');
    return;
  }

  const total = nights * pricePerNight;
  nightsSpan.textContent = nights + (nights === 1 ? ' noćenje' : ' noćenja');
  totalSpan.textContent  = 'Ukupno: ' + total + ' €';

  reserveBtn.disabled = false;
  reserveBtn.classList.add('enabled');
}


checkinInput.addEventListener('change', () => {
  if (checkinInput.value && checkinInput.value < todayStr){
    checkinInput.value = '';
  }

  if (checkoutInput.value) {
    if (checkoutInput.value < todayStr || new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
      checkoutInput.value = '';
    }
  }

  if(checkinInput.value){
    checkoutInput.min = checkinInput.value; 
  } else {
    checkinInput.min = todayStr;
  }

  updateSummary();
});

checkoutInput.addEventListener('change', () => {

  if(checkoutInput.value && checkoutInput.value < todayStr){
    checkoutInput.value = '';
  }

  if (!checkinInput.value || new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
    checkinInput.value = '';
    checkoutInput.value = '';
  }
  updateSummary();
});


clearBtn.addEventListener('click', () => {
  checkinInput.value = '';
  checkoutInput.value = '';
  updateSummary();
});


reserveBtn.addEventListener('click', () => {
  const nights = getNights();
  if (nights <= 0) {
    checkinInput.value = '';
    checkoutInput.value = '';
    updateSummary();
    return;
  }
  popup.classList.remove('hidden');
});

popupClose.addEventListener('click', () => {
  popup.classList.add('hidden');
  checkinInput.value = '';
  checkoutInput.value = '';
  updateSummary();
});
