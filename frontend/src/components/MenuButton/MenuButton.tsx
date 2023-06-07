import React from "react";
import "./styles.css"


const MenuButton: React.FC<{open: boolean, setOpen: Function}> = ({open, setOpen}) => {
    return <div
        className={open ?'menu active':'menu'}
        onClick={()=>setOpen(!open)}
    >
        <span className='bar1'></span>
        <span className='bar2'></span>
        <span className='bar3'></span>
    </div>
}

export default MenuButton