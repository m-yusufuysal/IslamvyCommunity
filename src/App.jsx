import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ZoomIn, ZoomOut, Move, Layers, Maximize, MousePointer2, Cpu, BookOpen, Home, Droplets, Sun, PenTool, Radio, Globe } from 'lucide-react';

// --- DATA: 2026 VISION ZONES & ARCHITECTURAL ANALYSIS ---
const projectData = {
  project_name: "NÛR & DÂHİ KÜLLİYESİ",
  subtitle: "Hafızlık ve Yapay Zeka Merkezi",
  location: "Bolu, Tokad-ı Hayreddin Ekosistemi",
  scale: "1:500",
  architect: "Nöral Mimari AI + Usta",
  zones: [
    {
      id: "A",
      name: "Manevi Çekirdek (Nöro-Mescid)",
      icon: <BookOpen size={20} />,
      color: "#4fc3f7",
      short_desc: "Holografik kubbe, sükût ve derin hafızlık odaklanması.",
      analysis: [
        { title: "Kuantum Akustik Kubbe", text: "Osmanlı ahşap kubbe mimarisinin akıllı cam ile inşası. 3D formda yükselen silindirik gövde, siber-hat sanatıyla bezenmiştir." },
        { title: "Nöro-Odaklanma Rahleleri", text: "Geleneksel ahşap rahleler, bio-geribildirim sistemleriyle donatılmıştır. Talebenin odaklanma ve yorgunluk seviyesine göre kubbedeki ışık süzmelerini ayarlar." },
        { title: "Holografik Minare", text: "Ormanın dokusunu kesinlikle bozmayan, sadece ezan vakitlerinde semaya uzanan lüminesans (ışık) bir minare izdüşümü." }
      ]
    },
    {
      id: "B",
      name: "Bilim ve AI Vadisi",
      icon: <Cpu size={20} />,
      color: "#ffca28",
      short_desc: "Siber-hat sanatı, algoritmik üretim ve robotik vadisi.",
      analysis: [
        { title: "Biyomimetik Laboratuvarlar", text: "Araziye bir ağaç kökü gibi tutunan, ormanın derinliklerine saygılı, yüksek teknoloji cam seralar." },
        { title: "Otonom Üretim Bantları", text: "Çocukların kodladığı modellemelerin, levitasyon robotik kollarıyla anında fiziksel prototiplere dönüştüğü atölyeler." },
        { title: "Holografik Girişimcilik", text: "Üretilen projelerin küresel sunumlarının yapıldığı, cam hacimli teknoloji küpleri." }
      ]
    },
    {
      id: "C",
      name: "Yaşam Alanı (Külliye)",
      icon: <Home size={20} />,
      color: "#81c784",
      short_desc: "Sıfır karbon yaşam, köy odası sıcaklığı ve dikey tarım.",
      analysis: [
        { title: "Kademeli Yeşil Bloklar", text: "3D modelde net bir şekilde görülen, birbirine ahşap eko-köprülerle bağlanan izometrik yatakhane modülleri. Yaş gruplarına göre ayrılmıştır." },
        { title: "Akıllı Köy Odaları", text: "Çocukların fıtratına uygun, duvarları interaktif organik ahşap olan, uyku ve sirkadiyen ritmi düzenleyen dinlenme alanları." },
        { title: "Aeroponik Yemekhane", text: "Dairesel cam atrium formunda yükselen yemekhanenin duvarları, topraksız (aeroponic) tarım üniteleridir." }
      ]
    },
    {
      id: "W",
      name: "Tefekkür Avlusu & Su",
      icon: <Droplets size={20} />,
      color: "#00bcd4",
      short_desc: "Külliyenin hayat damarı, enerji döngüsü ve dinlenme alanı.",
      analysis: [
        { title: "Ekolojik Su Yolları", text: "Binaların altından ve çevresinden süzülen yapay nehir. Vadinin topoğrafyasına uyum sağlayan su soğutma hattı." },
        { title: "Kinetik Şadırvan", text: "Avlunun merkezindeki Akşemseddin Şadırvanı, akan suyun kinetik enerjisini tüm kampüsün aydınlatmasına dönüştürür." },
        { title: "Tefekkür Adacıkları", text: "Suyun üzerine uzanan ahşap çalışma platformları. Kuantum hafızlığın en yoğun yaşandığı sükunet alanları." }
      ]
    }
  ]
};

// --- 3D HELPER COMPONENTS ---
const ExtrudedRect = ({ x, y, w, h, dx, dy, topFill, wallRightFill, wallBottomFill, is3D, rx = 0, ...props }) => {
  if (!is3D) return <rect x={x} y={y} width={w} height={h} rx={rx} fill={topFill} {...props} />;
  return (
    <g>
      {/* Right Wall */}
      <polygon points={`${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y + h + dy} ${x + w},${y + h}`} fill={wallRightFill} pointerEvents="none" />
      {/* Bottom Wall */}
      <polygon points={`${x},${y + h} ${x + dx},${y + h + dy} ${x + w + dx},${y + h + dy} ${x + w},${y + h}`} fill={wallBottomFill} pointerEvents="none" />
      {/* Top Roof */}
      <rect x={x + dx} y={y + dy} width={w} height={h} rx={rx} fill={topFill} {...props} />
    </g>
  );
};

const ExtrudedCircle = ({ cx, cy, r, dx, dy, topFill, wallFill, is3D, ...props }) => {
  if (!is3D) return <circle cx={cx} cy={cy} r={r} fill={topFill} {...props} />;
  return (
    <g>
      {/* Cylinder Wall / Extrusion */}
      <line x1={cx} y1={cy} x2={cx + dx} y2={cy + dy} stroke={wallFill} strokeWidth={r * 2} strokeLinecap="round" pointerEvents="none" />
      {/* Top Roof */}
      <circle cx={cx + dx} cy={cy + dy} r={r} fill={topFill} {...props} />
    </g>
  );
};

const ExtrudedPolygon = ({ points, dx, dy, topFill, wallFill, is3D, ...props }) => {
  if (!is3D) return <polygon points={points} fill={topFill} {...props} />;
  const layers = [];
  const steps = 15;
  for (let i = 0; i <= steps; i++) {
    const offsetX = (dx / steps) * i;
    const offsetY = (dy / steps) * i;
    layers.push(
      <polygon
        key={i}
        points={points}
        transform={`translate(${offsetX}, ${offsetY})`}
        fill={i === steps ? topFill : wallFill}
        pointerEvents={i === steps ? "all" : "none"}
        {...(i === steps ? props : {})}
      />
    );
  }
  return <g>{layers}</g>;
};

// --- MAIN COMPONENT ---
export default function App() {
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [viewMode, setViewMode] = useState('earth3d'); // 'blueprint', 'realistic', 'earth3d'
  const [visibleLayers, setVisibleLayers] = useState({ A: true, B: true, C: true, W: true, Grid: true });

  const containerRef = useRef(null);

  const isBP = viewMode === 'blueprint';
  const is3D = viewMode === 'earth3d';
  const isReal = viewMode === 'realistic' || viewMode === 'earth3d';

  // Advanced Forest Generation with Natural Clustering
  const forestTrees = useMemo(() => {
    const trees = [];
    const addCluster = (cx, cy, radius, count, baseSize) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        trees.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          r: baseSize + Math.random() * (baseSize * 0.5)
        });
      }
    };

    // Specific Dense Clusters representing Tokad-ı Hayreddin forest feel
    addCluster(150, 150, 200, 30, 40);
    addCluster(1200, 200, 250, 40, 45);
    addCluster(150, 950, 250, 35, 40);
    addCluster(1250, 850, 250, 45, 50);
    addCluster(700, 150, 100, 10, 35);
    addCluster(700, 1000, 150, 15, 40);

    // Random scattering
    for (let i = 0; i < 60; i++) {
      trees.push({
        x: Math.random() * 1600 - 100,
        y: Math.random() * 1200 - 100,
        r: 30 + Math.random() * 30
      });
    }

    // Filter overlapping the main complex footprint
    return trees.filter(t =>
      !(t.x > 300 && t.x < 1100 && t.y > 250 && t.y < 850) &&
      !(t.x > 150 && t.x < 300 && t.y > 600 && t.y < 850) &&
      !(t.x > 1100 && t.x < 1250 && t.y > 500 && t.y < 700)
    ).sort((a, b) => a.y - b.y);
  }, []);

  const handleMouseDown = (e) => {
    if (activeTool === 'pan' || e.button === 1 || is3D) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  const handleMouseMove = (e) => {
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.0015;
    const delta = -e.deltaY * zoomSensitivity;
    setScale(s => Math.min(Math.max(0.2, s + delta), 4));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [scale]);

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 4));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.2));
  const resetView = () => {
    setScale(is3D ? 0.8 : 0.7);
    setPan({ x: is3D ? 300 : Math.max(window.innerWidth / 2 - 700, 100), y: is3D ? -150 : 50 });
  };
  const toggleLayer = (layer) => setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));

  useEffect(() => {
    if (viewMode === 'earth3d') {
      setScale(0.85);
      setPan({ x: 350, y: -200 });
    } else {
      setScale(0.7);
      setPan({ x: Math.max(window.innerWidth / 2 - 600, 50), y: 50 });
    }
  }, [viewMode]);

  const renderEnvironment = () => {
    return (
      <g id="environment">
        {forestTrees.map((t, i) => (
          <g key={`tree-${i}`}>
            {isBP ? (
              <>
                <circle cx={t.x} cy={t.y} r={t.r} fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" strokeWidth="1.5" />
                <path d={`M ${t.x} ${t.y - t.r} L ${t.x} ${t.y + t.r} M ${t.x - t.r} ${t.y} L ${t.x + t.r} ${t.y}`} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              </>
            ) : is3D ? (
              <g>
                <circle cx={t.x + 15} cy={t.y + 25} r={t.r} fill="rgba(0,0,0,0.6)" filter="url(#shadowHeavy)" />
                <line x1={t.x} y1={t.y} x2={t.x - 15} y2={t.y - 45} stroke="#3e2723" strokeWidth="6" strokeLinecap="round" pointerEvents="none" />
                <circle cx={t.x - 5} cy={t.y - 15} r={t.r} fill="url(#treeGradient1)" />
                <circle cx={t.x - 10} cy={t.y - 30} r={t.r * 0.75} fill="url(#treeGradient2)" />
                <circle cx={t.x - 15} cy={t.y - 45} r={t.r * 0.4} fill="#66bb6a" />
              </g>
            ) : (
              <>
                <circle cx={t.x + 5} cy={t.y + 10} r={t.r} fill="rgba(0,0,0,0.4)" filter="url(#shadow)" />
                <circle cx={t.x} cy={t.y} r={t.r} fill="url(#treeGradient1)" />
                <circle cx={t.x} cy={t.y} r={t.r * 0.6} fill="url(#treeGradient2)" />
              </>
            )}
          </g>
        ))}
      </g>
    );
  };

  const renderWetlands = () => {
    if (!visibleLayers.W) return null;
    const streamPath = "M -50 350 C 250 400, 450 200, 700 450 C 800 600, 700 750, 900 850 C 1100 950, 1300 750, 1500 900";

    return (
      <g
        id="zone-w"
        onClick={() => setSelectedZone(projectData.zones.find(z => z.id === 'W'))}
        className="cursor-pointer transition-all duration-300"
        opacity={selectedZone && selectedZone.id !== 'W' ? (isBP ? 0.3 : 0.6) : 1}
      >
        {isBP ? (
          <>
            <path d={streamPath} fill="none" stroke="#00bcd4" strokeWidth="70" strokeOpacity="0.1" strokeLinecap="round" />
            <path d={streamPath} fill="none" stroke="#00e5ff" strokeWidth="2" strokeDasharray="10 8" />
            <circle cx="750" cy="620" r="45" fill="none" stroke="#00bcd4" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d={streamPath} fill="none" stroke="url(#waterGradient)" strokeWidth="90" strokeLinecap="round" filter="url(#waterRipple)" opacity="0.85" />
            <path d={streamPath} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="15" strokeLinecap="round" transform="translate(-10, -10)" filter="url(#blur-md)" />

            {[{ x: 450, y: 280 }, { x: 600, y: 380 }, { x: 950, y: 870 }, { x: 1200, y: 800 }].map((pos, i) => (
              <ExtrudedCircle key={i} cx={pos.x} cy={pos.y} r={18} dx={is3D ? -8 : 0} dy={is3D ? -12 : 0}
                topFill="#8d6e63" wallFill="#4e342e" is3D={is3D} filter="url(#shadow)"
              />
            ))}

            <g transform="translate(750, 620)">
              <circle cx="0" cy="0" r="55" fill="rgba(0,0,0,0.5)" filter="url(#shadow)" />
              <ExtrudedCircle cx={0} cy={0} r={50} dx={is3D ? -20 : 0} dy={is3D ? -30 : 0} topFill="url(#stoneGradient)" wallFill="#212121" is3D={is3D} />
              <circle cx={is3D ? -20 : 0} cy={is3D ? -30 : 0} r="38" fill="url(#waterGradient)" filter="url(#waterRipple)" />
              <circle cx={is3D ? -20 : 0} cy={is3D ? -30 : 0} r="12" fill="#00e5ff" filter="url(#glow-strong)" />
              {!isBP && <circle cx={is3D ? -20 : 0} cy={is3D ? -30 : 0} r="38" fill="none" stroke="#00e5ff" strokeWidth="2" opacity="0.5" filter="url(#glow-cyan)" />}
            </g>
          </>
        )}
      </g>
    );
  };

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-700 ${isBP ? 'bg-[#001424] text-slate-200' : 'bg-[#090a0f] text-slate-100'}`}>

      {/* LEFT SIDEBAR AESTHETICS */}
      <div className={`w-16 md:w-72 flex-shrink-0 flex flex-col z-30 shadow-[10px_0_40px_rgba(0,0,0,0.8)] transition-all duration-700 ${isBP ? 'bg-[#00101d] border-r border-cyan-900/40' : 'bg-[#12141a]/95 backdrop-blur-xl border-r border-slate-800'}`}>
        <div className="p-6 border-b border-inherit hidden md:flex items-center justify-between">
          <div>
            <h1 className={`font-bold tracking-widest text-[13px] flex items-center gap-2 ${isBP ? 'text-cyan-400' : 'text-[#d4af37]'}`}>
              <Globe size={18} className={!isBP ? "animate-pulse" : ""} /> NÛR & DÂHİ OS
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-mono">Masterplan AI v4.0</p>
          </div>
          {isBP && <div className="text-cyan-800"><PenTool size={20} /></div>}
        </div>

        <div className="p-4 border-b border-inherit flex flex-col gap-3">
          <span className="hidden md:block text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none mb-1">Görsel Motor</span>
          <div className="flex flex-col md:flex-row gap-1 bg-black/40 rounded-lg p-1.5 border border-white/5">
            <button onClick={() => setViewMode('blueprint')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-md text-[11px] font-bold tracking-wide transition-all ${viewMode === 'blueprint' ? 'bg-cyan-900/60 text-cyan-300 shadow-[inset_0_1px_4px_rgba(0,255,255,0.2)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
              <PenTool size={14} /> <span className="hidden md:inline">Ozalit</span>
            </button>
            <button onClick={() => setViewMode('realistic')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-md text-[11px] font-bold tracking-wide transition-all ${viewMode === 'realistic' ? 'bg-emerald-800/60 text-emerald-200 shadow-[inset_0_1px_4px_rgba(0,255,100,0.2)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
              <Sun size={14} /> <span className="hidden md:inline">2D Harita</span>
            </button>
            <button onClick={() => setViewMode('earth3d')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-md text-[11px] font-bold tracking-wide transition-all ${viewMode === 'earth3d' ? 'bg-blue-600/90 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
              <Globe size={14} /> <span className="hidden md:inline">3D Earth</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col p-3 border-b border-inherit">
          <div className="flex gap-1.5 mb-1.5">
            <button onClick={() => setActiveTool('select')} className={`flex-1 p-2.5 rounded-lg flex items-center justify-center transition-all ${activeTool === 'select' ? (isBP ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'bg-slate-700 text-white border border-slate-600') : 'hover:bg-white/5 text-slate-400 border border-transparent'}`}><MousePointer2 size={16} /></button>
            <button onClick={() => setActiveTool('pan')} className={`flex-1 p-2.5 rounded-lg flex items-center justify-center transition-all ${activeTool === 'pan' ? (isBP ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' : 'bg-slate-700 text-white border border-slate-600') : 'hover:bg-white/5 text-slate-400 border border-transparent'}`}><Move size={16} /></button>
          </div>
          <div className="flex gap-1.5">
            <button onClick={zoomIn} className="flex-1 p-2 rounded-lg bg-black/30 hover:bg-white/10 text-slate-400 flex justify-center transition-colors"><ZoomIn size={16} /></button>
            <button onClick={zoomOut} className="flex-1 p-2 rounded-lg bg-black/30 hover:bg-white/10 text-slate-400 flex justify-center transition-colors"><ZoomOut size={16} /></button>
            <button onClick={resetView} className="flex-1 p-2 rounded-lg bg-black/30 hover:bg-white/10 text-slate-400 flex justify-center transition-colors"><Maximize size={16} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center gap-2 mb-5 text-slate-500">
            <Layers size={14} />
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">Katman Kontrolü</span>
          </div>
          <div className="space-y-2">
            {Object.keys(visibleLayers).map(layer => {
              const zoneInfo = projectData.zones.find(z => z.id === layer);
              const name = layer === 'Grid' ? 'Holografik Izgara' : zoneInfo?.name;
              const accent = zoneInfo ? zoneInfo.color : '#ffffff';

              return (
                <label key={layer} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all duration-300 border ${visibleLayers[layer] ? (isBP ? 'bg-cyan-900/10 border-cyan-900/30' : 'bg-white/5 border-white/10') : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${visibleLayers[layer] ? 'bg-opacity-20 border-opacity-50 shadow-sm' : 'bg-black/50 border-slate-600/50'}`} style={{ backgroundColor: visibleLayers[layer] ? accent : 'transparent', borderColor: visibleLayers[layer] ? accent : '' }}>
                    {visibleLayers[layer] && <div className="w-2 h-2 rounded-sm shadow-[0_0_5px_currentColor]" style={{ backgroundColor: accent, color: accent }}></div>}
                  </div>
                  <input type="checkbox" checked={visibleLayers[layer]} onChange={() => toggleLayer(layer)} className="hidden" />
                  <span className={`hidden md:inline text-[12px] font-medium transition-colors truncate ${visibleLayers[layer] ? 'text-slate-200' : 'text-slate-500'}`}>{name}</span>
                  <span className="md:hidden text-[11px] font-bold" style={{ color: accent }}>{layer}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* CENTER INTERACTIVE CANVAS */}
      <div
        className={`flex-1 relative overflow-hidden transition-colors duration-1000 ${isBP ? 'bg-[#001e36]' : 'bg-[#181f21]'}`}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: activeTool === 'pan' || isDragging || is3D ? 'grab' : 'crosshair' }}
      >
        {isBP && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 100%)' }}></div>
        )}
        {!isBP && (
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-80"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1e2b20 0%, #080a08 100%)' }}></div>
        )}

        <div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            perspective: '2500px',
            transformStyle: 'preserve-3d',
            width: '2800px', height: '2000px'
          }}
        >
          <div
            className="w-full h-full origin-center"
            style={{
              transform: is3D ? 'rotateX(55deg) rotateZ(-30deg)' : 'rotateX(0deg) rotateZ(0deg)',
              transition: 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transformStyle: 'preserve-3d'
            }}
          >
            <svg width="100%" height="100%" className="pointer-events-auto" style={{ overflow: 'visible' }}>
              <defs>
                {/* Patterns */}
                {isBP ? (
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  </pattern>
                ) : (
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                  </pattern>
                )}

                <pattern id="terrainTex" width="400" height="400" patternUnits="userSpaceOnUse">
                  <rect width="400" height="400" fill="#111813" />
                  <path d="M0 200 Q 100 100, 200 200 T 400 200 M0 100 Q 100 0, 200 100 T 400 100" fill="none" stroke="#172219" strokeWidth="80" opacity="0.6" />
                  <circle cx="250" cy="150" r="80" fill="#0d140e" />
                  <circle cx="80" cy="300" r="120" fill="#0c120c" />
                </pattern>

                {/* Filters */}
                <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx={is3D ? "15" : "10"} dy={is3D ? "20" : "15"} stdDeviation={is3D ? "15" : "10"} floodColor="#000" floodOpacity={is3D ? "0.7" : "0.5"} />
                </filter>
                <filter id="shadowHeavy" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx={is3D ? "25" : "15"} dy={is3D ? "35" : "20"} stdDeviation={is3D ? "20" : "12"} floodColor="#000" floodOpacity="0.8" />
                </filter>
                <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="15" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
                <filter id="glow-strong"><feGaussianBlur stdDeviation="20" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
                <filter id="glow-gold"><feGaussianBlur stdDeviation="12" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
                <filter id="waterRipple"><feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" /><feGaussianBlur stdDeviation="2" /></filter>
                <filter id="blur-md"><feGaussianBlur stdDeviation="6" /></filter>

                {/* Gradients */}
                <radialGradient id="treeGradient1" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#43a047" /><stop offset="100%" stopColor="#1b5e20" /></radialGradient>
                <radialGradient id="treeGradient2" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#4caf50" /><stop offset="100%" stopColor="#153b17" /></radialGradient>

                <radialGradient id="domeRealistic" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#b2ebf2" stopOpacity="0.95" /><stop offset="60%" stopColor="#00acc1" stopOpacity="0.9" /><stop offset="100%" stopColor="#004d40" stopOpacity="0.95" /></radialGradient>
                <radialGradient id="domeInnerGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffca28" stopOpacity="0.85" /><stop offset="50%" stopColor="#ff8f00" stopOpacity="0.4" /><stop offset="100%" stopColor="#d84315" stopOpacity="0" /></radialGradient>

                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#004d40" /><stop offset="40%" stopColor="#0097a7" /><stop offset="100%" stopColor="#00251a" /></linearGradient>
                <linearGradient id="glassTech" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" /><stop offset="40%" stopColor="#ffca28" stopOpacity="0.4" /><stop offset="70%" stopColor="#ff6f00" stopOpacity="0.5" /><stop offset="100%" stopColor="#bf360c" stopOpacity="0.8" /></linearGradient>
                <linearGradient id="roofEco" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#aed581" /><stop offset="100%" stopColor="#33691e" /></linearGradient>
                <radialGradient id="stoneGradient" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e0e0e0" /><stop offset="80%" stopColor="#616161" /><stop offset="100%" stopColor="#212121" /></radialGradient>

                <pattern id="ottomanStar" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M25 0 L32 18 L50 25 L32 32 L25 50 L18 32 L0 25 L18 18 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Terrain */}
              {!isBP && <rect width="100%" height="100%" fill="url(#terrainTex)" />}
              {visibleLayers.Grid && <rect width="100%" height="100%" fill="url(#grid)" />}

              {renderWetlands()}

              {/* --- ZONE B: AI VADİSİ --- */}
              {visibleLayers.B && (
                <g id="zone-b" onClick={() => setSelectedZone(projectData.zones.find(z => z.id === 'B'))} className="cursor-pointer" opacity={selectedZone && selectedZone.id !== 'B' ? (isBP ? 0.2 : 0.5) : 1}>

                  <path d="M 750 620 L 1050 450 L 1250 500 L 1250 800 L 1050 900 Z"
                    fill={isBP ? "rgba(255, 202, 40, 0.05)" : "url(#glassTech)"}
                    stroke={isBP ? "#ffca28" : "#ff8f00"} strokeWidth={isBP ? 2 : 5} filter={!isBP ? "url(#shadowHeavy)" : ""} />
                  {!isBP && <path d="M 750 620 L 1050 450 L 1250 500 L 1250 800 L 1050 900 Z" fill="url(#ottomanStar)" opacity="0.6" pointerEvents="none" />}

                  {/* AI Lab Pod 1 */}
                  <g transform="translate(1050, 450)">
                    <ExtrudedPolygon points="0,-100 80,-50 80,50 0,100 -80,50 -80,-50"
                      dx={is3D ? -35 : 0} dy={is3D ? -55 : 0} topFill={isBP ? "rgba(255, 202, 40, 0.1)" : "url(#glassTech)"}
                      wallFill={isBP ? "none" : "#ff8f00"} stroke={isBP ? "#ffca28" : "#fff"} strokeWidth={isBP ? 2 : 1.5}
                      is3D={is3D} filter={!isBP ? "url(#shadowHeavy)" : ""}
                    />
                    {!isBP && <circle cx={is3D ? -35 : 0} cy={is3D ? -55 : 0} r="35" fill="#ffca28" filter="url(#glow-gold)" opacity="0.8" pointerEvents="none" />}
                    {is3D && !isBP && <line x1="0" y1="0" x2="-35" y2="-55" stroke="#fff" strokeWidth="2" opacity="0.5" />}
                  </g>

                  {/* Datacenter Pod 2 */}
                  <g transform="translate(1250, 650)">
                    <ExtrudedPolygon points="0,-90 70,-45 70,45 0,90 -70,45 -70,-45"
                      dx={is3D ? -45 : 0} dy={is3D ? -70 : 0} topFill={isBP ? "rgba(255, 202, 40, 0.1)" : "url(#glassTech)"}
                      wallFill={isBP ? "none" : "#ff6f00"} stroke={isBP ? "#ffca28" : "#fff"} strokeWidth={isBP ? 2 : 1.5}
                      is3D={is3D} filter={!isBP ? "url(#shadowHeavy)" : ""}
                    />
                    {!isBP && <rect x={is3D ? -55 : -10} y={is3D ? -110 : -40} width="20" height="80" fill="#00e5ff" filter="url(#glow-cyan)" opacity="0.9" pointerEvents="none" />}
                  </g>

                  {isBP && <text x="850" y="580" fill="#ffca28" fontSize="26" fontFamily="monospace" fontWeight="bold">AI-VADİSİ-3D</text>}
                </g>
              )}

              {/* --- ZONE C: YAŞAM ALANI --- */}
              {visibleLayers.C && (
                <g id="zone-c" onClick={() => setSelectedZone(projectData.zones.find(z => z.id === 'C'))} className="cursor-pointer" opacity={selectedZone && selectedZone.id !== 'C' ? (isBP ? 0.2 : 0.5) : 1}>

                  <path d="M 750 620 L 550 850 L 300 850" fill="none" stroke={isBP ? "#81c784" : "#2e7d32"} strokeWidth={isBP ? 20 : 35} strokeOpacity={isBP ? 0.3 : 0.95} filter={!isBP ? "url(#shadowHeavy)" : ""} />

                  {/* Dorm Block 1 */}
                  <g transform="translate(100, 780)" filter={!isBP ? "url(#shadowHeavy)" : ""}>
                    <ExtrudedRect x={0} y={0} w={240} h={350} dx={is3D ? -50 : 0} dy={is3D ? -80 : 0}
                      topFill={isBP ? "rgba(129, 199, 132, 0.1)" : "url(#roofEco)"}
                      wallRightFill="#1b5e20" wallBottomFill="#0a2a0a"
                      stroke={isBP ? "#81c784" : "#9ccc65"} strokeWidth={isBP ? 2 : 2.5}
                      is3D={is3D} rx={is3D ? 0 : 25}
                    />
                    {!isBP && (
                      <g transform={`translate(${is3D ? -50 : 0}, ${is3D ? -80 : 0})`} pointerEvents="none" opacity="0.85">
                        <rect x="25" y="30" width="50" height="290" fill="#0d47a1" rx="8" />
                        <rect x="165" y="30" width="50" height="290" fill="#0d47a1" rx="8" />
                        {/* Lit windows effect */}
                        {[...Array(10)].map((_, i) => (
                          <rect key={i} x="35" y={40 + i * 28} width="30" height="15" fill="#fff9c4" opacity="0.7" />
                        ))}
                      </g>
                    )}
                  </g>

                  {/* Aeroponic Dining Hall */}
                  <g transform="translate(500, 920)" filter={!isBP ? "url(#shadowHeavy)" : ""}>
                    <ExtrudedCircle cx={120} cy={120} r={isBP ? 120 : 130} dx={is3D ? -45 : 0} dy={is3D ? -70 : 0}
                      topFill={isBP ? "rgba(129, 199, 132, 0.1)" : "url(#glassTech)"}
                      wallFill="#1b5e20" stroke={isBP ? "#81c784" : "#b2ff59"} strokeWidth={isBP ? 2 : 3}
                      is3D={is3D}
                    />
                    {!isBP && <circle cx={is3D ? 75 : 120} cy={is3D ? 50 : 120} r="50" fill="#fff" opacity="0.4" pointerEvents="none" filter="url(#glow-cyan)" />}
                    {isBP && <text x="30" y="130" fill="#81c784" fontSize="22" fontFamily="monospace">AEROPONİ KÜL.</text>}
                  </g>
                </g>
              )}

              {renderEnvironment()}

              {/* --- ZONE A: MANEVİ ÇEKİRDEK --- */}
              {visibleLayers.A && (
                <g id="zone-a" onClick={() => setSelectedZone(projectData.zones.find(z => z.id === 'A'))} className="cursor-pointer" opacity={selectedZone && selectedZone.id !== 'A' ? (isBP ? 0.2 : 0.5) : 1}>

                  {/* Central Dome */}
                  <g transform="translate(450, 320)" filter={!isBP ? "url(#shadowHeavy)" : ""}>

                    <ExtrudedCircle cx={0} cy={0} r={isBP ? 220 : 230} dx={is3D ? -70 : 0} dy={is3D ? -110 : 0}
                      topFill={isBP ? "rgba(79, 195, 247, 0.05)" : "url(#domeRealistic)"}
                      wallFill={isBP ? "none" : "#00332a"}
                      stroke={isBP ? "#4fc3f7" : "rgba(255,255,255,0.8)"} strokeWidth={isBP ? 4 : 2}
                      is3D={is3D}
                    />

                    {/* Rich Dome Roof mapping */}
                    <g transform={`translate(${is3D ? -70 : 0}, ${is3D ? -110 : 0})`} pointerEvents="none">
                      {!isBP && <circle cx="0" cy="0" r="230" fill="url(#ottomanStar)" opacity="0.5" />}
                      {!isBP && <circle cx="60" cy="60" r="140" fill="url(#domeInnerGlow)" filter="url(#glow-gold)" opacity="0.9" />}

                      <circle cx="0" cy="0" r="50" fill={isBP ? "rgba(255,255,255,0.2)" : "#fff"} opacity={isBP ? 1 : 0.9} filter={!isBP ? "url(#glow-cyan)" : ""} />

                      {!isBP && [...Array(24)].map((_, i) => (
                        <line key={`rib-${i}`} x1="0" y1="0" x2={230 * Math.cos(i * 15 * Math.PI / 180)} y2={230 * Math.sin(i * 15 * Math.PI / 180)} stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      ))}

                      {isBP && <text x="-160" y="-235" fill="#4fc3f7" fontSize="28" fontFamily="monospace" fontWeight="bold">NÛR MERKEZİ</text>}
                    </g>

                    {/* Grand Holographic Minaret */}
                    <g transform={`translate(${is3D ? -230 : -180}, ${is3D ? -240 : -130})`} pointerEvents="none">
                      <circle cx="0" cy="0" r="25" fill={isBP ? "none" : "#00e5ff"} stroke={isBP ? "#4fc3f7" : "none"} filter={!isBP ? "url(#glow-strong)" : ""} />
                      <polygon points="-8,0 8,0 35,-350 -35,-350" fill={isBP ? "rgba(79,195,247,0.2)" : "url(#glassTech)"} opacity={isBP ? 0.5 : 0.95} filter={!isBP ? "url(#glow-cyan)" : ""} />
                      {!isBP && <circle cx="0" cy="-350" r="15" fill="#fff" filter="url(#glow-strong)" />}
                    </g>
                  </g>
                </g>
              )}

              {/* ARCHITECTURAL INFO CARD (ANCHORED IN SPACE) */}
              <g transform="translate(1950, 1500)" pointerEvents="none">
                <rect x="0" y="0" width="550" height="260" fill={isBP ? "rgba(0,15,30,0.85)" : "rgba(0,0,0,0.85)"} stroke={isBP ? "white" : "#d4af37"} strokeWidth="3" filter="url(#shadowHeavy)" />
                <rect x="10" y="10" width="530" height="240" fill="none" stroke={isBP ? "rgba(255,255,255,0.3)" : "rgba(212,175,55,0.3)"} strokeWidth="1" />
                <text x="35" y="55" fill="white" fontSize="32" fontFamily="Inter" fontWeight="bold" letterSpacing="4">{projectData.project_name}</text>
                <text x="35" y="95" fill={isBP ? "#4fc3f7" : "#00e5ff"} fontSize="18" fontFamily="monospace" fontWeight="medium">{projectData.subtitle}</text>
                <line x1="35" y1="120" x2="515" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

                <text x="35" y="155" fill="white" fontSize="15" fontFamily="monospace" letterSpacing="1">MİMAR: {projectData.architect}</text>
                <text x="35" y="185" fill="white" fontSize="15" fontFamily="monospace" letterSpacing="1">MOTOR: {is3D ? "Google Earth İzometrik (3D Hacimsel)" : (isBP ? "Endüstriyel Ozalit Blueprint" : "Uydu Gerçekçi Harita")}</text>
                <text x="35" y="215" fill="white" fontSize="15" fontFamily="monospace" letterSpacing="1">LOKASYON: {projectData.location}</text>

                {/* Master Compass */}
                <g transform={`translate(460, 180) ${is3D ? 'rotate(-30)' : ''}`}>
                  <circle cx="0" cy="0" r="40" fill="none" stroke={isBP ? "white" : "#d4af37"} strokeWidth="2" opacity="0.9" />
                  <circle cx="0" cy="0" r="32" fill="none" stroke={isBP ? "white" : "#d4af37"} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                  <polygon points="0,-45 10,0 0,10 -10,0" fill={isBP ? "white" : "#d4af37"} filter={!isBP ? "url(#glow-gold)" : ""} />
                  <text x="-6" y="-55" fill={isBP ? "white" : "#d4af37"} fontSize="16" fontFamily="sans-serif" fontWeight="bold">K</text>
                  <text x="-4" y="25" fill={isBP ? "white" : "#d4af37"} fontSize="10" opacity="0.6">G</text>
                </g>
              </g>

            </svg>
          </div>
        </div>
      </div>

      {/* RIGHT CYBER-PANEL */}
      <div className={`w-80 lg:w-[420px] flex-shrink-0 z-30 shadow-[-15px_0_40px_rgba(0,0,0,0.8)] transition-all duration-700 transform ${selectedZone ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'} ${isBP ? 'bg-[#00101d] border-l border-cyan-900/50' : 'bg-[#12141a]/95 backdrop-blur-xl border-l border-slate-800'}`}>
        {selectedZone ? (
          <div className="flex flex-col h-full relative">
            <div className="p-8 border-b border-inherit relative overflow-hidden">
              <div className="absolute inset-0 opacity-15" style={{ backgroundColor: selectedZone.color }}></div>
              {!isBP && <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-30 animate-[pulse_2s_ease-in-out_infinite]"></div>}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4" style={{ color: selectedZone.color }}>
                    <div className="p-3 rounded-xl bg-black/60 border border-current/40 shadow-lg" style={{ boxShadow: `0 0 15px ${selectedZone.color}40` }}>
                      {selectedZone.icon}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight leading-tight">{selectedZone.name}</h2>
                  </div>
                  <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-black/50 transition-colors">✕</button>
                </div>
                <p className="text-[13px] text-slate-300 font-mono border-l-2 pl-4 leading-relaxed tracking-wide" style={{ borderColor: selectedZone.color }}>{selectedZone.short_desc}</p>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div className="flex items-center gap-2 text-slate-400 border-b border-inherit pb-3">
                <Radio size={16} className={!isBP ? "text-blue-400 animate-pulse" : ""} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Uzamsal Mimari Analiz</h3>
              </div>

              {selectedZone.analysis.map((item, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${isBP ? 'bg-cyan-950/20 border-cyan-900/40' : 'bg-[#1a1f26] border-slate-700/60 hover:border-slate-500 shadow-xl'}`}>
                  <h4 className="text-[15px] font-bold mb-3 flex items-center gap-3" style={{ color: selectedZone.color }}>
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: selectedZone.color }}></div>
                    {item.title}
                  </h4>
                  <p className="text-slate-300 text-[13px] leading-relaxed font-sans">{item.text}</p>
                </div>
              ))}

              <div className={`mt-8 p-6 rounded-2xl border border-dashed relative overflow-hidden ${isBP ? 'bg-cyan-950/20 border-cyan-900/50' : 'bg-[#0f1218] border-blue-900/50'}`}>
                <div className="flex justify-between text-[11px] text-slate-500 mb-4 font-mono font-bold tracking-widest">
                  <span>SİSTEM: {selectedZone.id}-3D_NODE</span>
                  <span className={isBP ? "text-cyan-400" : "text-blue-400 animate-pulse"}>RENDER ONLINE</span>
                </div>
                <div className="flex items-end gap-1.5 h-12 opacity-80">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-full rounded-t-sm transition-all duration-500 ease-in-out"
                      style={{ height: `${Math.max(10, Math.random() * 100)}%`, backgroundColor: selectedZone.color, opacity: isBP ? 0.4 : 0.9 }}>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-black/10">
            <div className={`p-5 rounded-full mb-6 ${isBP ? 'bg-cyan-900/20 text-cyan-500' : 'bg-[#151a22] text-[#d4af37] border border-[#d4af37]/20 shadow-[0_0_40px_rgba(212,175,55,0.15)]'}`}>
              <Globe size={40} className={!isBP ? "animate-[spin_20s_linear_infinite]" : ""} />
            </div>
            <h3 className="text-slate-200 font-bold mb-3 text-lg tracking-wide">3D Uzay Hazır</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">Mimari kütleleri incelemek ve detaylı mekansal analizleri okumak için haritadaki 3 boyutlu hacimlere tıklayın.</p>
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER STATUS BAR */}
      <div className={`absolute bottom-0 left-0 right-0 h-9 border-t flex items-center justify-between px-6 text-[11px] z-40 font-mono font-medium transition-colors duration-700 ${isBP ? 'bg-[#000d1a] border-cyan-900/50 text-cyan-600/60' : 'bg-[#08090b] border-slate-800 text-slate-500'}`}>
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span> Kuantum Render: Aktif</span>
          <span className="hidden md:flex items-center gap-2 text-slate-400">
            <Layers size={12} /> Ağaç Yoğunluğu: Ultra
          </span>
          <span className="hidden lg:inline text-slate-400">Scale: {(scale * 100).toFixed(0)}%</span>
        </div>
        <div className="flex gap-6">
          <span className="text-[#d4af37] hidden md:inline">2026 ARCHITECTURAL VISION</span>
          <span>X: {Math.round(-pan.x)} Y: {Math.round(-pan.y)} Z: {is3D ? 'İzometrik' : 'Düz'}</span>
        </div>
      </div>

    </div>
  );
}
