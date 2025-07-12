import React, { useState } from 'react';

function calcolaStatistiche(esami) {
  const pesi = esami.map(e => parseInt(e.cfu));
  const voti = esami.map(e => {
    const voto = typeof e.voto === 'string' ? e.voto.trim().toUpperCase() : e.voto;
    if (voto === '30L') return 30;
    if (voto === 'APP') return 'APP';
    if (voto === 'NULL') return null;
    const n = parseInt(voto);
    return isNaN(n) ? null : n;
  });
  const cfuTotali = pesi.reduce((a, b) => a + b, 0);
  // CFU completati: esami con voto numerico, 30L o APP
  const cfuCompletati = pesi.filter((_, i) => voti[i] !== null).reduce((a, b) => a + b, 0);
  // Esami superati: voto numerico, 30L o APP
  const esamiSuperati = voti.filter(v => v !== null).length;
  const esamiTotali = esami.length;
  // Solo i numerici e 30L per la media
  const votiNumerici = voti.filter(v => typeof v === 'number');
  const pesiNumerici = pesi.filter((_, i) => typeof voti[i] === 'number');
  const media = votiNumerici.length ? votiNumerici.reduce((a, b) => a + b, 0) / votiNumerici.length : 0;
  const mediaPesata = pesiNumerici.length ? votiNumerici.reduce((sum, v, i) => sum + v * pesiNumerici[i], 0) / pesiNumerici.reduce((a, b) => a + b, 0) : 0;
  const media110 = mediaPesata ? (mediaPesata * 110) / 30 : 0;
  return {
    media,
    mediaPesata,
    media110,
    esamiSuperati,
    esamiTotali,
    cfuCompletati,
    cfuTotali
  };
}

function StatsPanel({ esami }) {
  const stats = calcolaStatistiche(esami);
  return (
    <div className="card">
      <div className="card-header">Statistiche</div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Media aritmetica: <strong>{stats.media.toFixed(2)}</strong></li>
        <li className="list-group-item">Media ponderata: <strong>{stats.mediaPesata.toFixed(2)}</strong></li>
        <li className="list-group-item">Media in 110: <strong>{stats.media110.toFixed(2)}</strong></li>
        <li className="list-group-item">Esami superati: <strong>{stats.esamiSuperati}/{stats.esamiTotali}</strong></li>
        <li className="list-group-item">CFU completati: <strong>{stats.cfuCompletati}/{stats.cfuTotali}</strong></li>
      </ul>
    </div>
  );
}

export default StatsPanel; 