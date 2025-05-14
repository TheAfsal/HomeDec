import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import store from './redux/store';
import App from "./App";
import './index.css'
import { ConfirmationProvider } from "./context/ConfirmationContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfirmationProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConfirmationProvider>
  </Provider>
);
