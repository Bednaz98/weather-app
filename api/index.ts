import axios from "axios"
import { APITypes } from "../types/apiTypes"
import { WeatherDisplay } from "../types"

import netInfo from "@react-native-community/netinfo"





const key = process.env["API_KEY"]
const url = "http://api.weatherapi.com/v1"



function transformWeatherData(data: APITypes): WeatherDisplay {
    const locationName = data.location.name
    const locationCountry = data.location.country
    return {
        locationName: `${locationName}, ${locationCountry}`,
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        favorite: false,
        lastFetchTime: Date.now(),
        feelsLike: data.current.feelslike_f,
        uv: data.current.uv
    }
}

export async function getWeatherDataByAddress(cityName: string) {
    const isConnected = await netInfo.fetch()
    if (!isConnected.isConnected) {
        return null
    }
    const mainData = await axios.get(url + "/current.json", { params: { key, q: cityName } })
    console.log(JSON.stringify(mainData.data))
    return transformWeatherData(mainData.data)

}