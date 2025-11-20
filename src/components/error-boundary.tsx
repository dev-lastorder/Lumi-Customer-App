// import React from 'react';
// import { View, StyleSheet, Button } from 'react-native';
// import { CustomText } from './common';

// type Props = { children: React.ReactNode };
// type State = { hasError: boolean; error: Error | undefined };

// export default class ErrorBoundary extends React.Component<Props, State> {
//   state: State = { hasError: false, error: undefined };

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    
//   }

//   handleReset = () => {
//     this.setState({ hasError: false, error: undefined });
//   };

//   render() {
//     if (this.state.hasError) {
//       return (
//         <View style={styles.container} className="bg-background dark:bg-dark-background">
//           <CustomText>Oops! The app crashed.</CustomText>
//           <CustomText>{this.state.error?.message}</CustomText>
//           <Button title="Try Again" onPress={this.handleReset} />
//         </View>
//       );
//     }

//     return this.props.children;
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 16,
//     paddingHorizontal: 20,
//   },
// });


import React from 'react';
import { View, StyleSheet, Button, ScrollView } from 'react-native';
import { CustomText } from './common';

type Props = { children: React.ReactNode };
type State = { 
  hasError: boolean; 
  error: Error | undefined;
  stack: string | undefined;
  componentStack: string | undefined;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { 
    hasError: false, 
    error: undefined,
    stack: undefined,
    componentStack: undefined,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      stack: error.stack,                     // JS stack trace
      componentStack: errorInfo.componentStack, // React component trace
    });

    // Optional: send to error monitoring service
    // crashlytics().recordError(error);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined,
      stack: undefined,
      componentStack: undefined 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <CustomText>Oops! The app crashed.</CustomText>
          <CustomText>{this.state.error?.message}</CustomText>

          {/* Stack trace */}
   
            <>
              <CustomText style={{ fontWeight: 'bold', marginTop: 20 }}>Stack Trace</CustomText>
              <CustomText selectable>{this.state.stack}</CustomText>

              <CustomText style={{ fontWeight: 'bold', marginTop: 20 }}>Component Trace</CustomText>
              <CustomText selectable>{this.state.componentStack}</CustomText>
            </>
         

          <Button title="Try Again" onPress={this.handleReset} />
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
});
