import React, { useRef } from 'react';

function toCSV(esami) {
  const header = 'Nome Corso,CFU,Voto';
  const rows = esami.map(e => `${e.nome},${e.cfu},${e.voto}`);
  return [header, ...rows].join('\n');
}

function fromCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  // Se la prima riga è un header, la salta
  const hasHeader = /cfu/i.test(lines[0]) && /voto/i.test(lines[0]);
  const dataLines = hasHeader ? lines.slice(1) : lines;
  return dataLines
    .map(line => line.split(','))
    .filter(fields => fields.length === 3 && fields.some(f => f.trim() !== ''))
    .map(([nome, cfu, voto]) => ({ nome, cfu, voto }));
}

function ImportExportPanel({ esami, onImport }) {
  const fileInput = useRef();

  const handleExport = () => {
    const blob = new Blob([toCSV(esami)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'esami.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const imported = fromCSV(evt.target.result);
      onImport(imported);
    };
    reader.readAsText(file);
  };

  // --- LINK CONDIVISIBILE ---
  const getShareLink = () => {
    const base = window.location.origin + window.location.pathname;
    const data = encodeURIComponent(JSON.stringify(esami));
    return `${base}?data=${data}`;
  };

  const handleCopyLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="card">
      <div className="card-header">Importa/Esporta</div>
      <div className="card-body">
        <p className="mb-3 text-secondary">Importa, esporta o condividi i tuoi esami.</p>
        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-outline-success" onClick={handleExport}>
            Esporta CSV
          </button>
          <input type="file" accept=".csv" style={{ display: 'none' }} ref={fileInput} onChange={handleImport} />
          <button className="btn btn-outline-primary" onClick={() => fileInput.current.click()}>
            Importa CSV
          </button>
          <button className="btn btn-outline-secondary" onClick={handleCopyLink}>
            Copia link condivisibile
          </button>
          <button className="btn btn-outline-danger" onClick={() => { if(window.confirm('Sei sicuro di voler svuotare tutti gli esami?')) onImport([]); }}>
            Svuota tutto
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportExportPanel; 