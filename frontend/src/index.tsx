import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import {ConfigProvider} from "antd";
import {MessagesProvider} from "./providers/MessagesProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ConfigProvider
          theme={{
              token: {
                  "colorPrimary": "#25274c",
                  "colorPrimaryBg": "#d4d4d4",
                  "colorPrimaryBorder": "#00062b"
              },
          }}
      >
          <BrowserRouter>
            <MessagesProvider>
              <App />
            </MessagesProvider>
          </BrowserRouter>
      </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
