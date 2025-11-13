import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { VIDEO } from '@/utils/constants/videos';
import { useRouter } from 'expo-router';

export default function SplashVideo({ onLoaded, onFinish }: { onLoaded?: () => void; onFinish?: () => void }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const router = useRouter(); // ✅ for default fallback navigation
  const player = useVideoPlayer(VIDEO.SPLASH_SCREEN);

  useEffect(() => {
    if (player) {
      player.loop = false;
      player.muted = true;
    }
  }, [player]);

  useEffect(() => {
    const playTimeout = setTimeout(() => {
      player.play();
    }, 500);

    const statusSubscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
        player.play();
      }

      if (status.status === 'idle' && hasLoaded && !hasFinished) {
        setHasFinished(true);
        finishSplash();
      }
    });

    const endSubscription = player.addListener('playToEnd', () => {
      if (!hasFinished) {
        setHasFinished(true);
        finishSplash();
      }
    });

    const timeout = setTimeout(() => {
      if (hasLoaded && !hasFinished) {
        setHasFinished(true);
        finishSplash();
      }
    }, 5000);

    return () => {
      clearTimeout(playTimeout);
      clearTimeout(timeout);
      statusSubscription?.remove();
      endSubscription?.remove();
    };
  }, [player, hasLoaded, hasFinished]);

  const finishSplash = () => {
    if (onFinish) {
      onFinish();
    } else {
      router.replace('/(food-delivery)/(discovery)/discovery');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
      />
    </View>
  );
}
