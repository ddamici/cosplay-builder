// This is the ENTRY POINT of the React application
// This file connects React code to the HTML page

// Import React's StrictMode - helps catch bugs during development
import { StrictMode } from 'react'

// Import createRoot - the modern way to render React apps (React 18+)
import { createRoot } from 'react-dom/client'

// Import global CSS styles
import './index.css'

// Import the main App component (the root of your component tree)
import App from './App.jsx'

// STEP 1: Find the HTML element with id="root" (in index.html)
// STEP 2: Create a React root at that element
// STEP 3: Render your app inside StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
