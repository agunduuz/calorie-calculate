import '@fortawesome/fontawesome-free/js/all.js';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker.js';
import { Meal, Workout } from './Item.js';
import './css/bootstrap.css';
import './css/style.css';

class App {
  constructor() {
    this._tracker = new CalorieTracker(); // CalorieTracker class'ından bir obje oluşturuluyor.
    this._loadEventListeners();
    this._tracker.loadItems(); // Yemekler local storage'dan alınıyor.
  }

  _loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal')); // Yeni yemek eklemek için form submit edildiğinde _newItem fonksiyonu çağırılıyor. Bind amacı this'in CalorieTracker class'ına bağlanması.
    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));

    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate Inputs
    if (name.value === '' || calories.value === '') {
      alert('Please fill in all fields');
      return;
    }

    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value); // Yeni bir meal objesi oluşturuluyor.
      this._tracker.addMeal(meal); // Yeni meal objesi CalorieTracker class'ındaki addMeal fonksiyonuna gönderiliyor.
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = '';
    calories.value = '';

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, {
      toggle: true,
    });
    // Bootstrap collapse özelliği aktif ediliyor.
    // https://getbootstrap.com/docs/5.0/components/collapse/
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');
        // Silinecek yemeğin id'si alınıyor.
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest('.card').remove(); // Silinecek yemek kartı siliniyor.
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase(); // Input'taki değer alınıyor. Küçük harfe çevriliyor.
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      // Yemek kartları seçiliyor.
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        // Yemek adı input'taki değeri içeriyorsa
        item.style.display = 'block'; // Yemek kartı gösteriliyor.
      } else {
        item.style.display = 'none'; // Yemek kartı gizleniyor.
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please add a limit');
      return;
    }

    this._tracker.setLimit(+limit.value); // CalorieTracker class'ındaki setLimit fonksiyonu çağırılıyor. +limit.value ile string değer number'a çevriliyor.
    limit.value = '';

    const modalEl = document.getElementById('limit-modal');
    const modal = Modal.getInstance(modalEl);
    // Bootstrap modal özelliği aktif ediliyor.
    // https://getbootstrap.com/docs/5.0/components/modal/#via-javascript
    modal.hide();
  }
}

const app = new App();
