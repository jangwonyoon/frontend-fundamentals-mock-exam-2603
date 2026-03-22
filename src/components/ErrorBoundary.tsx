import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { Text, Spacing, Button } from '_tosslib/components';

type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
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
        {error.message || '알 수 없는 오류가 발생했습니다.'}
      </Text>
      <Spacing size={24} />
      <Button display="inline" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
}

type Props = {
  children: ReactNode;
};

export function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('[ErrorBoundary]', error, info.componentStack);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
