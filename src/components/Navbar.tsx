import React from 'react';
import { Wind, LogOut, MapPin } from 'lucide-react';
import { City } from '../types';

interface NavbarProps {
  selectedCity: City;
  cities: City[];
  onCityChange: (city: City) => void;
  onLogout: () => void;
}

export function Navbar({ selectedCity, cities, onCityChange, onLogout }: NavbarProps) {
  return (
    <nav className="bg-gray-800 shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Wind className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-100">Air Quality Dashboard</h1>
              <p className="text-sm text-gray-400">Real-time monitoring system</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = cities.find(c => c.name === e.target.value);
                  if (city) onCityChange(city);
                }}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-100 hover:bg-gray-600 transition-colors duration-200"
              >
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}