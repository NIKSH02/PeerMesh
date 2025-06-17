import { Route, BrowserRouter as Router , Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Authentication from './pages/Authentication'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path= '/' element={<Landing />} />
          <Route path='/auth' element={<Authentication />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
