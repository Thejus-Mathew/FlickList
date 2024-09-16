import React, { useEffect, useState } from 'react'
import avatar from '../Images/avatar.png'
import { auth, db } from '../firebase/configure'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import logo from '../Images/logo.png'
import { MDBBtn, MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Modal, Offcanvas } from 'react-bootstrap'
import banner1 from '../Images/banner1.webp'
import banner2 from '../Images/banner2.jpg'
import banner3 from '../Images/banner3.avif'
import axios from 'axios'



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

    const [lgShow, setLgShow] = useState(false);



    const[suggestions,setSuggestions] = useState([])
    const[allMovies,setAllMovies] = useState([])
    const[movie,setMovie] = useState({})
    const[inputValue,setInputValue] = useState("")

    const movieSuggestions = async (input) => {
      try{
        const response = await axios.get(`https://www.omdbapi.com/?s=${input}&apikey=c27aadee`)
        if(response.data.Response=="True") {
          setSuggestions(response.data.Search)
        }else{
          setSuggestions([])
        }
      }catch(error){
        setSuggestions([])
        if(error.message){
          alert(error.message)
        }
      }
    }

    const searchBySuggestion = async(e)=>{
      try{
        const response = await axios.get(`https://www.omdbapi.com/?i=${e.target.value}&apikey=c27aadee`)
        setMovie(response.data)
        setInputValue(response.data.Title)
        setLgShow(true)
      }catch(error){
        if(error.message){
          alert(error.message)
        }
      }
    }

    const searchByButton = async()=>{
      if(inputValue == "") {
        alert("Fill the input field")
      }else{
        try{
          const response = await axios.get(`https://www.omdbapi.com/?t=${inputValue}&apikey=c27aadee`)
          if (response.data.Response == "False") {
            alert(response.data.Error)
          }else{
            setMovie(response.data)
            setLgShow(true)
          }
        }catch(error){
          if(error.message){
            alert(error.message)
          }
        }
      }
    }



    const addToWatchlist = async()=>{
      
    }
    const addToWatched = async()=>{

    }


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



      <section id='banner'>
        <div className="banner position-relative d-flex justify-content-center align-items-center">
          <MDBCarousel style={{width:"100vw"}}>
          <MDBCarouselItem itemId={1} interval={2500} >
              <img src={banner1} className='d-block w-100 bannerImage' alt='...' />
          </MDBCarouselItem>
          <MDBCarouselItem itemId={2} interval={2500}>
              <img src={banner2} className='d-block w-100 bannerImage'  alt='...' />
          </MDBCarouselItem>
          <MDBCarouselItem itemId={3} interval={2500}>
              <img src={banner3} className='d-block w-100 bannerImage' alt='...' />
          </MDBCarouselItem>
          </MDBCarousel>
          <div className="search position-absolute p-3 border border-1" style={{height:"clamp(100px,10vw,200px)"}}>
            <h2 className='text-light text-center' style={{fontSize:"clamp(20px,2.5vw,50px)",marginBottom:"clamp(10px,2vw,80px)"}}>Add movies to the collection</h2>
            <div className="d-flex">
              <input className='text-primary bg-light ps-2' value={inputValue} style={{ width: '40vw',border:"none",borderRadius:"0",outline:"none",height:"clamp(30px,3vw,70px)",fontSize:"clamp(13px,1.5vw,20px)" }} onChange={(e)=>setInputValue(e.target.value)} onInput={(e)=>movieSuggestions(e.target.value)} />
                <select onChange={(e)=>searchBySuggestion(e)} style={{border:"none",outline:"none",height:"clamp(30px,3vw,70px)",fontSize:"clamp(13px,1.5vw,20px)",width:"30vw"}}>
                  {
                    suggestions?.length>0?suggestions.map((item,index)=>(
                      <option key={index} value={item?.imdbID}>{item?.Title} ({item?.Year})</option>
                    )):
                    <option value=""></option>
                  }
                </select>
              <button onClick={searchByButton} className='button btn text-primary bg-light ms-3 d-flex justify-content-center' style={{height:"clamp(30px,3vw,70px)",width:"clamp(30px,3vw,70px)",fontSize:"clamp(20px,2vw,30px)"}}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>
        </div>


        <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
            {movie?.Title} ({movie?.Year})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-wrap justify-content-around">
              <img src={movie?.Poster} alt="" />
              <div className="content mt-3">
                <h6>Title: {movie?.Title}</h6>
                <p>Plot: {movie?.Plot}</p>
                <p>Released: {movie?.Released}</p>
                <p>Genre: {movie?.Genre}</p>
                <p>imdbRating: {movie?.imdbRating}/10</p>
              </div>
            </div>
            <div className="action d-flex justify-content-between px-5 pt-5 pb-3">
              <button className='btn btn-primary' onClick={addToWatchlist}>Add to Watchlist</button>
              <button className='btn btn-primary' onClick={addToWatched}>Add to Watched</button>
            </div>
          </Modal.Body>
        </Modal>
      </section>



        
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
