import React from 'react'
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify} from 'react-icons/bs'
import styles from '../styles/login.module.css'

function navbar() {

  const button = {
    color: 'white',
    display: 'inline-block',
    backgroundColor: '#4267B2',
    padding: '10px 20px',
    textDecoration: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
  };

  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' />
        </div>
        <div>
            {/* <BsSearch  className='icon'/> */}
        </div>
        <div >
            {/* <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/> */}
            {/* <BsPersonCircle className='icon'/> */}
            <button style={button} className={styles.button}>Logout</button>
        </div>
    </header>
  )
}

export default navbar