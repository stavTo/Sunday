import React, { useEffect, useRef } from 'react';

export function CanvasLoadingAnimation() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const circles = []

        const colors = ['#FF3F8E', '#04C2C9', '#2E55C1']

        function Circle(x, y, radius, color, dx, dy) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.dx = dx
            this.dy = dy

            this.draw = function () {
                context.beginPath()
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
                context.fillStyle = this.color
                context.fill()
                context.closePath()
            };

            this.update = function () {
                if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                    this.dx = -this.dx
                }

                if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                    this.dy = -this.dy
                }

                this.x += this.dx
                this.y += this.dy

                this.draw()
            };
        }

        function animate() {
            requestAnimationFrame(animate);
            context.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < circles.length; i++) {
                circles[i].update()
            }
        }

        function init() {
            circles.length = 0;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            for (let i = 0; i < 50; i++) {
                const radius = Math.random() * 10 + 1;
                const x = Math.random() * (canvas.width - radius * 2) + radius;
                const y = Math.random() * (canvas.height - radius * 2) + radius;
                const dx = (Math.random() - 0.5) * 2;
                const dy = (Math.random() - 0.5) * 2;
                const color = colors[Math.floor(Math.random() * colors.length)];

                circles.push(new Circle(x, y, radius, color, dx, dy));
            }
        }

        init()
        animate()

        window.addEventListener('resize', () => {
            init()
        })

        return () => {
            window.removeEventListener('resize', () => {
                init()
            })
        }
    }, [])

    return <canvas height={200} width={200} ref={canvasRef} id="canvas"></canvas>;
}