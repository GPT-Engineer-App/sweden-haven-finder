import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import 'leaflet/dist/leaflet.css';

const fetchCities = async () => {
  const response = await fetch('https://api.api-ninjas.com/v1/city?country=SE&limit=10', {
    headers: {
      'X-Api-Key': 'YOUR_API_NINJAS_KEY'
    }
  });
  return response.json();
};

const Index = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const { data: cities, isLoading, error } = useQuery({ queryKey: ['cities'], queryFn: fetchCities });

  const fetchWeather = async (city) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},SE&appid=YOUR_OPENWEATHERMAP_API_KEY&units=metric`);
    return response.json();
  };

  const { data: weather, refetch: refetchWeather } = useQuery({
    queryKey: ['weather', selectedCity],
    queryFn: () => fetchWeather(selectedCity),
    enabled: !!selectedCity,
  });

  const handleCityClick = (city) => {
    setSelectedCity(city.name);
    refetchWeather();
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Find Your Ideal Place in Sweden</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Map of Sweden</CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer center={[62.1282, 15.6435]} zoom={4} style={{ height: '60vh', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {cities.map((city) => (
                <Marker key={city.name} position={[city.latitude, city.longitude]}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{city.name}</h3>
                      <p>Population: {city.population}</p>
                      <Button onClick={() => handleCityClick(city)}>Select City</Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
                {weather && (
                  <div>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                  </div>
                )}
              </>
            ) : (
              <p>Select a city on the map to see more information.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
