import React, { useState, useEffect } from 'react';

const initialState = { nome: '', cfu: '', voto: '' };

function ExamForm({ onAdd, editing, onUpdate, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm(initialState);
  }, [editing]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nome || !form.cfu || !form.voto) {
      setError('All fields are required');
      return;
    }
    if (isNaN(form.cfu) || parseInt(form.cfu) <= 0) {
      setError('CFU must be a positive number');
      return;
    }
    const voto = form.voto.trim().toUpperCase();
    if (
      voto !== 'APP' &&
      voto !== '30L' &&
      voto !== 'NULL' &&
      (isNaN(voto) || voto < 18 || voto > 30)
    ) {
      setError('Invalid grade. Accepted values: 18-30, 30L, APP, NULL');
      return;
    }
    setError(null);
    if (editing) onUpdate(editing.index, { ...form, voto });
    else onAdd({ ...form, voto });
    setForm(initialState);
  };

  return (
    <div>
      <h3>{editing ? 'Modifica Esame' : 'Aggiungi Esame'}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-2">
          <label className="form-label">Nome corso</label>
          <input type="text" className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">CFU</label>
          <input type="number" className="form-control" name="cfu" value={form.cfu} onChange={handleChange} min="1" required />
        </div>
        <div className="mb-2">
          <label className="form-label">Voto</label>
          <input type="text" className="form-control" name="voto" value={form.voto} onChange={handleChange} placeholder="es: 28, 30L, APP, NULL" required />
        </div>
        <div className="form-text mb-2">
          <strong>Legenda voti:</strong> <br/>
          <span><b>18-30</b>: voto numerico<br/>
          <b>30L</b>: trenta e lode<br/>
          <b>APP</b>: esame passato (idoneità o superato senza voto)<br/>
          <b>NULL</b>: esame non valutato o non superato</span>
        </div>
        <button type="submit" className="btn btn-primary me-2">{editing ? 'Salva' : 'Aggiungi'}</button>
        {editing && <button type="button" className="btn btn-secondary" onClick={onCancel}>Annulla</button>}
      </form>
    </div>
  );
}

export default ExamForm; 