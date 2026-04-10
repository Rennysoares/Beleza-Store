import { Text, View, StyleSheet } from 'react-native';

export function Header() {
    return (
        <View>
            <Text style={styles.title}>Relatórios</Text>
            <Text style={styles.subtitle}>Verifique </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
    },
    subtitle: {
        marginTop: 4,
        fontSize: 15,
        color: '#6B7280',
    },
})