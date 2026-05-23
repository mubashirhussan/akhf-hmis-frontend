'use client';

import { useState } from 'react';
import HmisCard from '@/components/ui/HmisCard';

export default function HmisTabs({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  className = '',
  cardClassName = '',
  wrapInCard = false,
}) {
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey ?? items[0]?.key,
  );

  const isControlled = controlledActiveKey !== undefined;
  const activeKey = isControlled ? controlledActiveKey : internalActiveKey;

  const setActiveKey = (key) => {
    if (!isControlled) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const activeItem = items.find((item) => item.key === activeKey) ?? items[0];
  const activeIndex = items.findIndex((item) => item.key === activeKey);
  const isFirstTabActive = activeIndex <= 0;

  const panel = activeItem?.children ?? null;
  const panelClassName = [
    'hmis-tabs-panel',
    cardClassName,
    isFirstTabActive ? 'hmis-tabs-panel--first-active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`hmis-tabs ${className}`.trim()}>
      <div className="hmis-tabs-nav" role="tablist">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`hmis-tabs-tab ${isActive ? 'hmis-tabs-tab--active' : ''}`}
              onClick={() => setActiveKey(item.key)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {wrapInCard ? (
        <HmisCard className={panelClassName}>{panel}</HmisCard>
      ) : (
        <div className={panelClassName}>{panel}</div>
      )}
    </div>
  );
}
