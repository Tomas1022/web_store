import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [tab, setTab] = useState('juegos');
  const [juegos, setJuegos] = useState([]);
  const [desarrolladores, setDesarrolladores] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevoJuego, setNuevoJuego] = useState({ title: '', genre: '', price: '', stock: '', release_date: '', desarrollador_id: '' });
  const [nuevoDesarrollador, setNuevoDesarrollador] = useState({ nombre: '', pais: '' });
  const [mensaje, setMensaje] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  const token = localStorage.getItem('token');

  const cargarDatos = () => {
    fetch('http://localhost:3001/juegos')
      .then(res => res.json()).then(data => setJuegos(data));
    fetch('http://localhost:3001/desarrolladores')
      .then(res => res.json()).then(data => setDesarrolladores(data));
  };

  useEffect(() => {
    if (rol !== 'admin') { navigate('/'); return; }
    cargarDatos();
  }, [rol, navigate]);

  const handleGuardar = async () => {
    const res = await fetch(`http://localhost:3001/juegos/${editando.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ price: editando.price, stock: editando.stock, title: editando.title, genre: editando.genre, descripcion: editando.descripcion, requisitos: editando.requisitos })
    });
    if (res.ok) {
      setJuegos(juegos.map(j => j.id === editando.id ? editando : j));
      setEditando(null);
      mostrarMensaje('✅ Juego actualizado');
    }
  };

  const handleAgregarJuego = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', nuevoJuego.title);
    formData.append('genre', nuevoJuego.genre);
    formData.append('price', nuevoJuego.price);
    formData.append('stock', nuevoJuego.stock);
    formData.append('release_date', nuevoJuego.release_date);
    formData.append('desarrollador_id', nuevoJuego.desarrollador_id);
    if (imagenFile) formData.append('imagen', imagenFile);

    const res = await fetch('http://localhost:3001/juegos', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      setNuevoJuego({ title: '', genre: '', price: '', stock: '', release_date: '', desarrollador_id: '' });
      setImagenFile(null);
      setPreview(null);
      cargarDatos();
      mostrarMensaje('✅ Juego agregado correctamente');
    }
  };

  const handleAgregarDesarrollador = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/desarrolladores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevoDesarrollador)
    });
    if (res.ok) {
      setNuevoDesarrollador({ nombre: '', pais: '' });
      cargarDatos();
      mostrarMensaje('✅ Desarrollador agregado correctamente');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Confirma que desea eliminar este juego?')) return;
    const res = await fetch(`http://localhost:3001/juegos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setJuegos(juegos.filter(j => j.id !== id));
      mostrarMensaje('✅ Juego eliminado correctamente');
    }
  };

  const handleCambiarImagen = async (file, id) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('imagen', file);
    const res = await fetch(`http://localhost:3001/juegos/${id}/imagen`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      cargarDatos();
      mostrarMensaje('✅ Imagen actualizada correctamente');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImagenFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold text-yellow-400">⚙️ Panel Admin</h1>
        <button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          🎮 Ver Catálogo
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {mensaje && (
          <div className="bg-green-900 text-green-300 px-4 py-3 rounded-lg mb-6 text-sm">{mensaje}</div>
        )}

        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab('juegos')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${tab === 'juegos' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>🎮 Juegos</button>
          <button onClick={() => setTab('desarrolladores')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${tab === 'desarrolladores' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>🏢 Desarrolladores</button>
        </div>

        {/* TAB JUEGOS */}
        {tab === 'juegos' && (
          <div className="flex flex-col gap-8">
            {/* Formulario nuevo juego */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">➕ Agregar Juego</h2>
              <form onSubmit={handleAgregarJuego} className="grid grid-cols-2 gap-4">
                <input value={nuevoJuego.title} onChange={e => setNuevoJuego({...nuevoJuego, title: e.target.value})} placeholder="Título" required className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <input value={nuevoJuego.genre} onChange={e => setNuevoJuego({...nuevoJuego, genre: e.target.value})} placeholder="Género" required className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <input type="number" value={nuevoJuego.price} onChange={e => setNuevoJuego({...nuevoJuego, price: e.target.value})} placeholder="Precio" required className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <input type="number" value={nuevoJuego.stock} onChange={e => setNuevoJuego({...nuevoJuego, stock: e.target.value})} placeholder="Stock" required className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <input type="date" value={nuevoJuego.release_date} onChange={e => setNuevoJuego({...nuevoJuego, release_date: e.target.value})} required className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <select value={nuevoJuego.desarrollador_id} onChange={e => setNuevoJuego({...nuevoJuego, desarrollador_id: e.target.value})} required className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <option value="">Selecciona desarrollador</option>
                  {desarrolladores.map(d => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
                {/* Drag & Drop */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById('fileInput').click()}
                  className={`col-span-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-yellow-400 bg-yellow-900/20' : 'border-gray-600 hover:border-gray-400'}`}
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="h-40 mx-auto object-cover rounded-lg" />
                  ) : (
                    <div className="text-gray-400">
                      <p className="text-3xl mb-2">🖼️</p>
                      <p className="text-sm">Arrastra una imagen aquí o haz click para seleccionar</p>
                    </div>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setImagenFile(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <button type="submit" className="col-span-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition-colors">
                  Agregar Juego
                </button>
              </form>
            </div>

            {/* Tabla juegos */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <h2 className="text-xl font-bold p-6 text-yellow-400">Lista de Juegos</h2>
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-300">Título</th>
                    <th className="text-left px-6 py-3 text-gray-300">Género</th>
                    <th className="text-left px-6 py-3 text-gray-300">Precio</th>
                    <th className="text-left px-6 py-3 text-gray-300">Stock</th>
                    <th className="text-left px-6 py-3 text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {juegos.map(juego => (
                    <>
                      <tr key={juego.id} className="border-t border-gray-700">
                        <td className="px-6 py-4">
                          {editando?.id === juego.id ? (
                            <input value={editando.title} onChange={e => setEditando({...editando, title: e.target.value})} className="bg-gray-700 text-white px-3 py-1 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                          ) : (
                            <span className="font-semibold text-purple-400">{juego.title}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editando?.id === juego.id ? (
                            <input value={editando.genre} onChange={e => setEditando({...editando, genre: e.target.value})} className="bg-gray-700 text-white px-3 py-1 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                          ) : (
                            <span className="text-gray-300">{juego.genre}</span>
                          )}
                        </td>
                        {editando?.id === juego.id ? (
                          <>
                            <td className="px-6 py-4"><input type="number" value={editando.price} onChange={e => setEditando({...editando, price: e.target.value})} className="bg-gray-700 text-white px-3 py-1 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-yellow-500" /></td>
                            <td className="px-6 py-4"><input type="number" value={editando.stock} onChange={e => setEditando({...editando, stock: e.target.value})} className="bg-gray-700 text-white px-3 py-1 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-yellow-500" /></td>
                            <td className="px-6 py-4 flex gap-2">
                              <button onClick={handleGuardar} className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-lg">✅ Guardar</button>
                              <button onClick={() => setEditando(null)} className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-3 py-1 rounded-lg">Cancelar</button>
                              <label className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded-lg cursor-pointer">
                                🖼️
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleCambiarImagen(e.target.files[0], editando.id)} />
                              </label>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 text-green-400">${juego.price}</td>
                            <td className="px-6 py-4 text-gray-300">{juego.stock}</td>
                            <td className="px-6 py-4 flex gap-2">
                              <button onClick={() => setEditando({...juego})} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg">Editar</button>
                              <button onClick={() => handleEliminar(juego.id)} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg">Eliminar</button>
                            </td>
                          </>
                        )}
                      </tr>

                      {/* Panel expandible descripción y requisitos */}
                      {editando?.id === juego.id && (
                        <tr className="border-t border-gray-600">
                          <td colSpan={5} className="px-6 py-4 bg-gray-750">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-400 mb-1 block">📖 Descripción</label>
                                <textarea
                                  value={editando.descripcion || ''}
                                  onChange={e => setEditando({...editando, descripcion: e.target.value})}
                                  placeholder="Descripción del juego..."
                                  rows={4}
                                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-gray-400 mb-1 block">💻 Requisitos del sistema</label>
                                <textarea
                                  value={editando.requisitos || ''}
                                  onChange={e => setEditando({...editando, requisitos: e.target.value})}
                                  placeholder="SO: Windows 10&#10;RAM: 8GB&#10;GPU: GTX 660..."
                                  rows={4}
                                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none text-sm"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB DESARROLLADORES */}
        {tab === 'desarrolladores' && (
          <div className="flex flex-col gap-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">➕ Agregar Desarrollador</h2>
              <form onSubmit={handleAgregarDesarrollador} className="flex gap-4">
                <input value={nuevoDesarrollador.nombre} onChange={e => setNuevoDesarrollador({...nuevoDesarrollador, nombre: e.target.value})} placeholder="Nombre" required className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <input value={nuevoDesarrollador.pais} onChange={e => setNuevoDesarrollador({...nuevoDesarrollador, pais: e.target.value})} placeholder="País" required className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">Agregar</button>
              </form>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <h2 className="text-xl font-bold p-6 text-yellow-400">Lista de Desarrolladores</h2>
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-300">ID</th>
                    <th className="text-left px-6 py-3 text-gray-300">Nombre</th>
                    <th className="text-left px-6 py-3 text-gray-300">País</th>
                  </tr>
                </thead>
                <tbody>
                  {desarrolladores.map(d => (
                    <tr key={d.id} className="border-t border-gray-700">
                      <td className="px-6 py-4 text-gray-400">{d.id}</td>
                      <td className="px-6 py-4 font-semibold text-purple-400">{d.nombre}</td>
                      <td className="px-6 py-4 text-gray-300">{d.pais}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
