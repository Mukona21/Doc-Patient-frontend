import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './components/Signup';
import LogIn from './components/Login';
import { UserContext } from './Contexts/UserContext';
import { useState } from 'react';
import DocOnboard from './components/DocOnboard';
import PatOnboard from './components/PatOnboard';
import PatHome from './components/PatHome';
import PatAppoints from './components/PatAppoints';
import BookFill from './components/BookFill';
import BookConfirm from './components/BookConfirm';
import DocHome from './components/DocHome';
import DocAppoints from './components/DocAppoints';

function App() {
  const goTo = useNavigate();
  let [user, setUser] = useState(null);
  let [token, setToken] = useState(null);
  let [refreshToken, setRefreshToken] = useState(null);
  let [role, setRole] = useState("patient");//"doctor","patient"

  function logout() {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh_token", "");
    localStorage.setItem("user_data", "");
    goTo("/");
  }

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, refreshToken, setRefreshToken, logout, role, setRole }}>
      <div className="App">
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/doctor/onboard' element={<DocOnboard />} />
          <Route path='/patient/onboard' element={<PatOnboard />} />

          <Route path='/patient/home' element={<PatHome />} />
          <Route path='/patient/home/:docID' element={<BookFill />} />
          {/* <Route path='/patient/booknow' element={<BookConfirm />} /> */}
          <Route path='/patient/appoints' element={<PatAppoints />} />

          <Route path='/doctor/home' element={<DocHome />} />
          <Route path='/doctor/appoints' element={<DocAppoints />} />
          {/* <Route path='/doctor/home/:appointID' element={<DocAppoints />} /> */}
        </Routes>
      </div >
    </UserContext.Provider>
  );
}

export default App;
