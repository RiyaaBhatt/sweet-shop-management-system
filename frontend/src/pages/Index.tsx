// This page redirects to Home - the main landing page
import { Navigate } from 'react-router-dom';

const Index = () => {
  return <Navigate to="/home" replace />;
};

export default Index;
