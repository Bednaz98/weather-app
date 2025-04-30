import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Card } from "../components";
import { useState, useLayoutEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SelectLocation } from "./LocationSelection";
import { UnitType } from "../types";
import { WeatherDisplay } from "../types";
import { getWeatherDataFromStorage, addWeatherDataToStorage, removeWeatherDataFromStorage, saveTempUnitType, getTempUnitType } from "../storage";
import { getWeatherDataByAddress } from "../api";
import { useNetInfo } from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function WifiBanner() {
    const isConnected = useNetInfo()
    if (isConnected.isConnected) {
        return null
    }
    return <View style={{ backgroundColor: "darkkhaki", padding: 10, borderRadius: 10, alignItems: "center", width: "90%", alignSelf: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>No Wifi</Text>
        <Text style={{ fontSize: 12, fontWeight: "normal", textAlign: "center" }}>Please connect to wifi to use the app</Text>
    </View>
}

function convertTemperature(temperature: number, unitType: UnitType) {
    if (unitType === UnitType.FAHRENHEIT) {
        return temperature;
    }
    else {
        const value = (temperature - 32) * (5 / 9);
        return value.toFixed(1);
    }
}


function HeaderSection() {
    return <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>My Weather App</Text>
    </View>
}

function DisplayWeather(props: WeatherDisplay & { unitType: UnitType, onFavoritePress: (weatherData: WeatherDisplay) => Promise<void>, onDeletePress: (weatherData: WeatherDisplay) => Promise<void> }) {

    const onFavoritePress = async () => {
        await props.onFavoritePress(props)
    }

    const onDeletePress = async () => {
        await props.onDeletePress(props)
    }

    const Display = () => {
        return <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", width: "80%" }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >{props.locationName}</Text>
                <Text style={{ fontSize: 16 }}>{convertTemperature(props.temperature, props.unitType)}{props.unitType}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "normal" }}>{props.condition}</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity onPress={onFavoritePress} style={{ backgroundColor: "cyan", padding: 8, borderRadius: 10 }}>
                        <Ionicons name={props.favorite ? 'star' : 'star-outline'} size={16} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDeletePress} style={{ backgroundColor: "cyan", padding: 8, borderRadius: 10 }}>
                        <Ionicons name="trash" size={16} color='black' />
                    </TouchableOpacity>

                </View>
            </View>
            <ScrollView horizontal

            >
                <Text>Feels Like: {convertTemperature(props.feelsLike, props.unitType)}</Text>
                <Text>, UV Index: {props.uv}</Text>
            </ScrollView>
        </Card>
    }
    if (!props.favorite) {
        return <Display />
    }

    const refreshWeather = async () => {
        const newWeatherData = await getWeatherDataByAddress(props.locationName)
        if (newWeatherData) {
            props.onFavoritePress(newWeatherData)
        }
    }

    return (
        <TouchableOpacity onPress={refreshWeather}>
            <Display />
        </TouchableOpacity>
    )
}


const lastMinuteRefreshThreshold = 60
async function refreshFunction(currentWeatherData: WeatherDisplay[]) {
    const newWeather: WeatherDisplay[] = []
    const length = currentWeatherData.length
    for (let i = 0; i < length; i++) {
        const weather = currentWeatherData[i]
        const elapsedTime = (Date.now() - weather.lastFetchTime) / 1000
        const threshHoldCheck = elapsedTime > lastMinuteRefreshThreshold
        if (threshHoldCheck) {
            console.log("refresh with threshold")
            const newWeatherData = await getWeatherDataByAddress(weather.locationName)
            if (newWeatherData) {
                newWeather.push({ ...newWeatherData, favorite: weather.favorite })
                if (newWeatherData.favorite) {
                    await addWeatherDataToStorage({ ...newWeatherData, lastFetchTime: Date.now(), favorite: weather.favorite })
                }
            }
        }
        else {
            console.log("no refresh with threshold")
            newWeather.push(weather)
        }
    }

    return newWeather
}

const pullToRefreshDelay = 300

export function MainScreen() {
    const [displayWeatherData, setDisplayWeatherData] = useState<WeatherDisplay[]>([]);
    const [unitType, setUnitType] = useState<UnitType>(UnitType.FAHRENHEIT);
    const [refreshing, setRefreshing] = useState(false);

    const flipUnitType = async () => {
        const newUnitType = unitType === UnitType.FAHRENHEIT ? UnitType.CELSIUS : UnitType.FAHRENHEIT;
        setUnitType(newUnitType);
        await saveTempUnitType(newUnitType);
    }

    const addNewLocation = (location: WeatherDisplay) => {
        const filterFunction = (item: WeatherDisplay) => item.locationName !== location.locationName;
        const filteredWeatherData = displayWeatherData.filter(filterFunction);
        setDisplayWeatherData([location, ...filteredWeatherData]);
    }

    const onPullToRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            const weatherData = await refreshFunction(displayWeatherData)
            setDisplayWeatherData(weatherData)
            setRefreshing(false);
        }, pullToRefreshDelay);

    }


    const startUpCallBack = async () => {
        const weatherData = await getWeatherDataFromStorage()
        if (weatherData.length > 0) {
            setDisplayWeatherData(weatherData)
        }
        const unitType = await getTempUnitType()
        setUnitType(unitType)
    }
    useLayoutEffect(() => {
        startUpCallBack()
    }, [])

    const onFavoritePress = async (weatherData: WeatherDisplay) => {
        if (weatherData.favorite) {
            await removeWeatherDataFromStorage(weatherData)
            setDisplayWeatherData(displayWeatherData.map((item) => item.locationName === weatherData.locationName ? { ...item, favorite: false } : item))
        } else {
            await addWeatherDataToStorage(weatherData)
            const filteredList = displayWeatherData.filter((item) => item.locationName !== weatherData.locationName)
            setDisplayWeatherData([{ ...weatherData, favorite: true }, ...filteredList])
        }
    }
    const onDeletePress = async (weatherData: WeatherDisplay) => {
        await removeWeatherDataFromStorage(weatherData)
        setDisplayWeatherData(displayWeatherData.filter((item) => item.locationName !== weatherData.locationName))
    }
    const safeAreaInsets = useSafeAreaInsets();

    return (
        <View style={{ gap: 10, flex: 1 }}>
            <View style={{ gap: 10, backgroundColor: "cornflowerblue", paddingBottom: 10, }}>
                <View style={{ paddingTop: safeAreaInsets.top, gap: 10 }}>
                    <WifiBanner />
                    <HeaderSection />
                    <SelectLocation unitType={unitType} flipUnitType={flipUnitType} addNewLocation={addNewLocation} />
                </View>
            </View>
            <FlatList
                data={displayWeatherData}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <DisplayWeather {...item} unitType={unitType} onFavoritePress={onFavoritePress} onDeletePress={onDeletePress} />}
                keyExtractor={(item) => item.locationName + Math.random()}
                contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
                style={{ flex: 1, paddingHorizontal: 10 }}
                ListEmptyComponent={<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>No locations added</Text>
                </View>}
                refreshing={refreshing}
                onRefresh={onPullToRefresh}
            />
        </View>


    )
}