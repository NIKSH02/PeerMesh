import { Route, BrowserRouter as Router , Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Authentication from './pages/Authentication'
import { AuthProvider } from './contexts/AuthContext'
import VideoMeet from './pages/VideoMeet'



function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path= '/home' element={<Landing />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path= ":url" element={<VideoMeet />} />          // using :url to match any path after the base URL also known as dynamic routing
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
