/* custom cursor */
const addElement = () => {
  const newRing = document.createElement("div");
  newRing.classList.add("ring");
  document.body.appendChild(newRing);
};
if (!window.matchMedia("(pointer: coarse)").matches) {
  for (let i = 0; i <= 6; i++) {
    addElement();
  }
}
const ring = document.querySelectorAll(".ring");
const link = document.querySelectorAll("a");

window.onload = () => {
  /* custom cursor */
  window.addEventListener("mousemove", (event) => {
    const [x, y] = [event.pageX, event.pageY];
    gsap.to(ring, {
      top: y,
      left: x,
      delay: 0.001,
      ease: "Power3.inOut",
      stagger: 0.05,
    });
  });
  link.forEach((a) =>
    a.addEventListener("mouseenter", (event) => {
      gsap.to(ring, {
        scale: 4,
      });
    })
  );
  link.forEach((a) =>
    a.addEventListener("mouseleave", (event) => {
      gsap.to(ring, {
        scale: 1,
      });
    })
  );

  /* h1s */
  const h1stext = new Letterize({
    targets: ".projectContainer>div h1 strong",
  }).list;

  let animationh1 = [];
  animationh1[0] = anime.timeline({
    loop: false,
    duration: 1000,
  });
  animationh1[1] = anime.timeline({
    loop: false,
    duration: 1000,
  });

  h1stext.forEach((word, wordIndex) => {
    word.forEach((alphabet, index) => {
      animationh1[wordIndex].add(
        {
          targets: alphabet,
          top: 0,
          delay: 100 * index,
          easing: "easeInOutExpo",
          autoplay: false,
          direction: "normal",
        },
        0
      );
    });
  });

  /* logo */
  const text = new Letterize({
    targets: ".logo span",
  }).list;

  let animation = anime.timeline({
    loop: false,
    duration: 800,
  });

  text.forEach((word, index) => {
    word.forEach((alphabet, index) => {
      if (index !== 0) {
        animation.add(
          {
            targets: alphabet,
            translateX: `${-0.9 * index}ch`,
            opacity: 0,
            easing: "easeInOutExpo",
          },
          100
        );
      }
    });
    if (index !== 0) {
      animation.add({
        targets: word,
        translateX: `${-0.8 * word.length}ch`,
      });
    }
  });
  document.querySelector(".logo").addEventListener("mouseenter", () => {
    animation.reverse();
    animation.play();
  });

  document.querySelector(".logo").addEventListener("mouseleave", () => {
    animation.reverse();
    animation.play();
  });

  /* intersection observers */
  const detailsBullet = document.querySelectorAll(".detailContainer li");
  let options = {
    rootMargin: "-100px 100px -100px 100px",
    threshold: 0.6,
  };
  let observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList = "liIn";
      } else {
        entry.target.classList = "liOut";
      }
    });
  };
  let observer = new IntersectionObserver(observerCallback, options);

  const h1s = document.querySelectorAll(".projectContainer h1");
  let options2 = {
    rootMargin: "0px 0px 0px 50px",
    threshold: 0.7,
  };
  let observerCallback2 = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animationh1[entry.target.id].reverse();
        animationh1[entry.target.id].restart();
      } else {
        animationh1[entry.target.id].reverse();
        animationh1[entry.target.id].play();
      }
    });
  };
  let observer2 = new IntersectionObserver(observerCallback2, options2);
  /* intersection observer */
  detailsBullet.forEach((li) => observer.observe(li));
  h1s.forEach((h1) => observer2.observe(h1));
};

/*--------------------
Lenis
---------------------*/
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: "vertical", // vertical, horizontal
  gestureDirection: "vertical", // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

//get scroll value
lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }) => {
  //console.log({ scroll, limit, velocity, direction, progress });
  document.documentElement.style.setProperty("--progress", progress);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

/*--------------------
3d object
--------------------*/
//console.clear();
const canvas = document.querySelector(".scene");
let width = canvas.offsetWidth,
  height = canvas.offsetHeight;
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
const scene = new THREE.Scene();

const setup = () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0xebebeb, 0);

  scene.fog = new THREE.Fog(0x000000, 10, 950);

  const aspectRatio = width / height;
  const fieldOfView = 100;
  const nearPlane = 0.1;
  const farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = -80;
  camera.position.y = 0;
  camera.position.z = 300;
};
setup();

/*--------------------
Lights
--------------------*/
let hemispshereLight, shadowLight, light2;
const createLights = () => {
  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);

  light1 = new THREE.DirectionalLight(0xffffff, 0.4);
  light1.position.set(0, 450, 350);

  light2 = new THREE.DirectionalLight(0xfff150, 0.25);
  light2.position.set(-600, 350, 350);

  light3 = new THREE.DirectionalLight(0xfff150, 0.15);
  light3.position.set(0, -250, 300);

  scene.add(hemisphereLight);
  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
};
createLights();

/*--------------------
Bubble
--------------------*/
const bubbleGeometry = new THREE.IcosahedronGeometry(100, 2);
let bubble;
const createBubble = () => {
  for (let i = 0; i < bubbleGeometry.vertices.length; i++) {
    let vector = bubbleGeometry.vertices[i];
    vector.original = vector.clone();
  }
  const bubbleMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xbd4be3,
    emissiveIntensity: 0.5,
    roughness: 0.21,
    metalness: 0.21,
    side: THREE.FrontSide,
    wireframe: true,
  });
  bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
  bubble.castShadow = false;
  bubble.receiveShadow = false;
  scene.add(bubble);
};
createBubble();

/*--------------------
Map
--------------------*/
const map = (num, in_min, in_max, out_min, out_max) => {
  return (
    5 * (((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min)
  );
};

/*--------------------
Distance
--------------------*/
const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  return d;
};

/*--------------------
Mouse
--------------------*/
let mouse = new THREE.Vector2(0, 0);
const onMouseMove = (e) => {
  TweenMax.to(mouse, 0.8, {
    x: e.clientX || e.pageX || e.touches[0].pageX || 0,
    y: e.clientY || e.pageY || e.touches[0].pageY || 0,
    ease: Power2.easeOut,
  });
};
["mousemove", "touchmove"].forEach((event) => {
  window.addEventListener(event, onMouseMove);
});

/*--------------------
Resize
--------------------*/
const onResize = () => {
  canvas.style.width = "";
  canvas.style.height = "";
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  maxDist = distance(mouse, { x: width / 2, y: height / 2 });
  renderer.setSize(width, height);
};
let resizeTm;
window.addEventListener("resize", function () {
  resizeTm = clearTimeout(resizeTm);
  resizeTm = setTimeout(onResize, 200);
});

/*--------------------
Noise
--------------------*/
let dist = new THREE.Vector2(0, 0);
let maxDist = distance(mouse, { x: width / 2.5, y: height / 2.5 });
const updateVertices = (time) => {
  dist = distance(mouse, { x: width / 2, y: height / 2 });
  dist /= maxDist;
  dist = map(dist, 1, 0.25, 0.25, 1);
  for (let i = 0; i < bubbleGeometry.vertices.length; i++) {
    let vector = bubbleGeometry.vertices[i];
    vector.copy(vector.original);
    let perlin = noise.simplex3(
      vector.x * 0.006 + time * 0.0005,
      vector.y * 0.006 + time * 0.0005,
      vector.z * 0.006
    );
    let ratio = perlin * 0.3 * (dist + 0.1) + 0.8;
    vector.multiplyScalar(ratio);
  }
  bubbleGeometry.verticesNeedUpdate = true;
};

/*--------------------
Animate
--------------------*/
const render = (a) => {
  requestAnimationFrame(render);
  bubble.rotation.y = -4 + map(mouse.x, 0, width, 0, 4);
  bubble.rotation.z = 4 + map(mouse.y, 0, height, 0, -4);
  updateVertices(a);
  renderer.clear();
  renderer.render(scene, camera);
};
requestAnimationFrame(render);
renderer.render(scene, camera);
