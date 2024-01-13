import React from "react";
import Navbaradmin from "./Navbaradmin";
import axios from 'axios'
import {useState,useEffect} from 'react';
import {Link} from "react-router-dom";

function Customers (){
  const [blogs,setBlogs] = useState([])
  const fetchData=()=>{
    axios
    .get(`${process.env.REACT_APP_API}/blogs`)
    .then(response=>{
      setBlogs(response.data)
    })
    .catch(err=>alert(err));
  }
  //ดัก
  useEffect(()=>{
    fetchData()
  },[])
    return (
        <>
          <Navbaradmin/>
          {blogs.map((blog,index)=>(
            <div className="row ml-5 mr-5 mt-5 text-center shadow-xl " key={index}>
              <div className='col-md-12'>
                <Link to={`/blogs/${blogs.slug}`}>
                  <h2 className="text- font-bold text-lg text-b-font">{blog.title}</h2>
                </Link>
                
                <p>{blog.content.substring(0,20)}</p>
                <p>whoooo :{blog.author}</p>
                <p>date: {new Date(blog.createdAt).toLocaleString()}</p>

              </div>
            </div>

          ))}
         
        </>
      );
    
}

export default Customers ;