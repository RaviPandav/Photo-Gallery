// Get => Server pase thi data mangvu
// post => navo data mokalvu (create)
// patch => existing data ma thodu change (update)
// Delete => delete karvu

import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

// 3D Card Component with tilt effect
const Card3D = ({ image, author, url, index }) => {
  const cardRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div 
      ref={cardRef}
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div 
        className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 transition-all duration-500"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        
        {/* Image container */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src={image} 
            alt={author}
            loading="lazy"
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        {/* Content */}
        <div className="relative p-4 z-20">
          <h2 className="font-bold text-lg text-white truncate group-hover:text-cyan-400 transition-colors duration-300">
            {author}
          </h2>
          <p className="text-gray-400 text-sm mt-1">Click to view</p>
        </div>
        
        {/* 3D depth layers */}
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/40 transition-all duration-500" />
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/40 transition-all duration-500" />
      </div>
    </div>
  )
}

const App = () => {

  // data store
  const [userData, setUserData] = useState([])

  // page number
  const [indx, setIndx] = useState(1)

  // loading state
  const [loading, setLoading] = useState(true)


  // Api function
  const getData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://picsum.photos/v2/list?page=${indx}&limit=14`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  }


  // useEffect
  useEffect(() => {
    getData()
  },[indx])

  let printUserData = (
    <div className="flex flex-wrap gap-6 justify-center items-center w-full">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-800/50 rounded-2xl h-64 w-44" />
      ))}
    </div>
  )

  // data show karva mate
  if(userData.length > 0 && !loading){
    printUserData = userData.map((ele,idx) => {
      return (
        <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
          <a href={ele.url} target='_blank' rel="noopener noreferrer">
            <Card3D 
              image={ele.download_url} 
              author={ele.author} 
              url={ele.url}
              index={idx}
            />
          </a>
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-black p-4 text-white overflow-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          3D Gallery
        </h1>
        <p className="text-gray-400 mt-2">Hover over cards for 3D effect</p>
      </div>
     
      <div className="flex flex-wrap gap-6 p-2 justify-center items-start">
        {printUserData}
      </div>

        { /* ---------- previous button ----------- */}
      <div className='flex justify-center items-center p-8 gap-6'>
        <button 
        className='relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-purple-500 text-sm cursor-pointer active:scale-95 text-black rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30'
          style={{opacity: indx == 1 ? 0.6 : 1}}
          disabled={indx == 1}
        onClick={() => {
          if(indx > 1){
            setIndx(indx-1)
            setUserData([])
          }
        }}
        >
        <span className="relative z-10">Prev</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

        <div className="bg-gray-800/50 backdrop-blur-lg px-6 py-2 rounded-full border border-white/10">
          <span className="text-cyan-400 font-bold">Page {indx}</span>
        </div>

        {/* ---- next button ----- */}
        <button 
        className='relative overflow-hidden group bg-gradient-to-r from-purple-500 to-pink-500 text-sm cursor-pointer active:scale-95 text-black rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30'
        onClick={() => {
          setIndx(indx+1)
          setUserData([])
        }}
        >
          <span className="relative z-10">Next</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

    </div>
  )
}

export default App