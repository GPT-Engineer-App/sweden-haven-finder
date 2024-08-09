import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
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

const fetchSwedenInfo = async () => {
  const response = await fetch('https://restcountries.com/v3.1/name/sweden');
  const data = await response.json();
  return data[0];
};

const fetchISSPosition = async () => {
  const response = await fetch('http://api.open-notify.org/iss-now.json');
  const data = await response.json();
  return {
    latitude: parseFloat(data.iss_position.latitude),
    longitude: parseFloat(data.iss_position.longitude),
  };
};

const Index = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [issPosition, setIssPosition] = useState(null);

  const { data: swedenInfo, isLoading: isSwedenInfoLoading } = useQuery({
    queryKey: ['swedenInfo'],
    queryFn: fetchSwedenInfo,
  });

  const { data: issData, isLoading: isISSLoading } = useQuery({
    queryKey: ['issPosition'],
    queryFn: fetchISSPosition,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  useEffect(() => {
    if (issData) {
      setIssPosition(issData);
    }
  }, [issData]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Explore Sweden</h1>
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
              {issPosition && (
                <Circle
                  center={[issPosition.latitude, issPosition.longitude]}
                  pathOptions={{ fillColor: 'red', color: 'red' }}
                  radius={200000}
                >
                  <Popup>ISS Current Location</Popup>
                </Circle>
              )}
            </MapContainer>
          </CardContent>
        </Card>
        <div className="space-y-6 md:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Cities in Sweden</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[30vh] md:h-[40vh]">
                <div className="space-y-2">
                  {swedishCities.map((city) => (
                    <Button
                      key={city.name}
                      onClick={() => handleCityClick(city)}
                      variant={selectedCity?.name === city.name ? "default" : "outline"}
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
              <CardTitle>Sweden Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isSwedenInfoLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : swedenInfo ? (
                <div className="space-y-2">
                  <p><strong>Capital:</strong> {swedenInfo.capital[0]}</p>
                  <p><strong>Population:</strong> {swedenInfo.population.toLocaleString()}</p>
                  <p><strong>Area:</strong> {swedenInfo.area.toLocaleString()} km²</p>
                  <p><strong>Region:</strong> {swedenInfo.region}</p>
                  <p><strong>Subregion:</strong> {swedenInfo.subregion}</p>
                </div>
              ) : (
                <p>Failed to load Sweden information.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ISS Location</CardTitle>
            </CardHeader>
            <CardContent>
              {isISSLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading ISS position...</span>
                </div>
              ) : issPosition ? (
                <div className="space-y-2">
                  <p><strong>Latitude:</strong> {issPosition.latitude.toFixed(4)}</p>
                  <p><strong>Longitude:</strong> {issPosition.longitude.toFixed(4)}</p>
                </div>
              ) : (
                <p>Failed to load ISS position.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
