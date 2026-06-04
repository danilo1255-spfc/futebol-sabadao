import { useState, useEffect } from 'react'
import { db } from './firebase'
import { ref, onValue, set, get } from 'firebase/database'

const PLAYERS = [
  { name: "Biasi", pos: "linha" },{ name: "Claudiney", pos: "linha" },
  { name: "Danilo", pos: "linha" },{ name: "Dante", pos: "linha" },
  { name: "Daniel", pos: "linha" },{ name: "Dener", pos: "linha" },
  { name: "Eduardo", pos: "linha" },{ name: "Fabinho", pos: "linha" },
  { name: "Felipe", pos: "linha" },{ name: "Joaozao", pos: "linha" },
  { name: "Joao Foltran", pos: "linha" },{ name: "Lelo", pos: "linha" },
  { name: "Leonardo", pos: "linha" },{ name: "Martuel", pos: "linha" },
  { name: "Marcos", pos: "linha" },{ name: "Otavio", pos: "linha" },
  { name: "Rafael", pos: "linha" },{ name: "Rodrigo", pos: "linha" },
  { name: "Leandro", pos: "linha" },{ name: "Tiago", pos: "linha" },
  { name: "Tucano", pos: "linha" },{ name: "Wendel", pos: "linha" },
  { name: "Emerson", pos: "goleiro" },{ name: "Anderson", pos: "goleiro" },
  { name: "Renan", pos: "goleiro" },
]

const COLORS = { gols:'#00c853', assistencias:'#4fc3f7', dribles:'#ffe082', entregadas:'#ff6b6b', defesas:'#ce93d8' }
const LABELS = { gols:'Gols', assistencias:'Assist.', dribles:'Dribles', entregadas:'Entregadas', defesas:'Defesas' }

export default function Estatisticas() {
  const [stats, setStats] = useState({})
  const [ranking, setRanking] = useState('gols')
  const [view, setView] = useState('ranking')
  const [selected, setSelected] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const r = ref(db, 'estatisticas/total')
    return onValue(r, snap => setStats(snap.val() || {}))
  }, [])

  const getStat = (name, stat) => stats[name]?.[stat] || 0

  const addStat = async (name, stat, delta) => {
    const r = ref(db, 'estatisticas/total/' + name + '/' + stat)
    const snap = await get(r)
    await set(r, Math.max(0, (snap.val() || 0) + delta))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const ranked = [...PLAYERS]
    .map(p => ({ ...p, val: getStat(p.name, ranking) }))
    .filter(p => p.val > 0)
    .sort((a, b) => b.val - a.val)

  const player = PLAYERS.find(p => p.name === selected)
  const pstats = player?.pos === 'goleiro'
    ? ['gols','assistencias','defesas','entregadas']
    : ['gols','assistencias','dribles','entregadas']

  return (
    <div style={{minHeight:'100vh',background:'#1a0d2e',fontFamily:"'DM Sans',sans-serif",color:'#f0f4f0',paddingBottom:48}}>
      <div style={{background:'linear-gradient(160deg,#1a0828,#2d0f4a)',borderBottom:'3px solid #ce93d8',padding:'24px 20px 18px',textAlign:'center'}}>
        <div style={{fontSize:'2rem'}}>🏆</div>
        <div style={{fontSize:'2rem',fontWeight:900,letterSpacing:3,textTransform:'uppercase'}}>Ranking</div>
        <div style={{fontSize:'0.78rem',color:'#a07ab0',letterSpacing:'1.5px',textTransform:'uppercase',marginTop:4}}>Estatisticas 2026</div>
      </div>

      <div style={{maxWidth:480,margin:'16px auto 0',padding:'0 16px',display:'flex',gap:8}}>
        {[{k:'ranking',l:'🏆 Ranking'},{k:'lancar',l:'✏️ Lancar'}].map(v=>(
          <button key={v.k} onClick={()=>{setView(v.k);setSelected(null)}} style={{flex:1,padding:'10px',borderRadius:12,border:'none',background:view===v.k?'#ce93d8':'rgba(255,255,255,0.06)',color:view===v.k?'#000':'#a07ab0',fontWeight:700,fontSize:'0.88rem',cursor:'pointer'}}>
            {v.l}
          </button>
        ))}
      </div>

      {view === 'ranking' && (
        <div style={{maxWidth:480,margin:'14px auto 0',padding:'0 16px'}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
            {['gols','assistencias','dribles','defesas','entregadas'].map(s=>(
              <button key={s} onClick={()=>setRanking(s)} style={{padding:'5px 12px',borderRadius:20,border:'none',background:ranking===s?COLORS[s]:'rgba(255,255,255,0.06)',color:ranking===s?'#000':'#a07ab0',fontWeight:700,fontSize:'0.72rem',cursor:'pointer'}}>
                {LABELS[s]}
              </button>
            ))}
          </div>
          {ranked.length === 0 ? (
            <div style={{textAlign:'center',padding:'40px',color:'#a07ab0'}}>Nenhuma estatistica ainda. Use Lancar!</div>
          ) : ranked.map((p,i) => (
            <div key={p.name} style={{background:'rgba(255,255,255,0.04)',border:'1.5px solid '+(i===0?COLORS[ranking]+'66':'rgba(255,255,255,0.07)'),borderRadius:14,padding:'12px 14px',display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
              <div style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,background:i===0?'rgba(255,215,0,0.15)':i===1?'rgba(192,192,192,0.1)':i===2?'rgba(205,127,50,0.1)':'rgba(255,255,255,0.05)',color:i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#a07ab0'}}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:'0.7rem',color:'#a07ab0'}}>{p.pos==='goleiro'?'Goleiro':'Linha'}</div>
              </div>
              <div style={{fontWeight:900,fontSize:'1.8rem',color:COLORS[ranking],lineHeight:1}}>{p.val}</div>
            </div>
          ))}
        </div>
      )}

      {view === 'lancar' && !selected && (
        <div style={{maxWidth:480,margin:'14px auto 0',padding:'0 16px'}}>
          <div style={{fontSize:'0.7rem',color:'#a07ab0',textTransform:'uppercase',marginBottom:10}}>Selecione o jogador</div>
          {PLAYERS.map(p => (
            <div key={p.name} onClick={()=>setSelected(p.name)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginBottom:6}}>
              <div>{p.pos==='goleiro'?'🧤':'⚽'}</div>
              <div style={{fontWeight:700}}>{p.name}</div>
              <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                {['gols','assistencias'].map(s=>getStat(p.name,s)>0&&(
                  <span key={s} style={{fontSize:'0.7rem',color:COLORS[s],fontWeight:700}}>{getStat(p.name,s)}{s==='gols'?'G':'A'}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'lancar' && selected && (
        <div style={{maxWidth:480,margin:'14px auto 0',padding:'0 16px'}}>
          <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'none',color:'#a07ab0',cursor:'pointer',marginBottom:12}}>← Voltar</button>
          <div style={{background:'rgba(206,147,216,0.08)',border:'1.5px solid rgba(206,147,216,0.25)',borderRadius:14,padding:'14px',marginBottom:12,display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:'1.6rem'}}>{player?.pos==='goleiro'?'🧤':'⚽'}</div>
            <div style={{fontWeight:800,fontSize:'1.1rem'}}>{selected}</div>
            {saved && <div style={{marginLeft:'auto',color:'#00c853',fontWeight:700}}>✓ Salvo!</div>}
          </div>
          {pstats.map(stat => (
            <div key={stat} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <div>
                <div style={{fontWeight:700,color:COLORS[stat]}}>{LABELS[stat]}</div>
                <div style={{fontSize:'0.68rem',color:'#a07ab0',marginTop:2}}>Total: {getStat(selected,stat)}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <button onClick={()=>addStat(selected,stat,-1)} style={{width:36,height:36,borderRadius:10,border:'none',background:'rgba(255,107,107,0.15)',color:'#ff6b6b',fontSize:'1.3rem',fontWeight:700,cursor:'pointer'}}>−</button>
                <div style={{fontWeight:900,fontSize:'1.6rem',color:COLORS[stat],minWidth:32,textAlign:'center'}}>{getStat(selected,stat)}</div>
                <button onClick={()=>addStat(selected,stat,1)} style={{width:36,height:36,borderRadius:10,border:'none',background:'rgba(0,200,83,0.15)',color:'#00c853',fontSize:'1.3rem',fontWeight:700,cursor:'pointer'}}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
