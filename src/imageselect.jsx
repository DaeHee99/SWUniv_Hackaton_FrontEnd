import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Image, Line, Text } from 'react-konva';

const DrawingEditor = () => {
  const [image, setImage] = useState(null);
  const [lines, setLines] = useState([]);
  const [text, setText] = useState('');
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target.result;

      img.onload = () => {
        setImage(img);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleMouseDown = (event) => {
    if (!image) return; // 이미지가 없을 경우 그리기 작업 중지

    isDrawing.current = true;

    const { offsetX, offsetY } = event.evt;

    setLines([...lines, { points: [offsetX, offsetY] }]);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = event.evt;
    const updatedLines = [...lines];
    const lastLine = updatedLines[updatedLines.length - 1];

    lastLine.points = lastLine.points.concat([offsetX, offsetY]);

    setLines(updatedLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleImageLoad = () => {
    const img = imageRef.current;
    setImage(img);
  };

  const saveDrawing = () => {
    // 그림 데이터와 텍스트를 서버로 전송하는 로직을 작성하세요
    console.log('그림 저장:', lines, text);
    // TODO: 백엔드로 그림 데이터와 텍스트 전송
  };

  return (
    <div>
      <h1>그림 그리기</h1>
      <input type="file" onChange={handleImageChange} style={{ marginBottom: '10px' }} />

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          <Rect
            x={(window.innerWidth - 2000) / 2}
            y={(window.innerHeight - 800) / 2}
            width={2000}
            height={800}
            fill="rgba(255, 255, 255, 0.3)"
            stroke="black"
          />

          {image && (
            <Image
              image={image}
              x={(window.innerWidth - image.width) / 2}
              y={(window.innerHeight - image.height) / 2}
              ref={imageRef}
              draggable={false} // 이미지를 드래그할 수 없도록 설정
            />
          )}

          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke="white"
              strokeWidth={30}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
              listening={false} // 이미지 위에서는 마우스 이벤트를 받지 않도록 설정
            />
          ))}

          <Text
            text={text}
            x={window.innerWidth / 2}
            y={window.innerHeight / 2}
            fontSize={30}
            fill="white"
            align="center"
            listening={false} // 이미지 위에서는 마우스 이벤트를 받지 않도록 설정
          />
        </Layer>
      </Stage>

      <input type="text" value={text} onChange={handleTextChange} placeholder="텍스트 입력" />
      <button onClick={saveDrawing}>저장하기</button>
    </div>
  );
};

export default DrawingEditor;
