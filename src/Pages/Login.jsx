import { MDBBtn, MDBInput } from 'mdb-react-ui-kit'
import React, { useState } from 'react'
import googleIcon from '../Images/Google_Icon.png'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import { auth, db } from '../firebase/configure'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import logo from '../Images/logo.png'



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
      }catch(error){
        alert(error.message)
      }
  }

  return (
    <>
      <div className="main d-flex justify-content-center align-items-center" style={{height:"100vh",backgroundColor:"rgb(220,250,250"}}>
        <div className="container rounded-5 bg-light shadow-lg px-5" style={{width:"33%",minWidth:"380px"}}>
            <h2 className='py-4 d-flex align-items-center justify-content-center'><img src={logo} width={"40px"} alt="" /><span className='Flick'>Flick</span><span className='List'>List</span></h2>
            <h3>Login</h3>
            <MDBInput label="Email Address" className='my-5 mt-3' id="email" type="text" size="lg" onChange={(e)=>setEmail(e.target.value)} />
            <MDBInput label="Password" className='my-5' id="password" type="password" size="lg" onChange={(e)=>setPassword(e.target.value)}/>
            <MDBBtn size='lg' className='w-100 mb-3' onClick={handleLogin}>Login</MDBBtn>
            <div className="register d-flex justify-content-end">
                New User? <span className='text-primary ms-1 text-decoration-underline' style={{cursor: 'pointer'}} onClick={()=>navigate('/register')}> Register Here</span>
            </div>
            <div className="or d-flex justify-content-center align-items-center flex-column">
                <div className="border w-100 my-5"></div>
                <span className='position-absolute bg-light px-3 text-bold'>OR</span>
            </div>
            <MDBBtn size='lg' color='light' className='w-100 border-2 border mb-4 fs-6' onClick={handleGoogle}><img  src={googleIcon} className='me-3' height={"20px"} alt="" />Continue with google</MDBBtn>
        </div>
      </div>
    </>
  )
}

export default Login
