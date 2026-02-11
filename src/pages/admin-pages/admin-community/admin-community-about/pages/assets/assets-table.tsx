import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsGrid } from '@untitled-ui/icons-react';
import { notification, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { compact } from 'lodash';
import React, { useEffect, useState } from 'react';
import { CommunityAssetsItem } from 'src/transport/communities/communities.dto';
import { communityAssetsApi } from 'src/transport/communities/community.assets.api';

interface DragHandleProps {
  'data-row-key': string;
  isAssetReorderLoading: boolean;
  isDraggable: boolean;
}

const DragHandle = ({
  'data-row-key': dataRowKey,
  isAssetReorderLoading,
  isDraggable,
}: DragHandleProps) => {
  const { attributes, listeners, setNodeRef, transition, isDragging } =
    useSortable({
      id: dataRowKey,
      disabled: !isDraggable,
    });

  const style: React.CSSProperties = {
    cursor: 'move',
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9 } : {}),
  };

  return (
    <Spin
      spinning={isAssetReorderLoading}
      size="small"
      style={{ height: 16, width: 16 }}
    >
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <DotsGrid height={16} width={16} />
      </div>
    </Spin>
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
  isDraggable: boolean;
}

const Row = ({ children, isDraggable, ...props }: RowProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
    disabled: !isDraggable,
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'drag-handle') {
          return React.cloneElement(child as React.ReactElement, {
            'data-row-key': props['data-row-key'],
            ...(isDraggable ? { ...attributes, ...listeners } : {}),
          });
        }
        return child;
      })}
    </tr>
  );
};

export const AssetsTable: React.FC<{
  data: CommunityAssetsItem[];
  columns: ColumnsType<CommunityAssetsItem>;
  communityId: string;
  folderId: string;
  isDraggable: boolean;
}> = ({ data, columns, communityId, folderId, isDraggable }) => {
  const [dataSource, setDataSource] = useState<CommunityAssetsItem[]>([]);
  const [isAssetReorderLoading, setisAssetReorderLoading] = useState(false);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const assetsReorder = (
    communityId: string,
    folderId: string,
    activeId: string,
    newIndex: number
  ) => {
    setisAssetReorderLoading(true);

    communityAssetsApi
      .assetReorder(communityId, folderId, activeId, newIndex)
      .catch((error) => {
        notification.error({ message: `Reorder failed: ${error.message}` });
      })
      .finally(() => {
        setisAssetReorderLoading(false);
      });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.id === active.id);
        const overIndex = prev.findIndex((i) => i.id === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });

      const newIndex = dataSource?.findIndex((item) => item.id === over?.id);
      assetsReorder(communityId, folderId, active.id?.toString(), newIndex + 1);
    }
  };

  const dragHandleColumn = {
    title: '',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: (_: any, record: CommunityAssetsItem) => (
      <DragHandle
        isAssetReorderLoading={isAssetReorderLoading}
        data-row-key={record.id}
        isDraggable={isDraggable}
      />
    ),
  };

  const updatedColumns = compact([isDraggable && dragHandleColumn, ...columns]);

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={dataSource.map((i) => i?.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="id"
          columns={updatedColumns}
          dataSource={dataSource}
          pagination={{
            pageSize: 10,
            position: ['bottomCenter'],
          }}
          showSorterTooltip={{ target: 'sorter-icon' }}
          loading={{
            size: 'large',
            spinning: dataSource === undefined,
          }}
        />
      </SortableContext>
    </DndContext>
  );
};
