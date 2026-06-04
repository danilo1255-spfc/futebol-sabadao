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

const COLORS = { gols:'#00c853', assistencias:'#4fc3f7', dribles:'#ffe082', entregadas:'#ff6b6b', defesas:'#ff3333' }
const LABELS = { gols:'Gols', assistencias:'Assist.', dribles:'Dribles', entregadas:'Entregadas', defesas:'Defesas' }

function todayStr() {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0')
}

function fmtDate(str) {
  if (!str) return ''
  const parts = str.replace(/_/g,'-').split('-')
  return parts[2] + '/' + parts[1] + '/' + parts[0]
}

export default function Estatisticas() {
  const [stats, setStats] = useState({})
  const [jogos, setJogos] = useState({})
  const [ranking, setRanking] = useState('gols')
  const [view, setView] = useState('ranking')
  const [selected, setSelected] = useState(null)
  const [saved, setSaved] = useState(false)
  const [dataJogo, setDataJogo] = useState(todayStr())

  useEffect(() => {
    const u1 = onValue(ref(db,'estatisticas/total'), snap => setStats(snap.val()||{}))
    const u2 = onValue(ref(db,'estatisticas/jogos'), snap => setJogos(snap.val()||{}))
    return () => { u1(); u2() }
  }, [])

  const getStat = (name, stat) => stats[name]?.[stat] || 0

  const addStat = async (name, stat, delta) => {
    const dk = dataJogo.replace(/-/g,'_')
    const tRef = ref(db,'estatisticas/total/'+name+'/'+stat)
    const jRef = ref(db,'estatisticas/jogos/'+dk+'/'+name+'/'+stat)
    const [ts,js] = await Promise.all([get(tRef),get(jRef)])
    await Promise.all([
      set(tRef, Math.max(0,(ts.val()||0)+delta)),
      set(jRef, Math.max(0,(js.val()||0)+delta))
    ])
    setSaved(true)
    setTimeout(()=>setSaved(false),1500)
  }

  const ranked = [...PLAYERS].map(p=>({...p,val:getStat(p.name,ranking)})).filter(p=>p.val>0).sort((a,b)=>b.val-a.val)
  const jogosDates = Object.keys(jogos).sort().reverse()
  const player = PLAYERS.find(p=>p.name===selected)
  const pstats = player?.pos==='goleiro' ? ['gols','assistencias','defesas','entregadas'] : ['gols','assistencias','dribles','entregadas']

  return (
    <div style={{minHeight:'100vh',background:'#1a0000',fontFamily:"'DM Sans',sans-serif",color:'#f0f4f0',paddingBottom:48}}>
      <div style={{background:'linear-gradient(160deg,#2a0000,#4a0a0a)',borderBottom:'3px solid #ff3333',padding:'24px 20px 18px',textAlign:'center'}}>
        <div style={{fontSize:'2rem'}}>🏆</div>
        <div style={{fontSize:'2rem',fontWeight:900,letterSpacing:3,textTransform:'uppercase'}}>Ranking</div>
        <div style={{fontSize:'0.78rem',color:'#c07070',letterSpacing:'1.5px',textTransform:'uppercase',marginTop:4}}>Estatisticas 2026</div>
      </div>

      <div style={{maxWidth:480,margin:'16px auto 0',padding:'0 16px',display:'flex',gap:6}}>
        {[{k:'ranking',l:'🏆 Ranking'},{k:'historico',l:'📅 Histórico'},{k:'lancar',l:'✏️ Lançar'}].map(v=>(
          <button key={v.k} onClick={()=>{setView(v.k);setSelected(null)}} style={{flex:1,padding:'10px 4px',borderRadius:12,border:'none',background:view===v.k?'#ff3333':'rgba(255,255,255,0.06)',color:view===v.k?'#fff':'#c07070',fontWeight:700,fontSize:'0.75rem',cursor:'pointer'}}>
            {v.l}
          </button>
        ))}
      </div>

      {view==='ranking' && (
        <div style={{maxWidth:480,margin:'14px auto 0',padding:'0 16px'}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
            {['gols','assistencias','dribles','defesas','entregadas'].map(s=>(
              <button key={s} onClick={()=>setRanking(s)} style={{padding:'5px 12px',borderRadius:20,border:'none',background:ranking===s?COLORS[s]:'rgba(255,255,255,0.06)',color:ranking===s?'#000':'#c07070',fontWeight:700,fontSize:'0.72rem',cursor:'pointer'}}>{LABELS[s]}</button>
            ))}
          </div>
          {ranked.length===0 ? (
            <div style={{textAlign:'center',padding:'40px',color:'#c07070'}}>Nenhuma estatistica ainda. Use Lançar!</div>
          ) : ranked.map((p,i)=>(
            <div key={p.name} style={{background:'rgba(255,50,50,0.06)',border:'1.5px solid '+(i===0?'rgba(255,50,50,0.4)':'rgba(255,255,255,0.07)'),borderRadius:14,padding:'12px 14px',display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
              <div style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,background:i===0?'rgba(255,215,0,0.15)':i===1?'rgba(192,192,192,0.1)':i===2?'rgba(205,127,50,0.1)':'rgba(255,255,255,0.05)',color:i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#c07070'}}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:'0.7rem',color:'#c07070'}}>{p.pos==='goleiro'?'Goleiro':'Linha'}</div>
              </div>
              <div style={{fontWeight:900,fontSize:'1.8rem',color:COLORS[ranking],lineHeight:1}}>{p.val}</div>
            </div>
          ))}
        </div>
      )}

      {view==='historico' && (
        <div style={{maxWidth:480,margin:'14px auto 0',padding:'0 16px'}}>
          {jogosDates.length===0 ? (
            <div style={{textAlign:'center',padding:'40px',color:'#c07070'}}>Nenhum jogo lancado ainda.</div>
          ) : jogosDates.map(dk=>{
            const data = fmtDate(dk)
            const jogadores = Object.entries(jogos[dk])
              .map(([name,s])=>({name,gols:s.gols||0,assist:s.assistencias||0,dribles:s.dribles||0,entregadas:s.entregadas||0}))
              .filter(j=>j.gols>0||j.assist>0||j.dribles>0)
              .sort((a,b)=>b.gols-a.gols)
            return (
              <div key={dk} style={{background:'rgba(255,50,50,0.06)',border:'1px solid rgba(255,50,50,0.2)',borderRadius:14,padding:'14px',marginBottom:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <div style={{fontSize:'1rem'}}>📅</div>
                  <div style={{fontWeight:800,color:'#ff6b6b',fontSize:'1rem'}}>Sabado {data}</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 36px 36px 36px 36px',gap:4,marginBottom:6,padding:'0 4px'}}>
                  {['JOGADOR','G','A','D','E'].map(h=>(
                    <div key={h} style={{fontSize:'0.6rem',color:'#c07070',fontWeight:700,textAlign:h==='JOGADOR'?'left':'center'}}>{h}</div>
                  ))}
                </div>
                {jogadores.map(j=>(
                  <div key={j.name} style={{display:'grid',gridTemplateColumns:'1fr 36px 36px 36px 36px',gap:4,padding:'5px 4px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                    <div style={{fontSize:'0.85rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{j.name}</div>
                    <div style={{fontSize:'0.85rem',fontWeight:700,textAlign:'center',color:j.gols>0?'#00c853':'rgba(255,255,255,0.2)'}}>{j.gols||'-'}</div>
                    <div style={{fontSize:'0.85rem',fontWeight:700,textAlign:'center',color:j.assist>0?'#4fc3f7':'rgba(255,255,255,0.2)'}}>{j.assist||'-'}</div>
                    <div style={{fontSize:'0.85rem',fontWeight:700,textAlign:'center',color:j.dribles>0?'#ffe082':'rgba(255,255,255,0.2)'}}>{j.dribles||'-'}</div>
                    <div style={{fontSize:'0.85rem',fontWeight:700,textAlign:'center',color:j.entregadas>0?'#ff6b6b':'rgba(255,255,255,0.2)'}}>{j.entregadas||'-'}</div>
                  </div>
                ))}
                <div style={{marginTop:8,fontSize:'0.62rem',color:'#c07070'}}>G=Gols · A=Assist · D=Dribles · E=Entregadas</div>
              </div>
            )
          })}
        </div>
      )}

      {view==='lancar' && !selected && (
        <div style={{maxWidth:480,margin:'14px auto 0',padding:'0 16px'}}>
          <div style={{background:'rgba(255,50,50,0.08)',border:'1.5px solid rgba(255,50,50,0.25)',borderRadius:12,padding:'14px 16px',marginBottom:14}}>
            <div style={{fontSize:'0.72rem',color:'#c07070',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:8}}>📅 Data do Jogo</div>
            <input type="date" value={dataJogo} onChange={e=>setDataJogo(e.target.value)} style={{background:'rgba(0,0,0,0.3)',border:'1px solid rgba(255,50,50,0.4)',borderRadius:8,color:'#ff6b6b',fontSize:'1rem',fontWeight:700,padding:'8px 12px',outline:'none',width:'100%',boxSizing:'border-box'}}/>
          </div>
          <div style={{fontSize:'0.68rem',color:'#c07070',textTransform:'uppercase',letterSpacing:'1px',padding:'4px 0 6px'}}>🧤 Goleiros</div>
          {PLAYERS.filter(p=>p.pos==='goleiro').map(p=>(
            <div key={p.name} onClick={()=>setSelected(p.name)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginBottom:6}}>
              <div>🧤</div><div style={{fontWeight:700}}>{p.name}</div>
              <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                {['gols','assistencias'].map(s=>getStat(p.name,s)>0&&(<span key={s} style={{fontSize:'0.7rem',color:COLORS[s],fontWeight:700}}>{getStat(p.name,s)}{s==='gols'?'G':'A'}</span>))}
              </div>
            </div>
          ))}
          <div style={{fontSize:'0.68rem',color:'#c07070',textTransform:'uppercase',letterSpacing:'1px',padding:'8px 0 6px'}}>⚽ Linha</div>
          {PLAYERS.filter(p=>p.pos==='linha').map(p=>(
            <div key={p.name} onClick={()=>setSelected(p.name)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginBottom:6}}>
              <div>⚽</div><div style={{fontWeight:700}}>{p.name}</div>
              <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                {['gols','assistencias'].map(s=>getStat(p.name,s)>0&&(<span key={s} style={{fontSize:'0.7rem',color:COLORS[s],fontWeight:700}}>{getStat(p.name,s)}{s==='gols'?'G':'A'}</span>))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view==='lancar' && selected && (
        <div style={{maxWidth:480,margin:'14px auto 0',padding:'0 16px'}}>
          <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'none',color:'#c07070',cursor:'pointer',marginBottom:12}}>← Voltar</button>
          <div style={{background:'rgba(255,50,50,0.08)',border:'1.5px solid rgba(255,50,50,0.3)',borderRadius:14,padding:'14px',marginBottom:12,display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:'1.6rem'}}>{player?.pos==='goleiro'?'🧤':'⚽'}</div>
            <div>
              <div style={{fontWeight:800,fontSize:'1.1rem'}}>{selected}</div>
              <div style={{fontSize:'0.72rem',color:'#ff6b6b',marginTop:2}}>📅 {fmtDate(dataJogo)}</div>
            </div>
            {saved && <div style={{marginLeft:'auto',color:'#00c853',fontWeight:700}}>✓ Salvo!</div>}
          </div>
          {pstats.map(stat=>(
            <div key={stat} style={{background:'rgba(255,50,50,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <div>
                <div style={{fontWeight:700,color:COLORS[stat]}}>{LABELS[stat]}</div>
                <div style={{fontSize:'0.68rem',color:'#c07070',marginTop:2}}>Total: {getStat(selected,stat)}</div>
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
