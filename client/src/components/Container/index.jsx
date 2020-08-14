import React, { useState, useEffect } from 'react';

import api from '../../services/api';

import './styles.css';

function Container({ title, placeholder }) {

  const [express, setExpress] = useState({});
  const [id, setId] = useState('');

  async function getInfo() {
    const response = await api('/');

    if (response.status !== 200) throw Error('Error');

    return setExpress(response.data);
  }

  async function sendVideoInfos() {
    const response = await api('/', {
      method: 'POST',
      data: {
        id
      },
    });

    window.location = response.data;
  }

  useEffect(() => {
    getInfo();
  }, []);


  return (
    <div className="container">
      <h1>{title}</h1>
      <input type="text" placeholder={placeholder} onChange={(e) => { return setId(e.target.value) }} />
      <input type="button" onClick={sendVideoInfos} value="Buscar vídeo" /> <br />
      <h5>Back-end: {express.express === 'On-line' ? express.express : 'Off-line'}</h5>
    </div>
  );
}

export default Container;