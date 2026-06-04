'use client';

import { useMemo, useRef } from 'react';
import { Table } from 'antd';
import { useElementWidth } from '@/hooks/useElementWidth';
import { getTableScrollWidth } from '@/lib/table-utils';

function stripFixedColumns(columns = []) {
  return columns.map(({ fixed, ...column }) => column);
}

function applyColumnAlign(columns = [], defaultAlign = 'left') {
  return columns.map((column) => ({
    ...column,
    align: column.align ?? defaultAlign,
  }));
}

export default function HmisTable({
  className = '',
  wrapClassName = '',
  columns,
  columnAlign = 'left',
  scroll,
  tableLayout,
  ...props
}) {
  const wrapRef = useRef(null);
  const containerWidth = useElementWidth(wrapRef);

  const columnsWithAlign = useMemo(
    () => applyColumnAlign(columns, columnAlign),
    [columns, columnAlign],
  );

  const contentWidth = useMemo(() => {
    if (scroll?.x !== undefined && typeof scroll.x === 'number') {
      return scroll.x;
    }

    return getTableScrollWidth(columnsWithAlign);
  }, [columnsWithAlign, scroll?.x]);

  const needsHorizontalScroll = useMemo(() => {
    if (scroll?.x === false) return false;
    if (containerWidth === 0) return false;
    return contentWidth > containerWidth;
  }, [containerWidth, contentWidth, scroll?.x]);

  const resolvedColumns = useMemo(
    () =>
      needsHorizontalScroll
        ? columnsWithAlign
        : stripFixedColumns(columnsWithAlign),
    [columnsWithAlign, needsHorizontalScroll],
  );

  const verticalScrollY = scroll?.y;

  const tableScroll = useMemo(() => {
    const next = { ...scroll };
    delete next.y;

    if (scroll?.x === false) {
      delete next.x;
    } else if (needsHorizontalScroll && contentWidth > 0) {
      next.x = scroll?.x ?? contentWidth;
    } else {
      delete next.x;
    }

    return Object.keys(next).length > 0 ? next : undefined;
  }, [scroll, needsHorizontalScroll, contentWidth]);

  const resolvedTableLayout = tableLayout ?? (needsHorizontalScroll ? 'fixed' : 'auto');

  const wrapClassNames = [
    'hmis-table-wrap',
    'hmis-scrollbar',
    verticalScrollY != null && 'hmis-table-wrap--scroll-body',
    wrapClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapStyle =
    verticalScrollY != null
      ? {
          '--hmis-table-scroll-y':
            typeof verticalScrollY === 'number' ? `${verticalScrollY}px` : verticalScrollY,
        }
      : undefined;

  return (
    <div ref={wrapRef} className={wrapClassNames} style={wrapStyle}>
      <Table
        className={`hmis-table ${className}`.trim()}
        columns={resolvedColumns}
        scroll={tableScroll}
        bordered
        tableLayout={resolvedTableLayout}
        {...props}
      />
    </div>
  );
}
