import React from 'react';
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DraggableSectionListItem } from './DraggableSectionListItem';

function sectionListToArray(list) {
  const sections = Object.values(list);
  const outputArray = [];
  let positionIndex = 0;

  // DEVNOTE: Loop in sections
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    outputArray.push({
      draggableId: `draggable-id-${positionIndex}`,
      draggablePosition: positionIndex,
      draggableType: 'section',
      isFirstItemDraggable: sections[sectionIndex].isFirstItemDraggable,
      data: {
        title: sections[sectionIndex].title,
      }
    });
    positionIndex++;

    // DEVNOTE: Loop in items of the section
    const items = sections[sectionIndex].data || [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      outputArray.push({
        draggableId: `draggable-id-${positionIndex}`,
        draggablePosition: positionIndex,
        draggableType: 'item',
        isDraggable: items[itemIndex].draggable ?? !items[itemIndex].draggable,
        data: {
          ...items[itemIndex]
        }
      });
      positionIndex++;
    }
  }
  return outputArray;
}

function arrayToObject(items) {
  const outputObject = {};
  for (let index = 0; index < items.length; index++) {
    outputObject[items[index].draggableId] = {
      draggablePosition: items[index].draggablePosition,
      draggableType: items[index].draggableType,
      isDraggable: items[index].isDraggable,
    };
  }
  return outputObject;
}

const ITEM_HEIGHT = 70;

export function DraggableSectionList({ data, renderSectionHeader, renderItem }) {
  const list = sectionListToArray(data)
  const positions = useSharedValue(arrayToObject(list));
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: 'white',
          }}
          contentContainerStyle={{
            height: list.length * ITEM_HEIGHT,
          }}
        >
          {list.map((item) => (
            <DraggableSectionListItem
              key={item.draggableId}
              draggableId={item.draggableId}
              positions={positions}
              scrollY={scrollY}
              itemsCount={list.length}
            >
              {item.draggableType === 'section'
                ? renderSectionHeader(item.data)
                : renderItem(item.data)
              }
            </DraggableSectionListItem>
          ))}
        </Animated.ScrollView>
      </GestureHandlerRootView>
    </>
  );
}