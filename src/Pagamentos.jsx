import { useState, useEffect } from 'react'
import { db } from './firebase'
import { ref, onValue, set } from 'firebase/database'

const PLAYERS = [
  "Biasi","Claudiney","Danilo","Dante","Daniel",
  "Dener","Eduardo","Fabinho","Felipe","Joaozao",
  "Joao Foltran","Lelo","Leonardo","Martuel","Marcos",
  "Otavio","Rafael","Rodrigo","Leandro","Tiago","Tucano","Wendel"
]

const MONTH_NAMES = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const now = new Date()
const MES_KEY = now.getFullYear() + '_' + (now.getMonth() + 1)
const MES_LABEL = MONTH_NAMES[now.getMonth()] + ' ' + now.getFullYear()

function fmtMoney(v) { return 'R$ ' + Number(v).toFixed(0) }
function fmtTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + ' as ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0')
}

export default function Pagamentos() {
  const [payments, setPayments] = useState({})
  const [config, setConfig] = useState({ valorBase: 70, goleiroAtivo: false, goleiroTotal: 0 })
  const [filter, setFilter] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [editValor, setEditValor] = useState(false)
  const [editGoleiro, setEditGoleiro] = useState(false)
  const [tempValor, setTempValor] = useState('70')
  const [tempGoleiro, setTempGoleiro] = useState('0')
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const payRef = ref(db, 'meses/' + MES_KEY + '/pagamentos')
    const cfgRef = ref(db, 'meses/' + MES_KEY + '/config')
    const unsubPay = onValue(payRef, snap => { setPayments(snap.val() || {}); setLoading(false) }, () => { setOnline(false); setLoading(false) })
    const unsubCfg = onValue(cfgRef, snap => { if (snap.val()) { const c = snap.val(); setConfig(c); setTempValor(String(c.valorBase)); setTempGoleiro(String(c.goleiroTotal)) } })
    window.addEventListener('online', () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))
    return () => { unsubPay(); unsubCfg() }
  }, [])

  const togglePlayer = async (name) => {
    const isPaid = payments[name]?.paid
    await set(ref(db, 'meses/' + MES_KEY + '/pagamentos/' + name), isPaid ? { paid: false, ts: null } : { paid: true, ts: Date.now() })
  }

  const saveConfig = async (newCfg) => { await set(ref(db, 'meses/' + MES_KEY + '/config'), newCfg) }
  const handleValorSave = async () => { const v = parseFloat(tempValor.replace(',','.')) || 70; const c = {...config, valorBase: v}; setConfig(c); setEditValor(false); await saveConfig(c) }
  const handleGoleiroToggle = async () => { const c = {...config, goleiroAtivo: !config.goleiroAtivo}; setConfig(c); await saveConfig(c) }
  const handleGoleiroSave = async () => { const v = parseFloat(tempGoleiro.replace(',','.')) || 0; const c = {...config, goleiroTotal: v}; setConfig(c); setEditGoleiro(false); await saveConfig(c) }

  const valorUnit = config.valorBase + (config.goleiroAtivo ? config.goleiroTotal / PLAYERS.length : 0)
  const pagos = PLAYERS.filter(p => payments[p]?.paid)
  const pendentes = PLAYERS.filter(p => !payments[p]?.paid)
  const displayed = filter === 'pagos' ? pagos : filter === 'pendentes' ? pendentes : PLAYERS

  if (loading) return <div style={{minHeight:'100vh',background:'#0d260d',display:'flex',alignItems:'center',justifyContent:'center',color:'#00c853',fontSize:'1.3rem'}}>Carregando...</div>

  return (
    <div style={{minHeight:'100vh',background:'#0d260d',fontFamily:"'DM Sans',sans-serif",color:'#f0f4f0',paddingBottom:48}}>
      <div style={{background:'linear-gradient(160deg,#0a1f0a,#152815)',borderBottom:'3px solid #00c853',padding:'28px 20px 22px',textAlign:'center',position:'relative'}}>
        <div style={{fontSize:'2.2rem',marginBottom:6}}>⚽</div>
        <div style={{fontSize:'2.4rem',fontWeight:900,letterSpacing:3,textTransform:'uppercase',lineHeight:1}}>Futebol de Sabado</div>
        <div style={{fontSize:'0.78rem',color:'#7a9a7a',letterSpacing:'1.5px',textTransform:'uppercase',marginTop:6}}>Controle de Pagamentos</div>
        <div style={{display:'inline-block',marginTop:10,background:'#00c853',color:'#000',fontWeight:700,fontSize:'0.85rem',padding:'4px 18px',borderRadius:20,textTransform:'uppercase'}}>{MES_LABEL}</div>
        <div style={{position:'absolute',top:12,right:14,display:'flex',alignItems:'center',gap:5,fontSize:'0.65rem',color:online?'#00c853':'#ff6b6b'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:online?'#00c853':'#ff6b6b'}}/>
          {online?'Ao vivo':'Offline'}
        </div>
      </div>

      <div style={{maxWidth:480,margin:'16px auto 0',padding:'0 16px'}}>
        <div style={{background:'rgba(0,200,83,0.1)',border:'2px solid rgba(0,200,83,0.4)',borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:'1.6rem'}}>💳</div>
          <div>
            <div style={{fontSize:'0.72rem',color:'#7a9a7a',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:3}}>Chave Pix</div>
            <div style={{fontWeight:800,fontSize:'1rem',color:'#00c853'}}>danilo_9228@hotmail.com</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:480,margin:'12px auto 0',padding:'0 16px',display:'flex',flexDirection:'column',gap:10}}>
        <div style={{background:'rgba(0,200,83,0.08)',border:'1.5px solid rgba(0,200,83,0.25)',borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:'0.78rem',color:'#7a9a7a',textTransform:'uppercase'}}>Valor por jogador</span>
          {editValor ? (
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <input value={tempValor} onChange={e=>setTempValor(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleValorSave()} autoFocus style={{background:'rgba(0,0,0,0.3)',border:'1px solid #00c853',borderRadius:8,color:'#00c853',fontSize:'1.1rem',fontWeight:700,width:80,textAlign:'right',padding:'4px 8px',outline:'none'}}/>
              <button onClick={handleValorSave} style={{background:'#00c853',border:'none',borderRadius:8,color:'#000',fontWeight:700,padding:'5px 10px',cursor:'pointer'}}>OK</button>
            </div>
          ) : (
            <span onClick={()=>{setEditValor(true);setTempValor(String(config.valorBase))}} style={{fontWeight:800,fontSize:'1.5rem',color:'#00c853',cursor:'pointer'}}>{fmtMoney(config.valorBase)} ✏️</span>
          )}
        </div>
        <div style={{background:'rgba(255,200,0,0.07)',border:'1.5px solid rgba(255,200,0,0.22)',borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <span style={{fontSize:'0.78rem',color:'#e0c060',textTransform:'uppercase'}}>Rateio Goleiro</span>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            {config.goleiroAtivo && (editGoleiro ? (
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <input value={tempGoleiro} onChange={e=>setTempGoleiro(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleGoleiroSave()} autoFocus placeholder="Total R$" style={{background:'rgba(0,0,0,0.3)',border:'1px solid #ffe082',borderRadius:8,color:'#ffe082',fontSize:'1rem',fontWeight:700,width:90,textAlign:'right',padding:'4px 8px',outline:'none'}}/>
                <button onClick={handleGoleiroSave} style={{background:'#ffe082',border:'none',borderRadius:8,color:'#000',fontWeight:700,padding:'5px 10px',cursor:'pointer'}}>OK</button>
              </div>
            ) : (
              <span onClick={()=>{setEditGoleiro(true);setTempGoleiro(String(config.goleiroTotal))}} style={{color:'#ffe082',fontWeight:700,cursor:'pointer'}}>{fmtMoney(config.goleiroTotal)} ✏️</span>
            ))}
            <div onClick={handleGoleiroToggle} style={{width:42,height:24,borderRadius:12,cursor:'pointer',background:config.goleiroAtivo?'rgba(255,200,0,0.35)':'rgba(255,255,255,0.1)',position:'relative',flexShrink:0}}>
              <div style={{position:'absolute',top:4,left:config.goleiroAtivo?22:4,width:16,height:16,borderRadius:'50%',background:config.goleiroAtivo?'#ffe082':'#888',transition:'left 0.2s'}}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:480,margin:'12px auto 0',padding:'0 16px',display:'flex',gap:10}}>
        {[{val:pagos.length,lbl:'Pagaram',color:'#00c853'},{val:pendentes.length,lbl:'Pendentes',color:'#ffe082'},{val:fmtMoney(pagos.length*valorUnit),lbl:'Arrecadado',color:'#ff6b6b'}].map(s=>(
          <div key={s.lbl} style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 8px',textAlign:'center'}}>
            <div style={{fontWeight:800,fontSize:'1.6rem',color:s.color,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:'0.68rem',color:'#7a9a7a',textTransform:'uppercase',marginTop:3}}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:480,margin:'12px auto 0',padding:'0 16px'}}>
        <div style={{height:6,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,#009624,#00c853)',width:(pagos.length/PLAYERS.length*100).toFixed(0)+'%',transition:'width 0.4s'}}/>
        </div>
        <div style={{fontSize:'0.72rem',color:'#7a9a7a',textAlign:'right',marginTop:4}}>{pagos.length} de {PLAYERS.length} confirmados</div>
      </div>

      <div style={{maxWidth:480,margin:'16px auto 8px',padding:'0 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:'1rem',fontWeight:700,color:'#7a9a7a',textTransform:'uppercase',letterSpacing:2}}>Jogadores</span>
        <div style={{display:'flex',gap:6}}>
          {['todos','pendentes','pagos'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{fontSize:'0.68rem',fontWeight:700,padding:'4px 12px',borderRadius:20,border:filter===f?'none':'1px solid rgba(255,255,255,0.12)',background:filter===f?'#00c853':'transparent',color:filter===f?'#000':'#7a9a7a',cursor:'pointer'}}>
              {f==='todos'?'Todos':f==='pendentes'?'Pendentes':'Pagaram'}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:480,margin:'0 auto',padding:'0 16px',display:'flex',flexDirection:'column',gap:8}}>
        {displayed.map(name => {
          const isPaid = payments[name]?.paid
          const ts = payments[name]?.ts
          return (
            <div key={name} onClick={()=>togglePlayer(name)} style={{background:isPaid?'rgba(0,200,83,0.12)':'rgba(255,255,255,0.04)',border:'1.5px solid '+(isPaid?'rgba(0,200,83,0.4)':'rgba(255,255,255,0.07)'),borderRadius:14,padding:'14px 16px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',userSelect:'none'}}>
              <div style={{width:34,height:34,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,border:isPaid?'none':'2px solid rgba(255,255,255,0.18)',background:isPaid?'#00c853':'transparent',color:isPaid?'#000':'transparent'}}>✓</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:'1rem',color:isPaid?'#00c853':'#f0f4f0'}}>{name}</div>
                <div style={{fontSize:'0.72rem',color:isPaid?'rgba(0,200,83,0.6)':'#7a9a7a',marginTop:2}}>{isPaid?'Pagamento confirmado':'Aguardando pagamento'}</div>
                {ts && <div style={{fontSize:'0.62rem',color:'rgba(0,200,83,0.45)',marginTop:2}}>{fmtTime(ts)}</div>}
              </div>
              <div style={{fontWeight:800,fontSize:'1.2rem',color:isPaid?'#00c853':'#7a9a7a',flexShrink:0}}>{fmtMoney(valorUnit)}</div>
            </div>
          )
        })}
      </div>

      <div style={{maxWidth:480,margin:'24px auto 0',padding:'0 16px',textAlign:'center',fontSize:'0.72rem',color:'rgba(255,255,255,0.18)',lineHeight:1.7}}>
        Toque no seu nome para confirmar o pagamento<br/>Sincroniza em tempo real
      </div>
    </div>
  )
}
