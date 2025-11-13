// --- useTabScrollSync.ts ---
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Dimensions, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { SectionOffsetsMap, TabItemLayoutsMap, UseTabScrollSyncProps, UseTabScrollSyncReturn } from './types';
import Animated, { useSharedValue, runOnJS, useAnimatedScrollHandler } from 'react-native-reanimated';
import _ from 'lodash';

// --- Constants ---
const { height: windowHeight } = Dimensions.get('window');

export const useTabScrollSync = ({
  sections,
  initialActiveTabId,
  scrollThresholdFactor = 0.3,
  tabBarItemMarginHorizontal = 4,
  onOffsetsCalculated,
}: UseTabScrollSyncProps): UseTabScrollSyncReturn => {
  // --- Memoized Values ---
  const defaultActiveTab = useMemo(() => (sections.length > 0 ? sections[0]?.id : null), [sections]);

  // --- State ---
  const [activeTab, setActiveTab] = useState<string | null>(() => (initialActiveTabId !== undefined ? initialActiveTabId : defaultActiveTab));
  const [sectionOffsets, setSectionOffsets] = useState<SectionOffsetsMap>({});
  const [isManualScrolling, setIsManualScrolling] = useState<boolean>(false);
  const [tabItemLayouts, setTabItemLayouts] = useState<TabItemLayoutsMap>({});
  const [tabBarScrollViewWidth, setTabBarScrollViewWidth] = useState<number>(0);

  // --- Refs ---
  const scrollViewRef = useRef<Animated.ScrollView | null>(null);
  const sectionRefs = useRef<Record<string, View | null>>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tabScrollViewRef = useRef<Animated.ScrollView | null>(null);
  const isCalculatingRef = useRef<boolean>(false);
  const pendingCalculationRef = useRef<boolean>(false);

  // --- Memoized section IDs ---
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  // --- Sorted section IDs with offsets (memoized) ---
  const sortedSectionIds = useMemo(() => {
    return sectionIds.filter((id) => sectionOffsets[id] !== undefined).sort((a, b) => (sectionOffsets[a] || 0) - (sectionOffsets[b] || 0));
  }, [sectionIds, sectionOffsets]);

  // --- Callback for Section Ref Assignment ---
  const getSectionRef = useCallback(
    (id: string) => (el: View | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  // --- Logic for Calculating Section Offsets ---
  const calculateSectionOffsets = useCallback(() => {
    if (!scrollViewRef.current || sections.length === 0 || isCalculatingRef.current) {
      if (!isCalculatingRef.current) {
        pendingCalculationRef.current = true;
      }
      return;
    }

    isCalculatingRef.current = true;
    pendingCalculationRef.current = false;

    const measurementPromises: Promise<{ id: string; offset: number | undefined }>[] = sections.map((section) => {
      return new Promise<{ id: string; offset: number | undefined }>((resolve) => {
        const sectionView = sectionRefs.current[section.id];
        if (sectionView && scrollViewRef.current) {
          const scrollViewNode = scrollViewRef.current;
          sectionView.measureLayout(
            scrollViewNode as any,
            (_x, y) => resolve({ id: section.id, offset: y }),
            () => {
              resolve({ id: section.id, offset: undefined });
            }
          );
        } else {
          resolve({ id: section.id, offset: undefined });
        }
      });
    });

    Promise.all(measurementPromises).then((measurements) => {
      const newOffsets: SectionOffsetsMap = {};
      let offsetsHaveChanged = false;

      measurements.forEach((m) => {
        if (m.offset !== undefined) {
          newOffsets[m.id] = m.offset;
          if (sectionOffsets[m.id] !== m.offset) {
            offsetsHaveChanged = true;
          }
        }
      });

      if (Object.keys(newOffsets).length > 0 && (offsetsHaveChanged || Object.keys(sectionOffsets).length === 0)) {
        setSectionOffsets((prevOffsets) => {
          const mergedOffsets = { ...prevOffsets, ...newOffsets };
          if (onOffsetsCalculated) {
            onOffsetsCalculated(mergedOffsets);
          }
          return mergedOffsets;
        });
      }

      isCalculatingRef.current = false;

      // If there's a pending calculation request, process it
      if (pendingCalculationRef.current) {
        requestAnimationFrame(() => calculateSectionOffsets());
      }
    });
  }, [sections, sectionOffsets, onOffsetsCalculated]);

  // --- Effect for Initial Offset Calculation ---
  useEffect(() => {
    const timeoutId = setTimeout(calculateSectionOffsets, 300);
    return () => clearTimeout(timeoutId);
  }, [sections, calculateSectionOffsets]);

  // --- UI Interaction Handlers ---
  // UI Interaction Handlers ---
  const handleTabPress = useCallback(
    (tabId: string) => {
      if (!tabId) return;

      setActiveTab(tabId);

      if (scrollViewRef.current && sectionOffsets[tabId] !== undefined) {
        setIsManualScrolling(true);

        // Calculate scroll offset with a small additional buffer
        // Subtracting a small percentage of the window height to scroll slightly past the top
        const extraOffset = windowHeight * 0.2; // 10% of window height as additional scroll
        const yOffset = Math.max(0, (sectionOffsets[tabId] || 0) - extraOffset);

        scrollViewRef.current.scrollTo({
          y: yOffset,
          animated: true,
        });

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          setIsManualScrolling(false);
        }, 500) as unknown as NodeJS.Timeout;
      } else {
        calculateSectionOffsets();
      }
    },
    [sectionOffsets, calculateSectionOffsets, windowHeight]
  );

  const findActiveSection = useCallback(
    (scrollY: number): string | null => {
      if (sortedSectionIds.length === 0) {
        return defaultActiveTab;
      }

      let currentActiveSectionId: string | null = sortedSectionIds[0];
      const threshold = scrollY + windowHeight * scrollThresholdFactor;

      // Binary search would be more efficient for large lists
      if (sortedSectionIds.length > 20) {
        // Binary search implementation for large section lists
        let low = 0;
        let high = sortedSectionIds.length - 1;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const sectionId = sortedSectionIds[mid];
          const sectionOffset = sectionOffsets[sectionId] || 0;

          if (sectionOffset <= threshold) {
            currentActiveSectionId = sectionId;
            low = mid + 1; // Look for a better match in upper half
          } else {
            high = mid - 1; // Look in lower half
          }
        }
      } else {
        // Linear search for smaller lists
        for (let i = sortedSectionIds.length - 1; i >= 0; i--) {
          const sectionId = sortedSectionIds[i];
          const sectionOffset = sectionOffsets[sectionId] || 0;

          if (sectionOffset - 1 <= threshold) {
            currentActiveSectionId = sectionId;
            break;
          }
        }
      }

      return currentActiveSectionId;
    },
    [sortedSectionIds, sectionOffsets, scrollThresholdFactor, defaultActiveTab]
  );

  // Use debounced scroll handler to reduce frequency of execution
  // Debounce logic for scroll handler
  // Debounced scroll handler using Lodash
  const handleScroll = useMemo(() => {
    return _.debounce(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isManualScrolling) return;

        const scrollY = event.nativeEvent.contentOffset.y;
        const newActiveSectionId = findActiveSection(scrollY);

        if (newActiveSectionId && activeTab !== newActiveSectionId) {
          setActiveTab(newActiveSectionId);
        }
      },
      50,
      { leading: false, trailing: true }
    ); // 50ms debounce
  }, [isManualScrolling, findActiveSection, activeTab]);

  const handleMomentumScrollEnd = useCallback(() => {
    setIsManualScrolling(false);
  }, []);

  // --- Effect for Tab Bar Scrolling ---
  useEffect(() => {
    if (!activeTab || !tabScrollViewRef.current || tabBarScrollViewWidth === 0) return;

    const activeTabLayout = tabItemLayouts[activeTab];
    if (!activeTabLayout?.measured) return;

    const tabItemX = activeTabLayout.x;
    const tabItemWidth = activeTabLayout.width;
    const activeTabCenter = tabItemX + tabItemWidth / 2;

    // Calculate total width of all tabs (memoize this if sections change frequently)
    let totalTabsWidth = 0;
    let hasAllMeasurements = true;

    for (const section of sections) {
      const layout = tabItemLayouts[section.id];
      if (layout?.measured) {
        totalTabsWidth += layout.width + tabBarItemMarginHorizontal * 2;
      } else {
        hasAllMeasurements = false;
        break;
      }
    }

    // Only proceed if we have all measurements
    if (!hasAllMeasurements) return;

    let targetScrollX = 0;

    if (totalTabsWidth > tabBarScrollViewWidth) {
      targetScrollX = activeTabCenter - tabBarScrollViewWidth / 2;
      const maxScrollX = Math.max(0, totalTabsWidth - tabBarScrollViewWidth);
      targetScrollX = Math.max(0, Math.min(targetScrollX, maxScrollX));
    }

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      if (tabScrollViewRef.current) {
        tabScrollViewRef.current.scrollTo({ x: targetScrollX, animated: true });
      }
    });
  }, [activeTab, tabItemLayouts, tabBarScrollViewWidth, sections, tabBarItemMarginHorizontal]);

  // --- Layout Event Handlers ---
  const handleSectionLayout = useCallback(() => {
    // Batch section layout updates with requestAnimationFrame
    requestAnimationFrame(calculateSectionOffsets);
  }, [calculateSectionOffsets]);

  const handleTabLayout = useCallback((tabId: string, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;

    setTabItemLayouts((prevLayouts) => {
      // Avoid unnecessary re-renders if layout hasn't changed
      if (prevLayouts[tabId]?.x === x && prevLayouts[tabId]?.width === width && prevLayouts[tabId]?.measured) {
        return prevLayouts;
      }

      return {
        ...prevLayouts,
        [tabId]: { x, y, width, height, measured: true },
      };
    });
  }, []);

  const handleTabBarLayout = useCallback((event: LayoutChangeEvent) => {
    setTabBarScrollViewWidth(event.nativeEvent.layout.width);
  }, []);

  const handleContentScrollViewLayout = useCallback(() => {
    requestAnimationFrame(calculateSectionOffsets);
  }, [calculateSectionOffsets]);

  // Debounce content size changes to prevent excessive recalculations
  const handleContentScrollViewContentSizeChange = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      calculateSectionOffsets();
    }, 100) as unknown as NodeJS.Timeout;
  }, [calculateSectionOffsets]);

  // --- Cleanup Effect ---
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // --- Return Value ---
  return {
    activeTab,
    scrollViewRef,
    tabScrollViewRef,
    getSectionRef,
    handleTabPress,
    handleScroll,
    handleMomentumScrollEnd,
    handleSectionLayout,
    handleTabLayout,
    handleTabBarLayout,
    handleContentScrollViewLayout,
    handleContentScrollViewContentSizeChange,
    tabItemLayouts,
  };
};
