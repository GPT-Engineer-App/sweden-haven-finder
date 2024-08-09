import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navigation from '../components/Navigation';

const questions = [
  {
    id: 'population',
    text: 'What size of city do you prefer?',
    options: [
      { value: 'large', label: 'Large city (500,000+)' },
      { value: 'medium', label: 'Medium city (100,000 - 500,000)' },
      { value: 'small', label: 'Small city (30,000 - 100,000)' },
      { value: 'town', label: 'Town (< 30,000)' },
    ],
  },
  {
    id: 'location',
    text: 'Which part of Sweden do you prefer?',
    options: [
      { value: 'north', label: 'Northern Sweden' },
      { value: 'central', label: 'Central Sweden' },
      { value: 'south', label: 'Southern Sweden' },
    ],
  },
  {
    id: 'lifestyle',
    text: 'What lifestyle are you looking for?',
    options: [
      { value: 'urban', label: 'Urban and bustling' },
      { value: 'suburban', label: 'Suburban and balanced' },
      { value: 'rural', label: 'Rural and peaceful' },
    ],
  },
  {
    id: 'climate',
    text: 'What climate do you prefer?',
    options: [
      { value: 'cold', label: 'Cold with long winters' },
      { value: 'moderate', label: 'Moderate with distinct seasons' },
      { value: 'mild', label: 'Milder with shorter winters' },
    ],
  },
  {
    id: 'nature',
    text: 'What type of nature do you enjoy most?',
    options: [
      { value: 'coast', label: 'Coastal areas and archipelagos' },
      { value: 'forest', label: 'Forests and lakes' },
      { value: 'mountains', label: 'Mountains and wilderness' },
    ],
  },
  {
    id: 'culture',
    text: 'What kind of cultural scene do you prefer?',
    options: [
      { value: 'cosmopolitan', label: 'Cosmopolitan with international influences' },
      { value: 'traditional', label: 'Traditional Swedish culture' },
      { value: 'mix', label: 'A mix of both' },
    ],
  },
];

const cities = [
  { name: 'Stockholm', population: 'large', location: 'central', lifestyle: 'urban', climate: 'moderate', nature: 'coast', culture: 'cosmopolitan', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Stockholm_skyline_from_S%C3%B6dermalm.jpg/640px-Stockholm_skyline_from_S%C3%B6dermalm.jpg' },
  { name: 'Gothenburg', population: 'large', location: 'south', lifestyle: 'urban', climate: 'mild', nature: 'coast', culture: 'mix', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/G%C3%B6teborg_-_KMB_-_16001000010352.jpg/640px-G%C3%B6teborg_-_KMB_-_16001000010352.jpg' },
  { name: 'Malmö', population: 'medium', location: 'south', lifestyle: 'urban', climate: 'mild', nature: 'coast', culture: 'cosmopolitan', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Malm%C3%B6_-_panoramio_-_Laima_Grebzde_%281%29.jpg/640px-Malm%C3%B6_-_panoramio_-_Laima_Grebzde_%281%29.jpg' },
  { name: 'Uppsala', population: 'medium', location: 'central', lifestyle: 'suburban', climate: 'moderate', nature: 'forest', culture: 'mix', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Uppsala_Cathedral_from_the_Castle.jpg/640px-Uppsala_Cathedral_from_the_Castle.jpg' },
  { name: 'Västerås', population: 'medium', location: 'central', lifestyle: 'suburban', climate: 'moderate', nature: 'forest', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/V%C3%A4ster%C3%A5s_Skyline_2019.jpg/640px-V%C3%A4ster%C3%A5s_Skyline_2019.jpg' },
  { name: 'Örebro', population: 'medium', location: 'central', lifestyle: 'suburban', climate: 'moderate', nature: 'forest', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/%C3%96rebro_slott_maj_2005.jpg/640px-%C3%96rebro_slott_maj_2005.jpg' },
  { name: 'Linköping', population: 'medium', location: 'south', lifestyle: 'suburban', climate: 'moderate', nature: 'forest', culture: 'mix', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Link%C3%B6ping_-_KMB_-_16000300029956.jpg/640px-Link%C3%B6ping_-_KMB_-_16000300029956.jpg' },
  { name: 'Umeå', population: 'small', location: 'north', lifestyle: 'suburban', climate: 'cold', nature: 'forest', culture: 'mix', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ume%C3%A5_-_KMB_-_16001000065097.jpg/640px-Ume%C3%A5_-_KMB_-_16001000065097.jpg' },
  { name: 'Luleå', population: 'small', location: 'north', lifestyle: 'suburban', climate: 'cold', nature: 'coast', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Lule%C3%A5_-_KMB_-_16001000042467.jpg/640px-Lule%C3%A5_-_KMB_-_16001000042467.jpg' },
  { name: 'Karlstad', population: 'small', location: 'central', lifestyle: 'suburban', climate: 'moderate', nature: 'forest', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Karlstad_-_KMB_-_16001000012079.jpg/640px-Karlstad_-_KMB_-_16001000012079.jpg' },
  { name: 'Växjö', population: 'small', location: 'south', lifestyle: 'suburban', climate: 'mild', nature: 'forest', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/V%C3%A4xj%C3%B6_domkyrka%2C_den_6_juli_2006%2C_bild_2.JPG/640px-V%C3%A4xj%C3%B6_domkyrka%2C_den_6_juli_2006%2C_bild_2.JPG' },
  { name: 'Visby', population: 'town', location: 'central', lifestyle: 'rural', climate: 'mild', nature: 'coast', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Visby_ringmur_2.jpg/640px-Visby_ringmur_2.jpg' },
  { name: 'Ystad', population: 'town', location: 'south', lifestyle: 'rural', climate: 'mild', nature: 'coast', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Ystad_hamn.jpg/640px-Ystad_hamn.jpg' },
  { name: 'Kiruna', population: 'town', location: 'north', lifestyle: 'rural', climate: 'cold', nature: 'mountains', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Kiruna_stadshus_2012.jpg/640px-Kiruna_stadshus_2012.jpg' },
  { name: 'Sigtuna', population: 'town', location: 'central', lifestyle: 'rural', climate: 'moderate', nature: 'forest', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Sigtuna_2008.jpg/640px-Sigtuna_2008.jpg' },
  { name: 'Jokkmokk', population: 'town', location: 'north', lifestyle: 'rural', climate: 'cold', nature: 'mountains', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Jokkmokk-view.jpg/640px-Jokkmokk-view.jpg' },
  { name: 'Marstrand', population: 'town', location: 'south', lifestyle: 'rural', climate: 'mild', nature: 'coast', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Marstrand_-_KMB_-_16001000042538.jpg/640px-Marstrand_-_KMB_-_16001000042538.jpg' },
  { name: 'Åre', population: 'town', location: 'north', lifestyle: 'rural', climate: 'cold', nature: 'mountains', culture: 'mix', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/%C3%85re_ski_resort_2019.jpg/640px-%C3%85re_ski_resort_2019.jpg' },
  { name: 'Mörbylånga', population: 'town', location: 'south', lifestyle: 'rural', climate: 'mild', nature: 'coast', culture: 'traditional', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/M%C3%B6rbyl%C3%A5nga_church_Oland_Sweden.jpg/640px-M%C3%B6rbyl%C3%A5nga_church_Oland_Sweden.jpg' },
];

const LivingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRecommendations();
    }
  };

  const generateRecommendations = () => {
    const matchingCities = cities.filter(city => 
      Object.entries(answers).every(([key, value]) => city[key] === value || value === 'any')
    );

    setRecommendations(matchingCities.length > 0 ? matchingCities : cities);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Sweden Living Preferences Quiz</h1>
      <Navigation />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {recommendations.length === 0 ? `Question ${currentQuestion + 1} of ${questions.length}` : 'Your Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <>
              <p className="mb-4">{questions[currentQuestion].text}</p>
              <RadioGroup onValueChange={handleAnswer} value={answers[questions[currentQuestion].id]}>
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={handleNext} className="mt-4" disabled={!answers[questions[currentQuestion].id]}>
                {currentQuestion === questions.length - 1 ? 'Get Recommendations' : 'Next Question'}
              </Button>
            </>
          ) : (
            <>
              <p className="mb-4">Based on your preferences, here are some recommended places to live in Sweden:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((city) => (
                  <div key={city.name} className="border rounded-lg p-4">
                    <img src={city.image} alt={city.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                    <h3 className="font-bold text-lg">{city.name}</h3>
                    <p>Population: {city.population}</p>
                    <p>Location: {city.location}</p>
                    <p>Lifestyle: {city.lifestyle}</p>
                    <p>Climate: {city.climate}</p>
                    <p>Nature: {city.nature}</p>
                    <p>Culture: {city.culture}</p>
                  </div>
                ))}
              </div>
              <Button onClick={resetQuiz} className="mt-4">Take the Quiz Again</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LivingQuiz;
