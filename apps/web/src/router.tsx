import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts";
import { CreateProjectView, DashboardView, EditProjectView, ProjectDetailsView, ProjectsView } from "./views";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/create" element={<CreateProjectView />} />
          <Route path="/projects/:projectId/edit" element={<EditProjectView />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
