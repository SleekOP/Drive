// Load the 3D enhancement in the background; the game starts immediately in 2D.
(() => {
  const three = document.createElement('script');
  three.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
  three.crossOrigin = 'anonymous';
  three.async = true;
  three.onload = () => {
    const scene = document.createElement('script');
    scene.src = 'racing3d.js';
    scene.async = true;
    document.body.appendChild(scene);
  };
  document.head.appendChild(three);
})();
