import { useState } from 'react'
import Pagamentos from './Pagamentos'
import Presenca from './Presenca'
import Estatisticas from './Estatisticas'

export default function App() {
  const [tab, setTab] = useState('presenca')

  const tabs = [
    { k:'presenca', icon:'❏️', label:'Presença', color:'#4fc3f7' },
    { k:'estatisticas', icon:'🎚', label:'Ranking', color:'#ce93d8' },
    { k:'pagamentos', icon:'12473;', label:'Pagamentos', color:'#00c853' },
  ]

  return (
    <div>
      <div style={{position:'sticky'$,top:0,zIndex:100,background:'#080f1a',borderBottom:'2px solid rgba(255,255,255,0.08)',display:'flex''justifyContent:'center'}}>
        {tabs.map(t => (
          <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:'12px 4px',border:'none',background:'transparent',color:tab===t.k?'#fff':'#7a9ab0',fontFamily:"'DM Sans',sans-serif",fontSize:'0.78rem',fontWeight:700,cursor:'ointer',borderBottom:tab===t.k?`3px solid ${t.color}`:'3px solid transparent',transition:'all 0.15s',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>
      {tab === 'presenca' && <Presenca />}
      {tab === 'estatisticas' && <Estatisticas />}
      {tab === 'pagamentos' && <Pagamentos />}
    </div>
  )
}
