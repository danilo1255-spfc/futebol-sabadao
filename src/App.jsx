import { useState } from 'react'
import Pagamentos from './Pagamentos'
import Presenca from './Presenca'
import Estatisticas from './Estatisticas'
export default function App() {
  const [tab, setTab] = useState('presenca')
  return (
    <div>
      <div style={{position:'sticky',top:0,zIndex:100,background:'#080f1a',borderBottom:'2px solid rgba(255,255,255,0.08)',display:'flex'}}>
        <button onClick={()=>setTab('presenca')} style={{flex:1,padding:'12px 4px',border:'none',background:'transparent',color:tab==='presenca'?'#fff':'#7a9ab0',fontSize:'0.78rem',fontWeight:700,cursor:'pointer',borderBottom:tab==='presenca'?'3px solid #4fc3f7':'3px solid transparent'}}>
          Presenca
        </button>
        <button onClick={()=>setTab('estatisticas')} style={{flex:1,padding:'12px 4px',border:'none',background:'transparent',color:tab==='estatisticas'?'#fff':'#7a9ab0',fontSize:'0.78rem',fontWeight:700,cursor:'pointer',borderBottom:tab==='estatisticas'?'3px solid #ff3333':'3px solid transparent'}}>
          Ranking
        </button>
        <button onClick={()=>setTab('pagamentos')} style={{flex:1,padding:'12px 4px',border:'none',background:'transparent',color:tab==='pagamentos'?'#fff':'#7a9ab0',fontSize:'0.78rem',fontWeight:700,cursor:'pointer',borderBottom:tab==='pagamentos'?'3px solid #00c853':'3px solid transparent'}}>
          Pagamentos
        </button>
      </div>
      {tab === 'presenca' && <Presenca />}
      {tab === 'estatisticas' && <Estatisticas />}
      {tab === 'pagamentos' && <Pagamentos />}
    </div>
  )
}
