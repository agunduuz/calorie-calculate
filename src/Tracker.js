import Storage from './Storage.js';

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit(); // Local storage'dan calorieLimit değeri alınıyor.
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesTotal(); // Toplam kaloriyi yazdırmak için fonksiyon çağırılıyor.
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById('limit').value = this._calorieLimit; // Input'a değer yazdırılıyor.
  }

  // Public Methods // =================================================================
  addMeal(meal) {
    this._meals.push(meal); // Meal array içine meal objesi ekleniyor.
    this._totalCalories += meal.calories; // Toplam kaloriye ekleniyor.
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeals(meal);
    this._displayNewMeal(meal); // Yeni eklenen yemeği yazdırmak için fonksiyon çağırılıyor.
    this._render(); // Toplam kaloriyi yazdırmak için fonksiyon çağırılıyor.
  }

  addWorkout(workout) {
    this._workouts.push(workout); // Workout array içine workout objesi ekleniyor.
    this._totalCalories -= workout.calories; // Toplam kaloriye çıkarılıyor.
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkouts(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id); // Silinecek yemeğin index'i bulunuyor.
    if (index !== -1) {
      const meal = this._meals[index]; // Silinecek yemek meal değişkenine atanıyor.
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1); // Silinecek yemek array'den çıkarılıyor.
      Storage.removeMeal(id); // Local storage'dan siliniyor.
      this._render(); // Toplam kaloriyi yazdırmak için fonksiyon çağırılıyor.
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit); // Local storage'a değer yazılıyor.
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  // Private Methods // =================================================================
  _displayCaloriesTotal() {
    const totalCalories = document.getElementById('calories-total'); // Toplam kaloriyi yazdırmak için html elementi seçiliyor.
    totalCalories.innerHTML = this._totalCalories; // Toplam kalori yazdırılıyor.
  }
  _displayCaloriesLimit() {
    const calorieLimitEl = document.getElementById('calories-limit');
    calorieLimitEl.innerHTML = this._calorieLimit;
  }
  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById('calories-consumed');
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    // Yediğimiz yemeklerin kalorilerini topluyoruz.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    caloriesConsumedEl.innerHTML = consumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedEl.innerHTML = burned;
  }
  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;
    const progressEl = document.getElementById('calorie-progress');

    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        'bg-danger'
      );
      progressEl.classList.remove('bg-success');
      progressEl.classList.add('bg-danger');
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
      progressEl.classList.remove('bg-danger');
      progressEl.classList.add('bg-success');
    }
  }
  _displayCaloriesProgress() {
    const progressEl = document.getElementById('calorie-progress');
    const percentage = (this._totalCalories / this._calorieLimit) * 100; // Yüzde hesaplanıyor.
    const width = Math.min(percentage, 100); // Yüzde 100'den büyükse 100'e eşitleniyor.
    progressEl.style.width = `${width}%`; // Progress barın genişliği ayarlanıyor.
  }

  _displayNewMeal(meal) {
    const mealsEl = document.getElementById('meal-items');
    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meal.id); // Yemek kartına id ekleniyor.
    mealEl.innerHTML = `
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                      <h4 class="mx-1">${meal.name}</h4>
                      <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                      >
                      ${meal.calories}
                      </div>
                      <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                </div>
    
        `;
    mealsEl.appendChild(mealEl);
  }
  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById('workout-items');
    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id); // Yemek kartına id ekleniyor.
    workoutEl.innerHTML = `
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                      <h4 class="mx-1">${workout.name}</h4>
                      <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                      >
                      ${workout.calories}
                      </div>
                      <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                </div>
    
        `;
    workoutsEl.appendChild(workoutEl);
  }

  _render() {
    this._displayCaloriesTotal(); // Toplam kaloriyi yazdırmak için fonksiyon çağırılıyor.
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;
