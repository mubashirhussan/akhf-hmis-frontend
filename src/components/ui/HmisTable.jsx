'use client';

import { useMemo, useRef } from 'react';
import { Table } from 'antd';
import { useElementWidth } from '@/hooks/useElementWidth';
import { getTableScrollWidth } from '@/lib/table-utils';

function stripFixedColumns(columns = []) {
  return columns.map(({ fixed, ...column }) => column);
}

export default function HmisTable({
  className = '',
  wrapClassName = '',
  columns,
  scroll,
  tableLayout,
  ...props
}) {
  const wrapRef = useRef(null);
  const containerWidth = useElementWidth(wrapRef);

  const contentWidth = useMemo(() => {
    if (scroll?.x !== undefined && typeof scroll.x === 'number') {
      return scroll.x;
    }

    return getTableScrollWidth(columns);
  }, [columns, scroll?.x]);

  const needsHorizontalScroll = useMemo(() => {
    if (scroll?.x === false) return false;
    if (containerWidth === 0) return false;
    return contentWidth > containerWidth;
  }, [containerWidth, contentWidth, scroll?.x]);

  const resolvedColumns = useMemo(
    () => (needsHorizontalScroll ? columns : stripFixedColumns(columns)),
    [columns, needsHorizontalScroll],
  );

  const tableScroll = useMemo(() => {
    const next = { ...scroll };

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

  return (
    <div
      ref={wrapRef}
      className={`hmis-table-wrap hmis-scrollbar ${wrapClassName}`.trim()}
    >
      <Table
        className={`hmis-table ${className}`.trim()}
        columns={resolvedColumns}
        scroll={tableScroll}
        tableLayout={resolvedTableLayout}
        {...props}
      />
    </div>
  );
}
