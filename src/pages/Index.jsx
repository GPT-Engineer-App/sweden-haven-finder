import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as React from 'react';
import { Label } from "@/components/ui/label";
import 'leaflet/dist/leaflet.css';

const swedishCities = [
  { name: "Stockholm", latitude: 59.3293, longitude: 18.0686, population: 935619, culture: 5, nature: 3, economy: 5 },
  { name: "Gothenburg", latitude: 57.7089, longitude: 11.9746, population: 572799, culture: 4, nature: 4, economy: 4 },
  { name: "Malmö", latitude: 55.6050, longitude: 13.0038, population: 316588, culture: 4, nature: 3, economy: 3 },
  { name: "Uppsala", latitude: 59.8586, longitude: 17.6389, population: 168096, culture: 4, nature: 4, economy: 3 },
  { name: "Västerås", latitude: 59.6099, longitude: 16.5448, population: 119373, culture: 3, nature: 4, economy: 3 },
  { name: "Örebro", latitude: 59.2753, longitude: 15.2134, population: 115765, culture: 3, nature: 4, economy: 3 },
  { name: "Linköping", latitude: 58.4108, longitude: 15.6214, population: 158841, culture: 3, nature: 4, economy: 3 },
  { name: "Helsingborg", latitude: 56.0465, longitude: 12.6942, population: 108334, culture: 3, nature: 4, economy: 3 },
  { name: "Jönköping", latitude: 57.7826, longitude: 14.1618, population: 139222, culture: 3, nature: 5, economy: 3 },
  { name: "Norrköping", latitude: 58.5877, longitude: 16.1924, population: 141676, culture: 3, nature: 4, economy: 3 },
];

const quizQuestions = [
  { id: 'culture', question: 'How important is cultural life and entertainment to you?', options: ['Not important', 'Somewhat important', 'Very important'] },
  { id: 'nature', question: 'How much do you value access to nature and outdoor activities?', options: ['Not important', 'Somewhat important', 'Very important'] },
  { id: 'economy', question: 'How important is a strong job market and economy to you?', options: ['Not important', 'Somewhat important', 'Very important'] },
  { id: 'weather', question: 'What\'s your preferred weather?', options: ['I love the cold!', 'Mild temperatures are nice', 'The warmer, the better'] },
  { id: 'citySize', question: 'What size of city do you prefer?', options: ['Small and cozy', 'Medium-sized', 'Large and bustling'] },
  { id: 'education', question: 'How important are educational opportunities?', options: ['Not a priority', 'Somewhat important', 'Very important'] },
  { id: 'cuisine', question: 'How adventurous are you with food?', options: ['I stick to what I know', 'I like trying new things occasionally', 'I\'m a total foodie!'] },
  { id: 'transport', question: 'What\'s your preferred mode of transportation?', options: ['I love driving', 'I prefer public transport', 'I\'m all about cycling and walking'] },
];

const fetchSwedenInfo = async () => {
  const response = await fetch('https://restcountries.com/v3.1/name/sweden');
  const data = await response.json();
  return data[0];
};

const fetchISSPosition = async () => {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (!response.ok) {
      throw new Error('Failed to fetch ISS position');
    }
    const data = await response.json();
    return {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    };
  } catch (error) {
    console.error('Error fetching ISS position:', error);
    throw error;
  }
};

const Index = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [issPosition, setIssPosition] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [quizScore, setQuizScore] = useState(0);

  const { data: swedenInfo, isLoading: isSwedenInfoLoading } = useQuery({
    queryKey: ['swedenInfo'],
    queryFn: fetchSwedenInfo,
  });

  const { data: issData, isLoading: isISSLoading, error: issError } = useQuery({
    queryKey: ['issPosition'],
    queryFn: fetchISSPosition,
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 2, // Retry twice before showing error
  });

  useEffect(() => {
    if (issData) {
      setIssPosition(issData);
    }
  }, [issData]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateRecommendations = () => {
    const scores = swedishCities.map(city => {
      let score = 0;
      if (quizAnswers.culture === 'Very important') score += city.culture * 2;
      else if (quizAnswers.culture === 'Somewhat important') score += city.culture;
      
      if (quizAnswers.nature === 'Very important') score += city.nature * 2;
      else if (quizAnswers.nature === 'Somewhat important') score += city.nature;
      
      if (quizAnswers.economy === 'Very important') score += city.economy * 2;
      else if (quizAnswers.economy === 'Somewhat important') score += city.economy;
      
      // Additional scoring based on new questions
      if (quizAnswers.weather === 'I love the cold!' && city.name === 'Stockholm') score += 2;
      if (quizAnswers.citySize === 'Large and bustling' && city.population > 500000) score += 2;
      if (quizAnswers.education === 'Very important' && ['Stockholm', 'Uppsala', 'Lund'].includes(city.name)) score += 2;
      if (quizAnswers.cuisine === 'I\'m a total foodie!' && ['Stockholm', 'Gothenburg', 'Malmö'].includes(city.name)) score += 2;
      if (quizAnswers.transport === 'I prefer public transport' && ['Stockholm', 'Gothenburg'].includes(city.name)) score += 2;

      return { ...city, score };
    });

    const sortedCities = scores.sort((a, b) => b.score - a.score);
    setRecommendations(sortedCities.slice(0, 3));
    setQuizCompleted(true);

    // Calculate quiz score
    const totalQuestions = Object.keys(quizAnswers).length;
    const score = Math.round((sortedCities[0].score / (totalQuestions * 2)) * 100);
    setQuizScore(score);
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
              <CardTitle>Where Should You Live in Sweden?</CardTitle>
            </CardHeader>
            <CardContent>
              {!quizCompleted ? (
                <div className="space-y-4">
                  {quizQuestions.map((q) => (
                    <div key={q.id}>
                      <p className="font-semibold mb-2">{q.question}</p>
                      <RadioGroup onValueChange={(value) => handleQuizAnswer(q.id, value)}>
                        {q.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${q.id}-${index}`} />
                            <Label htmlFor={`${q.id}-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <Button onClick={calculateRecommendations} className="w-full mt-4">
                    Get Recommendations
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Your Sweden Living Score: {quizScore}%</h3>
                  <p className="text-sm text-gray-600">
                    {quizScore < 50 ? "Sweden might be a challenge for you, but challenges can be exciting!" :
                     quizScore < 75 ? "Sweden could be a good fit for you!" :
                     "Wow! You and Sweden are a perfect match!"}
                  </p>
                  <h3 className="font-semibold mb-2">Top Recommendations:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {recommendations.map((city, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{city.name}</span>
                        <span className="text-sm text-gray-600">Match: {Math.round((city.score / (Object.keys(quizAnswers).length * 2)) * 100)}%</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 p-4 bg-blue-100 rounded-md">
                    <h4 className="font-semibold mb-2">Fun Fact:</h4>
                    <p className="text-sm">
                      {recommendations[0]?.name === 'Stockholm' ? "Did you know Stockholm is built on 14 islands connected by 57 bridges?" :
                       recommendations[0]?.name === 'Gothenburg' ? "Gothenburg is home to Liseberg, the largest amusement park in Scandinavia!" :
                       "Sweden is one of the best countries for work-life balance, with a standard 5 weeks of vacation per year!"}
                    </p>
                  </div>
                  <Button onClick={() => {setQuizCompleted(false); setQuizAnswers({});}} className="w-full mt-4">
                    Retake Quiz
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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
              ) : issError ? (
                <p className="text-red-500">Failed to load ISS position. Please try again later.</p>
              ) : issPosition ? (
                <div className="space-y-2">
                  <p><strong>Latitude:</strong> {issPosition.latitude.toFixed(4)}</p>
                  <p><strong>Longitude:</strong> {issPosition.longitude.toFixed(4)}</p>
                </div>
              ) : (
                <p>No ISS position data available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
