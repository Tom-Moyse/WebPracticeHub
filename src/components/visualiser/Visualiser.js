import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/visualiser.css';
import { beginAnalyser, saveConfig, defaultConfig } from './VisualiserStatic';

function Visualiser() {
    const [initialized, setInitialized] = useState(false);
    const location = useLocation();
    const [bg, setBg] = useState(null);

    const initialize = () => {
        setInitialized(true);
        const ancestor = document.getElementsByClassName("App")[0]
        setBg(ancestor.style.background);
        ancestor.style.background = 'none';
        beginAnalyser();
    }
    
    useEffect(() => {
        const ancestor = document.getElementsByClassName("App")[0]
        
        // If you want to perform cleanup (e.g., reset state when leaving the route), return a cleanup function:
        return () => {
            ancestor.style.background = bg;
            setInitialized(false);
        };
    }, [location]);

    if (!initialized){
    return (
        <div className='centerdiv'>
            <button onClick={initialize}>Select source</button>
        </div>
    )
    }
    if (initialized){
    return (
        <>
        <canvas id="canvas" />
        <div className='canvasBox'>
        
        </div>
        <div className="centerdiv">
            <label htmlFor="visualiser-dropdown">Choose a visualiser:</label>
            <select id="visualiser-dropdown" name="visualiser-dropdown">
                <option value="bars">Bars</option>
                <option value="circle">Circle</option>
                <option value="boxes">Boxes</option>
                <option value="hexwave">Hexagon Wave</option>
                <option value="hexbounce">Hexagon Bounce</option>
            </select>
            
            <form id="controlForm">
                <ul id="generalOpts">
                    <li>
                        <label htmlFor="basehue">Base Hue</label>
                        <input type="range" id="basehue" name="basehue" min="0" max="1" defaultValue="0" step="0.01"/>
                    </li>
                    <li>
                        <label htmlFor="scrollspeed">Hue Scroll</label>
                        <input type="range" id="scrollspeed" name="scrollspeed" min="0" max="2" defaultValue="0.1" step="0.05"/>
                    </li>
                    <li>
                        <label htmlFor="hueshift">Hue Range</label>
                        <input type="range" id="hueshift" name="hueshift" min="0" max="2" defaultValue="0.2" step="0.1"/>
                    </li>
                    <li>
                        <label htmlFor="maxbrightness">Brightness Threshold</label>
                        <input type="range" id="maxbrightness" name="maxintensity" min="1" max="800" defaultValue="200" step="1"/>
                    </li>
                    <li>
                        <label htmlFor="exponentfactor">Stretch Factor</label>
                        <input type="range" id="exponentfactor" name="exponentfactor" min="0.75" max="1.25" defaultValue="1.15" step="0.01"/>
                    </li>
                    <li>
                        <label htmlFor="interpolationcount">Bar Count Multiplier</label>
                        <input type="range" id="interpolationcount" name="interpolationcount" min="1" max="20" defaultValue="10" step="1"/>
                    </li>
                    <li>
                        <label htmlFor="smoothingfactor">Smoothing Factor</label>
                        <input type="range" id="smoothingfactor" name="smoothingfactor" min="1" max="10" defaultValue="4" step="1"/>
                    </li>
                </ul>
                <ul id="circleOpts" className="hidden">
                    <li>
                        <label htmlFor="innerradius">Inner Radius</label>
                        <input type="range" id="innerradius" name="innerradius" min="0" max="150" defaultValue="40" step="5"/>
                    </li>
                    <li>
                        <label htmlFor="outerradius">Outer Radius</label>
                        <input type="range" id="outerradius" name="outerradius" min="10" max="500" defaultValue="150" step="10" style={{direction:'rtl'}}/>
                    </li>
                    <li>
                        <label htmlFor="strokewidth">Bar Width</label>
                        <input type="range" id="strokewidth" name="strokewidth" min="1" max="20" defaultValue="12" step="1"/>
                    </li>
                    <li>
                        <label htmlFor="rotatespeed">Rotation Speed</label>
                        <input type="range" id="rotatespeed" name="rotatespeed" min="0" max="5" defaultValue="1.5" step="0.1"/>
                    </li>
                </ul>
                <ul id="boxOpts" className="hidden">
                    <li>
                        <label htmlFor="maxintensity">Intensity Threshold</label>
                        <input type="range" id="maxintensity" name="maxintensity" min="20" max="800" defaultValue="400" step="10"/>
                    </li>
                    <li>
                        <label htmlFor="maxrotation">Rotation Intensity</label>
                        <input type="range" id="maxrotation" name="maxrotation" min="0" max="4" defaultValue="0.5" step="0.25"/>
                    </li>
                </ul>
                <ul id="hexbOpts" className="hidden">
                    <li>
                        <label htmlFor="maxintensity2">Intensity Threshold</label>
                        <input type="range" id="maxintensity2" name="maxintensity2" min="20" max="800" defaultValue="400" step="10"/>
                    </li>
                    <li>
                        <label htmlFor="velconst">Base Velocity</label>
                        <input type="range" id="velconst" name="velconst" min="10" max="300" defaultValue="100" step="10"/>
                    </li>
                </ul>
                <ul id="hexwOpts" className="hidden">
                    <li>
                        <label htmlFor="maxintensity3">Intensity Threshold</label>
                        <input type="range" id="maxintensity3" name="maxintensity3" min="20" max="800" defaultValue="400" step="10"/>
                    </li>
                    <li>
                        <label htmlFor="wavefreq">Wave Frequency</label>
                        <input type="range" id="wavefreq" name="wavefreq" min="-10" max="10" defaultValue="2" step="0.1"/>
                    </li>
                </ul>
            </form>
        </div>
        <div id="button-box">
            <button onClick={saveConfig} id="configsave">Save Config</button>
            <button onClick={defaultConfig} id="configdefault">Reset to Defaults</button>
        </div>
        <script src='./VisualiserStatic.js'/>
        </>
    );
    }
}

export default Visualiser;