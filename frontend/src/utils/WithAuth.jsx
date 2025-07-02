import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const WithAuth = ( WrappedComponent ) => {
    const AuthComponent = (props) => {
        const router = useNavigate();

        const isAuthenticated = () => {
            if (localStorage.getItem("token")) {
                return true;
            }else 
            return false;
        }

        useEffect(() => {
            if (!isAuthenticated) {
                router("/auth")
            }
        }, [])

        return < WrappedComponent {...props} /> 
    }
    return AuthComponent
 }

 export default WithAuth; 