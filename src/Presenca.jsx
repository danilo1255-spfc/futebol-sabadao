import { useState, useEffect } from 'react'
import { db } from './firebase'
import { ref, onValue, set } from 'firebase/database'

const PLAYERS = [
  { name: "Biasi", pos: "linha" },
  { name: "Claudiney", pos: "linha" },
  { name: "Danilo", pos: "linha" },
  { name: "Dante", pos: "linha" },
  { name: "Daniel", pos: "linha" },
  { name: "Dener", pos: "linha" },
  { name: "Eduardo", pos: "linha" },
  { name: "Fabinho", pos: "linha" },
  { name: "Felipe", pos: "linha" },
  { name: "Joãozão", pos: "linha" },
  { name: "João Foltran", pos: "linha" },
  { name: "Lelo", pos: "linha" },
  { name: "Léonardo", pos: "linha" },
  { name: "Martuel", pos: "linha" },
  { name: "Marcos", pos: "linha" },
  { name: "Otávio", pos: "linha" },
  { name: "Rafael", pos: "linha" },
  { name: "Rodrigo", pos: "linha" },
  { name: "Leandro", pos: "linha" },
  { name: "Tiago", pos: "linha" },
  { name: "Tucano", pos: "linha" },
  { name: "Wendel", pos: "linha" },
  { name: "Emerson", pos: "goleiro" },
  { name: "Anderson", pos: "goleiro" },
  { name: "Renan", pos: "goleiro_avulso" },
]

function getWeekKey() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  return `presenca_${monday.getFullYear()}_${monday.getMonth()+1}_${monday.getDate()}`
}

function getNextSaturday() {
  const now = new Date()
  const day = now.getDay()
  const diff = (6 - day + 7) % 7 || 7
  const sat = new Date(now)
  sat.setDate(now.getDate() + diff)
  return sat.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
}

const WEEK_KEY = getWeekKey()
const SAT_LABEL = getNextSaturday()

export default function Presenca() {
  const [presencas, setPresencas] = useState({})
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(true)
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    const presRef = ref(db, WEEK_KEY)
    const unsub = onValue(presRef, (snap) => {
      setPresencas(snap.val() || {})
      setLoading(false)
    }, () => { setOnline(false); setLoading(false) })
    window.addEventListener('online', () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))
    return () => unsub()
  }, [])

  const toggle = async (name, status) => {
    const current = presencas[name]?.status
    const presRef = ref(db, `${WEEK_KEY}/${name}`)
    await set(presRef, current === status ? { status: null, ts: null } : { status, ts: Date.now() })
  }

  const goleiros = PLAYERS.filter(p => p.pos === 'goleiro')
  const avulso = PLAYERS.filter(p => p.pos === 'goleiro_avulso')
  const linha = PLAYERS.filter(p => p.pos === 'linha')

  const confirmados = PLAYERS.filter(p => presencas[p.name]?.status === 'vai')
  const goleirosConf = confirmados.filter(p => p.pos === 'goleiro' || p.pos === 'goleiro_avulso')
  const faltando = PLAYERS.filter(p => !presencas[p.name]?.status)

  const allGroups = [
    { label: '🧤 Goleiros Fixos', players: goleiros },
    { label: '🧤 Goleiro Avulso', players: avulso },
    { label: '⚽ Jogadores de Linha', players: linha },
  ]

  const displayed = filter === 'vai' ? PLAYERS.filter(p => presencas[p.name]?.status === 'vai')
    : filter === 'nao' ? PLAYERS.filter(p => presencas[p.name]?.status === 'nao')
    : filter === 'aguardando' ? faltando
    : null // null = show groups

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0d1a2e',display:'flex',alignItems:'center',justifyContent:'center',color:'#4fc3f7',fontSize:'1.3rem'}}>
      ⚽ Carregando...
    </div>
  )

  const renderPlayer = (p) => {
    const status = presencas[p.name]?.status
    const isVai = status === 'vai'
    const isNao = status === 'nao'
    const isAvulso = p.pos === 'goleiro_avulso'
    return (
      <div key={p.name} style={{background:isVai?'rgba(79,195,247,0.1)':isNao?'rgba(255,107,107,0.08)':'rgba(255,255,255,0.04)',border:`1.5px solid ${isVai?'rgba(79,195,247,0.35)':isNao?'rgba(255,107,107,0.25)':'rgba(255,255,255,0.07)'}`,borderRadius:14,padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:32,height:32,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',background:p.pos!=='linha'?'rgba(255,224,130,0.15)':'rgba(79,195,247,0.1)',border:p.pos!=='linha'?'1.5px solid rgba(255,224,130,0.3)':'1.5px solid rgba(79,195,247,0.2)'}}>
          {p.pos !== 'linha' ? '🧤' : '⚽'}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:'1rem',color:isVai?'#4fc3f7':isNao?'rgba(255,107,107,0.7)':'#f0f4f0',display:'flex',alignItems:'center',gap:6}}>
            {p.name}
            {isAvulso && <span style={{fontSize:'0.6rem',background:'rgba(255,224,130,0.15)',color:'#ffe082',padding:'2px 7px',borderRadius:10,fontWeight:600}}>AVULSO</span>}
          </div>
          <div style={{fontSize:'0.7rem',color:isVai?'rgba(79,195,247,0.6)':isNao?'rgba(255,107,107,0.5)':'#7a9ab0',marginTop:2}}>
            {p.pos === 'linha' ? '⚽ Linha' : '🧤 Goleiro'}{isVai?' · Confirmado':isNao?' · Não vai':''}
          </div>
        </div>
        <div style={{display:'flex',gap:6,flexShrink:0}}>
          <button onClick={()=>toggle(p.name,'vai')} style={{width:36,height:36,borderRadius:10,border:'none',background:isVai?'#4fc3f7':'rgba(79,195,247,0.12)',color:isVai?'#000':'#4fc3f7',fontSize:'1.1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✅</button>
          <button onClick={()=>toggle(p.name,'nao')} style={{width:36,height:36,borderRadius:10,border:'none',background:isNao?'#ff6b6b':'rgba(255,107,107,0.12)',color:isNao?'#000':'#ff6b6b',fontSize:'1.1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>❌</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#0d1a2e',backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,0.012) 60px,rgba(255,255,255,0.012) 62px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,0.012) 60px,rgba(255,255,255,0.012) 62px)`,fontFamily:"'DM Sans',sans-serif",color:'#f0f4f0',paddingBottom:48}}>

      <div style={{background:'linear-gradient(160deg,#0a1628,#0d2040)',borderBottom:'3px solid #4fc3f7',padding:'28px 20px 22px',textAlign:'center',position:'relative'}}>
        <div style={{fontSize:'2.2rem',marginBottom:6}}>🗓️</div>
        <div style={{fontSize:'2.2rem',fontWeight:900,letterSpacing:3,textTransform:'uppercase',lineHeight:1}}>Futebol de Sábado</div>
        <div style={{fontSize:'0.78rem',color:'#7a9ab0',letterSpacing:'1.5px',textTransform:'uppercase',marginTop:6}}>Lista de Presença</div>
        <div style={{display:'inline-block',marginTop:10,background:'#4fc3f7',color:'#000',fontWeight:700,fontSize:'0.82rem',padding:'4px 18px',borderRadius:20,textTransform:'capitalize'}}>{SAT_LABEL}</div>
        <div style={{position:'absolute',top:12,right:14,display:'flex',alignItems:'center',gap:5,fontSize:'0.65rem',color:online?'#4fc3f7':'#ff6b6b'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:online?'#4fc3f7':'#ff6b6b',boxShadow:`0 0 6px ${online?'#4fc3f7':'#ff6b6b'}`}}/>
          {online?'Ao vivo':'Offline'}
        </div>
      </div>

      <div style={{maxWidth:480,margin:'16px auto 0',padding:'0 16px',display:'flex',gap:8}}>
        {[
          {val:confirmados.length, lbl:'Confirmados', color:'#4fc3f7'},
          {val:`${goleirosConf.length}/2`, lbl:'Goleiros', color:'#ffe082'},
          {val:faltando.length, lbl:'Aguardando', color:'#ff8a65'},
        ].map(s=>(
          <div key={s.lbl} style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 8px',textAlign:'center'}}>
            <div style={{fontWeight:800,fontSize:'1.6rem',color:s.color,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:'0.68rem',color:'#7a9ab0',textTransform:'uppercase',letterSpacing:'0.8px',marginTop:3}}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:480,margin:'12px auto 0',padding:'0 16px'}}>
        <div style={{height:6,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,#0288d1,#4fc3f7)',width:`${(confirmados.length/PLAYERS.length*100).toFixed(0)}%`,transition:'width 0.4s'}}/>
        </div>
        <div style={{fontSize:'0.72rem',color:'#7a9ab0',textAlign:'right',marginTop:4}}>{confirmados.length} de {PLAYERS.length} responderam</div>
      </div>

      <div style={{maxWidth:480,margin:'18px auto 8px',padding:'0 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:'1rem',fontWeight:700,color:'#7a9ab0',textTransform:'uppercase',letterSpacing:2}}>👥 Jogadores</span>
        <div style={{display:'flex',gap:5}}>
          {[{k:'todos',l:'Todos'},{k:'vai',l:'✅'},{k:'nao',l:'❌'},{k:'aguardando',l:'⏳'}].map(f=>(
            <button key={f.k} onClick={()=>setFilter(f.k)} style={{fontSize:'0.68rem',fontWeight:700,padding:'4px 12px',borderRadius:20,border:filter===f.k?'none':'1px solid rgba(255,255,255,0.12)',background:filter===f.k?'#4fc3f7':'transparent',color:filter===f.k?'#000':'#7a9ab0',cursor:'pointer'}}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:480,margin:'0 auto',padding:'0 16px',display:'flex',flexDirection:'column',gap:8}}>
        {displayed ? (
          displayed.map(p => renderPlayer(p))
        ) : (
          allGroups.map(group => (
            <div key={group.label}>
              <div style={{fontSize:'0.72rem',fontWeight:700,color:'#7a9ab0',textTransform:'uppercase',letterSpacing:'1.5px',padding:'8px 4px 6px'}}>{group.label}</div>
              {group.players.map(p => renderPlayer(p))}
            </div>
          ))
        )}
      </div>

      <div style={{maxWidth:480,margin:'28px auto 0',padding:'0 16px',textAlign:'center',fontSize:'0.72rem',color:'rgba(255,255,255,0.18)',lineHeight:1.7}}>
        ✅ Confirmar presença &nbsp;|&nbsp; ❌ Não vai<br/>Reseta toda semana 🔄
      </div>
    </div>
  )
}
