import { Home, Map, HelpCircle } from "lucide-react";
import Index from "./pages/Index.jsx";
import LivingQuiz from "./pages/LivingQuiz.jsx";

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
    page: <LivingQuiz />,
  },
];
