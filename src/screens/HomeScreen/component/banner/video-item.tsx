import { useVideoPlayer, VideoView } from 'expo-video';
import { IVideoItemComponent } from './interface';

export const VideoItem = ({ url, style, ...rest }: IVideoItemComponent) => {
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
    player.play();
  });
  

  return (
    <VideoView
      player={player}
      style={[{ flex: 1, borderRadius: 8 }, style]}
      contentFit="cover"
      {...rest}
    />
  );
};
