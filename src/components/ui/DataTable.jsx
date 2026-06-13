'use client';

import { useMemo, useRef } from 'react';
import { Spin, Table } from 'antd';
import { useElementWidth } from '@/hooks/useElementWidth';
import { getTableScrollWidth } from '@/lib/table-utils';

function relaxColumnsForFit(columns = []) {
  return columns.map(({ fixed, width, ...column }) => ({
    ...column,
    ellipsis: column.ellipsis ?? true,
  }));
}

function applyColumnAlign(columns = [], defaultAlign = 'left') {
  return columns.map((column) => ({
    ...column,
    align: column.align ?? defaultAlign,
  }));
}

function isTableLoading(loading) {
  if (!loading) return false;
  if (typeof loading === 'object') return loading.spinning !== false;
  return true;
}

function countLeafColumns(columns = []) {
  return columns.reduce((count, column) => {
    if (column.children?.length) {
      return count + countLeafColumns(column.children);
    }

    return count + 1;
  }, 0);
}

export default function DataTable({
  className = '',
  wrapClassName = '',
  columns,
  columnAlign = 'left',
  scroll = { x: false },
  tableLayout = 'auto',
  loading = false,
  rowSelection,
  components: userComponents,
  ...props
}) {
  const wrapRef = useRef(null);
  const containerWidth = useElementWidth(wrapRef);

  const columnsWithAlign = useMemo(
    () => applyColumnAlign(columns, columnAlign),
    [columns, columnAlign],
  );

  const forceHorizontalScroll = scroll?.x === true;

  const contentWidth = useMemo(() => {
    if (scroll?.x !== undefined && typeof scroll.x === 'number') {
      return scroll.x;
    }

    return getTableScrollWidth(columnsWithAlign);
  }, [columnsWithAlign, scroll?.x]);

  const needsHorizontalScroll = useMemo(() => {
    if (scroll?.x === false) return false;
    if (forceHorizontalScroll && contentWidth > 0) return true;
    if (containerWidth === 0) return false;
    return contentWidth > containerWidth;
  }, [containerWidth, contentWidth, scroll?.x, forceHorizontalScroll]);

  const resolvedColumns = useMemo(
    () =>
      needsHorizontalScroll
        ? columnsWithAlign
        : relaxColumnsForFit(columnsWithAlign),
    [columnsWithAlign, needsHorizontalScroll],
  );

  const verticalScrollY = scroll?.y;

  const tableScroll = useMemo(() => {
    const next = { ...scroll };
    delete next.y;

    if (scroll?.x === false) {
      delete next.x;
    } else if (needsHorizontalScroll && contentWidth > 0) {
      next.x = typeof scroll?.x === 'number' ? scroll.x : contentWidth;
    } else {
      delete next.x;
    }

    return Object.keys(next).length > 0 ? next : undefined;
  }, [scroll, needsHorizontalScroll, contentWidth]);

  const resolvedTableLayout = tableLayout ?? (needsHorizontalScroll ? 'fixed' : 'auto');
  const isLoading = isTableLoading(loading);
  const loadingColSpan = countLeafColumns(resolvedColumns) + (rowSelection ? 1 : 0);

  const tableComponents = useMemo(() => {
    const BodyWrapper = (bodyProps) => {
      if (isLoading) {
        return (
          <tbody {...bodyProps}>
            <tr className="ant-table-placeholder">
              <td colSpan={loadingColSpan} className="data-table-body-loading-cell">
                <div className="data-table-body-loading-content">
                  <Spin size="large" />
                </div>
              </td>
            </tr>
          </tbody>
        );
      }

      const UserBodyWrapper = userComponents?.body?.wrapper;
      if (UserBodyWrapper) {
        return <UserBodyWrapper {...bodyProps} />;
      }

      return <tbody {...bodyProps}>{bodyProps.children}</tbody>;
    };

    return {
      ...userComponents,
      body: {
        ...userComponents?.body,
        wrapper: BodyWrapper,
      },
    };
  }, [isLoading, loadingColSpan, userComponents]);

  const wrapClassNames = [
    'data-table-wrap',
    'app-scrollbar',
    verticalScrollY != null && 'data-table-wrap--scroll-body',
    isLoading && 'data-table-wrap--loading-body',
    wrapClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapStyle =
    verticalScrollY != null
      ? {
          '--data-table-scroll-y':
            typeof verticalScrollY === 'number' ? `${verticalScrollY}px` : verticalScrollY,
        }
      : undefined;

  return (
    <div ref={wrapRef} className={wrapClassNames} style={wrapStyle}>
      <Table
        className={`data-table ${className}`.trim()}
        columns={resolvedColumns}
        scroll={tableScroll}
        bordered
        tableLayout={resolvedTableLayout}
        rowSelection={rowSelection}
        components={tableComponents}
        {...props}
      />
    </div>
  );
}
