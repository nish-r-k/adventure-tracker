#  Outdoor Adventure Tracker

This project is a **real-world solution** that helps outdoor enthusiasts track their adventures, monitor weather conditions, and share their location for safety. 

---

# What it does

-  **Tracks your live location** using the **Geolocation API**.
-  **Displays an interactive map** with your route drawn using the **Canvas API** overlay.
-  **Detects your network status** using the **Network Information API**.
-  **Uses Background Tasks API** (or fallback) to periodically update your location and alert you if you deviate from your planned route.
-  **Shows real weather data** at your current location via **OpenWeatherMap**.
-  **Lets you share your current location** for safety.

---

# Real Web APIs used

| Web API | How it’s used |

| **Geolocation API** | Get your current coordinates in real time. 
| **Canvas API** | Draw your travel route dynamically on top of the map. 
| **Network Information API** | Show warnings if your network is slow or offline. 
| **Background Tasks API** (with fallback) | Periodically updates location & weather. 
| **Leaflet.js** | Provides an interactive map with OpenStreetMap tiles. 
| **OpenWeatherMap API** | Fetches real weather data for your location (needs API key). 



# Tech stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Leaflet.js (for the map)
- OpenWeatherMap (for weather)



# How to run

1. **Get an OpenWeatherMap API key**  
   - Sign up at [https://openweathermap.org/](https://openweathermap.org/)  
   - Get your free API key.

2. **Replace the placeholder in `script.js`**  
   ```javascript
   const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
