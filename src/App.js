import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/json')
      .then((response) => {
        setSvgContent(response.data); // SVG 문자열
      })
      .catch((error) => {
        console.error('SVG 로딩 실패:', error);
      });
  }, []);

  return (
    <div>
      <h2>그림 재현 (SVG)</h2>
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ width: 800, height: 600, border: '1px solid #ccc' }}
      />
    </div>
  );
}

export default App;
