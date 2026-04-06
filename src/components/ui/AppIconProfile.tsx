import { Text, View } from "react-native";

export default function AppIconProfile({firstLetter}: {firstLetter: string}) {
    return (
        <View style={{
            width: 50, height: 50,
            borderRadius: '50%',
            backgroundColor: 'rgb(171,44,231)', alignItems: 'center', justifyContent: 'center'
        }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{firstLetter}</Text>
        </View>
    );
}