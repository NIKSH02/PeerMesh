import WithAuth from '../utils/WithAuth';
import { useNavigate } from 'react-router-dom';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


import styles from "../styles/HomeComponent.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


function HomeComponent() {

let navigate = useNavigate();

let token = localStorage.getItem("token")

const [error, setError] = useState(false);


const [ meetingCode, setMeetingCode ] = useState('');

const {addToUserHistory} = useContext(AuthContext);

    let handleVideoCall = async () => {
        if (meetingCode.trim() === '') {
            setError(true);
        } else {
            setError(false);
            await addToUserHistory(meetingCode)
            navigate(`/${meetingCode}`)
        }
    }


  return (
    <> 
        { token !== null ? 
            <>
                <div className={styles.navBar}>
                    <div className={styles.appBrand} >
                        <img src="Brand.png" alt="LOGO" />
                        <h2>PeerMesh</h2>
                    </div>
                    <div className={styles.btnContainer} >
                        <Button variant='outlined' onClick={()=> { navigate("/history")}} style={{color: "black"}} startIcon={<WorkHistoryOutlinedIcon />} >
                            History
                        </Button>
                        <Button variant='outlined' color='error' startIcon={<LogoutOutlinedIcon />} onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth")
                        }} >
                            Logout
                        </Button>
                    </div>
                </div>
                <div className={styles.meetContainer}>
                    <div className={styles.leftPanel}>
                        <div>
                            <p>Clear Calls, Just Like your EX's Clear Conversations</p>
                            <div className={styles.fields}>
                                <TextField 
                                id="outlined-basic" 
                                label="Meeting Code" 
                                value={meetingCode} 
                                onChange={e => setMeetingCode(e.target.value)} 
                                variant="outlined" 
                                error={error}
                                />
                                <Button variant="contained" color="success" onClick={handleVideoCall} >Connect</Button>
                            </div>
                            {error && <p style={{color: "red",fontWeight:"100"}}>meetingCode is required</p> }
                        </div>
                    </div>
                        <div className= {styles.rightPanel}>
                        <img src="logo3.png" alt="MEET IMAGE" />
                    </div>
                </div>
            </>
        : 

            <div className={styles.errorLoginContainer} >
                <div className={styles.errorLogin}>
                    <div className={styles.appBrandLogin} >
                        <img src="Brand.png" alt="LOGO" />
                        <h2>PeerMesh</h2>
                    </div>
                    <Button variant="outlined" color="success" onClick={() => {
                        navigate("/auth")
                    }} >Login</Button>
                </div>
                <div className={styles.arrow}>
                    <h2>The Point is Page is there you just have to Login </h2>
                    <img src="arrow.svg" alt="arrow" />
                </div>
                <div className={styles.errorLoginImg}>
                    <img src="pnf.png" alt="" />
                </div>
            </div>


        }
        
        
    </>
  )
}

export default WithAuth(HomeComponent);