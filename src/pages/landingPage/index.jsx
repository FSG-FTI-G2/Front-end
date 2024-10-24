import React from 'react';
import './style.css';

export default function LandingPage() {
    const redirectToDashboard = () => {
        window.location.href = 'http://localhost:5173/dashboard';
    };

    return (
        <>
            <nav>
                <div className="nav__header">
                    <div className="nav__logo">
                        <a href="#"> Chat<span>Bot</span></a>
                    </div>
                    <div className="nav__menu__btn" id="menu-btn">
                        <span><i className="ri-menu-line"></i></span>
                    </div>
                </div>
                <ul className="nav__links" id="nav-links">
                    <li>
                        <a href="#">About us</a>
                        <ul className="submenu">
                            <li><a href="#">Our Story</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Careers</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Package</a>
                        <ul className="submenu">
                            <li><a href="#">Basic</a></li>
                            <li><a href="#">Pro</a></li>
                            <li><a href="#">Enterprise</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Model</a>
                        <ul className="submenu">
                            <li><a href="#">GPT-3</a></li>
                            <li><a href="#">GPT-4</a></li>
                            <li><a href="#">Custom Model</a></li>
                        </ul>
                    </li>
                    <li><a href="#">Contact</a></li>
                </ul>
                <div className="nav__btns">
                    <button className="btn sign_up">Sign Up</button>
                    <button className="btn sign_in" onClick={redirectToDashboard}>Sign In</button>
                </div>
            </nav>

            <div className="intro">
                <h1>Welcome to ChatBot Platform</h1>
                <p>Your intelligent assistant for better customer interaction</p>
                <a href="http://localhost:5173/dashboard" className="btn start-btn">Let's Start with Chatbot</a>
            </div>
        </>
    );
}
