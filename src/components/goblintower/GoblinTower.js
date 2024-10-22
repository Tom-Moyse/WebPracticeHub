import React from 'react';
import { setupGame, resetGame, takeStep, blockTime, exitShop } from './GoblinTowerStatic'
import '../../css/goblintower.css';

function GoblinTower() {
    return ( 
        <div id="goblintower">
        <div id="fullTransition" className=""></div>
        <button onClick={setupGame} id="newgameButton" className="button-4">New Game</button>
        <div id="gameOverWindow" className="hidden">
            <div className="avatar">
                <img className="avatarImg" src="static/img/gameover.png" height="160" width="160" />
                <p id="gameOverName">NAME</p>
            </div>
            <div id="gameOverInfo">
                <p>Level:</p>
                <p>Steps Taken:</p>
                <p>Gold Earnt:</p>
                <p>Goblins Defeated:</p>
            </div>
            <button id="resetButton" className="button-4" onClick={resetGame}>Play<br />Again</button>
        </div>
        <div id="allMainWindows" className="hidden">
            <div id="panelWindows">
                <div id="heroWindow">
                    <div className="avatar">
                        <img className="avatarImg" src="static/img/hero.png" height="160" width="100" />
                        <p id="avatarName">NAME</p>
                    </div>
                    <div id="attributes">
                        <h3>Attributes</h3>
                        <div className="tooltip">
                            Level: 
                            <span className="tooltiptext">
                                Your Level affects the enemies you face, your strength and is increased every time you reach the end of a floor
                            </span>
                        </div>
                        <div className="tooltip">
                            Steps: 
                            <span className="tooltiptext">
                                The number of steps you have taken
                            </span>
                        </div>
                        <div className="tooltip">
                            Health: 
                            <span className="tooltiptext">
                                How close you are to death
                            </span>
                        </div>
                        <div className="tooltip">
                            Defence: 
                            <span className="tooltiptext">
                                Blocking is hard - defence works to passively reduce incoming damage
                            </span>
                        </div>
                        <div className="tooltip">
                            Strength: 
                            <span className="tooltiptext">
                                Determines how hard you can hit your opponents
                            </span>
                        </div>
                        <div className="tooltip">
                            Block: 
                            <span className="tooltiptext">
                                Determines the portion of damage received when successfully blocking an attack.
                            </span>
                        </div>
                        <div className="tooltip">
                            Auto Dodges: 
                            <span className="tooltiptext">
                                Each auto dodge is a ticket to automatically avoid a lethal damage strike - acquire more via dodge potions. 
                            </span>
                        </div>
                        <div className="tooltip">
                            Gold:
                            <span className="tooltiptext">
                                Money to buy things in the shop
                            </span>
                        </div>
                    </div>
                </div>
                
                <div id="shopWindow" className="hidden">
                    <h2>Shop!</h2>
                    <div id="twocol">
                        <div id="potions">
                            <h4>Consumables</h4>
                            <div id="consumablegrid">
                                <div className="shopitem">
                                    <button id="potionpurchase-0" className="button-4">Health Potion +2</button>
                                    <p>Cost: 3</p>
                                </div>
                                <div className="shopitem">
                                    <button id="potionpurchase-1" className="button-4">Health Potion +2</button>
                                    <p>Cost: 3</p>
                                </div>
                                <div className="shopitem">
                                    <button id="potionpurchase-2" className="button-4">Health Potion +3</button>
                                    <p>Cost: 4</p>
                                </div>
                                <div className="shopitem">
                                    <button id="potionpurchase-3" className="button-4">Health Potion +1</button>
                                    <p>Cost: 2</p>
                                </div>
                                <div className="shopitem">
                                    <button id="potionpurchase-4" className="button-4">Health Potion +3</button>
                                    <p>Cost: 4</p>
                                </div>
                            </div>
                        </div>
                        <div id="upgrades">
                            <h4>Upgrades</h4>
                            <div id="upgradegrid">
                                <div className="shopitem">
                                    <button id="upgradepurchase-3" className="button-4">Strength +1</button>
                                    <p>Cost: 5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="eventWindow">
                    <h2>Event Log: </h2>
                    <div id="eventLog">
                    </div>
                </div>
            </div>

            <div id="gameWindow">
                <div id="bgBox" className="">
                </div>
                <div id="darkTransition" className="">
                </div>
                <div id="heroBox">
                    <div id="heroHP" className="hpbar"></div>
                    <img id="heroImg" src="static/img/hero.png" width="72" height="72" />
                    <img id="hhitsplat" className="hidden" src="static/img/hitsplat.png" width="32" height="32" />
                    <div id="hdamageNumber" className="hidden" >1</div>
                </div>
                <div id="goblinBox" className="hidden">
                    <div id="goblinHP" className="hpbar"></div>
                    <img id="goblinImg" src="static/img/goblin.png" width="72" height="72" />
                    <img id="ghitsplat" className="hidden" src="static/img/hitsplat.png" width="32" height="32" />
                    <div id="gdamageNumber" className="hidden" >1</div>
                </div>
            </div>

            <div id="controlWindow">
                <div id="consumableInfo">
                    <button className="itembutton button-4">Health Potion +2</button>
                    <button className="itembutton button-4">Health Potion +2</button>
                    <button className="itembutton button-4">Health Potion +2</button>
                    <button className="itembutton button-4">Health Potion +2</button>
                    <button className="itembutton button-4">Health Potion +3</button>
                </div>
                <button className="bigbutton button-4" id="stepButton" onClick={takeStep}>Take Step</button>
                <button className="bigbutton button-4 hidden" id="blockButton" onClick={blockTime}>Block</button>
                <button className="bigbutton button-4 hidden" id="leaveShopButton" onClick={exitShop}>Exit Shop</button>
            </div>
        </div>
        </div>
    );
}

export default GoblinTower;