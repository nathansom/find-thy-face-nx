import { IParticlesProps } from "@tsparticles/react";

export const particlesOptions: IParticlesProps["options"] = {
  background: {
    color: {
      value: '#000000',
    },
    opacity: 0,
  },
  fullScreen: {
    zIndex: -1,
  },
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'repulse',
      },
    },
  },
  particles: {
    color: {
      value: '#ffffff',
      animation: {
        h: {
          enable: true,
          speed: 20,
        },
      },
    },
    links: {
      color: {
        value: '#ffffff',
      },
      enable: true,
      opacity: 0.4,
    },
    move: {
      enable: true,
      gravity: {
        maxSpeed: 5,
      },
      path: {},
      outModes: {
        bottom: 'out',
        left: 'out',
        right: 'out',
        top: 'out',
        default: "out",
      },
      speed: 1,
      spin: {},
    },
    number: {
      density: {
        enable: true,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
      animation: {},
    },
    orbit: {
      animation: {
        speed: 0.5,
      },
    },
    size: {
      value: {
        min: 0.1,
        max: 2,
      },
      animation: {
        speed: 1,
      },
    },
  },
};

export default particlesOptions;
