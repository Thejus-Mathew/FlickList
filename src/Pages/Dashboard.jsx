import React, { useEffect, useState } from 'react'
import avatar from '../Images/avatar.png'
import { auth, db } from '../firebase/configure'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import logo from '../Images/logo.png'
import { MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle } from 'mdb-react-ui-kit'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Offcanvas } from 'react-bootstrap'



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


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);




  return (
    <>
        <header>
          <Navbar expand="lg" className="bg-dark navbar-dark">
            <Container fluid className='ps-5 pe-3 d-flex flex-wrap justify-content-between'>
              <Navbar.Brand>
                <img
                  alt=""
                  src={logo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />
                <span className='Flick fs-2 ms-2'>Flick</span>
                <span className='List fs-2'>List</span>
            </Navbar.Brand>


            

            <Button style={{backgroundColor:"rgb(0,0,0,0)",border:"none",boxShadow:"none"}} onClick={handleShow}>
              <Navbar.Brand className='d-flex justify-content-end' style={{width:"80vw"}}>
                  <span className='me-3'>{user?user.name:"Name"}</span>
                  <img
                    alt=""
                    src={user?user.avatar?user.avatar:avatar:avatar}
                    width="40"
                    height="40"
                    style={{borderRadius:"50%"}}
                    className="d-inline-block align-top"
                  />
              </Navbar.Brand>
            </Button>

            <Offcanvas show={show} className="bg-secondary" onHide={handleClose} placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title></Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className='d-flex flex-column align-items-center'>
                <div className="image my-5 mb-3" style={{width:"320px",aspectRatio:"1/1"}}>
                  <img src={user?user.avatar?user.avatar:avatar:avatar} width={"100%"} height={"100%"} style={{borderRadius:"50%"}} alt="" />
                </div>
                <h3>{user?user.name:"Name"}</h3>
                <p>{user?user.email:"Email Address"}</p>
                <MDBBtn size='lg' color='dark' onClick={handleLogout}>
                  Logout
                </MDBBtn>
              </Offcanvas.Body>
            </Offcanvas>

            </Container>
          </Navbar>
        </header>

        
      <div className="main d-flex justify-content-center align-items-center" style={{height:"100vh",backgroundColor:"rgb(220,250,250"}}>
        <div className="container bg-light rounded-5 shadow-lg px-5 pb-2 d-flex flex-column align-items-center" style={{width:"33%",minWidth:"380px"}}>
            <div className="image my-5 mb-3" style={{width:"320px",aspectRatio:"1/1"}}>
                <img src={user?user.avatar?user.avatar:avatar:avatar} width={"100%"} height={"100%"} style={{borderRadius:"50%"}} alt="" />
            </div>
            <h3>{user?user.name:"Name"}</h3>
            <p>{user?user.email:"Email Address"}</p>
        </div>
      </div>
    </>
  )
}

export default Dashboard
