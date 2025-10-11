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
          
          {/* Public routes - WITH Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} /> 
                <Route path="/contact" element={<Contact />} />
                <Route path="/company" element={<Company />} />
                <Route path="/blogs" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/gallery" element={<div>Gallery page coming soon</div>} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </div>
    </AdminAuthProvider>
  );
}

export default App;