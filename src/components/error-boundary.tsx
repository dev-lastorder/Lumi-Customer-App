import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { CustomText } from './common';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error: Error | undefined };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} className="bg-background dark:bg-dark-background">
          <CustomText>Oops! The app crashed.</CustomText>
          <CustomText>{this.state.error?.message}</CustomText>
          <Button title="Try Again" onPress={this.handleReset} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
});
