import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BackgroundOrbs from './BackgroundOrbs';
import ScrollProgress from './ScrollProgress';

export default function Layout() {
  return (
    <div className="min-h-screen transition-theme relative">
      <BackgroundOrbs />
      <ScrollProgress />
      
      <Navbar />
      
      <main className="lg:ml-72 pt-14 lg:pt-0 min-h-screen relative z-10 transition-all duration-500">
        <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
