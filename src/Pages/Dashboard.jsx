import React, { useEffect, useState } from 'react'
import avatar from '../Images/avatar.png'
import { auth, db } from '../firebase/configure'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import logo from '../Images/logo.png'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit'
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
    const [lgShow1, setLgShow1] = useState(false);
    const [lgShow2, setLgShow2] = useState(false);



    const[suggestions,setSuggestions] = useState([])
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
      let currentMovie = movie
      currentMovie.watchlist = true
      let currentUser = user
      if(currentUser.content.find(item=>item.imdbID==currentMovie.imdbID)){
        alert("Movie already added")
      }else{
        try{
          currentUser.content.push(currentMovie)
          await setDoc(doc(db,"users",user.uid),currentUser,{ merge: true })
          setUser(currentUser)
        }catch(error){
          if(error.message){
            alert(error.message)
          }
        }
      }
      setLgShow(false)
    }
    const addToWatched = async()=>{
      let currentMovie = movie
      currentMovie.watchlist = false
      let currentUser = user
      if(currentUser.content.find(item=>item.imdbID==currentMovie.imdbID)){
        alert("Movie already added")
      }else{
        try{
          currentUser.content.push(currentMovie)
          await setDoc(doc(db,"users",user.uid),currentUser,{ merge: true })
          setUser(currentUser)
        }catch(error){
          if(error.message){
            alert(error.message)
          }
        }
      }
      setLgShow(false)
    }


    const moveToWatched = async (item) =>{
      let currentUser = {...user}
      let currentMovie = item
      currentMovie.watchlist = false
      currentUser.content = currentUser.content.filter(a=>a.imdbID != item.imdbID)
      currentUser.content.push(currentMovie)
      try{
        await setDoc(doc(db,"users",user.uid),currentUser,{ merge: true })
        setUser(currentUser)
      }catch(error){
        if(error.message){
          alert(error.message)
        }
      }
      setLgShow1(false)
    }


    const deleteMovie = async(item)=>{
      let currentUser = { ...user }
      currentUser.content = currentUser.content.filter(a=>a.imdbID != item.imdbID)
      try{
        await setDoc(doc(db,"users",user.uid),currentUser,{ merge: true })
        setUser(currentUser)
      }catch(error){
        if(error.message){
          alert(error.message)
        }
      }
      setLgShow1(false)
      setLgShow2(false)
    }

    const watchlistModal = async(item) =>{
      try{
        const response = await axios.get(`https://www.omdbapi.com/?i=${item.imdbID}&apikey=c27aadee`)
        setMovie(response.data)
        setLgShow1(true)
      }catch(error){
        if(error.message){
          alert(error.message)
        }
      }
    }
    const watchedModal = async(item) =>{
      try{
        const response = await axios.get(`https://www.omdbapi.com/?i=${item.imdbID}&apikey=c27aadee`)
        setMovie(response.data)
        setLgShow2(true)
      }catch(error){
        if(error.message){
          alert(error.message)
        }
      }
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
            <div className="action d-flex justify-content-between gap-5 px-5 pt-5 pb-3">
              <button className='btn btn btn-info text-light' onClick={addToWatchlist}>Add to Watchlist</button>
              <button className='btn btn btn-success' onClick={addToWatched}>Add to Watched</button>
            </div>
          </Modal.Body>
        </Modal>
      </section>


      <section id='watchlist'>
        <div className="container-fluid pt-5 pb-3" style={{backgroundColor:"rgb(220,250,250"}}>
            <h2 className='heading ms-3 mb-3'>Watchlist</h2>
            <div className="px-3 border border-5 mx-3">
              <div className="d-flex py-3 justify-content-start gap-3" style={{overflowX:"scroll"}}>
                {
                    user?.content.filter(item1=>item1.watchlist==true)?.length>0?user.content.filter(item1=>item1.watchlist==true).map((item,index)=>(
                      <div className=" bg-dark" style={{width:"clamp(14rem,17vw,20rem)"}} key={index}>
                        <MDBCard className='bg-dark text-light py-0'style={{width:"clamp(14rem,17vw,20rem)"}}>
                            <MDBCardImage src={item?.Poster} width={"100%"} position='top' alt='...' style={{aspectRatio:"3/4"}} onClick={()=>watchlistModal(item)}/>
                        </MDBCard>
                        <div className='text-light px-2 py-2'>
                          <div className='fs-5' style={{height:"60px",width:"100%",overflow:"hidden"}}><p>{item?.Title} ({item?.Year})</p> </div>
                          <div className="button d-flex justify-content-between mt-3 px-3 pb-3">
                              <button className='btn btn-sm btn-info' onClick={()=>moveToWatched(item)}>Add to watched</button>
                              <button className='btn btn-sm btn-danger' onClick={()=>deleteMovie(item)}><i className="fa-solid fa-trash"></i></button>
                          </div>
                        </div>
                      </div>
                    )):<p>Empty Watchlist</p>
                }
              </div>
            </div>
        </div>


        <Modal
        size="lg"
        show={lgShow1}
        onHide={() => setLgShow1(false)}
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
            <div className="action d-flex justify-content-between gap-5 px-5 pt-5 pb-3">
            <button className='btn btn btn-info' onClick={()=>moveToWatched(movie)}>Add to watched</button>
            <button className='btn btn btn-danger' onClick={()=>deleteMovie(movie)}>Delete Movie</button>
            </div>
          </Modal.Body>
        </Modal>


      </section>





      <section id='watched'>
        <div className="container-fluid pt-5 pb-3" style={{backgroundColor:"rgb(220,250,250"}}>
            <h2 className='heading ms-3 mb-3'>Watched</h2>
            <div className="px-3 border border-5 mx-3">
              <div className="d-flex py-3 justify-content-start gap-3" style={{overflowX:"scroll"}}>
                {
                    user?.content.filter(item1=>item1.watchlist!=true)?.length>0?user.content.filter(item1=>item1.watchlist!=true).map((item,index)=>(
                      <div className=" bg-dark" key={index} style={{width:"clamp(14rem,17vw,20rem)"}}>
                        <MDBCard className='bg-dark text-light py-0'style={{width:"clamp(14rem,17vw,20rem)"}}>
                            <MDBCardImage src={item?.Poster} width={"100%"} position='top' alt='...' style={{aspectRatio:"3/4"}} onClick={()=>watchedModal(item)}/>
                        </MDBCard>
                        <div className='text-light px-2 py-2'>
                        <div className='fs-5' style={{height:"60px",width:"100%",overflow:"hidden"}}><p>{item?.Title} ({item?.Year})</p> </div>
                          <div className="button d-flex justify-content-end mt-3 px-3 pb-3">
                              <button className='' onClick={()=>deleteMovie(item)}><i className="fa-solid fa-trash"></i></button>
                          </div>
                        </div>
                      </div>
                    )):<p>Add movies to watched section</p>
                }
              </div>
            </div>
        </div>

        <Modal
        size="lg"
        show={lgShow2}
        onHide={() => setLgShow2(false)}
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
            <div className="action d-flex justify-content-end gap-5 px-5 pt-5 pb-3">
            <button className='btn btn btn-danger' onClick={()=>deleteMovie(movie)}>Delete Movie</button>
            </div>
          </Modal.Body>
        </Modal>
      </section>



      <section id='Collection'>
        <div className="container-fluid pt-5 pb-3" style={{backgroundColor:"rgb(220,250,250"}}>
            <h2 className='heading ms-3 mb-3'>My Collection</h2>
            <div className="px-3 border border-5 mx-3">
              <div className="d-flex py-3 justify-content-start gap-3" style={{overflowX:"scroll"}}>
                {
                    user?.content?.length>0?user.content.map((item,index)=>(
                      <div className=" bg-dark" key={index} style={{width:"clamp(14rem,17vw,20rem)"}}>
                        <MDBCard className='bg-dark text-light py-0'style={{width:"clamp(14rem,17vw,20rem)"}}>
                            <MDBCardImage src={item?.Poster} width={"100%"} position='top' alt='...' style={{aspectRatio:"3/4"}} onClick={()=>watchedModal(item)}/>
                        </MDBCard>
                        <div className='text-light px-2 py-2'>
                        <div className='fs-5' style={{height:"60px",width:"100%",overflow:"hidden"}}><p>{item?.Title} ({item?.Year})</p> </div>
                          <div className="button d-flex justify-content-end mt-3 px-3 pb-3">
                              <button className='' onClick={()=>deleteMovie(item)}><i className="fa-solid fa-trash"></i></button>
                          </div>
                        </div>
                      </div>
                    )):<p>Add movies to the categories</p>
                }
              </div>
            </div>
        </div>
      </section>



    </>
  )
}

export default Dashboard
