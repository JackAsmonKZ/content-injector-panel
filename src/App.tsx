import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import CampaignDetails from "./pages/CampaignDetails/CampaignDetails";
import AppLayout from "./components/AppLayout";
import Page from "./pages/Page/Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Page />
            </AppLayout>
          }
        />
        <Route
          path="/campaigns"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <AppLayout>
              <CampaignDetails />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
