// Aetheria - Prototipo React (un solo archivo)
// Hecho como referencia: replica funciones básicas tipo "Discord" (chat por canales, lista de servidores, miembros).
// Nota legal: no copiaremos marcas, logos ni código propietario. Esto es un prototipo educativo.

import React, {useState, useEffect, useRef} from 'react';

export default function AetheriaApp(){
  // Datos iniciales de ejemplo
  const initialServers = [{id: 's1', name: 'NosFugamos', color: 'bg-gradient-to-br from-indigo-600 to-purple-600'}, {id: 's2', name: 'Aetheria Guild', color: 'bg-gradient-to-br from-green-500 to-teal-500'}];
  const initialChannels = {
    s1: [ {id: 'c1', name: 'general', type: 'text'}, {id: 'c2', name: 'rol-play', type: 'text'}, {id: 'c3', name: 'anuncios', type: 'text'} ],
    s2: [ {id: 'c4', name: 'lounge', type: 'text'}, {id: 'c5', name: 'eventos', type: 'text'} ]
  };
  const initialMembers = [ {id:'u1',name:'Admin',status:'online'}, {id:'u2',name:'Player01',status:'idle'}, {id:'u3',name:'Guía',status:'dnd'} ];
  const [servers] = useState(initialServers);
  const [channels] = useState(initialChannels);
  const [currentServer, setCurrentServer] = useState('s1');
  const [currentChannel, setCurrentChannel] = useState('c1');
  const [messages, setMessages] = useState({ c1: [ {id:1, user:'Admin', text:'Bienvenidos a NosFugamos RP!', ts: Date.now()} ] });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(()=>{
    // Simula mensajes entrantes cada cierto tiempo (solo demo)
    const t = setInterval(()=>{
      const id = currentChannel;
      setMessages(prev=>{
        const next = {...prev};
        const list = next[id] ? [...next[id]] : [];
        list.push({id: Date.now(), user: 'Sistema', text: 'Mensaje de prueba automático', ts: Date.now()});
        next[id] = list;
        return next;
      });
    }, 20000);
    return ()=> clearInterval(t);
  }, [currentChannel]);

  useEffect(()=>{
    // Scroll automático al cambiar de canal o recibir mensaje
    if(messagesEndRef.current) messagesEndRef.current.scrollIntoView({behavior:'smooth'});
  }, [messages, currentChannel]);

  function sendMessage(e){
    e.preventDefault();
    if(!input.trim()) return;
    setMessages(prev=>{
      const next = {...prev};
      const list = next[currentChannel] ? [...next[currentChannel]] : [];
      list.push({id: Date.now(), user: 'Tú', text: input.trim(), ts: Date.now()});
      next[currentChannel] = list;
      return next;
    });
    setInput('');
  }

  const serverObj = servers.find(s => s.id === currentServer);
  const channelList = channels[currentServer] || [];
  const channelMessages = messages[currentChannel] || [];

  // UI
  return (
    <div className="min-h-screen flex bg-gray-900 text-white font-sans">
      {/* Barra de servidores */}
      <aside className="w-20 bg-gray-800 p-2 flex flex-col gap-2">
        {servers.map(s=> (
          <button key={s.id} onClick={()=>{setCurrentServer(s.id); setCurrentChannel((channels[s.id]||[])[0]?.id || '');}} className={`w-12 h-12 rounded-2xl flex items-center justify-center ${currentServer===s.id? 'ring-2 ring-offset-1 ring-indigo-400': ''}`}>
            <div className={`${s.color} w-full h-full rounded-xl flex items-center justify-center text-xs font-bold`}>{s.name[0]}</div>
          </button>
        ))}
        <div className="mt-auto text-xs text-gray-400 px-1">Aetheria</div>
      </aside>

      {/* Sidebar de canales */}
      <div className="w-64 bg-gray-850 p-4 border-r border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div>
            <div className="text-sm font-semibold">{serverObj?.name}</div>
            <div className="text-xs text-gray-400">#{channelList.find(c=>c.id===currentChannel)?.name || 'sin canal'}</div>
          </div>
        </div>
        <nav>
          <div className="text-xs uppercase text-gray-400 mb-2">Canales</div>
          <ul className="space-y-1">
            {channelList.map(c=> (
              <li key={c.id}>
                <button onClick={()=>setCurrentChannel(c.id)} className={`w-full text-left px-2 py-1 rounded ${currentChannel===c.id? 'bg-gray-700': 'hover:bg-gray-800'}`}>
                  # {c.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Área de chat */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
          <div>
            <div className="text-lg font-semibold">#{channelList.find(c=>c.id===currentChannel)?.name || 'canal'}</div>
            <div className="text-xs text-gray-400">Bienvenido a Aetheria — prototipo de chat</div>
          </div>
          <div className="text-sm text-gray-400">Usuarios: {initialMembers.length}</div>
        </header>

        <section className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {channelMessages.map(m=> (
              <div key={m.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm">{m.user[0]}</div>
                <div>
                  <div className="text-sm font-semibold">{m.user} <span className="text-xs text-gray-400 ml-2">{new Date(m.ts).toLocaleTimeString()}</span></div>
                  <div className="text-sm text-gray-200">{m.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <footer className="p-4 border-t border-gray-800">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder={`Enviar mensaje a #${channelList.find(c=>c.id===currentChannel)?.name || ''}`} className="flex-1 bg-gray-800 rounded px-3 py-2 outline-none" />
            <button className="px-4 py-2 bg-indigo-600 rounded hover:opacity-90">Enviar</button>
          </form>
        </footer>
      </main>

      {/* Lista de miembros */}
      <aside className="w-64 bg-gray-850 p-4 border-l border-gray-800">
        <div className="text-sm font-semibold mb-3">Miembros</div>
        <ul className="space-y-2">
          {initialMembers.map(m=> (
            <li key={m.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">{m.name[0]}</div>
              <div className="flex-1">
                <div className="text-sm">{m.name}</div>
                <div className="text-xs text-gray-400">{m.status}</div>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

/*
README rápido — cómo usar este prototipo
1) Copia este archivo a un proyecto React (Vite o Create React App).
2) Asegúrate de tener Tailwind configurado (el estilo usa clases Tailwind).
3) Ejecuta `npm run dev` o `npm start`.

Qué incluye
- Sidebar de servidores
- Lista de canales por servidor
- Área de chat con mensajes por canal (estado local simulado)
- Lista de miembros
- Simulación de mensajes automáticos

Siguientes pasos recomendados
- Añadir autenticación (Auth0, Clerk, o JWT personalizado)
- Conectar WebSocket real (Socket.IO o WebSocket nativo) para chat en tiempo real
- Implementar permisos y roles, subida de archivos, llamadas de voz/video (WebRTC)
- Diseño responsive y acceso móvil
*/
