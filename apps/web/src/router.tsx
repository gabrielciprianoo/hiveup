import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout, AuthLayout } from "./layouts";
import { CreateProjectView, DashboardView, EditProjectView, ProjectDetailsView, ProjectsView, LoginView, RegisterView, ConfirmAccountView, RequestCodeView } from "./views";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/confirm-account" element={<ConfirmAccountView />} />
          <Route path="/request-code" element={<RequestCodeView />} />
        </Route>
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
