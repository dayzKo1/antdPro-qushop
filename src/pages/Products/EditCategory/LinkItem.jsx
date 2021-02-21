import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './styles.less';

const LinkItem = ({
  data,
  index,
  onChange,
  delLink,
  moveItem,
  type,
  sortType,
  select,
  delList,
}) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'card',
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveItem(dragIndex, hoverIndex, onChange);
      const child = item;
      child.index = hoverIndex;
    },
  });
  const [{ isDragging }, preview] = useDrag({
    item: { type: 'card', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drop(ref);
  const delItem = (e) => {
    e.stopPropagation();
    if (type === 'editCategory') {
      delList(index);
    }
    delLink(index, onChange);
  };
  const categories = data.categories && data.categories.map((item) => item.name).join('  ');
  const tags = data.tags && data.tags.map((item) => item.name).join('  ');
  const sku =
    data.sku || (data.variants && data.variants.map((item) => `${item.sku}\xa0\xa0`).join(`  `));
  const title = (
    <div className={styles.nameTooltip}>
      {tags && (
        <>
          <div>标签</div> <div>{tags}</div>
        </>
      )}
      {categories && (
        <>
          <div>分类</div> <div>{categories}</div>
        </>
      )}
      {sku && (
        <>
          <div>sku</div>
          <div>{sku}</div>
        </>
      )}
    </div>
  );
  return (
    <div ref={preview} style={{ cursor: 'pointer' }}>
      <div
        ref={ref}
        style={{
          opacity,
          cursor: type === 'editCategory' && sortType === 'manual' ? 'pointer' : 'initial',
        }}
        className={styles.linkList}
        onClick={type === 'editCategory' && sortType === 'manual' ? () => select(index) : () => {}}
      >
        <div className={styles.index}>{index + 1}</div>
        <div
          className={styles.img}
          style={{
            backgroundImage: `url(${data.image || data.thumbnail_url})`,
          }}
        />
        <div className={styles.name} style={{ width: '50%' }}>
          {type === 'productGroup' ? (
            <Tooltip title={title}>
              <span style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}>
                {data.post_title || data.name}{' '}
              </span>
              {data.post_status === 'private' ? <span className={styles.private}>已下架</span> : []}
            </Tooltip>
          ) : (
            <div>
              <span style={{ display: 'inline-block' }}>{data.post_title || data.name}&nbsp; </span>
              {data.post_status === 'private' ? <span className={styles.private}>已下架</span> : []}
            </div>
          )}
        </div>
        <DeleteOutlined
          onClick={delItem}
          style={{ fontSize: 16, marginRight: 10, cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default LinkItem;
