import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas('c', {
      isDrawingMode: false,
      selection: false,
    });
    canvasRef.current = canvas;

    axios.get('http://localhost:3000/json') // json 포맷으로 받기
      .then(res => {
        const strokes = res.data.strokes;
        playTimelapse(canvas, strokes);
      });
  }, []);

  const playTimelapse = (canvas, strokes) => {
    strokes.sort((a, b) => a.timestamp - b.timestamp); // stroke 순서 정렬

    let totalDelay = 0;

    strokes.forEach(stroke => {
      const points = stroke.points;

      let pathPoints = [];
      let strokeStart = stroke.timestamp;

      points.forEach((pt, i) => {
        setTimeout(() => {
          pathPoints.push(`L ${pt.x} ${pt.y}`);
          if (i === 0) pathPoints[0] = `M ${pt.x} ${pt.y}`;

          const pathData = pathPoints.join(' ');
          const path = new fabric.Path(pathData, {
            stroke: stroke.color,
            strokeWidth: stroke.strokeWidth,
            fill: null,
            selectable: false,
          });

          canvas.add(path);
          canvas.renderAll();
        }, totalDelay + pt.t);
      });

      // 다음 stroke 시작 시점 보정
      const lastPointT = points.at(-1)?.t ?? 0;
      totalDelay += lastPointT + 100; // 약간의 간격 추가
    });
  };

  return (
    <div>
      <h2>타임랩스 그림 재현</h2>
      <canvas id="c" width={800} height={600} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
}

export default App;
