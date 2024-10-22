"use strict";
export function setupGame() {
    var _a;
    const heroName = capitalize((_a = prompt("Enter your hero's name: ")) === null || _a === void 0 ? void 0 : _a.trim()) || "The Nameless Hero";
    hero.name = heroName;
    updateDisplay();
    toggle([document.getElementById("allMainWindows"), document.getElementById("newgameButton")]);
}
export function resetGame() {
    var _a, _b, _c;
    (_a = document.getElementById("gameOverWindow")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    (_b = document.getElementById("shopWindow")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
    hero.reset();
    heroconsumables.reset();
    stats.reset();
    document.getElementById("eventLog").innerHTML = "";
    const heroName = ((_c = prompt("Enter your hero's name: ")) === null || _c === void 0 ? void 0 : _c.trim()) || "The Nameless Hero";
    hero.name = heroName;
    updateDisplay();
    toggle([document.getElementById("allMainWindows")]);
}
function capitalize(str) {
    if (str == undefined)
        return undefined;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function logev(msg) {
    var _a;
    let logdiv = document.getElementById("eventLog");
    if (logdiv == null) {
        console.warn("Log Div not found");
        return;
    }
    let logentry = document.createElement("p");
    logentry.textContent = ">" + msg;
    logdiv.prepend(logentry);
    if (logdiv.childElementCount > gameOptions.logLength) {
        (_a = logdiv.lastChild) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
function heroAttack() {
    const heroBox = document.getElementById("heroBox");
    const hitsplatImg = document.getElementById("ghitsplat");
    const damageNumber = document.getElementById("gdamageNumber");
    heroBox === null || heroBox === void 0 ? void 0 : heroBox.classList.add("attack");
    setTimeout(() => {
        let maxHit = hero.lvl + hero.strength;
        let damage = Math.floor(Math.random() * (maxHit + 1));
        if (goblin.health <= 0) {
            damage = 0;
        }
        damageNumber.textContent = damage.toString();
        damageNumber === null || damageNumber === void 0 ? void 0 : damageNumber.classList.remove("hidden");
        if (damage == 0) {
            hitsplatImg.src = "static/img/hitsplatzero.png";
        }
        else {
            hitsplatImg.src = "static/img/hitsplat.png";
        }
        hitsplatImg.classList.remove("hidden");
        setTimeout(() => {
            hitsplatImg.classList.add("hidden");
            damageNumber === null || damageNumber === void 0 ? void 0 : damageNumber.classList.add("hidden");
        }, 500);
        logev(`${hero.name} dealt ${damage} damage to the goblin`);
        goblin.health = Math.max(goblin.health - damage, 0);
        let goblinHealthPercent = (goblin.health / goblin.maxHealth) * 100;
        document.getElementById("goblinHP").style.background = `
            linear-gradient(90deg, rgba(0,255,0,1) 0%, rgba(0,255,0,1) ${goblinHealthPercent}%, 
            rgba(255,0,0,1) ${goblinHealthPercent}%, rgba(255,0,0,1) 100%)
        `;
    }, 500);
}
function heroJustAttacked() {
    const heroBox = document.getElementById("heroBox");
    heroBox === null || heroBox === void 0 ? void 0 : heroBox.classList.remove("attack");
    if (goblin.health > 0) {
        goblinAttack();
    }
    else {
        const goblinImg = document.getElementById("goblinImg");
        goblinImg.src = "static/img/skull.png";
        logev(`The goblin dropped ${goblin.gold} gold!`);
        hero.gold += goblin.gold;
        stats.goldEarned += goblin.gold;
        setTimeout(endEncounter, 1000);
    }
}
function goblinAttack() {
    const goblinBox = document.getElementById("goblinBox");
    const hitsplatImg = document.getElementById("hhitsplat");
    const damageNumber = document.getElementById("hdamageNumber");
    goblinBox === null || goblinBox === void 0 ? void 0 : goblinBox.classList.add("attack");
    setTimeout(() => {
        let maxReduction = Math.floor(goblin.maxHit / 2);
        let damageRoll = Math.floor(Math.random() * (goblin.maxHit + 1));
        let reducableDamage = Math.min(maxReduction, damageRoll);
        let baseDamage = damageRoll - reducableDamage;
        let defendedDamage = Math.max(reducableDamage - hero.defence, 0);
        let totalDamage = baseDamage + defendedDamage;
        let hittime = new Date().getTime();
        let hiterror = hittime - blocktime;
        let blockallowance = Math.max(gameOptions.minBlockWindow, gameOptions.baseBlockWindow - (gameOptions.lvlBlockScale * hero.lvl));
        let blocked = hiterror <= blockallowance;
        let damage = blocked ? Math.floor(totalDamage / (1 + hero.blockStrength)) : totalDamage;
        if (goblin.health <= 0) {
            damage = 0;
            damageNumber.textContent = damage.toString();
        }
        else if (damage >= hero.health && hero.autoDodge > 0) {
            logev(`${hero.name} dodged the lethal blow (auto dodge used)`);
            damage = 0;
            hero.autoDodge -= 1;
            blocked = false;
            damageNumber.textContent = "!!";
        }
        else {
            damageNumber.textContent = damage.toString();
        }
        damageNumber === null || damageNumber === void 0 ? void 0 : damageNumber.classList.remove("hidden");
        if (blocked) {
            hitsplatImg.src = "static/img/hitsplatblock.png";
        }
        else if (damage == 0) {
            hitsplatImg.src = "static/img/hitsplatzero.png";
        }
        else {
            hitsplatImg.src = "static/img/hitsplat.png";
        }
        hitsplatImg === null || hitsplatImg === void 0 ? void 0 : hitsplatImg.classList.remove("hidden");
        setTimeout(() => {
            hitsplatImg === null || hitsplatImg === void 0 ? void 0 : hitsplatImg.classList.add("hidden");
            damageNumber === null || damageNumber === void 0 ? void 0 : damageNumber.classList.add("hidden");
        }, 500);
        if (blocked) {
            logev(`${hero.name} blocked successfully and only received ${damage} damage`);
        }
        else {
            logev(`${hero.name} failed to block and received ${damage} damage`);
        }
        hero.setHealth(hero.health - damage);
        updateDisplay();
    }, 500);
}
function goblinJustAttacked() {
    const goblinBox = document.getElementById("goblinBox");
    goblinBox === null || goblinBox === void 0 ? void 0 : goblinBox.classList.remove("attack");
    if (hero.health > 0) {
        heroAttack();
    }
    else {
        logev(`${hero.name} was slain by the goblin - he had taken a step too many`);
        const heroImg = document.getElementById("heroImg");
        const hitsplatImg = document.getElementById("hhitsplat");
        const damageNumber = document.getElementById("hdamageNumber");
        hitsplatImg === null || hitsplatImg === void 0 ? void 0 : hitsplatImg.classList.add("hidden");
        damageNumber === null || damageNumber === void 0 ? void 0 : damageNumber.classList.add("hidden");
        heroImg.src = "static/img/skull.png";
        const hb = document.getElementById("heroBox");
        const gb = document.getElementById("goblinBox");
        hb.outerHTML = hb.outerHTML;
        gb.outerHTML = gb.outerHTML;
        const heroBox = document.getElementById("heroBox");
        const goblinBox = document.getElementById("goblinBox");
        setTimeout(() => {
            var _a;
            (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.add("start");
            setTimeout(() => {
                document.getElementById("bgBox").style.backgroundImage = "url(static/img/cemetary-bg.png)";
                heroBox === null || heroBox === void 0 ? void 0 : heroBox.classList.add("hidden");
                goblinBox === null || goblinBox === void 0 ? void 0 : goblinBox.classList.add("hidden");
                console.log("Hiding boxes");
            }, 150);
            setTimeout(() => {
                var _a;
                (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.remove("start");
            }, 500);
            setTimeout(() => {
                var _a;
                (_a = document.getElementById("fullTransition")) === null || _a === void 0 ? void 0 : _a.classList.add("start");
            }, 3700);
            setTimeout(() => {
                gameOver();
                document.getElementById("bgBox").style.backgroundImage = "url(static/img/basic-bg.png)";
                document.getElementById("heroImg").src = "static/img/hero.png";
                heroBox === null || heroBox === void 0 ? void 0 : heroBox.classList.remove("hidden");
                toggle([document.getElementById("stepButton"), document.getElementById("blockButton")]);
                document.getElementById("stepButton").disabled = false;
                console.log("Running game over");
            }, 4000);
            setTimeout(() => {
                var _a;
                (_a = document.getElementById("fullTransition")) === null || _a === void 0 ? void 0 : _a.classList.remove("start");
            }, 4500);
        }, 2000);
    }
}
function beginEncounter() {
    var _a, _b, _c;
    logev(`${hero.name} encountered a goblin`);
    (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.add("start");
    const heroBox = document.getElementById("heroBox");
    const goblinBox = document.getElementById("goblinBox");
    setTimeout(() => {
        goblinBox === null || goblinBox === void 0 ? void 0 : goblinBox.classList.remove("hidden");
        document.getElementById("bgBox").style.backgroundImage = "url(static/img/dungeon-bg.png)";
    }, 150);
    (_b = document.getElementById("stepButton")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
    (_c = document.getElementById("blockButton")) === null || _c === void 0 ? void 0 : _c.classList.remove("hidden");
    let goblinHPMult = (Math.random() * 0.6) + 0.7;
    let goblinGoldMult = Math.random() * 2;
    let goblinMaxHit = 3;
    goblin = new Goblin(Math.floor((hero.lvl + 1) * 5 * goblinHPMult), Math.floor((hero.lvl + 1) * 3 * goblinGoldMult), goblinMaxHit + hero.lvl);
    //goblin = new Goblin(1,1,100);
    let heroHealthPercent = (hero.health / hero.maxHealth) * 100;
    let goblinHealthPercent = (goblin.health / goblin.maxHealth) * 100;
    document.getElementById("heroHP").style.background = `
        linear-gradient(90deg, rgba(0,255,0,1) 0%, rgba(0,255,0,1) ${heroHealthPercent}%, 
        rgba(255,0,0,1) ${heroHealthPercent}%, rgba(255,0,0,1) 100%)
    `;
    document.getElementById("goblinHP").style.background = `
        linear-gradient(90deg, rgba(0,255,0,1) 0%, rgba(0,255,0,1) ${goblinHealthPercent}%, 
        rgba(255,0,0,1) ${goblinHealthPercent}%, rgba(255,0,0,1) 100%)
    `;
    setTimeout(() => {
        var _a;
        heroBox === null || heroBox === void 0 ? void 0 : heroBox.addEventListener("animationend", () => { heroJustAttacked(); }, false);
        goblinBox === null || goblinBox === void 0 ? void 0 : goblinBox.addEventListener("animationend", () => { goblinJustAttacked(); }, false);
        heroAttack();
        (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.remove("start");
    }, 600);
}
function endEncounter() {
    var _a, _b, _c;
    logev(`A decisive victory for ${hero.name}!`);
    stats.goblinsDefeated++;
    (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.add("start");
    const but = document.getElementById("stepButton");
    setTimeout(() => {
        var _a;
        (_a = document.getElementById("goblinBox")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        const goblinImg = document.getElementById("goblinImg");
        goblinImg.src = "static/img/goblin.png";
        document.getElementById("bgBox").style.backgroundImage = "url(static/img/basic-bg.png)";
    }, 150);
    setTimeout(() => {
        var _a;
        (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.remove("start");
        but.disabled = false;
    }, 500);
    (_b = document.getElementById("stepButton")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
    (_c = document.getElementById("blockButton")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
    const heroBox = document.getElementById("heroBox");
    const goblinBox = document.getElementById("goblinBox");
    heroBox.outerHTML = heroBox.outerHTML;
    goblinBox.outerHTML = goblinBox.outerHTML;
    updateDisplay();
}
export function takeStep() {
    var _a, _b, _c, _d, _e, _f;
    const but = document.getElementById("stepButton");
    but.disabled = true;
    let r = Math.random();
    hero.steps += 1;
    if (hero.steps % gameOptions.lvlLength == 0) {
        hero.lvl += 1;
        logev(`${hero.name} reached the end of the path and found a shop`);
        (_a = document.getElementById("bgBox")) === null || _a === void 0 ? void 0 : _a.classList.add("slide");
        (_b = document.getElementById("heroBox")) === null || _b === void 0 ? void 0 : _b.classList.add("step");
        setTimeout(() => {
            var _a, _b;
            (_a = document.getElementById("bgBox")) === null || _a === void 0 ? void 0 : _a.classList.remove("slide");
            (_b = document.getElementById("heroBox")) === null || _b === void 0 ? void 0 : _b.classList.remove("step");
            shopEvent();
            but.disabled = false;
        }, 1000);
    }
    else if (r <= gameOptions.baseEncounterChance + hero.lvl * gameOptions.lvlEncounterScale) {
        (_c = document.getElementById("bgBox")) === null || _c === void 0 ? void 0 : _c.classList.add("slide");
        (_d = document.getElementById("heroBox")) === null || _d === void 0 ? void 0 : _d.classList.add("step");
        setTimeout(() => {
            var _a, _b;
            (_a = document.getElementById("bgBox")) === null || _a === void 0 ? void 0 : _a.classList.remove("slide");
            (_b = document.getElementById("heroBox")) === null || _b === void 0 ? void 0 : _b.classList.remove("step");
            beginEncounter();
        }, 1000);
    }
    else {
        (_e = document.getElementById("bgBox")) === null || _e === void 0 ? void 0 : _e.classList.add("slide");
        (_f = document.getElementById("heroBox")) === null || _f === void 0 ? void 0 : _f.classList.add("step");
        setTimeout(() => {
            var _a, _b;
            (_a = document.getElementById("bgBox")) === null || _a === void 0 ? void 0 : _a.classList.remove("slide");
            (_b = document.getElementById("heroBox")) === null || _b === void 0 ? void 0 : _b.classList.remove("step");
            but.disabled = false;
        }, 1000);
        if (hero.health < hero.maxHealth) {
            logev(`${hero.name} recovers slightly`);
            hero.setHealth(hero.health + 1);
        }
        else {
            logev(`${hero.name} continues onwards`);
        }
    }
    updateDisplay();
}
function shopEvent() {
    var _a;
    let shop = new Shop();
    shop.randomiseStock();
    document.getElementById("consumablegrid").innerHTML = shop.getConsumablesHTML();
    document.getElementById("upgradegrid").innerHTML = shop.getUpgradesHTML();
    shop.attachEventListeners();
    (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.add("start");
    setTimeout(() => {
        document.getElementById("bgBox").style.backgroundImage = "url(static/img/shop-bg.png)";
    }, 150);
    setTimeout(() => {
        var _a;
        (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.remove("start");
    }, 500);
    toggle([document.getElementById("stepButton"), document.getElementById("shopWindow"), document.getElementById("leaveShopButton")]);
}
export function exitShop() {
    var _a;
    toggle([document.getElementById("stepButton"), document.getElementById("shopWindow"), document.getElementById("leaveShopButton")]);
    (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.add("start");
    setTimeout(() => {
        document.getElementById("bgBox").style.backgroundImage = "url(static/img/basic-bg.png)";
    }, 150);
    setTimeout(() => {
        var _a;
        (_a = document.getElementById("darkTransition")) === null || _a === void 0 ? void 0 : _a.classList.remove("start");
    }, 500);
}
function gameOver() {
    document.getElementById("gameOverName").textContent = hero.name;
    document.getElementById("gameOverInfo").innerHTML = `
        <p>Level: ${hero.lvl}</p>
        <p>Steps Taken: ${hero.steps}</p>
        <p>Gold Earnt: ${stats.goldEarned}</p>
        <p>Goblins Defeated: ${stats.goblinsDefeated}</p>
    `;
    toggle([document.getElementById("gameOverWindow"), document.getElementById("allMainWindows")]);
}
function toggle(els) {
    els = (els instanceof Array) ? els : [els];
    els.forEach(el => {
        el.classList.toggle("hidden");
    });
}
export function blockTime() {
    blocktime = new Date().getTime();
    let but = document.getElementById("blockButton");
    but.disabled = true;
    setTimeout(() => {
        but.disabled = false;
    }, gameOptions.blockReset);
}
function updateDisplay() {
    var _a, _b;
    document.getElementById("attributes").innerHTML = `
        <h3>Attributes</h3>
        <div class="tooltip">
            Level: ${hero.lvl}
            <span class="tooltiptext">
                Your Level affects the enemies you face, your strength and is increased every time you reach the end of a floor
            </span>
        </div>
        <div class="tooltip">
            Steps: ${hero.steps}
            <span class="tooltiptext">
                The number of steps you have taken
            </span>
        </div>
        <div class="tooltip">
            Health: ${hero.health} / ${hero.maxHealth}
            <span class="tooltiptext">
                How close you are to death
            </span>
        </div>
        <div class="tooltip">
            Defence: ${hero.defence}
            <span class="tooltiptext">
                Blocking is hard - defence works to passively reduce incoming damage
            </span>
        </div>
        <div class="tooltip">
            Strength: ${hero.strength}
            <span class="tooltiptext">
                Determines how hard you can hit your opponents
            </span>
        </div>
        <div class="tooltip">
            Block: ${hero.blockStrength}
            <span class="tooltiptext">
                Determines the portion of damage received when successfully blocking an attack.
            </span>
        </div>
        <div class="tooltip">
            Auto Dodges: ${hero.autoDodge}
            <span class="tooltiptext">
                Each auto dodge is a ticket to automatically avoid a lethal damage strike - acquire more via dodge potions. 
            </span>
        </div>
        <div class="tooltip">
            Gold: ${hero.gold}
            <span class="tooltiptext">
                Money to buy things in the shop
            </span>
        </div>
    `;
    document.getElementById("avatarName").textContent = hero.name;
    let heroHealthPercent = (hero.health / hero.maxHealth) * 100;
    let goblinHealthPercent = (goblin.health / goblin.maxHealth) * 100;
    document.getElementById("heroHP").style.background = `
        linear-gradient(90deg, rgba(0,255,0,1) 0%, rgba(0,255,0,1) ${heroHealthPercent}%, 
        rgba(255,0,0,1) ${heroHealthPercent}%, rgba(255,0,0,1) 100%)
    `;
    document.getElementById("goblinHP").style.background = `
        linear-gradient(90deg, rgba(0,255,0,1) 0%, rgba(0,255,0,1) ${goblinHealthPercent}%, 
        rgba(255,0,0,1) ${goblinHealthPercent}%, rgba(255,0,0,1) 100%)
    `;
    document.getElementById("consumableInfo").innerHTML = "";
    for (const [i, p] of heroconsumables.consumables.entries()) {
        if (p == null) {
            continue;
        }
        let consumablebutton = document.createElement("button");
        consumablebutton.classList.add("itembutton", "button-4");
        consumablebutton.textContent = p.toString();
        consumablebutton.onclick = () => { heroconsumables.useConsumable(i); updateDisplay(); };
        (_a = document.getElementById("consumableInfo")) === null || _a === void 0 ? void 0 : _a.appendChild(consumablebutton);
    }
    if (((_b = document.getElementById("consumableInfo")) === null || _b === void 0 ? void 0 : _b.childElementCount) == 0) {
        document.getElementById("consumableInfo").innerHTML = `<p>Out of Consumables</p>`;
    }
}
class StrengthUpgrade {
    constructor(strength) {
        this.strength = strength;
        this.cost = 5 * this.strength;
    }
    use() {
        hero.strength += this.strength;
        logev(`${hero.name} gains ${this.strength} Strength`);
        updateDisplay();
    }
    toString() {
        return `Strength (+${this.strength})`;
    }
}
class MaxHPUpgrade {
    constructor(strength) {
        this.strength = strength;
        this.cost = 3 * this.strength;
    }
    use() {
        hero.maxHealth += this.strength;
        logev(`${hero.name} gains ${this.strength} max Health`);
        updateDisplay();
    }
    toString() {
        return `Max HP (+${this.strength})`;
    }
}
class DefenceUpgrade {
    constructor(strength) {
        this.strength = strength;
        this.cost = 4 * this.strength;
    }
    use() {
        hero.defence += this.strength;
        logev(`${hero.name} gains ${this.strength} Defence`);
        updateDisplay();
    }
    toString() {
        return `Defence (+${this.strength})`;
    }
}
class BlockUpgrade {
    constructor(strength) {
        this.strength = strength;
        this.cost = 3 * this.strength;
    }
    use() {
        hero.blockStrength += this.strength;
        logev(`${hero.name} gains ${this.strength} Block ability`);
        updateDisplay();
    }
    toString() {
        return `Block (+${this.strength})`;
    }
}
class HealthPotion {
    constructor(strength) {
        this.strength = strength;
        this.cost = strength + 1;
    }
    use() {
        if (hero.health == hero.maxHealth) {
            logev(`${hero.name} completely wasted the health potion`);
        }
        else if (hero.maxHealth - hero.health < this.strength) {
            logev(`${hero.name} used the health potion but may have wasted its potential`);
        }
        else {
            logev(`${hero.name} used the health potion recovering ${this.strength} health`);
        }
        hero.setHealth(hero.health + this.strength);
    }
    toString() {
        return `Health Potion (+${this.strength})`;
    }
}
class ExplosiveConsumable {
    constructor(strength) {
        this.strength = strength;
        this.cost = this.strength;
    }
    use() {
        logev(`${hero.name} threw the explosive at the goblin dealing ${this.strength} damage`);
        goblin.health -= this.strength;
        updateDisplay();
    }
    toString() {
        return `Explosive (-${this.strength})`;
    }
}
class DodgePotion {
    constructor(strength) {
        this.strength = strength;
        this.cost = this.strength;
    }
    use() {
        logev(`${hero.name} gained ${this.strength} auto dodge actions`);
        hero.autoDodge += this.strength;
    }
    toString() {
        return `Dodge Potion (+${this.strength})`;
    }
}
class ConsumableBox {
    constructor() {
        this.maxConsumables = 6;
        this.consumables = new Array(this.maxConsumables);
        this.consumables[0] = new HealthPotion(2);
        this.consumables[1] = new HealthPotion(2);
    }
    addConsumable(c) {
        for (let i = 0; i < this.maxConsumables; i++) {
            if (this.consumables[i] == null) {
                this.consumables[i] = c;
                return true;
            }
        }
        return false;
    }
    useConsumable(i) {
        this.consumables[i].use();
        this.consumables.splice(i, 1);
    }
    toString() {
        let myStr = "";
        this.consumables.forEach(c => {
            myStr += c.toString() + ", ";
        });
        return myStr;
    }
    reset() {
        this.consumables = new Array(this.maxConsumables);
        this.consumables[0] = new HealthPotion(2);
        this.consumables[1] = new HealthPotion(2);
    }
}
class HeroCharacter {
    constructor(name = "unset") {
        this.name = name;
        this.lvl = 0;
        this.steps = 0;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.gold = 3;
        this.strength = 1;
        this.defence = 1;
        this.blockStrength = 1;
        this.autoDodge = 1;
    }
    setHealth(newHealth) {
        this.health = Math.min(newHealth, this.maxHealth);
    }
    reset() {
        this.lvl = 0;
        this.steps = 0;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.gold = 3;
    }
}
class Goblin {
    constructor(hp = 4, gold = 3, maxHit = 3) {
        this.name = "Goblin";
        this.maxHealth = hp;
        this.health = this.maxHealth;
        this.gold = gold;
        this.maxHit = maxHit;
    }
}
class Shop {
    constructor() {
        this.num_consumables = 5;
        this.consumables = new Array(this.num_consumables);
        this.num_upgrades = 3;
        this.upgrades = new Array(this.num_upgrades);
    }
    randomiseStock() {
        const consumableTypes = [HealthPotion, ExplosiveConsumable, DodgePotion];
        const upgradeTypes = [StrengthUpgrade, MaxHPUpgrade, DefenceUpgrade, BlockUpgrade];
        for (let i = 0; i < this.num_consumables; i++) {
            let typeIndex = Math.floor(Math.random() * consumableTypes.length);
            let strength = Math.ceil(Math.random() * 3);
            this.consumables[i] = new consumableTypes[typeIndex](strength);
        }
        for (let i = 0; i < this.num_upgrades; i++) {
            let typeIndex = Math.floor(Math.random() * upgradeTypes.length);
            let strength = Math.ceil(Math.random() * 3);
            this.upgrades[i] = new upgradeTypes[typeIndex](strength);
        }
    }
    getConsumablesHTML() {
        let htmlStr = "";
        for (const [i, c] of this.consumables.entries()) {
            htmlStr += `
                <div class="shopitem">
                <button id="consumablepurchase-${i}" class="button-4">${c.toString()}</button>
                <p>Cost: ${c.cost}</p>
                </div>
            `;
        }
        if (htmlStr.length == 0) {
            htmlStr = `<div class="shopitem">Out of Stock!</div>`;
        }
        return htmlStr;
    }
    getUpgradesHTML() {
        let htmlStr = "";
        for (const [i, u] of this.upgrades.entries()) {
            htmlStr += `
                <div class="shopitem">
                <button id="upgradepurchase-${i}" class="button-4">${u.toString()}</button>
                <p>Cost: ${u.cost}</p>
                </div>
            `;
        }
        if (htmlStr.length == 0) {
            htmlStr = `<div class="shopitem">Out of Stock!</div>`;
        }
        return htmlStr;
    }
    attachEventListeners() {
        for (let i = 0; i < this.num_consumables; i++) {
            const button = document.getElementById(`consumablepurchase-${i}`);
            if (button) {
                button.addEventListener("click", () => this.sellConsumable(i));
            }
        }
        for (let i = 0; i < this.num_upgrades; i++) {
            const button = document.getElementById(`upgradepurchase-${i}`);
            if (button) {
                button.addEventListener("click", () => this.sellUpgrade(i));
            }
        }
    }
    sellConsumable(cid) {
        var _a, _b;
        if (hero.gold >= this.consumables[cid].cost) {
            if (heroconsumables.addConsumable(this.consumables[cid])) {
                hero.gold -= this.consumables[cid].cost;
                (_b = (_a = document.getElementById(`consumablepurchase-${cid}`)) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
            }
            else {
                logev(`${hero.name} bag was too full to carry that`);
            }
        }
        else {
            logev(`${hero.name} did not posses enough Gold!`);
        }
        let cgrid = document.getElementById("consumablegrid");
        if (cgrid.childElementCount == 0) {
            cgrid.innerHTML = `<div class="shopitem">Out of Stock!</div>`;
        }
        updateDisplay();
    }
    sellUpgrade(uid) {
        var _a, _b;
        if (hero.gold >= this.upgrades[uid].cost) {
            hero.gold -= this.upgrades[uid].cost;
            this.upgrades[uid].use();
            (_b = (_a = document.getElementById(`upgradepurchase-${uid}`)) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
        }
        else {
            logev(`${hero.name} did not posses enough Gold!`);
        }
        let ugrid = document.getElementById("upgradegrid");
        if (ugrid.childElementCount == 0) {
            ugrid.innerHTML = `<div class="shopitem">Out of Stock!</div>`;
        }
        updateDisplay();
    }
}
class StatTracker {
    constructor() {
        this.goldEarned = 0;
        this.goblinsDefeated = 0;
    }
    reset() {
        this.goldEarned = 0;
        this.goblinsDefeated = 0;
    }
}
const gameOptions = {
    baseEncounterChance: 0.15,
    lvlEncounterScale: 0.05,
    lvlLength: 10,
    logLength: 20,
    baseBlockWindow: 100,
    lvlBlockScale: 10,
    minBlockWindow: 10,
    blockReset: 500
};
const hero = new HeroCharacter();
const heroconsumables = new ConsumableBox();
const stats = new StatTracker();
var goblin = new Goblin();
var blocktime = 0;
