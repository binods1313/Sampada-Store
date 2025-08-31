import React from 'react'
import { AiFillInstagram } from 'react-icons/ai'; // Selective import
import { AiOutlineTwitter } from 'react-icons/ai'; // Selective import
import { AiFillYoutube } from 'react-icons/ai'; // Selective import
import { AiFillFacebook } from 'react-icons/ai'; // Selective import

const Footer = () => {
  return (
    <div className="footer-container">
    <p>2025 Lumina Headphones All Rights Reserverd</p>
    <p className="icons">
      <AiFillInstagram />
      <AiOutlineTwitter />
      <AiFillFacebook />
      <AiFillYoutube />
      
    </p>
  </div>
)
}

export default Footer