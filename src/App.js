import React, { useState, useEffect, useRef } from 'react';
import ExamTable from './ExamTable';
import ExamForm from './ExamForm';
import StatsPanel from './StatsPanel';
import ImportExportPanel from './ImportExportPanel';

const LOCAL_KEY = 'esami-list';

function loadEsami() {
  const data = localStorage.getItem(LOCAL_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveEsami(esami) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(esami));
}

function App() {
  const [esami, setEsami] = useState(() => {
    // Se c'è ?data= nell'URL, importa da lì
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const esami = JSON.parse(decodeURIComponent(data));
        // Rimuovo il parametro data dall'URL
        const url = new URL(window.location);
        url.searchParams.delete('data');
        window.history.replaceState({}, '', url);
        return esami;
      } catch {
        return loadEsami();
      }
    }
    return loadEsami();
  });
  const [editing, setEditing] = useState(null); // esame in modifica o null
  const formRef = useRef(null);

  useEffect(() => {
    saveEsami(esami);
  }, [esami]);

  const handleAdd = (esame) => {
    setEsami([...esami, esame]);
  };

  const handleDelete = (index) => {
    setEsami(esami.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditing({ ...esami[index], index });
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  };

  const handleUpdate = (index, esame) => {
    setEsami(esami.map((e, i) => (i === index ? esame : e)));
    setEditing(null);
  };

  const handleImport = (imported) => {
    setEsami(imported);
  };

  return (
    <>
      <div className="container py-4">
        <h1 className="mb-4 text-center">Exami</h1>
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <StatsPanel esami={esami} />
          </div>
          <div className="col-md-6 mb-3">
            <ImportExportPanel esami={esami} onImport={handleImport} />
          </div>
        </div>
        <hr className="my-4" />
        <div className="row mb-4">
          <div className="col-12 mb-4">
            <div id="exam-form" ref={formRef} />
            <ExamForm onAdd={handleAdd} editing={editing} onUpdate={handleUpdate} onCancel={() => setEditing(null)} />
          </div>
          <div className="col-12">
            <ExamTable esami={esami} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </div>
      </div>
      <footer className="text-center text-secondary py-3" style={{fontSize: '1.05rem'}}>
        Made by Giovanni Norbedo &middot; <a href="https://norbedo.xyz" target="_blank" rel="noopener noreferrer">norbedo.xyz</a>
      </footer>
    </>
  );
}

export default App; 