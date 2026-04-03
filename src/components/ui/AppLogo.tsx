import React from "react";
import { View, Text} from "react-native";
import { Package } from "lucide-react-native";

type AppLogoProps = {
    size?: number;
    showText?: boolean;
};

export default function AppLogo({ size = 20, showText = true }: AppLogoProps) {
    return (
        <View style={{display: 'flex', flexDirection: 'row', alignItems: "center", gap: 5}}>
            <View style={{ backgroundColor: 'rgb(171,44,231)', padding: 7, borderRadius: 10 }}>
                <Package color={'white'} size={size} />
            </View>
            <Text style={{ fontSize: 14, color: '#333'}}>Beleza Store</Text>
        </View>

    );
}