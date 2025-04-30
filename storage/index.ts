import AsyncStorage from "@react-native-async-storage/async-storage";
import { UnitType, WeatherDisplay } from "../types";


const weatherKey = "weatherData"

function convertObjectToArray(object: { [key: string]: WeatherDisplay }): WeatherDisplay[] {
    return Object.values(object)
}

export async function getWeatherDataFromStorage(): Promise<WeatherDisplay[]> {
    console.log("getting stored weather data")
    try {
        const weatherData = await AsyncStorage.getItem(weatherKey)
        console.log("weatherData", weatherData)
        return weatherData ? convertObjectToArray(JSON.parse(weatherData)) : []
    } catch (error) {
        console.error(error)
        await AsyncStorage.clear()
        return []
    }
}


function reduceWeatherArray(weatherDataArray: WeatherDisplay[]): { [key: string]: WeatherDisplay } {
    return weatherDataArray.reduce((acc: any, item: WeatherDisplay) => {
        acc[item.locationName] = item
        return acc
    }, {})
}

export async function addWeatherDataToStorage(weatherData: WeatherDisplay) {
    console.log("adding weather data to storage")
    try {
        const weatherDataArray = await getWeatherDataFromStorage()
        const newWeatherDataArray = [{ ...weatherData, favorite: true }, ...weatherDataArray]
        const object = reduceWeatherArray(newWeatherDataArray)
        await AsyncStorage.setItem(weatherKey, JSON.stringify(object))
        return newWeatherDataArray
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function removeWeatherDataFromStorage(weatherData: WeatherDisplay) {
    console.log("removing weather data from storage")
    try {
        const weatherDataArray = await getWeatherDataFromStorage()
        const filteredList = weatherDataArray.filter((item) => item.locationName !== weatherData.locationName)
        const object = reduceWeatherArray(filteredList)
        await AsyncStorage.setItem(weatherKey, JSON.stringify(object))
        return filteredList
    } catch (error) {
        console.error(error)
        return []
    }
}

const tempUnitTypeKey = "tempUnitType"
export async function saveTempUnitType(unitType: UnitType) {
    await AsyncStorage.setItem(tempUnitTypeKey, unitType)
}

export async function getTempUnitType(): Promise<UnitType> {
    const unitType = await AsyncStorage.getItem(tempUnitTypeKey)
    console.log("unitType", unitType)
    return unitType ? unitType as UnitType : UnitType.FAHRENHEIT
}




