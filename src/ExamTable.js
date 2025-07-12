import React, { useState } from 'react';

// Rimuovo PAGE_SIZE e logica paginazione
const sorters = {
  nome: (a, b) => a.nome.localeCompare(b.nome),
  cfu: (a, b) => b.cfu - a.cfu,
  voto: (a, b) => {
    // Normalizzo tutto a maiuscolo e tolgo spazi
    const va = typeof a.voto === 'string' ? a.voto.trim().toUpperCase() : a.voto;
    const vb = typeof b.voto === 'string' ? b.voto.trim().toUpperCase() : b.voto;
    // APP e NULL sono i più bassi
    const toNum = v => {
      if (v === 'APP' || v === 'NULL') return -2;
      if (v === '30L') return 31;
      const n = parseInt(v);
      return isNaN(n) ? -2 : n;
    };
    return toNum(vb) - toNum(va);
  }
};

function ExamTable({ esami, onDelete, onEdit }) {
  const [sortBy, setSortBy] = useState('voto');

  const sorted = [...esami].sort(sorters[sortBy]);

  return (
    <div>
      <h3>Esami</h3>
      <div className="mb-2">
        <span>Ordina per: </span>
        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setSortBy('voto')}>Voto</button>
        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setSortBy('nome')}>Nome corso</button>
        <button className="btn btn-sm btn-outline-primary" onClick={() => setSortBy('cfu')}>CFU</button>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nome corso</th>
              <th>CFU</th>
              <th>Voto</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((esame, i) => (
              <tr key={i}>
                <td>{esame.nome}</td>
                <td>{esame.cfu}</td>
                <td>{esame.voto}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(esami.indexOf(esame))}>Modifica</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(esami.indexOf(esame))}>Elimina</button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={4} className="text-center">Nessun esame inserito</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExamTable; 