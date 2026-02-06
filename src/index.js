import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Monkey-patch to fix a known issue with leaflet-routing-machine in React
// This prevents an error when the component unmounts during an async operation.
const originalClearLines = L.Routing.Control.prototype._clearLines;
if (originalClearLines) {
  L.Routing.Control.prototype._clearLines = function() {
    if (this._map) {
      originalClearLines.apply(this, arguments);
    }
  };
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
