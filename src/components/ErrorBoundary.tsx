import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { Text, Spacing, Button } from '_tosslib/components';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            text-align: center;
          `}
        >
          <Text typography="t4" fontWeight="bold" color={colors.grey900}>
            문제가 발생했습니다
          </Text>
          <Spacing size={8} />
          <Text typography="t6" color={colors.grey500}>
            {this.state.error?.message ?? '알 수 없는 오류가 발생했습니다.'}
          </Text>
          <Spacing size={24} />
          <Button display="inline" onClick={this.handleReset}>
            다시 시도
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
