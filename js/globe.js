(function () {
  const globeEl = document.getElementById('global-globe');
  if (!globeEl) return;

  const fallbackEl = document.getElementById('global-map');
  const countEl = document.getElementById('global-projects-count');

  const PROJECTS = [
    { country: 'New Zealand', lat: -41.0, lon: 174.0, company: 'Alstef' },
    { country: 'Australia', lat: -25.27, lon: 133.77, company: 'Alstef' },
    { country: 'Mexico', lat: 23.6345, lon: -102.5528, company: 'Alstef' },
    { country: 'Switzerland', lat: 46.8182, lon: 8.2275, company: 'Alstef' },
    { country: 'Croatia', lat: 45.1, lon: 15.2, company: 'Alstef' },
    { country: 'France', lat: 46.2276, lon: 2.2137, company: 'Alstef' },
    { country: 'China', lat: 35.8617, lon: 104.1954, company: 'Forvia' },
    { country: 'Germany', lat: 51.1657, lon: 10.4515, company: 'Forvia' },
    { country: 'Italy', lat: 41.8719, lon: 12.5674, company: 'Poclain Hydraulics' },
    { country: 'Slovenia', lat: 46.1512, lon: 14.9955, company: 'Poclain Hydraulics' }
  ];

  const COMPANY_COLORS = {
    Alstef: '#00D1B2',
    Forvia: '#4C7EFF',
    'Poclain Hydraulics': '#FF7A59'
  };

  const tooltip = createTooltip();
  let resumeRotateTimeout;

  if (countEl) {
    const unique = new Set(PROJECTS.map(project => project.country));
    countEl.textContent = unique.size;
  }

  if (window.Globe && supportsWebGL()) {
    initGlobe();
  } else {
    initFallbackMap();
  }

  function supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!window.WebGLRenderingContext && !!canvas.getContext('webgl');
    } catch (err) {
      return false;
    }
  }

  function initGlobe() {
    const dataset = PROJECTS.map(project => ({ ...project, color: COMPANY_COLORS[project.company] }));

    const globe = window.Globe({ rendererConfig: { alpha: true, antialias: true } })(globeEl)
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor('#0d1c3d')
      .atmosphereAltitude(0.25)
      .pointAltitude(() => 0.02)
      .pointRadius(() => 0.9)
      .pointColor(d => d.color)
      .pointLabel(d => `${d.country} • ${d.company}`)
      .pointsData(dataset)
      .ringsData([])
      .ringColor(d => d.color)
      .ringAltitude(() => 0.01)
      .ringMaxRadius(() => 3)
      .ringPropagationSpeed(() => 2)
      .ringRepeatPeriod(() => 1200);

    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const controls = globe.controls();
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    globe.pointOfView({ lat: 28, lng: 5, altitude: 2.2 }, 0);

    controls.addEventListener('start', () => {
      controls.autoRotate = false;
      clearTimeout(resumeRotateTimeout);
    });

    controls.addEventListener('end', () => {
      clearTimeout(resumeRotateTimeout);
      resumeRotateTimeout = setTimeout(() => {
        controls.autoRotate = true;
      }, 1400);
    });

    globe.onPointHover(point => {
      if (!point) {
        hideTooltip();
        globe.ringsData([]);
        return;
      }
      showTooltip(`${point.country} • ${point.company}`);
      globe.ringsData([point]);
    });

    document.addEventListener('pointermove', evt => {
      tooltip.dataset.x = evt.clientX;
      tooltip.dataset.y = evt.clientY;
      positionTooltip();
    });
  }

  function initFallbackMap() {
    globeEl.style.display = 'none';
    fallbackEl.classList.add('active');

    if (!window.L) return;

    const map = L.map('global-map', {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true
    }).setView([25, 5], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 5,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    PROJECTS.forEach(project => {
      L.circleMarker([project.lat, project.lon], {
        radius: 6,
        color: COMPANY_COLORS[project.company],
        fillColor: COMPANY_COLORS[project.company],
        fillOpacity: 0.9,
        weight: 2
      }).addTo(map).bindPopup(`<strong>${project.country}</strong><br>${project.company}`);
    });
  }

  function createTooltip() {
    const node = document.createElement('div');
    node.className = 'globe-tooltip';
    document.body.appendChild(node);
    return node;
  }

  function showTooltip(content) {
    tooltip.textContent = content;
    tooltip.style.opacity = 1;
    positionTooltip();
  }

  function hideTooltip() {
    tooltip.style.opacity = 0;
  }

  function positionTooltip() {
    if (tooltip.style.opacity === '0') return;
    const x = Number(tooltip.dataset.x || window.innerWidth / 2);
    const y = Number(tooltip.dataset.y || window.innerHeight / 2);
    tooltip.style.left = `${x + 14}px`;
    tooltip.style.top = `${y + 18}px`;
  }
})();
