import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts";
import { DashboardView } from "./views";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
