import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext();

export function AuthProvider({children}) {

    const [authenticated, setAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);

    const validateToken = async () => {
        setAuthLoading(true)

        const token = localStorage.getItem("token");

        const username = localStorage.getItem("username");

        if(!token){

            setAuthenticated(false)

            setAuthLoading(false)

            return;
        }

        try {
            // pokušavamo validirati 
            const response = await fetch("https://front3.edukacija.online/backend/wp-json/jwt-auth/v1/token/validate", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`}
            })

            //provjera 
            if(response.ok) {
                setAuthenticated(true);
                setUser(username);
                console.log("user authenticated")
                console.log(authenticated)
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                setAuthenticated(false);
                console.log("user authentication failed");
                console.log(authenticated)
            }

        } catch (error) {
            // hvatamo greške sa servera 
            setAuthenticated(false);
            console.log("Server error");

        } finally {
            // uklanjamo loading
            setAuthLoading(false);
        }
    }

    useEffect(() => {
        validateToken();
    }, [authenticated])

    return (
        <AuthContext.Provider value={{
            authenticated,
            authLoading,
            validateToken,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth() {
    return useContext(AuthContext);
}