import React, { useEffect, useState } from 'react'
import avatar from '../Images/avatar.png'
import { MDBBtn } from 'mdb-react-ui-kit'
import { auth, db } from '../firebase/configure'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function Dashboard() {

    const[user,setUser]=useState(null)
    const navigate = useNavigate()


    const fetchUserData = async () =>{
        auth.onAuthStateChanged(async(user)=>{
            const docRef = doc(db,"users",user.uid)
            const docSnap =await getDoc(docRef)
            if(docSnap.exists){
                setUser(docSnap.data())
            }else{
                alert("User not logged in")
            }
        })
    }


    const handleLogout = async () =>{
        try{
            await auth.signOut()
            navigate("/login")
        }catch(error){
            alert(error.message.slice(error.message.indexOf("(")+6,error.message.indexOf(")")))
        }
    }


    useEffect(()=>{
        fetchUserData()
    },[])


  return (
    <>
      <div className="main position-relative d-flex justify-content-center align-items-center" style={{height:"100vh",backgroundColor:"rgb(220,250,250"}}>
        <div className="container bg-light rounded-5 shadow-lg px-5 pb-2 d-flex flex-column align-items-center" style={{width:"33%",minWidth:"380px"}}>
            <div className="image my-5 mb-3" style={{width:"320px",aspectRatio:"1/1"}}>
                <img src={user?user.avatar?user.avatar:avatar:avatar} width={"100%"} height={"100%"} style={{borderRadius:"50%"}} alt="" />
            </div>
            <h3>{user?user.name:"Name"}</h3>
            <p>{user?user.email:"Name"}</p>
        </div>
        <MDBBtn style={{position:"absolute",top:30,right:60}} size='lg' color='dark' onClick={handleLogout}>
        Logout
        </MDBBtn>
      </div>
    </>
  )
}

export default Dashboard
