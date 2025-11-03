import { useEffect, useRef } from 'react';

const BioLoader = ({ isVisible = true, message = "PROCESSING WITH LOCAL AI..." }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    class BioLoaderAnimation {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dpr = Math.max(1, window.devicePixelRatio || 1);
        this.isRunning = false;

        // Animation parameters
        this.animationDuration = 12000; // 12 seconds for full sequence
        this.startTime = null;
        
        // Center position
        this.centerX = 0;
        this.centerY = 0;
        
        // Animation state
        this.animationProgress = 0;
        this.phase = 0;
        
        // Snake strands from bottom corners
        this.leftStrand = { points: [], progress: 0 };
        this.rightStrand = { points: [], progress: 0 };
        
        // DNA helix properties
        this.helixPoints = { left: [], right: [] };
        this.helixOpacity = 0;
        this.basePairs = [];
        this.basePairOpacity = 0;
        
        // Protein properties
        this.bindingProtein = {
          x: 0, y: 0, opacity: 0, scale: 0,
          targetX: 0, targetY: 0, position: 0,
          brownianOffset: { x: 0, y: 0 }
        };
        
        this.unzippingProtein = {
          x: 0, y: 0, opacity: 0, scale: 0,
          targetX: 0, targetY: 0
        };
        
        // Unzipping animation
        this.unzipProgress = 0;
        this.strandsExiting = false;

        // Store the debounced resize function for proper cleanup
        this.debouncedResize = this.debounce(() => this.resize(), 120);

        this.resize();
        window.addEventListener('resize', this.debouncedResize);
        
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          this.start();
        }
      }

      start() {
        if (!this.isRunning && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          this.isRunning = true;
          this.startTime = performance.now();
          requestAnimationFrame(this.animate);
        }
      }

      stop() {
        this.isRunning = false;
      }

      resize() {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        
        this.canvas.width = Math.floor(w * this.dpr);
        this.canvas.height = Math.floor(h * this.dpr);
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        this.centerX = w / 2;
        this.centerY = h / 2;
      }

      // Smooth easing functions
      easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      
      easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }
      
      easeInQuart(t) {
        return t * t * t * t;
      }
      
      easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      // Generate snake-like strand moving from bottom corner to center
      generateSnakeStrand(fromCorner, progress, time) {
        const points = [];
        const w = this.canvas.width / this.dpr;
        const h = this.canvas.height / this.dpr;
        
        // Starting positions
        const startX = fromCorner === 'left' ? 50 : w - 50;
        const startY = h - 50;
        const endX = this.centerX;
        const endY = this.centerY;
        
        // Total path length for smooth progression
        const totalSteps = 150;
        const currentSteps = Math.floor(totalSteps * progress);
        
        for (let i = 0; i <= currentSteps; i++) {
          const t = i / totalSteps;
          
          // Base path from corner to center
          const baseX = startX + (endX - startX) * t;
          const baseY = startY + (endY - startY) * t;
          
          // Snake-like zigzag motion
          const frequency = 8; // Number of zigzags
          const amplitude = 25 * (1 - t * 0.7); // Reduce amplitude as it approaches center
          const zigzag = Math.sin(t * frequency * Math.PI + time * 3) * amplitude;
          
          // Apply zigzag perpendicular to the path
          const dx = endX - startX;
          const dy = endY - startY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const perpX = -dy / length;
          const perpY = dx / length;
          
          const x = baseX + perpX * zigzag;
          const y = baseY + perpY * zigzag;
          
          points.push({ x, y });
        }
        
        return points;
      }

      // Generate DNA helix points
      generateHelixPoints() {
        const radius = 30;
        const height = 200;
        const turns = 3;
        const steps = 100;
        
        const leftPoints = [];
        const rightPoints = [];
        const basePairs = [];
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const angle = t * turns * 2 * Math.PI;
          
          // Left strand
          const leftX = this.centerX + Math.cos(angle) * radius;
          const leftY = this.centerY - height/2 + t * height;
          leftPoints.push({ x: leftX, y: leftY });
          
          // Right strand (opposite phase)
          const rightX = this.centerX + Math.cos(angle + Math.PI) * radius;
          const rightY = this.centerY - height/2 + t * height;
          rightPoints.push({ x: rightX, y: rightY });
          
          // Base pairs (every 5th point)
          if (i % 5 === 0) {
            basePairs.push({
              left: { x: leftX, y: leftY },
              right: { x: rightX, y: rightY }
            });
          }
        }
        
        this.helixPoints.left = leftPoints;
        this.helixPoints.right = rightPoints;
        this.basePairs = basePairs;
      }

      // Brownian motion for protein
      updateBrownianMotion(protein, intensity = 2) {
        protein.brownianOffset.x += (Math.random() - 0.5) * intensity;
        protein.brownianOffset.y += (Math.random() - 0.5) * intensity;
        
        // Damping to prevent drift
        protein.brownianOffset.x *= 0.95;
        protein.brownianOffset.y *= 0.95;
        
        // Limit maximum offset
        const maxOffset = 8;
        protein.brownianOffset.x = Math.max(-maxOffset, Math.min(maxOffset, protein.brownianOffset.x));
        protein.brownianOffset.y = Math.max(-maxOffset, Math.min(maxOffset, protein.brownianOffset.y));
      }

      // Draw smooth line using quadratic curves (very smooth)
      drawSmoothLine(points, color, thickness, opacity) {
        if (points.length < 2) return;
        
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = thickness;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        // Use quadratic curves for extremely smooth rendering
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        
        // Final point
        const lastPoint = points[points.length - 1];
        const secondLastPoint = points[points.length - 2];
        this.ctx.quadraticCurveTo(
          secondLastPoint.x,
          secondLastPoint.y,
          lastPoint.x,
          lastPoint.y
        );
        
        this.ctx.stroke();
        this.ctx.restore();
      }

      // Draw circles along a path (nucleotides/bases)
      drawNucleotides(points, radius, color, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        
        for (let i = 0; i < points.length; i += 10) {
          this.ctx.beginPath();
          this.ctx.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2);
          this.ctx.fill();
        }
        
        this.ctx.restore();
      }

      // Draw smooth double helix
      drawDoubleHelix(x, y, scale, rotation, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        const radius = 25 * scale;
        const pitch = 40 * scale;
        const height = 150 * scale;
        
        // Draw two helical strands
        const colors = ['#3b82f6', '#8b5cf6']; // blue and purple
        
        for (let strandIndex = 0; strandIndex < 2; strandIndex++) {
          const strandColor = colors[strandIndex];
          const points = [];
          
          const steps = 80;
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = t * Math.PI * 6 + (strandIndex * Math.PI);
            const px = Math.cos(angle) * radius;
            const py = (t - 0.5) * height;
            points.push({ x: px, y: py });
          }
          
          this.drawSmoothLine(points, strandColor, 4, 0.9);
        }
        
        // Draw base pair connections
        this.ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)';
        this.ctx.lineWidth = 1;
        
        const connectionSteps = 15;
        for (let i = 0; i <= connectionSteps; i++) {
          const t = i / connectionSteps;
          const angle = t * Math.PI * 6;
          
          const x1 = Math.cos(angle) * radius;
          const x2 = Math.cos(angle + Math.PI) * radius;
          const y = (t - 0.5) * height;
          
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y);
          this.ctx.lineTo(x2, y);
          this.ctx.stroke();
        }
        
        this.ctx.restore();
      }

      // Draw protein molecule (binding protein)
      drawProtein(x, y, scale, opacity, color) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        
        // Draw protein as blob/sphere
        const size = 35 * scale;
        
        // Outer glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 1.2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 * opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Main body
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Highlight
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
      }

      // Main animation loop
      animate = (currentTime) => {
        if (!this.isRunning) return;
        
        if (!this.startTime) this.startTime = currentTime;
        
        const elapsed = currentTime - this.startTime;
        this.animationProgress = (elapsed % this.animationDuration) / this.animationDuration;
        
        // Determine phase (0-1 for each phase)
        this.phase = this.animationProgress * 4;
        
        const w = this.canvas.width / this.dpr;
        const h = this.canvas.height / this.dpr;
        
        // Clear canvas with subtle trail effect
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.ctx.fillRect(0, 0, w, h);
        
        this.updateAnimation();
        this.drawAnimation(w, h);
        
        this.animationId = requestAnimationFrame(this.animate);
      }

      updateAnimation() {
        const p = this.animationProgress;
        
        // Phase 1 (0-0.15): Snake strands enter from bottom corners
        if (p < 0.15) {
          const phaseProgress = p / 0.15;
          this.leftStrand.progress = this.easeInOutCubic(phaseProgress);
          this.rightStrand.progress = this.easeInOutCubic(phaseProgress);
        }
        
        // Phase 2 (0.15-0.35): Strands form DNA helix (no base pairs yet)
        else if (p < 0.35) {
          const phaseProgress = (p - 0.15) / 0.2;
          this.leftStrand.progress = 1;
          this.rightStrand.progress = 1;
          this.helixOpacity = this.easeInOutCubic(phaseProgress);
          this.generateHelixPoints();
        }
        
        // Phase 3 (0.35-0.55): Binding protein enters with Brownian motion
        else if (p < 0.55) {
          const phaseProgress = (p - 0.35) / 0.2;
          this.helixOpacity = 1;
          this.bindingProtein.opacity = this.easeInOutCubic(phaseProgress);
          this.bindingProtein.scale = this.easeOutQuart(phaseProgress);
          
          // Position protein at top of helix initially
          if (this.helixPoints.left.length > 0) {
            const topPoint = this.helixPoints.left[0];
            this.bindingProtein.targetX = topPoint.x;
            this.bindingProtein.targetY = topPoint.y - 40;
          }
          
          this.updateBrownianMotion(this.bindingProtein, 3);
        }
        
        // Phase 4 (0.55-0.75): Protein moves down strand, base pairs form
        else if (p < 0.75) {
          const phaseProgress = (p - 0.55) / 0.2;
          this.bindingProtein.position = this.easeInOutQuad(phaseProgress);
          this.basePairOpacity = this.easeInOutCubic(phaseProgress);
          
          // Move protein along the helix
          if (this.helixPoints.left.length > 0) {
            const index = Math.floor(this.bindingProtein.position * (this.helixPoints.left.length - 1));
            const point = this.helixPoints.left[index];
            this.bindingProtein.targetX = point.x;
            this.bindingProtein.targetY = point.y;
          }
          
          this.updateBrownianMotion(this.bindingProtein, 2);
        }
        
        // Phase 5 (0.75-0.9): Unzipping protein enters, binding protein leaves
        else if (p < 0.9) {
          const phaseProgress = (p - 0.75) / 0.15;
          
          // Binding protein leaves
          this.bindingProtein.opacity = 1 - this.easeInQuart(phaseProgress);
          
          // Unzipping protein enters
          this.unzippingProtein.opacity = this.easeInOutCubic(phaseProgress);
          this.unzippingProtein.scale = this.easeOutQuart(phaseProgress);
          this.unzippingProtein.x = this.centerX + 60;
          this.unzippingProtein.y = this.centerY - 100;
          
          // Start unzipping
          this.unzipProgress = this.easeInOutQuad(phaseProgress);
        }
        
        // Phase 6 (0.9-1.0): Strands exit from top corners
        else {
          const phaseProgress = (p - 0.9) / 0.1;
          this.unzippingProtein.opacity = 1 - this.easeInQuart(phaseProgress);
          this.helixOpacity = 1 - this.easeInQuart(phaseProgress);
          this.basePairOpacity = 0;
          this.strandsExiting = true;
          this.unzipProgress = 1;
        }
      }

      drawAnimation(w, h) {
        const time = this.animationProgress * 10; // For time-based effects
        
        // Phase 1-2: Draw snake strands
        if (this.leftStrand.progress > 0 || this.rightStrand.progress > 0) {
          const leftPoints = this.generateSnakeStrand('left', this.leftStrand.progress, time);
          const rightPoints = this.generateSnakeStrand('right', this.rightStrand.progress, time);
          
          if (leftPoints.length > 0) {
            this.drawSmoothLine(leftPoints, '#3b82f6', 6, 0.9); // blue strand
            this.drawNucleotides(leftPoints, 4, '#1e40af', 0.8); // darker blue nucleotides
          }
          
          if (rightPoints.length > 0) {
            this.drawSmoothLine(rightPoints, '#8b5cf6', 6, 0.9); // purple strand
            this.drawNucleotides(rightPoints, 4, '#6d28d9', 0.8); // darker purple nucleotides
          }
        }
        
        // Phase 2+: Draw DNA helix
        if (this.helixOpacity > 0 && !this.strandsExiting) {
          this.drawDNAHelix();
        }
        
        // Phase 3-4: Draw binding protein with Brownian motion
        if (this.bindingProtein.opacity > 0) {
          const proteinX = this.bindingProtein.targetX + this.bindingProtein.brownianOffset.x;
          const proteinY = this.bindingProtein.targetY + this.bindingProtein.brownianOffset.y;
          
          this.drawProteinMolecule(
            proteinX, 
            proteinY, 
            this.bindingProtein.scale, 
            this.bindingProtein.opacity, 
            '#10b981' // emerald binding protein
          );
        }
        
        // Phase 5: Draw unzipping protein
        if (this.unzippingProtein.opacity > 0) {
          this.drawProteinMolecule(
            this.unzippingProtein.x,
            this.unzippingProtein.y,
            this.unzippingProtein.scale,
            this.unzippingProtein.opacity,
            '#ef4444' // red unzipping protein
          );
        }
        
        // Phase 6: Draw exiting strands
        if (this.strandsExiting) {
          this.drawExitingStrands(w, h);
        }
      }

      // Draw DNA helix with optional base pairs
      drawDNAHelix() {
        if (this.helixPoints.left.length === 0) return;
        
        // Draw helix strands
        this.drawSmoothLine(this.helixPoints.left, '#3b82f6', 5, this.helixOpacity);
        this.drawSmoothLine(this.helixPoints.right, '#8b5cf6', 5, this.helixOpacity);
        
        // Draw base pairs if they should be visible
        if (this.basePairOpacity > 0) {
          this.ctx.save();
          this.ctx.globalAlpha = this.basePairOpacity;
          this.ctx.strokeStyle = '#94a3b8'; // gray base pairs
          this.ctx.lineWidth = 2;
          
          for (let pair of this.basePairs) {
            this.ctx.beginPath();
            this.ctx.moveTo(pair.left.x, pair.left.y);
            this.ctx.lineTo(pair.right.x, pair.right.y);
            this.ctx.stroke();
          }
          
          this.ctx.restore();
        }
      }

      // Draw protein molecule with glow effect
      drawProteinMolecule(x, y, scale, opacity, color) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        
        const size = 25 * scale;
        
        // Outer glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
        gradient.addColorStop(0, `${color}80`); // Semi-transparent
        gradient.addColorStop(1, `${color}00`); // Fully transparent
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Main protein body
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Highlight
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
      }

      // Draw strands exiting to top corners
      drawExitingStrands(w, h) {
        const exitProgress = (this.animationProgress - 0.9) / 0.1;
        
        if (this.helixPoints.left.length > 0 && this.helixPoints.right.length > 0) {
          // Calculate exit paths
          const leftExit = this.generateExitPath('left', exitProgress, w, h);
          const rightExit = this.generateExitPath('right', exitProgress, w, h);
          
          this.drawSmoothLine(leftExit, '#3b82f6', 5, 1 - exitProgress);
          this.drawSmoothLine(rightExit, '#8b5cf6', 5, 1 - exitProgress);
        }
      }

      // Generate exit path from center to top corners
      generateExitPath(side, progress, w, h) {
        const points = [];
        const startX = this.centerX;
        const startY = this.centerY;
        const endX = side === 'left' ? 50 : w - 50;
        const endY = 50;
        
        const steps = Math.floor(100 * progress);
        
        for (let i = 0; i <= steps; i++) {
          const t = i / 100;
          const x = startX + (endX - startX) * t;
          const y = startY + (endY - startY) * t;
          
          // Add slight wave motion
          const wave = Math.sin(t * 6 * Math.PI) * 15 * (1 - t);
          const perpX = side === 'left' ? -wave : wave;
          
          points.push({ x: x + perpX, y });
        }
        
        return points;
      }


      debounce(fn, ms) {
        let t; 
        return (...args) => { 
          clearTimeout(t); 
          t = setTimeout(() => fn(...args), ms); 
        };
      }

      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
        if (this.debouncedResize) {
          window.removeEventListener('resize', this.debouncedResize);
        }
      }
    }

    const animation = new BioLoaderAnimation(canvasRef.current);
    animationRef.current = animation;

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full h-full">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          aria-hidden="true"
        />
        <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none">
          <div className="inline-flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-gray-300 text-sm font-medium tracking-wider animate-pulse">
              {message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioLoader;
