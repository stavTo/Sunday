import Particles from 'react-particles'
import { useCallback } from 'react'
import { loadFull } from 'tsparticles'

export function ParticleContainer() {
  const particleOptions = {
    "background": {
      "color": {
        "value": "transparent"
      }
    },
    "particles": {
      "number": {
        "value": 150
      },
      "shape": {
        "type": "circle",
      },
      "opacity": {
        "value": 0.8,
        "random": true, // Set to false in our case 
        "anim": {
          "enable": true,
          "speed": 4,
          "opacity_min": 0.4,
          "sync": false
        }
      },
      "size": {
        "value": 3
      },
      "line_linked": {
        "enable": true,
        "distance": 120,
        "color": "#96f8ff",
        "opacity": 0.6,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "random",
        "random": true,
        "straight": false,
        "outModes": {
          "default": "out"
        },
        "bounce": false,
        "attract": {
          "enable": true,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detectsOn": "canvas",
      "events": {
        "onHover": {
          "enable": true,
          "mode": "repulse"
        }
      }
    },
    "fn": {
      "particlesUpdate": function (particles) {
        particles.forEach(function (particle) {
          if (Math.random() < 0.5) {
            particle.rotate += 180 * (Math.PI / 180);
          }
        });
      }
    }
  }


  const particlesInit = useCallback(async engine => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine)
  }, []);

  const particlesLoaded = useCallback(async container => {
    // await console.log(container)
  }, [])

  return (
    <Particles
      id="ai-particles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particleOptions} />
  )
}
