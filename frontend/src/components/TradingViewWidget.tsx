import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  width?: string | number;
  height?: string | number;
  theme?: 'light' | 'dark';
  type?: 'chart' | 'mini' | 'ticker' | 'market-overview';
}

function TradingViewWidget({ 
  symbol = 'NASDAQ:AAPL', 
  width = '100%', 
  height = 400,
  theme = 'light',
  type = 'chart'
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!container.current || scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      if (container.current && (window as any).TradingView) {
        if (type === 'chart') {
          new (window as any).TradingView.widget({
            autosize: false,
            symbol: symbol,
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: theme,
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            container_id: container.current.id,
            width: width,
            height: height,
            studies: [
              'RSI@tv-basicstudies',
              'MASimple@tv-basicstudies'
            ]
          });
        } else if (type === 'mini') {
          new (window as any).TradingView.MiniChart({
            symbol: symbol,
            width: width,
            height: height,
            locale: 'en',
            dateRange: '12M',
            colorTheme: theme,
            trendLineColor: 'rgba(41, 98, 255, 1)',
            underLineColor: 'rgba(41, 98, 255, 0.3)',
            underLineBottomColor: 'rgba(41, 98, 255, 0)',
            isTransparent: false,
            autosize: false,
            largeChartUrl: '',
            container_id: container.current.id
          });
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      scriptLoadedRef.current = false;
    };
  }, [symbol, width, height, theme, type]);

  const containerId = `tradingview_${Math.random().toString(36).substring(7)}`;

  return (
    <div className="tradingview-widget-container">
      <div id={containerId} ref={container} />
    </div>
  );
}

export default memo(TradingViewWidget);

