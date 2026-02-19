
import React from 'react';
import type { WeatherCondition } from './types';

export const SunnyIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

export const CloudyIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
  </svg>
);

export const RainIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 17a5 5 0 0 0-5-5h-1.26a8 8 0 1 0-11.48 0H4a4 4 0 0 0 0 8h1"></path>
    <path d="m16 14-2 4"></path>
    <path d="m8 14-2 4"></path>
    <path d="m12 16-2 4"></path>
  </svg>
);

export const ThunderstormIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16.923a4 4 0 0 0-1.464-5.223 8 8 0 1 0-13.072 0A4 4 0 0 0 3 16.923V17a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-.077Z"></path>
    <path d="m13 12-3 5h4l-3 5"></path>
  </svg>
);

export const SnowIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 17.58A5 5 0 0 0 15 8h-1.26a8 8 0 1 0-11.48 0H2.5A4.5 4.5 0 0 0 .3 13.9a4.51 4.51 0 0 0 4.2 4.6h11.2a4.49 4.49 0 0 0 4.3-4.42Z"></path>
    <path d="M10 15.5v-5"></path>
    <path d="M7.5 13l5-3"></path>
    <path d="m7.5 18 5-3"></path>
    <path d="m12.5 13-5-3"></path>
    <path d="m12.5 18-5-3"></path>
  </svg>
);

export const MistIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12c0-2.8 2.2-5 5-5s5 2.2 5 5c0 2.8-2.2 5-5 5s-5-2.2-5-5Z"></path>
        <path d="M12 12h.01"></path>
        <path d="M17.5 10c0-2.8 2.2-5 5-5s5 2.2 5 5c0 2.8-2.2 5-5 5s-5-2.2-5-5Z" transform="translate(-10.5 2)"></path>
        <path d="M12 12h.01" transform="translate(-10.5 2)"></path>
        <path d="M2 17h20"></path>
        <path d="M2 21h20"></path>
    </svg>
);


export const WEATHER_ICONS: Record<WeatherCondition, React.ComponentType<{ className?: string }>> = {
  Sunny: SunnyIcon,
  Clear: SunnyIcon,
  Cloudy: CloudyIcon,
  Rain: RainIcon,
  Thunderstorm: ThunderstormIcon,
  Snow: SnowIcon,
  Mist: MistIcon,
};


export const GitHubIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.341-3.369-1.341-.454-1.156-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.309.678.922.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .267.18.577.688.481A10.007 10.007 0 0022 12c0-5.523-4.477-10-10-10z"
      clipRule="evenodd"
    />
  </svg>
);
