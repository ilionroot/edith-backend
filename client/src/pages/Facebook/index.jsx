import React from 'react';

import Container from '../../components/Container';
import NavBar from '../../components/NavBar';

import './styles.css';

function Facebook() {
  return (
    <>
      <NavBar />
      <Container title="Facebook" placeholder="ID do vídeo no Facebook..." />
    </>
  );
}

export default Facebook;