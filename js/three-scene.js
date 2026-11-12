(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  var GOLD = 0xd4a24e;
  var CREAM = 0xf3e9d8;
  var COFFEE = 0x2a1a0e;

  function makeCup() {
    var cup = new THREE.Group();

    var bodyMat = new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.32, metalness: 0.08 });
    var goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.25, metalness: 0.85 });
    var coffeeMat = new THREE.MeshStandardMaterial({ color: COFFEE, roughness: 0.15, metalness: 0.1 });

    var profile = [];
    profile.push(new THREE.Vector2(0.01, -1.1));
    profile.push(new THREE.Vector2(0.62, -1.1));
    profile.push(new THREE.Vector2(0.72, -0.9));
    profile.push(new THREE.Vector2(0.82, 0.1));
    profile.push(new THREE.Vector2(1.05, 0.92));
    profile.push(new THREE.Vector2(1.08, 1.0));
    profile.push(new THREE.Vector2(1.0, 1.02));
    profile.push(new THREE.Vector2(0.78, 0.12));
    profile.push(new THREE.Vector2(0.7, -0.95));
    var body = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), bodyMat);
    cup.add(body);

    var surface = new THREE.Mesh(new THREE.CircleGeometry(0.78, 48), coffeeMat);
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = 0.86;
    cup.add(surface);

    var crema = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.78, 48),
      new THREE.MeshBasicMaterial({ color: 0x8a5a2b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    crema.rotation.x = -Math.PI / 2;
    crema.position.y = 0.865;
    cup.add(crema);

    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.1, 20, 40, Math.PI * 1.15), goldMat);
    handle.position.set(1.02, 0.05, 0);
    handle.rotation.z = Math.PI * 0.42;
    cup.add(handle);

    var rim = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.035, 16, 72), goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.0;
    cup.add(rim);

    var saucerProfile = [
      new THREE.Vector2(0.25, 0),
      new THREE.Vector2(1.3, 0.02),
      new THREE.Vector2(1.85, 0.22),
      new THREE.Vector2(1.88, 0.3),
      new THREE.Vector2(1.3, 0.14),
      new THREE.Vector2(0.3, 0.1)
    ];
    var saucer = new THREE.Mesh(new THREE.LatheGeometry(saucerProfile, 64), bodyMat);
    saucer.position.y = -1.14;
    cup.add(saucer);

    var saucerRim = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.03, 14, 72), goldMat);
    saucerRim.rotation.x = Math.PI / 2;
    saucerRim.position.y = -0.84;
    cup.add(saucerRim);

    return cup;
  }

  function makeBeans(count) {
    var group = new THREE.Group();
    var beanMat = new THREE.MeshStandardMaterial({ color: 0x4a2c17, roughness: 0.55, metalness: 0.15 });
    for (var i = 0; i < count; i++) {
      var bean = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), beanMat);
      bean.scale.set(1, 0.62, 0.78);
      bean.position.set(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5 - 1
      );
      bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      bean.userData = {
        speed: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        baseY: bean.position.y
      };
      group.add(bean);
    }
    return group;
  }

  function makeSteam() {
    var group = new THREE.Group();
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext('2d');
    var grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(243,233,216,0.55)');
    grad.addColorStop(1, 'rgba(243,233,216,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    var tex = new THREE.CanvasTexture(canvas);

    for (var i = 0; i < 26; i++) {
      var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex, transparent: true, opacity: 0, depthWrite: false
      }));
      sprite.userData = {
        life: Math.random(),
        speed: 0.0035 + Math.random() * 0.004,
        x: (Math.random() - 0.5) * 0.7,
        z: (Math.random() - 0.5) * 0.7
      };
      sprite.scale.setScalar(0.6 + Math.random() * 0.5);
      group.add(sprite);
    }
    return group;
  }

  function createScene(canvas, opts) {
    opts = opts || {};
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.6, 8.5);

    var world = new THREE.Group();
    scene.add(world);

    var cup = makeCup();
    cup.scale.setScalar(opts.cupScale || 1);
    world.add(cup);

    var beans = makeBeans(opts.beans || 0);
    world.add(beans);

    var steam = makeSteam();
    steam.position.y = 1.0;
    cup.add(steam);

    scene.add(new THREE.AmbientLight(0xfff2dd, 0.55));
    var key = new THREE.DirectionalLight(0xffe0b0, 1.15);
    key.position.set(4, 6, 5);
    scene.add(key);
    var rim = new THREE.DirectionalLight(0xd4a24e, 0.7);
    rim.position.set(-5, 2, -4);
    scene.add(rim);
    var glow = new THREE.PointLight(0xd4a24e, 1.1, 18);
    glow.position.set(0, 3.4, 2.4);
    scene.add(glow);

    var targetRotY = 0, targetRotX = 0, rotY = 0, rotX = 0;
    var targetDist = camera.position.z, dist = targetDist;
    var dragging = false, lastX = 0, lastY = 0;
    var interactive = opts.interactive !== false;

    function onDown(x, y) { dragging = true; lastX = x; lastY = y; }
    function onMove(x, y) {
      if (!dragging) return;
      targetRotY += (x - lastX) * 0.008;
      targetRotX += (y - lastY) * 0.005;
      targetRotX = Math.max(-0.7, Math.min(0.7, targetRotX));
      lastX = x; lastY = y;
    }
    function onUp() { dragging = false; }

    if (interactive) {
      canvas.addEventListener('pointerdown', function (e) { onDown(e.clientX, e.clientY); });
      window.addEventListener('pointermove', function (e) { onMove(e.clientX, e.clientY); });
      window.addEventListener('pointerup', onUp);
      canvas.addEventListener('wheel', function (e) {
        e.preventDefault();
        targetDist = Math.max(5, Math.min(13, targetDist + e.deltaY * 0.006));
      }, { passive: false });
    } else {
      window.addEventListener('mousemove', function (e) {
        var nx = (e.clientX / window.innerWidth) * 2 - 1;
        var ny = (e.clientY / window.innerHeight) * 2 - 1;
        targetRotY = nx * 0.45;
        targetRotX = ny * 0.22;
      });
    }

    function resize() {
      var w = canvas.clientWidth || canvas.parentElement.clientWidth;
      var h = canvas.clientHeight || canvas.parentElement.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      if (!dragging && interactive) targetRotY += 0.0022;
      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      world.rotation.y = rotY;
      world.rotation.x = rotX;

      dist += (targetDist - dist) * 0.08;
      camera.position.z = dist;
      camera.position.y = 1.6 + Math.sin(t * 0.6) * 0.12;
      camera.lookAt(0, 0.2, 0);

      cup.position.y = Math.sin(t * 1.1) * 0.14;

      beans.children.forEach(function (bean, i) {
        var u = bean.userData;
        bean.position.y = u.baseY + Math.sin(t * u.speed + u.phase) * 0.7;
        bean.rotation.x += 0.004 * u.speed;
        bean.rotation.y += 0.006 * u.speed;
      });

      steam.children.forEach(function (s) {
        var u = s.userData;
        u.life += u.speed;
        if (u.life > 1) { u.life = 0; }
        s.position.set(
          u.x + Math.sin(u.life * 9) * 0.22,
          u.life * 2.6,
          u.z
        );
        s.material.opacity = Math.sin(u.life * Math.PI) * 0.5;
      });

      renderer.render(scene, camera);
    }
    animate();
  }

  function boot() {
    var heroCanvas = document.getElementById('heroCanvas');
    var labCanvas = document.getElementById('labCanvas');
    if (heroCanvas) createScene(heroCanvas, { cupScale: 0.62, beans: 16, interactive: false });
    if (labCanvas) createScene(labCanvas, { cupScale: 1.15, beans: 10, interactive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
