import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface WeatherCardProps {
    data: {
        date: string;
        day: string;
        temp_max: number;
        temp_min: number;
        rain_prob: number;
        condition: {
            icon: string;
            text: string;
        };
    };
}

const getBackgroundColor = (temp: number) => {
    if (temp < 20) return '#4A90E2'; // Azul frío
    if (temp >= 20 && temp < 30) return '#FFC107'; // Amarillo brillante
    return '#D0021B'; // Rojo cálido
};

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
    return (
        <View style={[styles.card, { backgroundColor: getBackgroundColor(data.temp_max) }]}>
            <View style={styles.left}>
                <Text style={styles.date}>{data.day} - {data.date}</Text>
                <Text style={styles.condition}>{data.condition.text}</Text>
                <View style={styles.tempContainer}>
                    <Text style={styles.temp}>🌡 {data.temp_max.toFixed(1)}°C</Text>
                    <Text style={styles.tempMin}> / {data.temp_min.toFixed(1)}°C</Text>
                </View>
                <Text style={styles.rain}>💧 {data.rain_prob.toFixed(0)}% prob. de lluvia</Text>
            </View>
            <Image source={{ uri: data.condition.icon }} style={styles.icon} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
        padding: 16,
        borderRadius: 14,
        width: '95%', 
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 2, height: 3 },
        shadowRadius: 4,
        elevation: 3, 
    },
    left: {
        flex: 1, 
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    icon: {
        width: 50,
        height: 50, 
        marginLeft: 12,
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 4,
    },
    temp: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    tempMin: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EEE',
    },
    condition: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#FFF',
        marginVertical: 2,
    },
    rain: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 6,
    },
});

export default WeatherCard;
