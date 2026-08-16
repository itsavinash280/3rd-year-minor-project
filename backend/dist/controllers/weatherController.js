export const getWeatherForecast = async (req, res) => {
    try {
        const { district = 'Lucknow', state = 'Uttar Pradesh' } = req.query;
        const weatherData = {
            location: { district, state },
            current: {
                tempC: 31,
                condition: 'Partly Cloudy',
                humidity: 62,
                windKmph: 14,
                rainfallProb: 10,
                uvIndex: 7,
            },
            forecast7Days: [
                { day: 'Today (Aug 15)', maxTemp: 32, minTemp: 24, condition: 'Sunny', rainChance: 10, icon: 'sun' },
                { day: 'Tomorrow (Aug 16)', maxTemp: 31, minTemp: 23, condition: 'Partly Cloudy', rainChance: 20, icon: 'cloud-sun' },
                { day: 'Mon (Aug 17)', maxTemp: 30, minTemp: 22, condition: 'Light Rain', rainChance: 65, icon: 'cloud-rain' },
                { day: 'Tue (Aug 18)', maxTemp: 29, minTemp: 22, condition: 'Thunderstorm', rainChance: 80, icon: 'cloud-lightning' },
                { day: 'Wed (Aug 19)', maxTemp: 31, minTemp: 23, condition: 'Partly Cloudy', rainChance: 30, icon: 'cloud-sun' },
                { day: 'Thu (Aug 20)', maxTemp: 33, minTemp: 25, condition: 'Clear Sky', rainChance: 5, icon: 'sun' },
                { day: 'Fri (Aug 21)', maxTemp: 34, minTemp: 25, condition: 'Sunny', rainChance: 0, icon: 'sun' },
            ],
            agroAdvisory: [
                'Rainfall expected on Aug 17 & 18: Postpone pesticide and fertilizer sprays until Aug 19.',
                'High humidity on Tue: Ensure proper field drainage in standing paddy crops.',
                'Ideal soil temperature (26-28°C) for land preparation for upcoming Rabi sowing.',
            ],
        };
        res.status(200).json({ success: true, weather: weatherData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
