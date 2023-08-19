class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2); // Random id oluşturuluyor. https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    this.name = name; // Yemek adı
    this.calories = calories; // Kalori
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

export { Meal, Workout };
