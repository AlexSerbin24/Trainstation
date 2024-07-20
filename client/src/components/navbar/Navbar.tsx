import React from 'react'
import { Link } from 'react-router-dom'
import NavbarLinks from './components/NavbarLinks.tsx'
import classes from "./Navbar.module.css"


type Props = {
  onClick: () => void;
};


export default function Navbar({ onClick }: Props) {

  return (
    <nav className={classes["navbar"]}>
      <div>
        <Link to={"/"} style={{display:"block", textDecoration:"none"}}>
          <h1 style={{ fontSize: 32, fontWeight: "bold" }}>Trainstation</h1>
        </Link>
      </div>
      <NavbarLinks onClick={onClick} />
    </nav>
  )
}
