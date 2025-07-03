let IS_PROD = true; 

const server = IS_PROD ? 
    "https://peermeshbackend.onrender.com":
    "http://localhost:5173";


export default server;