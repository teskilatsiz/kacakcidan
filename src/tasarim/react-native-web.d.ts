import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    dataSet?: Record<string, string>;
    'aria-pressed'?: boolean | 'mixed';
  }
  interface TextProps {
    dataSet?: Record<string, string>;
  }
}
