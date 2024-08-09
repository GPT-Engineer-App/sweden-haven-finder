import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { navItems } from '../nav-items';

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
];

const cities = [
  { name: 'Stockholm', population: 'large', location: 'central', lifestyle: 'urban' },
  { name: 'Gothenburg', population: 'large', location: 'south', lifestyle: 'urban' },
  { name: 'Malmö', population: 'medium', location: 'south', lifestyle: 'urban' },
  { name: 'Uppsala', population: 'medium', location: 'central', lifestyle: 'suburban' },
  { name: 'Västerås', population: 'medium', location: 'central', lifestyle: 'suburban' },
  { name: 'Örebro', population: 'medium', location: 'central', lifestyle: 'suburban' },
  { name: 'Linköping', population: 'medium', location: 'south', lifestyle: 'suburban' },
  { name: 'Umeå', population: 'small', location: 'north', lifestyle: 'suburban' },
  { name: 'Luleå', population: 'small', location: 'north', lifestyle: 'suburban' },
  { name: 'Karlstad', population: 'small', location: 'central', lifestyle: 'suburban' },
  { name: 'Växjö', population: 'small', location: 'south', lifestyle: 'suburban' },
  { name: 'Visby', population: 'town', location: 'central', lifestyle: 'rural' },
  { name: 'Ystad', population: 'town', location: 'south', lifestyle: 'rural' },
  { name: 'Kiruna', population: 'town', location: 'north', lifestyle: 'rural' },
  { name: 'Sigtuna', population: 'town', location: 'central', lifestyle: 'rural' },
];

const LivingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const navigation = (
    <nav className="mb-6 flex justify-center space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRecommendations();
    }
  };

  const generateRecommendations = () => {
    const matchingCities = cities.filter(city => 
      (answers.population === city.population || answers.population === 'any') &&
      (answers.location === city.location || answers.location === 'any') &&
      (answers.lifestyle === city.lifestyle || answers.lifestyle === 'any')
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
      {navigation}
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
              <ul className="list-disc pl-5 mb-4">
                {recommendations.map((city) => (
                  <li key={city.name}>{city.name}</li>
                ))}
              </ul>
              <Button onClick={resetQuiz}>Take the Quiz Again</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LivingQuiz;
