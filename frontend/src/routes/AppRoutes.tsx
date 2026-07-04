import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Signup } from '../pages/Signup';
import { Signin } from '../pages/Signin';
import { Blog } from '../pages/Blog';
import { Blogs } from '../pages/Blogs';
import { Bookmarks } from '../pages/Bookmarks';
import { Publish } from '../pages/Publish';
import { Edit } from '../pages/Edit';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Navigate to="/blogs" replace />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/blog/:id" element={<Blog />} />
                    <Route path="/edit/:id" element={<Edit />} />
                    <Route path="/publish" element={<Publish />} />
                    <Route path="/post" element={<Navigate to="/publish" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
