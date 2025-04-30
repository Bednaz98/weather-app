import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity } from "react-native";

import * as Location from 'expo-location';
import { useState, useRef } from "react";
import { Card } from "../components";
import { UnitType, WeatherDisplay } from "../types";
import { getWeatherDataByAddress } from "../api";
import { useNetInfo } from "@react-native-community/netinfo";


async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        return null
    }

    const location = await Location.getCurrentPositionAsync();
    console.log("location", location)
    const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    });
    const firstLocation = address[0]
    const city = firstLocation?.city
    const country = firstLocation?.country
    if (!city) return `${country}`
    else if (!country) return `${city}`
    else if (!city && !country) return "Unknown"
    else return `${city}, ${country}`;
}


const ToolBar = (props: { unitType: UnitType, flipUnitType: () => Promise<void> }) => {
    return <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 30 }}>
        <Text style={{ fontSize: 16 }}>Unit Type</Text>
        <TouchableOpacity onPress={props.flipUnitType} style={{ backgroundColor: "cyan", padding: 8, borderRadius: 10 }}>
            <Text>{props.unitType}</Text>
        </TouchableOpacity>
    </View>
}


const TimeoutDelay = 400

export function SelectLocation(props: { unitType: UnitType, flipUnitType: () => Promise<void>, addNewLocation: (location: WeatherDisplay) => void }) {

    const [inputLocation, setInputLocation] = useState("")
    const [loadingGeolocation, setLoadingGeolocation] = useState(false)
    const inputRef = useRef<TextInput>(null)
    const isConnected = useNetInfo()


    const handleGetLocation = async () => {
        setLoadingGeolocation(true)
        const address = await getLocation()
        if (address) {
            setInputLocation(address || "");
            setTimeout(() => {
                setLoadingGeolocation(false)
            }, TimeoutDelay)

        }
        else {
            setTimeout(() => {
                setLoadingGeolocation(false)
            }, TimeoutDelay)
        }
    }


    const LoadingForm = () => {
        return <View style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Getting Your Location...</Text>
            <ActivityIndicator size="large" />
        </View>
    }


    const handleUseInputLocation = async () => {
        try {
            setLoadingGeolocation(true)
            console.log("adding location")
            const weatherData = await getWeatherDataByAddress(inputLocation)
            if (weatherData) {
                setLoadingGeolocation(false)
                setInputLocation("")
                inputRef.current?.clear()
                inputRef.current?.blur()
                props.addNewLocation(weatherData);
            }
            else {
                setLoadingGeolocation(false)
            }
        } catch (error) {
            console.log("error", JSON.stringify(error))
            setLoadingGeolocation(false)
        }
    }


    const clearInputLocation = () => {
        setInputLocation("")
        inputRef.current?.clear()
        inputRef.current?.blur()
    }


    return <View style={{ justifyContent: "center" }}>
        <Card>
            {loadingGeolocation ? <LoadingForm /> : <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Select a Location</Text>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <TextInput
                        ref={inputRef}
                        value={inputLocation}
                        style={{ flex: 1, borderWidth: 1, borderColor: "black", borderRadius: 10, padding: 4, fontSize: 16, paddingLeft: 10 }}
                        placeholder="Enter a location"
                        onChangeText={setInputLocation}

                    />
                    <Button title="Clear" onPress={clearInputLocation} disabled={inputLocation.length === 0} />
                </View>
                <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-around" }}>
                    <Button title="Use My Location" onPress={handleGetLocation} disabled={!isConnected.isConnected} />
                    <Button title="Add Location" onPress={handleUseInputLocation} disabled={inputLocation.length < 4 || !isConnected.isConnected} />
                </View>
            </View>}
            <ToolBar unitType={props.unitType} flipUnitType={props.flipUnitType} />
        </Card>
    </View>
}