import React, { useState, useEffect } from 'react';
import { 
    View, Text, FlatList, StyleSheet, ActivityIndicator, 
    TouchableOpacity, StatusBar 
} from 'react-native';
import WeatherCard from '../components/WeatherCard';

const WeatherApp: React.FC = () => {
    const [forecast, setForecast] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const apiKey = '11edcbabe7cfa2e03e9cab996d06efc9';
    const urlBase = 'https://api.openweathermap.org/data/2.5/forecast';
    const lat = '21.14';
    const lon = '-98.42';

    const fetchWeatherData = async () => {
        try {
            const response = await fetch(`${urlBase}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            const data = await response.json();

            if (response.status !== 200) {
                throw new Error(data.message || "Error al obtener datos del clima");
            }

            // Agrupar datos por día
            const groupedForecast: any = {};
            data.list.forEach((item: any) => {
                const date = item.dt_txt.split(' ')[0];
                const dayOfWeek = new Date(date).toLocaleDateString('es-ES', { weekday: 'long' });

                if (!groupedForecast[date]) {
                    groupedForecast[date] = {
                        date: new Date(date).toLocaleDateString('es-ES'),
                        day: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
                        temp_max: item.main.temp_max,
                        temp_min: item.main.temp_min,
                        rain_prob: item.pop * 100,
                        condition: { 
                            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
                            text: item.weather[0].description 
                        }
                    };
                } else {
                    groupedForecast[date].temp_max = Math.max(groupedForecast[date].temp_max, item.main.temp_max);
                    groupedForecast[date].temp_min = Math.min(groupedForecast[date].temp_min, item.main.temp_min);
                    groupedForecast[date].rain_prob = Math.max(groupedForecast[date].rain_prob, item.pop * 100);
                }
            });

            setForecast(Object.values(groupedForecast).slice(0, 5));
            setError('');
        } catch (error: any) {
            console.error("❌ Error en fetchWeatherData:", error.message);
            setError(error.message || 'Error al obtener datos del clima');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando datos del clima...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>🌤 Pronóstico del Clima</Text>
            <Text style={styles.subtitle}>📍 Huejutla de Reyes</Text>

            <FlatList
                data={forecast}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => <WeatherCard data={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF', // Azul brillante
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    list: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#007AFF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#D0021B',
        fontSize: 18,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 15,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    retryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default WeatherApp;
