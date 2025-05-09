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

    const fetchAndDraw = async() =>{
      try{
        const res = await axios.post('http://localhost:3000/reconstruction/findFinalStrokeData', {
      drawingid : "681e640b3acaafe0f9cc9943"});
        console.log('✅ 프론트에서 받은 stroke 데이터:', res.data);
        const strokes = res.data.result.finalStrokes.strokes;
        console.log(strokes);
        await playTimelapse(canvas, strokes);
      }catch(err){
        console.error('❌ React 요청 에러:', err);
      }
    }

    fetchAndDraw();
  
  }, []);

  const playTimelapse = async (canvas, strokes) => { 
    strokes.sort((a, b) => a.strokeOrder - b.strokeOrder);
    
    for(const stroke of strokes){
      const points = stroke.points;
      const isErasing = stroke.isErasing;
      const strokeColor = `#${stroke.color.slice(-6)}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        
        const delay = curr.t - prev.t;
        await new Promise(resolve=> setTimeout(resolve, delay));
  
        // 개별 선분 생성
        const line = new fabric.Line([prev.x, prev.y, curr.x, curr.y], {
          stroke: strokeColor,
          strokeWidth: (prev.p ?? 1) * 1, // 필압 기반 굵기 (스케일 조정 가능)
          strokeLineCap: 'round',      // 선 끝을 둥글게
          strokeLineJoin: 'round',     // 꺾이는 부분을 둥글게
          strokeMiterLimit: 10,
          fill: null,
          selectable: false,
        });
  
        if (isErasing) {
          const pt = new fabric.Point(curr.x, curr.y);
          canvas.getObjects().forEach(obj => {
            if (obj.containsPoint(pt)) canvas.remove(obj);
          });
        } else {
          canvas.add(line);
        }
      }
  
      canvas.renderAll();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    // const lastPointT = points.at(-1)?.t ?? 0;
    // totalDelay += lastPointT + 100;
  };

  return (
    <div>
      <h2>타임랩스 그림 재현</h2>
      <canvas id="c" width={800} height={600} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
}

export default CanvasPage;
