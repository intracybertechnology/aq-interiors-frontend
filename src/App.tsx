import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './components/sections/AboutUs';
import Services from './components/sections/Services';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import Company from './pages/Company';
import Blog from './components/sections/Blog';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import BlogDetail from './components/sections/BlogDetail';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminBlogs from './pages/admin/Blogs';
import AdminBlogForm from './pages/admin/BlogForm';
import AdminProjectForm from './pages/admin/ProjectForm';
import AdminProjects from './pages/admin/Projects';
import AdminClientForm from './pages/admin/ClientForm';
import AdminClients from './pages/admin/Clients';
import HeroImageForm from './pages/admin/HeroForm';


function App() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Admin routes - WITHOUT Layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/blogs/create" element={<AdminBlogForm />} />
          <Route path="/admin/blogs/edit/:id" element={<AdminBlogForm />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/projects/create" element={<AdminProjectForm />} />
          <Route path="/admin/projects/edit/:id" element={<AdminProjectForm />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/clients/create" element={<AdminClientForm />} />
          <Route path="/admin/clients/edit/:id" element={<AdminClientForm />} />
           <Route path="/admin/hero-images" element={<HeroImageForm />} />
          
          {/* Public routes - WITH Layout - Use Layout as wrapper component */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/projects/:id" element={<Layout><ProjectDetail /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/company" element={<Layout><Company /></Layout>} />
          <Route path="/blogs" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:id" element={<Layout><BlogDetail /></Layout>} />
          <Route path="/gallery" element={<Layout><div>Gallery page coming soon</div></Layout>} />
        </Routes>
      </div>
    </AdminAuthProvider>
  );
}

export default App;