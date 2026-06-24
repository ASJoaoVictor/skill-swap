import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleAuth = () => {
    return <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                try{
                    const response = await api.post("/login/google", {
                        "token": credentialResponse.credential
                    })

                    localStorage.setItem("token", response.data.token);
                    window.location.href = "./index";
                }catch(err){
                    console.log(err);
                }
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    </GoogleOAuthProvider>
}

export default GoogleAuth;