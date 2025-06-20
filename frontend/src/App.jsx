import { Route, BrowserRouter as Router , Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Authentication from './pages/Authentication'



function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path= '/' element={<Landing />} />
            <Route path='/auth' element={<Authentication />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
