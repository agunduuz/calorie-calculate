class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    // Static görevi, Storage class'ından obje oluşturmadan fonksiyon çağırılabilmesini sağlamak.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      // Local storage'da calorieLimit yoksa
      calorieLimit = defaultLimit; // Default değer atanıyor.
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit'); // Local storage'dan değer alınıyor.
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit); // Local storage'a değer yazılıyor.
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
      // Local storage'dan değer alınıyor. JSON.parse ile string değer objeye çevriliyor.
    }
    return meals;
  }

  static saveMeals(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals(); // Local storage'dan yemekler alınıyor.
    meals.forEach((meal, index) => {
      // Yemekler içinde dönülüyor.
      if (meal.id === id) {
        // Silinecek yemek bulunuyor.
        meals.splice(index, 1); // Yemek array'den çıkarılıyor.
      }
    });

    localStorage.setItem('meals', JSON.stringify(meals)); // Yemekler local storage'a yazılıyor.
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
      // Local storage'dan değer alınıyor. JSON.parse ile string değer objeye çevriliyor.
    }
    return workouts;
  }

  static saveWorkouts(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });

    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('meals');
    localStorage.removeItem('workouts');
  }
}

export default Storage;
