import React from 'react'
import classes from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className= {classes["footer"]}>
        <h3>© {new Date().getFullYear()} Trainstation. All rights reserved</h3>
    </footer>
  )
}
