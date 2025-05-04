import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';

function CanvasPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas('c', {
      isDrawingMode: false,
      selection: false,
    });
    canvasRef.current = canvas;

    axios.get('http://localhost:3000/json')
    .then(res => {
      console.log('✅ 프론트에서 받은 stroke 데이터:', res.data);
      const strokes = res.data.strokes;
      playTimelapse(canvas, strokes);
    })
    .catch(err => {
      console.error('❌ React 요청 에러:', err);
    });
  
  }, []);

  const playTimelapse = (canvas, strokes) => {
    strokes.sort((a, b) => a.strokeOrder - b.strokeOrder);
  
    let totalDelay = 0;
  
    strokes.forEach(stroke => {
      const points = stroke.points;
      if (!points || points.length === 0) return;
  
      const isErasing = stroke.isErasing;
      const strokeColor = `#${stroke.color.slice(-6)}`; // 마지막 6자리만
  
      let pathPoints = [];
      points.forEach((pt, i) => {
        if (i === 0) pathPoints.push(`M ${pt.x} ${pt.y}`);
        else pathPoints.push(`L ${pt.x} ${pt.y}`);
      });
  
      const pathData = pathPoints.join(' ');
  
      setTimeout(() => {
        const path = new fabric.Path(pathData, {
          stroke: strokeColor,
          strokeWidth: stroke.strokeWidth,
          fill: null,
          selectable: false,
        });
  
        if (isErasing) {
          const allPoints = points.map(pt => new fabric.Point(pt.x, pt.y));
          canvas.getObjects().forEach(obj => {
            allPoints.forEach(pt => {
              if (obj.containsPoint(pt)) canvas.remove(obj);
            });
          });
        } else {
          canvas.add(path);
        }
  
        canvas.renderAll();
      }, totalDelay);
  
      const lastPointT = points.at(-1)?.t ?? 0;
      totalDelay += lastPointT + 100;
    });
  };
  

  return (
    <div>
      <h2>타임랩스 그림 재현</h2>
      <canvas id="c" width={800} height={600} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
}

export default CanvasPage;
