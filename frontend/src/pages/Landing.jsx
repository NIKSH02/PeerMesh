import { Link } from 'react-router-dom'
import '../App.css'


export default function Landing() {
  return (
    <div className='landingPage'>
      <div className="landingPageContainer">
        <nav>
            <div className="navHeader">
                <h2>Apna Video Call</h2>
            </div>
            <div className="navList">
                <p>Join as Guest</p>
                <p>Register</p>
                <div role='button'>
                    Login
                </div>
            </div>
        </nav>
        <div className="landingPageContent">
            <div>
                <h1><span style={{color:"#FF9839"}}>Connect</span> with your Loved Ones</h1>
                <p style={{fontSize:"1.5rem", paddingTop:".3rem"}}>
                  Cover a distance by Apna Video Call</p>
                <div role='button'>
                    &nbsp;
                    <Link to={"/Home"}>Get Started</Link>
                </div>
            </div>
            <div>
                <img src="/public/mobile.png" alt="" />
            </div>
        </div>
      </div>
    </div>
  )
}
