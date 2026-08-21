import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';

// Android'dagi Image (Fresco/OkHttp) kodlanmagan "+" belgisini URL'da
// noto'g'ri talqin qilib, rasmni yuklolmasligi mumkin — shu sababli xavfsiz kodlaymiz.
const encodeImageUri = (uri) => (uri ? uri.replace(/\+/g, '%2B') : uri);

export default function Avatar({ letter = '?', size = 42, bgColor = '#e87a45', uri }) {
  const [failed, setFailed] = useState(false);
  const showImage = uri && !failed;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: showImage ? 'transparent' : bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {showImage ? (
        <Image
          source={{ uri: encodeImageUri(uri) }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={{ color: '#fff', fontSize: size * 0.4, fontWeight: '700' }}>
          {letter}
        </Text>
      )}
    </View>
  );
}
