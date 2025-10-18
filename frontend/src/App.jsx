import { Routes, Route } from 'react-router-dom';
import { Header } from './components/header.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Admin from "./pages/dashboard-admin.jsx";
import T1 from './pages/dashboard-t1.jsx';
import T2 from './pages/dashboard-t2.jsx';
import PrivateRoute from './services/privateRoute.jsx';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* main crece con el contenido sin forzar h-screen */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path='/dashboard-admin' element={<Admin />} />
            <Route path='/dashboard-t1' element={<T1 />} />
            <Route path='/dashboard-t2' element={<T2 />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App;
