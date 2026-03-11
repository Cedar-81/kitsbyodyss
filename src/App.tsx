import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Overview from './pages/overview'
import Transportation from './pages/transportation'
import Food from './pages/food'
import Activities from './pages/activities'
import Accommodation from './pages/accommodation'
import Layout from './Layout'
import NewFood from './pages/new_food'
import NewAccommodation from './pages/new_accommodation'
import NewActivity from './pages/new_activity'
import NewTransportation from './pages/new_transportation'
import { useEffect } from 'react'
import { supabase } from './utils/supabase'
import Profile from './pages/profile'
import NewKit from './pages/new_kit'
import Home from './pages/home'


function App() {
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("User:", data.session?.user);
    };

    getSession();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          <Route path=':user_id'>
            <Route path='profile' element={<Profile />} />
            <Route path='new-kit' element={<NewKit />} />
          </Route>
        </Route>
          
        <Route path='/:user_id' element={<Layout />}>
          <Route path=':id/overview' element={<Overview />} />
          <Route path=':id/transportation' element={<Transportation />} />
          <Route path=':id/food' element={<Food />} />
          <Route path=':id/activities' element={<Activities />} />
          <Route path=':id/accommodation' element={<Accommodation />} />
          <Route path=':id/new-food' element={<NewFood />} />
          <Route path=':id/new-accommodation' element={<NewAccommodation />} />
          <Route path=':id/new-activity' element={<NewActivity />} />
          <Route path=':id/new-transportation' element={<NewTransportation />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
