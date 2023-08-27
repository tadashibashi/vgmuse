import React from 'react'
import ReactDOM from 'react-dom/client'
import {HelmetProvider} from "react-helmet-async";

import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <HelmetProvider>
          <Router><App /></Router>
      </HelmetProvider>
  </React.StrictMode>,
)
