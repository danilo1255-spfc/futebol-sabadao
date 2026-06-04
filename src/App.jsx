import { useState } from 'react'
import Pagamentos from './Pagamentos'
import Presenca from './Presenca'
import Estatisticas from './Estatisticas'
export default function App() {
  const [tab, setTab] = useState('presenca')
  const tabs = [
    { k:'presenca', icon:'P', label:'Presenca', color:'#4fc3f7' },
    { k:'estatisticas', icon:'R', label:'Ranking', color:'#ce93d8' },
    { k:'pagamentos', icon:'$', label:'Pagamentos', color:'#00c853' },
  ]
  return (
    <div>
      <div style={{position:'sticky',top:0,zIndex:100,background:'#080f1a',borderBottom:'2px solid rgba(255,255,255,0.08)',display:'flex'}}>
        {tabs.map(t => (
          <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:'12px 4px',border:'none',background:'transparent',color:tab===t.k?'#fff':'#7a9ab0',fontSize:'0.78rem',fontWeight:700,cursor:'pointer',borderBottom:tab===t.k?'3px solid '+t.color:'3px solid transparent',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {tab === 'presenca' && <Presenca />}
      {tab === 'estatisticas' && <Estatisticas />}
      {tab === 'pagamentos' && <Pagamentos />}
    </div>
  )
}
