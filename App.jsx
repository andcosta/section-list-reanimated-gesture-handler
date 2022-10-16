// Expo SDK40
// expo-blur: ~8.2.2
// expo-haptics: ~8.4.0
// react-native-gesture-handler: ~1.8.0
// react-native-reanimated: ^2.0.0-rc.0
// react-native-safe-area-context: 3.1.9

import React, { useState } from 'react';
import {
  Image,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { DraggableSectionList } from './src/components/DraggableSectionList';

const ALBUM_COVERS = {
  DISCOVERY:
    'https://upload.wikimedia.org/wikipedia/en/a/ae/Daft_Punk_-_Discovery.jpg',
  HUMAN_AFTER_ALL:
    'https://upload.wikimedia.org/wikipedia/en/0/0d/Humanafterall.jpg',
  HOMEWORK:
    'https://upload.wikimedia.org/wikipedia/en/9/9c/Daftpunk-homework.jpg',
  RANDOM_ACCESS_MEMORIES:
    'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg',
};

const DAFT_PUNK = 'Daft Punk';

const data = [
  {
      title: 'Main menu bar',
      isFirstItemDraggable: true,
      data: [
        {
          id: 'one-more-time',
          title: 'One More Time',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.DISCOVERY,
        },
        {
          id: 'digital-love',
          title: 'Digital Love',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.DISCOVERY,
        },
        {
          id: 'nightvision',
          title: 'Nightvision',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.DISCOVERY,
        },
        {
          id: 'something-about-us',
          title: 'Something About Us',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.DISCOVERY,
        },
        {
          id: 'veridis-quo',
          title: 'Veridis Quo',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.DISCOVERY,
        },
        {
          id: 'make-love',
          title: 'Make Love',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.HUMAN_AFTER_ALL,
        },
        {
          id: 'television-rules-the-nation',
          title: 'Television Rules the Nation',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.HUMAN_AFTER_ALL,
        },
      ],
  },
  {
      title: 'More view',
      data: [
        {
          id: 'phoenix',
          title: 'Phoenix',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.HOMEWORK,
        },
        {
          id: 'revolution-909',
          title: 'Revolution 909',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.HOMEWORK,
        },
        {
          id: 'around-the-world',
          title: 'Around the World',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.HOMEWORK,
        },
        {
          id: 'within',
          title: 'Within',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
        },
        {
          id: 'touch',
          title: 'Touch (feat. Paul Williams)',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
        },
        {
          id: 'beyond',
          title: 'Beyond',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
        },
        {
          id: 'motherboard',
          title: 'Motherboard',
          artist: DAFT_PUNK,
          cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
        },
      ],
  },
];

const SONG_HEIGHT = 70;
const SCROLL_HEIGHT_THRESHOLD = SONG_HEIGHT;

function Song({ artist, cover, title }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: SONG_HEIGHT,
        padding: 10,
      }}
    >
      <Image
        source={{ uri: cover }}
        style={{ height: 50, width: 50, borderRadius: 4 }}
      />

      <View
        style={{
          marginLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4,
          }}
        >
          {title}
        </Text>

        <Text style={{ fontSize: 12, color: 'gray' }}>{artist}</Text>
      </View>
    </View>
  );
}

function Header({ title }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: SONG_HEIGHT,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

export default function App() {

  return (
    <>  
        <StatusBar barStyle="white-content" />
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <DraggableSectionList
              data={data}
              renderSectionHeader={(section) => <Header title={section.title} />}
              renderItem={(data) => <Song artist={data.artist} cover={data.cover} title={data.title} />}
            />
          </SafeAreaView>
        </SafeAreaProvider>
    </>
  );
}