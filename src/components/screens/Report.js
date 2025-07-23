import React from "react";
import '../../style/Report.css';

function Report() {
    return (
        <div className="Report-screen">
            <div className="Report-container">
                <div className="loading-screen">
                    هێڤیە چاڤەرێ  بە 
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-dots">
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Report;