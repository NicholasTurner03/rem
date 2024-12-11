// Initial Phaser configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
let player;
let cursors;
let background;
let weatherData;

// Load assets (images for the jetpack, background, etc.)
function preload() {
  this.load.image("background", "assets/background.png"); // Background image
  this.load.image("jetpack", "assets/jetpack.png"); // Jetpack sprite
  this.load.image("obstacle", "assets/obstacle.png"); // Obstacle sprite
}

// Create the game objects
function create() {
  background = this.add
    .tileSprite(0, 0, 800, 600, "background")
    .setOrigin(0, 0);
  player = this.physics.add.sprite(100, 300, "jetpack").setOrigin(0, 0.5);
  player.setCollideWorldBounds(true); // Prevent going out of bounds

  // Add basic controls (up and down with the arrow keys)
  cursors = this.input.keyboard.createCursorKeys();

  // Call the functions for Geolocation and Weather Fetch
  getLocationAndWeather();
}

// Update the game logic (called on every frame)
function update() {
  // Player movement (up and down with arrows)
  if (cursors.up.isDown) {
    player.setVelocityY(-200); // Move up
  } else if (cursors.down.isDown) {
    player.setVelocityY(200); // Move down
  } else {
    player.setVelocityY(0); // Stop movement
  }

  // Update background scroll (you can adjust speed here)
  background.tilePositionX += 2;
}

// Function to get Geolocation and Weather data
function getLocationAndWeather() {
  // Geolocation API: Get the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch weather data based on the location
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error: ", error);
      }
    );
  } else {
    console.log("Geolocation not supported");
  }
}

// Fetch weather data based on geolocation
function fetchWeather(latitude, longitude) {
  const apiKey = "YOUR_API_KEY"; // Replace with your weather API key (e.g., OpenWeatherMap)
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      weatherData = data;
      console.log("Weather data: ", weatherData);

      // Change background color or theme based on weather (example)
      if (weatherData.weather[0].main === "Clear") {
        background.setTint(0x87ceeb); // Clear skies (light blue)
      } else if (weatherData.weather[0].main === "Rain") {
        background.setTint(0x1e90ff); // Rainy (darker blue)
      }
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}
