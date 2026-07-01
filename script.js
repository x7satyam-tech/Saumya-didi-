window.addEventListener("load", () => {
    const frontPortal = document.getElementById("frontPortal");
    const portalEnterBtn = document.getElementById("portalEnterBtn");
    const luxuryMain = document.getElementById("luxuryMain");
    const stardustLayer = document.getElementById("stardustLayer");
    const fireBlastCanvas = document.getElementById("fireBlastCanvas");
    const hangingGarland = document.getElementById("hangingGarland");
    
    const candleFlameTarget = document.getElementById("candleFlameTarget");
    const candleFlame = document.getElementById("candleFlame");
    const smokeTrail = document.getElementById("smokeTrail");
    const cakeAssembly = document.getElementById("cakeAssembly");
    const wishRevealPanel = document.getElementById("wishRevealPanel");
    
    const nextToBalloonBtn = document.getElementById("nextToBalloonBtn");
    const balloonSection = document.getElementById("balloonSection");
    const surpriseBalloon = document.getElementById("surpriseBalloon");
    
    const giftSection = document.getElementById("giftSection");
    const giftPackage = document.getElementById("giftPackage");
    const memoirLetter = document.getElementById("memoirLetter");
    
    const goToAlbumBtn = document.getElementById("goToAlbumBtn");
    const albumSection = document.getElementById("albumSection");
    const liveAlbumUploader = document.getElementById("liveAlbumUploader");
    const scatteredAlbumCanvas = document.getElementById("scatteredAlbumCanvas");

    let context = fireBlastCanvas ? fireBlastCanvas.getContext("2d") : null;
    let effectParticles = [];
    let loopId = null;

    function handleResize() {
        if (!fireBlastCanvas) return;
        fireBlastCanvas.width = window.innerWidth;
        fireBlastCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    function makeAtmosphere() {
        if (!stardustLayer) return;
        stardustLayer.innerHTML = ""; 
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            particle.style.width = `${Math.random() * 3 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            
            particle.animate([{ opacity: 0.1 }, { opacity: 0.9 }, { opacity: 0.1 }], {
                duration: 2500 + Math.random() * 2500,
                iterations: Infinity
            });
            stardustLayer.appendChild(particle);
        }
    }
    makeAtmosphere();

    class FireFXParticle {
        constructor(x, y, variant) {
            this.x = x;
            this.y = y;
            this.variant = variant;
            
            if (variant === 'firestorm') {
                this.vx = (Math.random() - 0.5) * 16;
                this.vy = -Math.random() * 18 - 5;
                this.size = Math.random() * 24 + 14;
                this.alpha = 1;
                this.decay = Math.random() * 0.014 + 0.008;
                const firePalettes = ["#FF4500", "#FF7300", "#FFA200", "#FFD000", "#FFF3CD"];
                this.color = firePalettes[Math.floor(Math.random() * firePalettes.length)];
            } else {
                this.vx = (Math.random() - 0.5) * 24;
                this.vy = (Math.random() - 0.5) * 24 - 3;
                this.size = variant === 'treat' ? Math.random() * 7 + 5 : Math.random() * 3 + 1.5;
                this.alpha = 1;
                this.decay = Math.random() * 0.006 + 0.004;
                const treatPalettes = ["#FFF", "#FF8FAB", "#FB6F92", "#E3C193", "#FFC2D1"];
                this.color = treatPalettes[Math.floor(Math.random() * treatPalettes.length)];
            }
            
            this.accelY = variant === 'firestorm' ? -0.06 : 0.16;
            this.rotationAngle = Math.random() * 360;
            this.spinSpeed = (Math.random() - 0.5) * 5;
        }
        step() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.accelY;
            this.alpha -= this.decay;
            this.rotationAngle += this.spinSpeed;
            if (this.variant === 'firestorm') this.size *= 0.95;
        }
        render() {
            if(!context) return;
            context.save();
            context.globalAlpha = this.alpha;
            context.translate(this.x, this.y);
            context.rotate((this.rotationAngle * Math.PI) / 180);

            if (this.variant === 'firestorm') {
                context.fillStyle = this.color;
                context.shadowBlur = 25;
                context.shadowColor = this.color;
                context.beginPath();
                context.moveTo(0, -this.size);
                context.quadraticCurveTo(this.size / 1.8, -this.size / 2, 0, this.size);
                context.quadraticCurveTo(-this.size / 1.8, -this.size / 2, 0, -this.size);
                context.fill();
            } else if (this.variant === 'treat') {
                context.fillStyle = this.color;
                context.beginPath();
                context.ellipse(0, 0, this.size, this.size / 1.6, 0, 0, 2 * Math.PI);
                context.fill();
            } else {
                context.fillStyle = this.color;
                context.beginPath();
                context.arc(0, 0, this.size, 0, 2 * Math.PI);
                context.fill();
            }
            context.restore();
        }
    }

    function deployBurst(x, y, variant, amount) {
        for (let i = 0; i < amount; i++) {
            effectParticles.push(new FireFXParticle(x, y, variant));
        }
        if (!loopId) masterRenderLoop();
    }

    function masterRenderLoop() {
        if (!context) return;
        context.clearRect(0, 0, fireBlastCanvas.width, fireBlastCanvas.height);
        
        for (let i = effectParticles.length - 1; i >= 0; i--) {
            effectParticles[i].step();
            if (effectParticles[i].alpha <= 0 || effectParticles[i].size <= 0.8) {
                effectParticles.splice(i, 1);
            } else {
                effectParticles[i].render();
            }
        }
        
        if (effectParticles.length > 0) {
            loopId = requestAnimationFrame(masterRenderLoop);
        } else {
            loopId = null;
        }
    }

    // High Impact Click Listener Fix for Mobile
    if (portalEnterBtn && frontPortal && luxuryMain && hangingGarland) {
        portalEnterBtn.addEventListener("click", (e) => {
            e.preventDefault();
            frontPortal.classList.add("dismissed");
            luxuryMain.classList.remove("hidden");
            window.scrollTo({ top: 0 });
            setTimeout(() => {
                hangingGarland.style.transform = "translate3d(-50%, 150px, 0)";
            }, 300);
        });
    }

    let candleIsLit = true;
    if (candleFlameTarget && candleFlame && smokeTrail && cakeAssembly && wishRevealPanel) {
        candleFlameTarget.addEventListener("click", () => {
            if (!candleIsLit) return;
            candleIsLit = false;
            candleFlame.classList.add("dead");
            smokeTrail.classList.add("rise");
            
            for (let stride = 0; stride < window.innerWidth; stride += 90) {
                deployBurst(stride, window.innerHeight + 15, 'firestorm', 20);
            }
            
            setTimeout(() => {
                cakeAssembly.classList.add("quenched");
                wishRevealPanel.classList.remove("hidden");
            }, 900);
        });
    }

    if (nextToBalloonBtn && balloonSection) {
        nextToBalloonBtn.addEventListener("click", () => {
            balloonSection.classList.remove("hidden");
            balloonSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    let balloonPopped = false;
    if (surpriseBalloon && giftSection) {
        surpriseBalloon.addEventListener("click", (evt) => {
            if (balloonPopped) return;
            balloonPopped = true;
            surpriseBalloon.style.display = 'none';
            
            deployBurst(evt.clientX || window.innerWidth/2, evt.clientY || window.innerHeight/2, 'treat', 130);
            
            setTimeout(() => {
                giftSection.classList.remove("hidden");
                giftSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 700);
        });
    }

    if (giftPackage && memoirLetter) {
        giftPackage.addEventListener("click", () => {
            giftPackage.classList.add("unwrapped");
            setTimeout(() => {
                memoirLetter.classList.remove("hidden");
                memoirLetter.offsetHeight;
                memoirLetter.classList.add("visible");
            }, 500);
        });
    }

    if (goToAlbumBtn && albumSection) {
        goToAlbumBtn.addEventListener("click", () => {
            albumSection.classList.remove("hidden");
            albumSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});
        
