import { MDBBtn, MDBInput } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import googleIcon from '../Images/Google_Icon.png'
import { getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, db } from '../firebase/configure'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { isMobile } from 'react-device-detect'



function Login() {

    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')

    const navigate = useNavigate()



    const handleLogin =async()=>{
        try{
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/dashboard")
        }
        catch(error){
            alert(error.message.slice(error.message.indexOf("(")+6,error.message.indexOf(")")))
        }
    }


    const handleGoogle = async ()=>{
      try{
        const provider =new GoogleAuthProvider()
        if (isMobile) {
          await signInWithRedirect(auth, provider);
        } else {
        const result = await signInWithPopup(auth,provider)
        const user = result.user
        const docRef = doc(db,"users",user.uid)
        const docSnap =await getDoc(docRef)
        const data = docSnap.data()
        if(!data){
          await setDoc(doc(db,"users",user.uid),{
              name:user.displayName,
              avatar:user.photoURL,
              email:user.email,
              password,
              content:[]
          })
        }
        navigate("/dashboard")
      }
      }catch(error){
        alert(error.message)
      }
  }


  const handleUserData = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
  
    if (!data) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        avatar: user.photoURL,
        email: user.email,
        password,
        content: []
      });
    }
  }


  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        await handleUserData(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.message) alert(error.message);
    }
  }

  useEffect(()=>{
    handleRedirectResult()
  },[])

  return (
    <>
      <div className="main d-flex justify-content-center align-items-center" style={{height:"100vh",backgroundColor:"rgb(220,250,250"}}>
        <div className="container rounded-5 bg-light shadow-lg px-5" style={{width:"33%",minWidth:"380px"}}>
            <h3 className='text-center mt-5 '>Login</h3>
            <MDBInput label="Email Address" className='my-5' id="email" type="text" size="lg" onChange={(e)=>setEmail(e.target.value)} />
            <MDBInput label="Password" className='my-5' id="password" type="password" size="lg" onChange={(e)=>setPassword(e.target.value)}/>
            <MDBBtn size='lg' className='w-100 mb-3' onClick={handleLogin}>Login</MDBBtn>
            <div className="register d-flex justify-content-end">
                New User? <span className='text-primary ms-1 text-decoration-underline' style={{cursor: 'pointer'}} onClick={()=>navigate('/register')}> Register Here</span>
            </div>
            <div className="or d-flex justify-content-center align-items-center flex-column">
                <div className="border w-100 my-5"></div>
                <span className='position-absolute bg-light px-3 text-bold'>OR</span>
            </div>
            <MDBBtn size='lg' color='light' className='w-100 border-2 border mb-4' onClick={handleGoogle}><img  src={googleIcon} className='me-3' height={"20px"} alt="" />Continue with google</MDBBtn>
        </div>
      </div>
    </>
  )
}

export default Login
