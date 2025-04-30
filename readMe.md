# My Weather App

## Project Requirements

To run this project, the following dependencies are required:

- **Node.js**
- **OpenJDK 17** (or equivalent Java SDK) — *Android only*
- **Android Studio** — *Android only*
- **Xcode** — *iOS only*
- **Ruby 2.7 or later** — *iOS only*

For detailed setup instructions specific to your operating system, please refer to the [React Native environment setup guide](https://reactnative.dev/docs/0.74/set-up-your-environment?platform=android&os=macos).

### API Configuration

This app requires an API key. To provide this key, create a `.env.local` file in the project root and include the following:

```env
EXPO_PUBLIC_API_KEY=your_api_key_here
```

## Running the Project

### Android

1. Open Android Studio.
2. Create an emulator by installing a base system image.
3. Run the emulator.

### iOS

1. Launch Xcode and accept the license agreement if prompted.
2. Ensure that Xcode Command Line Tools are installed.
3. Open the Simulator app.
4. Install the required iOS runtime for the simulator.

### Running the App

In your terminal, execute the following commands:

```shell
npm install # this will install all dependencies

# To run on Android
npm run android

# To run on iOS
npm run ios
```

## App Features

This React Native application provides the following functionality:

- **Search Functionality**
  - Users can enter a city name or use their current geolocation.
  - An option to clear the input is available.
  - City search is enabled only after the user enters more than 4 characters to reduce failed API calls.

- **Weather Display**
  - Displays city name, temperature, weather condition, UV index, and "feels like" temperature.

- **Favorites**
  - Users can favorite a location, which is persisted across sessions.
  - Previously searched cities can be cleared.

- **Unit Toggle**
  - Users can switch between Fahrenheit and Celsius.

- **Data Refresh**
  - Pull-to-refresh is supported, using cached data for up to one minute.
  - Tapping a favorite location triggers a live API fetch.

- **Offline Support**
  - Weather data is cached locally.
  - If the user is offline, some UI elements are disabled.
  - Favorited cities remain accessible even without a Wi-Fi connection.



# References
- source code: https://github.com/Bednaz98/weather-app
- Api reference source is from: https://www.weatherapi.com/
- Logo used here: <a href="https://www.flaticon.com/free-icons/weather-app" title="weather app icons">Weather app icons created by Andrean Prabowo - Flaticon</a>