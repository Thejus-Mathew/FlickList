import { MDBBtn, MDBInput, MDBSpinner } from 'mdb-react-ui-kit'
import React, { useState } from 'react'
import googleIcon from '../Images/Google_Icon.png'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../firebase/configure'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import logo from '../Images/logo.png'


function Register() {

    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[name,setName]=useState('')

    const[loading,setLoading] = useState(false)
    const[gLoading,setGLoading] = useState(false)

    
    const navigate = useNavigate()

    const handleRegister=async ()=>{
        setLoading(true)
        try{
            if(!name){
                const error = new Error('(auth/missing-name)')
                throw error
            }
            await createUserWithEmailAndPassword(auth,email,password)
            const user = auth.currentUser
            if(user){
                await setDoc(doc(db,"users",user.uid),{
                    name,email,password,content:[],uid:user.uid
                })
            }
            alert("user registered successfully");
            navigate("/login")
        }catch(error){
            alert(error.message.slice(error.message.indexOf("(")+6,error.message.indexOf(")")))
        }
        setLoading(false)
    }



    const handleGoogle = async ()=>{
        setGLoading(true)
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
                content:[],
                uid:user.uid
            })
          }
          navigate("/dashboard")
        }catch(error){
          alert(error.message)
        }
        setGLoading(false)
    }

  return (
    <>
        <div className="main d-flex justify-content-center align-items-center" style={{height:"100vh",backgroundColor:"rgb(220,250,250"}}>
            <div className="container bg-light rounded-5 shadow-lg px-5" style={{width:"33%",minWidth:"380px"}}>
                <h2 className='py-4 d-flex align-items-center justify-content-center'><img src={logo} width={"40px"} alt="" /><span className='Flick'>Flick</span><span className='List'>List</span></h2>
                <h3>Register</h3>
                <MDBInput label="Full Name" className='my-5 mt-3' id="name" type="text" size="lg" onChange={(e)=>setName(e.target.value)}/>
                <MDBInput label="Email Address" className='my-5' id="email" type="text" size="lg" onChange={(e)=>setEmail(e.target.value)}/>
                <MDBInput label="Password" className='my-5' id="password" type="password" size="lg" onChange={(e)=>setPassword(e.target.value)}/>
                <MDBBtn size='lg' disabled={loading || gLoading} className='w-100 mb-3' onClick={handleRegister}>
                    {loading?<>Registering &nbsp;&nbsp;<MDBSpinner grow size='sm' role='status' tag='span' className='me-2' /><MDBSpinner grow size='sm' role='status' tag='span' className='me-2' /><MDBSpinner grow size='sm' role='status' tag='span' className='me-2' /></>:<>Register</>}
                </MDBBtn>
                <div className="register d-flex justify-content-end">
                    Already registered? <span className='text-primary ms-1 text-decoration-underline' style={{cursor: 'pointer'}} onClick={()=>navigate('/login')}> Login Here</span>
                </div>
                <div className="or d-flex justify-content-center align-items-center flex-column">
                    <div className="border w-100 my-5"></div>
                    <span className='position-absolute bg-light px-3 text-bold'>OR</span>
                </div>
                <MDBBtn size='lg' disabled={loading || gLoading} color='light' className='w-100 border-2 border mb-4' onClick={handleGoogle}>
                    {gLoading
                    ?<><img  src={googleIcon} className='me-3' height={"20px"} alt="" />google verification &nbsp;&nbsp;<MDBSpinner grow size='sm' role='status' tag='span' className='me-2' /><MDBSpinner grow size='sm' role='status' tag='span' className='me-2' /><MDBSpinner grow size='sm' role='status' tag='span' className='me-2' /></>
                    :<><img  src={googleIcon} className='me-3' height={"20px"} alt="" />Continue with google</>
                    }
                </MDBBtn>
            </div>
        </div>
    </>
  )
}

export default Register
