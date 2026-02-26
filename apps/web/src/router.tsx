import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts";
import { CreateProjectView, DashboardView, ProjectsView } from "./views";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/projects/create" element={<CreateProjectView />} />
          <Route path="/projects" element={<ProjectsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
