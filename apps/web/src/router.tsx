import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts";
import { CreateProjectView, DashboardView } from "./views";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/projects/create" element={<CreateProjectView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
