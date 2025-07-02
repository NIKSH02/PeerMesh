import SlowMotionVideoOutlinedIcon from '@mui/icons-material/SlowMotionVideoOutlined';

import { Link, useNavigate } from 'react-router-dom'
import '../App.css'


export default function Landing() {

  let navigate = useNavigate();

  let token = localStorage.getItem("token");

  function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  return (
    <div className='landingPage'>
      <div className="landingPageContainer">
        <nav>
            <div className="navHeader">
              <SlowMotionVideoOutlinedIcon />
              <h2>PeerMesh</h2>
            </div>
            <div className="navList">
                <p onClick={() => { navigate(`/${generateRandomString}`)}}>Join as Guest</p>
                <p onClick={() => {
                  navigate("/auth")
                }}>Register</p>
                <div role='button'>
                    { token === null ? <Link to={"/auth"}>Login</Link> : <p>Logout</p>} 
                </div>
            </div>
        </nav>
        <div className="landingPageContent">
            <div>
                <h1><span style={{color:"#FF9839"}}>Connect</span> with your Loved Ones</h1>
                <p style={{fontSize:"1.5rem", paddingTop:".3rem"}}>
                  Cover a distance by Apna Video Call</p>
                <div role='button'>
                    { token === null ? <Link to={"/auth"}>Get Started</Link>: <p onClick={() => {
                      navigate("/home")
                    }}>Get Started</p> }
                </div>
            </div>
            <div>
                <img src="/mobile.png" alt="" />
            </div>
        </div>
      </div>
    </div>
  )
}
