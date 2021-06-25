import React from 'react';
import './style.scss';

const Footer = () => {
    return (<>
        <footer className="footer">
            <h2>Credits</h2>
            <ul className="credits-container">
                <li className='credits'>
                    <a href="https://github.com/akramsabbah9" className="github fa fa-github"> </a>
                    <h3>Akram Sabbah</h3>
                </li>
                <li className='credits'>
                    <a href="https://github.com/benwade91" className="github fa fa-github"> </a>
                    <h3>Ben Wade</h3>
                </li>
                <li className='credits'>
                    <a href="https://github.com/bhumisha" className="github fa fa-github"> </a>
                    <h3>Bhumisha Dave</h3>
                </li>
                <li className='credits'>
                    <a href="https://github.com/yulduzetta" className="github fa fa-github"> </a>
                    <h3>Yulduz Ibrahim</h3>
                </li>
            </ul>
        </footer>
    </>)
}

export default Footer;