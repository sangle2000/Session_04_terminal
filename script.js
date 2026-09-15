document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling for Navigation ---
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // --- OS Toggle State ---
    let currentOS = 'mac'; // 'mac' or 'win'
    const osBtns = document.querySelectorAll('.os-btn');
    
    osBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedOS = e.target.dataset.os;
            currentOS = selectedOS;
            
            // Sync all toggle buttons on the page
            osBtns.forEach(b => {
                if (b.dataset.os === selectedOS) b.classList.add('active');
                else b.classList.remove('active');
            });
            
            // Auto click reset buttons if they exist so the terminal is clean
            const btnReset2 = document.getElementById('btn-demo2-reset');
            const btnReset3 = document.getElementById('btn-demo3-reset');
            if (btnReset2) btnReset2.click();
            if (btnReset3) btnReset3.click();
        });
    });

    // --- Animation Helpers ---
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
    async function typeTerminal(elementId, command, output = null) {
        const termBody = document.getElementById(elementId);
        const typingSpan = termBody.querySelector('.term-line:last-child .typing');
        const cursorSpan = termBody.querySelector('.term-line:last-child .cursor');
        
        if (!typingSpan) return;
        
        typingSpan.textContent = '';
        for (let i = 0; i < command.length; i++) {
            typingSpan.textContent += command.charAt(i);
            await sleep(100);
        }
        await sleep(300); // pause before enter
        
        // Finalize line
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="prompt">$</span> <span>${command}</span>`;
        
        const currentTypingLine = termBody.querySelector('.term-line:last-child');
        termBody.insertBefore(line, currentTypingLine);
        
        if (output) {
            const out = document.createElement('div');
            out.className = 'term-line';
            out.style.color = '#94a3b8';
            out.textContent = output;
            termBody.insertBefore(out, currentTypingLine);
        }
        
        typingSpan.textContent = ''; // Reset for next time
        termBody.scrollTop = termBody.scrollHeight;
    }

    // Reset Terminal Content
    function resetTerminal(elementId) {
        const termBody = document.getElementById(elementId);
        termBody.innerHTML = '<div class="term-line"><span class="prompt">$</span> <span class="typing"></span><span class="cursor">_</span></div>';
    }

    // --- Interactive Blocks Logic ---

    // 1. Demo Lò Vi Sóng
    const mwScreen = document.querySelector('.mw-screen');
    const mwDoor = document.querySelector('.microwave-door');
    const mwFood = document.querySelector('.microwave-food');
    const mwStart = document.querySelector('.mw-start-btn');
    
    const btnGui = document.getElementById('btn-demo1-gui');
    const btnCli1 = document.getElementById('btn-demo1-cli1');
    const btnCli2 = document.getElementById('btn-demo1-cli2');
    const btnCli3 = document.getElementById('btn-demo1-cli3');
    const btnReset = document.getElementById('btn-demo1-reset');
    
    const demo1Buttons = [btnGui, btnCli1, btnCli2, btnCli3, btnReset];
    
    function setDemo1Buttons(disabled) {
        demo1Buttons.forEach(b => { if(b) b.disabled = disabled; });
    }
    
    function resetMicrowave() {
        mwScreen.textContent = '00:00';
        mwDoor.classList.remove('on');
        mwFood.style.opacity = '0';
        document.querySelectorAll('.food-item').forEach(f => f.classList.remove('taken'));
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            resetTerminal('term-demo-1');
            resetMicrowave();
        });
    }

    async function runMicrowaveAction(foodId, emoji, tempStr, isCLI, cmd = null, output = null) {
        setDemo1Buttons(true);
        resetMicrowave();
        
        await sleep(300);
        
        // Take food from shelf
        const shelfItem = document.getElementById(foodId);
        if (shelfItem) shelfItem.classList.add('taken');
        
        // Put in microwave
        mwFood.textContent = emoji;
        mwFood.style.opacity = '1';
        
        if (isCLI) {
            // CLI action
            await typeTerminal('term-demo-1', cmd);
            mwDoor.classList.add('on');
            mwScreen.textContent = tempStr;
            await sleep(1500);
            mwDoor.classList.remove('on');
            mwScreen.textContent = 'DONE';
            await typeTerminal('term-demo-1', '', output);
        } else {
            // GUI action
            mwStart.style.transform = 'scale(0.9)';
            await sleep(200);
            mwStart.style.transform = 'scale(1)';
            mwDoor.classList.add('on');
            mwScreen.textContent = tempStr;
            await typeTerminal('term-demo-1', '', '(Bạn thao tác trên bảng điều khiển GUI)');
            await sleep(1500);
            mwDoor.classList.remove('on');
            mwScreen.textContent = 'DONE';
        }
        
        setDemo1Buttons(false);
    }

    if (btnGui) {
        btnGui.addEventListener('click', () => runMicrowaveAction('food-bread', '🥪', '01:00', false));
    }
    if (btnCli1) {
        btnCli1.addEventListener('click', () => runMicrowaveAction('food-pizza', '🍕', '200°C', true, 'microwave --temp 200C "Pizza"', 'Baking Pizza at 200C... Done! 🍕'));
    }
    if (btnCli2) {
        btnCli2.addEventListener('click', () => runMicrowaveAction('food-soup', '🍲', '100°C', true, 'microwave --temp 100C "Soup"', 'Heating Soup at 100C... Done! 🍲'));
    }
    if (btnCli3) {
        btnCli3.addEventListener('click', () => runMicrowaveAction('food-chicken', '🍗', '150°C', true, 'microwave --temp 150C "Ga"', 'Roasting Ga at 150C... Done! 🍗'));
    }

    // 2. Demo Siêu Thị
    const player = document.getElementById('player');
    const tooltip = document.getElementById('map-tooltip');
    const aisles = document.querySelector('.aisles-container');
    
    const btnPwd = document.getElementById('btn-demo2-pwd');
    const btnLs = document.getElementById('btn-demo2-ls');
    const btnCd = document.getElementById('btn-demo2-cd');
    const btnReset2 = document.getElementById('btn-demo2-reset');
    
    const demo2Btns = [btnPwd, btnLs, btnCd, btnReset2];
    function setDemo2Btns(disabled) { demo2Btns.forEach(b => { if(b) b.disabled = disabled; }); }
    
    if (btnReset2) {
        btnReset2.addEventListener('click', () => {
            resetTerminal('term-demo-2');
            player.classList.remove('moving-right');
            player.classList.remove('moving-left');
            tooltip.classList.add('hidden');
            aisles.classList.remove('zoomed');
        });
    }

    if (btnPwd) {
        btnPwd.addEventListener('click', async () => {
            setDemo2Btns(true);
            const cmd = currentOS === 'mac' ? 'pwd' : 'Get-Location';
            await typeTerminal('term-demo-2', cmd);
            tooltip.classList.remove('hidden');
            const output = currentOS === 'mac' ? '/Supermarket/Cong_chinh' : 'Path\n----\nC:\\Supermarket\\Cong_chinh';
            await typeTerminal('term-demo-2', '', output);
            await sleep(1500);
            tooltip.classList.add('hidden');
            setDemo2Btns(false);
        });
    }
    
    if (btnLs) {
        btnLs.addEventListener('click', async () => {
            setDemo2Btns(true);
            const cmd = currentOS === 'mac' ? 'ls' : 'dir';
            await typeTerminal('term-demo-2', cmd);
            aisles.classList.add('zoomed');
            await typeTerminal('term-demo-2', '', 'Khu_Banh_Keo  Khu_Sua');
            await sleep(2000);
            aisles.classList.remove('zoomed');
            setDemo2Btns(false);
        });
    }

    if (btnCd) {
        btnCd.addEventListener('click', async () => {
            setDemo2Btns(true);
            const cmd = currentOS === 'mac' ? 'cd Khu_Sua' : 'cd Khu_Sua'; // cd works on both natively
            await typeTerminal('term-demo-2', cmd);
            player.classList.add('moving-right');
            await typeTerminal('term-demo-2', '');
            setDemo2Btns(false);
        });
    }

    // 3. Demo Văn Phòng
    const deskItems = document.getElementById('desk-items');
    
    const btnTouch = document.getElementById('btn-demo3-touch');
    const btnCp = document.getElementById('btn-demo3-cp');
    const btnMkdir = document.getElementById('btn-demo3-mkdir');
    const btnMv = document.getElementById('btn-demo3-mv');
    const btnRm = document.getElementById('btn-demo3-rm');
    const btnReset3 = document.getElementById('btn-demo3-reset');
    
    const demo3Btns = [btnTouch, btnCp, btnMkdir, btnMv, btnRm, btnReset3];
    function setDemo3Btns(disabled) { demo3Btns.forEach(b => { if(b) b.disabled = disabled; }); }
    
    let paperObj = null;
    let paperCopyObj = null;
    let folderObj = null;

    if (btnReset3) {
        btnReset3.addEventListener('click', () => {
            resetTerminal('term-demo-3');
            deskItems.innerHTML = '';
            paperObj = null;
            paperCopyObj = null;
            folderObj = null;
        });
    }

    if (btnTouch) {
        btnTouch.addEventListener('click', async () => {
            setDemo3Btns(true);
            const cmd = currentOS === 'mac' ? 'touch bao_cao.txt' : 'New-Item bao_cao.txt';
            await typeTerminal('term-demo-3', cmd);
            paperObj = document.createElement('div');
            paperObj.className = 'paper-item';
            paperObj.textContent = '📄';
            deskItems.appendChild(paperObj);
            await typeTerminal('term-demo-3', '');
            setDemo3Btns(false);
        });
    }
    
    if (btnCp) {
        btnCp.addEventListener('click', async () => {
            setDemo3Btns(true);
            const cmd = currentOS === 'mac' ? 'cp bao_cao.txt ban_sao.txt' : 'Copy-Item bao_cao.txt ban_sao.txt';
            await typeTerminal('term-demo-3', cmd);
            paperCopyObj = document.createElement('div');
            paperCopyObj.className = 'paper-item';
            paperCopyObj.textContent = '📄';
            deskItems.appendChild(paperCopyObj);
            await typeTerminal('term-demo-3', '');
            setDemo3Btns(false);
        });
    }
    
    if (btnMkdir) {
        btnMkdir.addEventListener('click', async () => {
            setDemo3Btns(true);
            const cmd = currentOS === 'mac' ? 'mkdir du_an_moi' : 'mkdir du_an_moi';
            await typeTerminal('term-demo-3', cmd);
            folderObj = document.createElement('div');
            folderObj.className = 'folder-item';
            folderObj.textContent = '📁';
            deskItems.appendChild(folderObj);
            await typeTerminal('term-demo-3', '');
            setDemo3Btns(false);
        });
    }
    
    if (btnMv) {
        btnMv.addEventListener('click', async () => {
            setDemo3Btns(true);
            const cmd = currentOS === 'mac' ? 'mv bao_cao.txt du_an_moi/' : 'Move-Item bao_cao.txt du_an_moi/';
            await typeTerminal('term-demo-3', cmd);
            if (paperObj) paperObj.classList.add('move-to-folder');
            await typeTerminal('term-demo-3', '');
            setDemo3Btns(false);
        });
    }
    
    if (btnRm) {
        btnRm.addEventListener('click', async () => {
            setDemo3Btns(true);
            const cmd = currentOS === 'mac' ? 'rm -r du_an_moi' : 'Remove-Item -Recurse du_an_moi';
            await typeTerminal('term-demo-3', cmd);
            if (folderObj) folderObj.classList.add('move-to-shredder');
            await typeTerminal('term-demo-3', '');
            setDemo3Btns(false);
        });
    }
});
