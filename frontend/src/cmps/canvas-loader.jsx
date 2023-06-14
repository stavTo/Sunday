import { useEffect } from "react";

export function CanvasLoader() {

    let width, height, loopId, id, canvas, ctx, particles;

    let options = {
        particleColor: "rgb(209, 213, 229)",
        lineColor: "rgb(60, 47, 100)",
        particleAmount: 70,
        defaultRadius: 2,
        letiantRadius: 2,
        defaultSpeed: 6,
        letiantSpeed: 1,
        linkRadius: 300
    };

    let rgb = options.lineColor.match(/\d+/g);

    // document.addEventListener("DOMContentLoaded", init);

    useEffect(() => {
        init()
    }, [])

    function init() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        resizeReset();
        initializeElements();
        startAnimation();
    }

    class Particle {
        constructor() {
            // let _this = this;

            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.color = options.particleColor;
            this.radius = options.defaultRadius + Math.random() * options.letiantRadius;
            this.speed = options.defaultSpeed + Math.random() * options.letiantSpeed;
            this.directionAngle = Math.floor(Math.random() * 360);
            this.vector = {
                x: Math.cos(this.directionAngle) * this.speed,
                y: Math.sin(this.directionAngle) * this.speed
            };

            this.update = function () {
                this.border();
                this.x += this.vector.x;
                this.y += this.vector.y;
            };

            this.border = function () {
                if (this.x >= width || this.x <= 0) {
                    this.vector.x *= -1;
                }
                if (this.y >= height || this.y <= 0) {
                    this.vector.y *= -1;
                }
                if (this.x > width) this.x = width;
                if (this.y > height) this.y = height;
                if (this.x < 0) this.x = 0;
                if (this.y < 0) this.y = 0;
            };

            this.draw = function () {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
            };
        }
    }

    function resizeReset() {
        width = canvas.width = window.innerHeight;
        height = canvas.height = window.innerHeight;
    }

    function initializeElements() {
        particles = [];
        for (let i = 0; i < options.particleAmount; i++) {
            particles.push(new Particle());
        }
    }

    function startAnimation() {
        loopId = requestAnimationFrame(animationLoop);
    }

    function animationLoop() {
        ctx.clearRect(0, 0, width, height);
        drawScene();

        id = requestAnimationFrame(animationLoop);
    }

    function drawScene() {
        drawLine()
        drawParticle()
    }

    function drawParticle() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update()
            particles[i].draw()
        }
    }

    function drawLine() {
        for (let i = 0; i < particles.length; i++) {
            linkPoints(particles[i], particles)
        }
    }

    function linkPoints(point, hubs) {
        for (let i = 0; i < hubs.length; i++) {
            let distance = checkDistance(point.x, point.y, hubs[i].x, hubs[i].y)
            let opacity = 1 - distance / options.linkRadius
            if (opacity > 0) {
                ctx.lineWidth = 0.5
                ctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')';
                ctx.beginPath()
                ctx.moveTo(point.x, point.y)
                ctx.lineTo(hubs[i].x, hubs[i].y)
                ctx.closePath()
                ctx.stroke()
            }
        }
    }

    function checkDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    return (
        <div className="canvas-container">
            <canvas id="canvas" height="1000" width="1000"></canvas>
        </div>
    )
}