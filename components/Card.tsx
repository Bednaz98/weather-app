import { View } from "react-native";


export function Card(props: { children: React.ReactNode }) {
    return <View style={{
        borderColor: "black",
        borderWidth: 1, borderRadius: 10, padding: 14,
        backgroundColor: "white",
        justifyContent: "center",
        width: "90%",
        alignSelf: "center",
        gap: 10
    }}>
        {props.children}
    </View>
}