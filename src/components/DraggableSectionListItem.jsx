import React, { useState, useRef } from 'react';
import {
  useWindowDimensions,
} from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler';

const SONG_HEIGHT = 70;
const SCROLL_HEIGHT_THRESHOLD = SONG_HEIGHT;

function clamp(value, lowerBound, upperBound) {
    'worklet';
    return Math.max(lowerBound, Math.min(value, upperBound));
}

function objectMove(objectsWithPositions, from, to) {
    'worklet';
    const newObject = JSON.parse(JSON.stringify(objectsWithPositions));
    if (to === 0) {  return newObject; } 

    for (const id in objectsWithPositions) {
      if (objectsWithPositions[id].draggablePosition === from.draggablePosition) {
        newObject[id].draggablePosition = to;
      }
      
      if (objectsWithPositions[id].draggablePosition === to) {
        newObject[id].draggablePosition = from.draggablePosition;
      }
    }
    
    return newObject;
}

export function DraggableSectionListItem ({ draggableId, positions, scrollY, itemsCount, children }) {
    const dimensions = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [moving, setMoving] = useState(false);
    const top = useSharedValue(positions.value[draggableId].draggablePosition * SONG_HEIGHT);
    const isSelected = useSharedValue(false);
    const panRef = useRef(null);
    const longPressRef = useRef(null);

    const onLongPressEvent = useAnimatedGestureHandler({
      onActive: () => {
        isSelected.value = true;
      },
      onFinish: () => {
        isSelected.value = false;
      },
    });

    useAnimatedReaction(
      () => positions.value[draggableId].draggablePosition,
      (currentPosition, previousPosition) => {
        if (currentPosition !== previousPosition) {
          if (!moving) {
            top.value = withSpring(currentPosition * SONG_HEIGHT);
          }
        }
      },
      [moving]
    );
  
    const gestureHandler = useAnimatedGestureHandler({
      onStart() {
        runOnJS(setMoving)(true);
      },
      onActive(event) {
          const positionY = event.absoluteY + scrollY.value;
    
          if (positionY <= scrollY.value + SCROLL_HEIGHT_THRESHOLD) {
            scrollY.value = withTiming(0, { duration: 1500 });
          } else if (positionY >= scrollY.value + dimensions.height - SCROLL_HEIGHT_THRESHOLD) {
            const contentHeight = itemsCount * SONG_HEIGHT;
            const containerHeight = dimensions.height - insets.top - insets.bottom;
            const maxScroll = contentHeight - containerHeight;
            scrollY.value = withTiming(maxScroll, { duration: 1500 });
          } else {
            cancelAnimation(scrollY);
          }
    
          top.value = withTiming(positionY - SONG_HEIGHT, {
            duration: 16,
          });
    
          const newPosition = clamp(
            Math.floor(positionY / SONG_HEIGHT),
            0,
            itemsCount - 1
          );
    
          if (newPosition !== positions.value[draggableId].draggablePosition) {
            positions.value = objectMove(
              positions.value,
              positions.value[draggableId],
              newPosition
            );
          }
      },
      onFinish() {
        top.value = positions.value[draggableId].draggablePosition * SONG_HEIGHT;
        runOnJS(setMoving)(false);
      },
    });
  
    const animatedStyle = useAnimatedStyle(() => {
      return {
        position: 'absolute',
        left: 0,
        right: 20,
        top: top.value,
        zIndex: moving ? 1 : 0,
        backgroundColor: 'white',
      };
    }, [moving]);

    return (
      <LongPressGestureHandler
      ref={longPressRef}
      onGestureEvent={onLongPressEvent}
      simultaneousHandlers={panRef}
      minDurationMs={300}>
      <Animated.View style={animatedStyle}>
        <PanGestureHandler
          activeOffsetX={[-1, 1]}
          ref={panRef}
          onGestureEvent={gestureHandler}>
            <Animated.View>
              {children}
            </Animated.View>
        </PanGestureHandler>
      </Animated.View>
      </LongPressGestureHandler>
    );
  }