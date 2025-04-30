
# MY Weather App

## project requirements
in order to run the project the following will be needed:
- NodeJS
- OpenJDK17 (or Java equivalent) Android only
- Android Studio Android only
- Xcode iOS only
- Ruby 2.7 or greater iOS only
more detailed instructions for OS specific setup can be found here: https://reactnative.dev/docs/0.74/set-up-your-environment?platform=android&os=macos

The api requires a took to be used. This can be added by creating a .env.local file and adding the following:

```env
EXPO_PUBLIC_API_KEY=****
```


## starting the project

### Running on Android
to run on android, be sure to create an emulator through android studio. This will require installing a base image for the emulator.

### Running on iOS
to run on ios, first open xCode and agree to the terms of service. be sure that the xcode commandline tools are install. open the simulator app that comes with xCode. install required OS simulator

### deploying a test build
After the above requirements are setup run the following commands in the terminal:
```shell
npm i # or npm install

# for android
npm run android

# for ios
npm run ios
```

## App Features

The React Native project was created to satisfy the following feature:
- The User can input a city
    - the user can also use their geo location
    - when entering a location the user has a clear option
    - submission is only allowed when the user types ore than 4 characters to prevent api calsl that may fail
- Display the weather in a specific city
    - City name
    - Temperature
    - Weather condition
    - UV index
    - "Feels like" Temperature
- a user can favorite a location to persist it across app sessions
- the user can clean a previously searched city
- the user can toggle between fahrenheit and celsius 
- The user has two ways to refresh the display
    - standard pull down to refresh, using an cached data for up to one minute
    - whew clicking on a favorite location, the app will fetch the relevant data live
- All weather data is being pulled from a third party api
- all data is cached in app
- if the user has no wifi, parts of the display are disabled
- if there is no wifi, the previous cities favorite can still be interacted with.



# References
Api reference source is from: https://www.weatherapi.com/
Logo used here: <a href="https://www.flaticon.com/free-icons/weather-app" title="weather app icons">Weather app icons created by Andrean Prabowo - Flaticon</a>