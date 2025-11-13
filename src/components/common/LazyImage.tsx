import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, StyleProp, View } from 'react-native';

// You can define a default placeholder or allow it to be passed as a prop
const DefaultPlaceholder: React.FC<{ style: StyleProp<ImageStyle> }> = ({ style }) => (
  <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' }]}>
    <ActivityIndicator size="small" color="#888888" />
  </View>
);

interface LazyImageProps {
  sourceUri: string | undefined | null;    // The actual image URL from MongoDB
  style: StyleProp<ImageStyle>;            // Style for the image/container (must include dimensions)
  isVisible: boolean;                      // CRUCIAL: Parent tells this component if it's in view
  placeholderComponent?: React.ReactNode;  // Optional custom placeholder
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onErrorComponent?: React.ReactNode;      // Optional component to show on load error
}

const LazyImage: React.FC<LazyImageProps> = ({
  sourceUri,
  style,
  isVisible,
  placeholderComponent,
  resizeMode = 'cover',
  onErrorComponent,
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMounted = useRef(true); // To prevent state updates on unmounted component

  // This ref ensures we only attempt to trigger the load once per unique sourceUri/visibility event
  const hasAttemptedLoadForCurrentVisibility = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isVisible && sourceUri && !hasAttemptedLoadForCurrentVisibility.current) {
      if (isMounted.current) {
        setShouldLoad(true); // Trigger the loading process
        setIsLoading(true);  // Show loading indicator immediately
        setHasError(false);  // Reset error state
      }
      hasAttemptedLoadForCurrentVisibility.current = true;
    } else if (!isVisible) {
      // If it becomes not visible again, reset the attempt flag
      // This allows it to reload if it scrolls out and back in, if desired.
      // If you only want it to load ONCE EVER, then manage `hasAttemptedLoad` differently
      // (e.g. a global ref based on sourceUri, or move `hasAttemptedLoad.current = true` inside the `if(isVisible)` block)
      hasAttemptedLoadForCurrentVisibility.current = false;
      // Optionally, reset shouldLoad to show placeholder again if it scrolls out of view
      // setShouldLoad(false); // This would make it unload and reload
    }
  }, [isVisible, sourceUri]);

  const onLoadSuccess = () => {
    if (isMounted.current) {
      setIsLoading(false);
      setHasError(false);
    }
  };

  const onLoadGenericEnd = () => {
    // onLoadEnd is called on both success and error on Android, and sometimes on iOS
    // We use specific onLoad and onError for more reliability
    if (isMounted.current) {
      // If still loading after this fires, it might be an error not caught by onError
      // or a success on some platforms. Let onLoadSuccess or onError handle final state.
    }
  };

  const onErrorLoading = () => {
    if (isMounted.current) {
      setIsLoading(false);
      setHasError(true);
      
    }
  };

  // If we shouldn't load yet, or there's no valid URI, show placeholder
  if (!shouldLoad || !sourceUri) {
    return placeholderComponent ? <>{placeholderComponent}</> : <DefaultPlaceholder style={style} />;
  }

  // If there was an error loading the image
  if (hasError) {
    return onErrorComponent ? <>{onErrorComponent}</> : (
      <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdd' }]}>
        {/* Basic error indicator */}
      </View>
    );
  }

  // Render the actual image
  return (
    <View style={style}>
      {/* The Image component that loads from the network */}
      <Image
        source={{ uri: sourceUri }}
        style={{width:"100%", height:"100%"}} // Image should fill the container defined by `props.style`
        resizeMode={resizeMode}
        onLoad={onLoadSuccess}       // Preferred for success
        onError={onErrorLoading}
        // onLoadEnd={onLoadGenericEnd} // Can be used but sometimes behaves differently on platforms
        // onLoadStart is implicit when source changes
      />
      {/* Loading indicator shown on top while image is fetching */}
      {isLoading && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" color="#333" />
        </View>
      )}
    </View>
  );
};

export default LazyImage;