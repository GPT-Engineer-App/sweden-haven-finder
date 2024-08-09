import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import 'leaflet/dist/leaflet.css';

const swedishCities = [
  { name: "Stockholm", latitude: 59.3293, longitude: 18.0686, population: 935619 },
  { name: "Gothenburg", latitude: 57.7089, longitude: 11.9746, population: 572799 },
  { name: "Malmö", latitude: 55.6050, longitude: 13.0038, population: 316588 },
  { name: "Uppsala", latitude: 59.8586, longitude: 17.6389, population: 168096 },
  { name: "Västerås", latitude: 59.6099, longitude: 16.5448, population: 119373 },
  { name: "Örebro", latitude: 59.2753, longitude: 15.2134, population: 115765 },
  { name: "Linköping", latitude: 58.4108, longitude: 15.6214, population: 158841 },
  { name: "Helsingborg", latitude: 56.0465, longitude: 12.6942, population: 108334 },
  { name: "Jönköping", latitude: 57.7826, longitude: 14.1618, population: 139222 },
  { name: "Norrköping", latitude: 58.5877, longitude: 16.1924, population: 141676 },
];

const Index = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  const getPlaceholderWeather = (city) => {
    // Generate pseudo-random weather data based on the city name
    const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min, max) => (seed % (max - min + 1)) + min;
    
    return {
      temperature: random(10, 25),
      weather_state_name: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][random(0, 3)],
      humidity: random(30, 80),
      wind_speed: random(0, 10)
    };
  };

  const { data: weather } = useQuery({
    queryKey: ['weather', selectedCity],
    queryFn: () => getPlaceholderWeather(selectedCity),
    enabled: !!selectedCity,
  });

  const handleCityClick = (city) => {
    setSelectedCity(city.name);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Find Your Ideal Place in Sweden</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Map of Sweden</CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer center={[62.1282, 15.6435]} zoom={5} style={{ height: '70vh', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {swedishCities.map((city) => (
                <Marker key={city.name} position={[city.latitude, city.longitude]}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{city.name}</h3>
                      <p>Population: {city.population.toLocaleString()}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>
        <div className="space-y-6 md:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Cities in Sweden</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[40vh] md:h-[50vh]">
                <div className="space-y-2">
                  {swedishCities.map((city) => (
                    <Button
                      key={city.name}
                      onClick={() => handleCityClick(city)}
                      variant={selectedCity === city.name ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      {city.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>City Information</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCity ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">{selectedCity}</h3>
                  <div className="space-y-2">
                    <p>Temperature: {weather.temperature.toFixed(1)}°C</p>
                    <p>Weather: {weather.weather_state_name}</p>
                    <p>Humidity: {weather.humidity}%</p>
                    <p>Wind Speed: {weather.wind_speed.toFixed(1)} m/s</p>
                  </div>
                </>
              ) : (
                <p>Select a city to see more information.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
