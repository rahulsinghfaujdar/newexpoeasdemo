import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, G, Line, Path, Pattern, Rect, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { PRIORITY_COLORS } from '../theme/colors';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const NODE_R = 8;
const DEPOT_R = 10;
const GLOW = 5;

const RouteMapViz = ({ route }) => {
  const [canvasW, setCanvasW] = useState(300);
  const onLayout = e => {
    const w = Math.floor(e.nativeEvent.layout.width);
    if (w > 0) setCanvasW(w);
  };

  const dashOffset = useSharedValue(0);
  useEffect(() => {
    dashOffset.value = withRepeat(
      withTiming(-10, { duration: 600, easing: Easing.linear }),
      -1,
      false,
    );
  }, [dashOffset]);
  const animEdgeProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const n = route.length;
  const edgePad = NODE_R + GLOW + 8;
  const depotAreaH = DEPOT_R + GLOW + 18;
  const topPad = depotAreaH + 24;
  const botPad = edgePad;
  const rowH = 50;
  const canvasH = Math.max(220, topPad + botPad + Math.max(0, n - 1) * rowH);

  const positions = route.map((order, idx) => {
    const hash = order.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const nudge = ((hash % 20) - 10);
    const isRight = idx % 2 === 1;
    const baseX = isRight ? canvasW * 0.68 : canvasW * 0.32;
    const x = Math.max(edgePad, Math.min(canvasW - edgePad, baseX + nudge));
    const span = canvasH - topPad - botPad;
    const y = n <= 1 ? topPad + span / 2 : topPad + (idx / (n - 1)) * span;
    return { x, y };
  });

  const depotX = canvasW / 2;
  const depotY = DEPOT_R + GLOW + 8;

  return (
    <View onLayout={onLayout} style={{ width: '100%' }}>
      <Svg width={canvasW} height={canvasH}>
        <Defs>
          <Pattern id="mapgrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <Path d="M 28 0 L 0 0 0 28" fill="none" stroke="#252525" strokeWidth="1" />
          </Pattern>
        </Defs>
        <Rect width={canvasW} height={canvasH} fill="#151515" />
        <Rect width={canvasW} height={canvasH} fill="url(#mapgrid)" />

        {positions.length > 0 && (
          <AnimatedLine
            animatedProps={animEdgeProps}
            x1={depotX} y1={depotY}
            x2={positions[0].x} y2={positions[0].y}
            stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="6,4"
            strokeLinecap="round" strokeOpacity="0.65"
          />
        )}

        {positions.slice(0, -1).map((pos, i) => (
          <AnimatedLine
            key={`cl${i}`}
            animatedProps={animEdgeProps}
            x1={pos.x} y1={pos.y}
            x2={positions[i + 1].x} y2={positions[i + 1].y}
            stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="6,4"
            strokeLinecap="round" strokeOpacity="0.6"
          />
        ))}

        <G>
          <Circle cx={depotX} cy={depotY} r={DEPOT_R + GLOW + 2} fill="#FBBF2410" />
          <Circle cx={depotX} cy={depotY} r={DEPOT_R + GLOW - 1} fill="#FBBF2420" />
          <Circle cx={depotX} cy={depotY} r={DEPOT_R} fill="#1f1f1f"
            stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="4,3" />
          <SvgText x={depotX} y={depotY + 4} textAnchor="middle"
            fill="#FBBF24" fontSize="9" fontWeight="bold">D</SvgText>
        </G>

        {positions.map(({ x, y }, idx) => {
          const order = route[idx];
          const pc = PRIORITY_COLORS[order.priority];
          return (
            <G key={order.id}>
              <Circle cx={x} cy={y} r={NODE_R + GLOW} fill={pc + '18'} />
              <Circle cx={x} cy={y} r={NODE_R + 2} fill={pc + '30'} />
              <Circle cx={x} cy={y} r={NODE_R} fill={pc} />
              <SvgText x={x} y={y + 3} textAnchor="middle"
                fill="#fff" fontSize="8" fontWeight="bold">
                {idx + 1}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default RouteMapViz;