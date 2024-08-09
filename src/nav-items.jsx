import { Map, HelpCircle } from "lucide-react";
import Index from "./pages/Index.jsx";
import React from 'react';

const LivingQuiz = React.lazy(() => import('./pages/LivingQuiz.jsx'));

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Sweden Living Map",
    to: "/",
    icon: <Map className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Living Preferences Quiz",
    to: "/quiz",
    icon: <HelpCircle className="h-4 w-4" />,
    page: <React.Suspense fallback={<div>Loading...</div>}><LivingQuiz /></React.Suspense>,
  },
];
