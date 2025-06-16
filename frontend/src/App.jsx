import { Route, BrowserRouter as Router , Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path= '/' element={<Landing />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
