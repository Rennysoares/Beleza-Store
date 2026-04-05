import { Plus } from 'lucide-react-native';
import { View, TouchableOpacity, StyleSheet } from 'react-native'

export default function AppPlusButton() {
    return (
        <TouchableOpacity
            onPress={()=>{}}
        >
            <View style={styles.button}>
                <Plus size={18} color='black' />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{ 
        backgroundColor: '#d4d2d2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: '50%'
    }
})