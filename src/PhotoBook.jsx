function PageCopy({ entry, page, total }) {
  return (
    <div className="photoBookCopy">
      <p className="photoBookEyebrow">PHOTO NOTE · {String(page + 1).padStart(2, '0')}</p>
      <div className="photoBookRule" />
      <h3>{entry[2]}</h3>
      <p>{entry[3]}</p>
      <small>{entry[1]} / {String(total).padStart(2, '0')}</small>
    </div>
  )
}

function BookLeaf({ mode, entry, side, page, total }) {
  return (
    <div className={`bookLeaf ${mode} ${side}`}>
      {side === 'left'
        ? <div className="photoMat"><img src={`/assets/photography/${entry[0]}`} alt={entry[2]} /></div>
        : <PageCopy entry={entry} page={page} total={total} />}
    </div>
  )
}

export default function PhotoBook({ mode, entries, page, open, turn, onOpen, onFlip, onFlipEnd }) {
  const entry = entries[page]
  const total = entries.length
  const hasPrevious = page > 0
  const hasNext = page < total - 1
  const coverTitle = mode === 'wide' ? '横幅影像' : '竖幅影像'
  const targetEntry = turn ? entries[turn.to] : entry
  const flippingForward = turn?.direction === 'next'
  const leftEntry = !turn ? entry : flippingForward ? entry : targetEntry
  const rightEntry = !turn ? entry : flippingForward ? targetEntry : entry

  return (
    <div className={`photoBook3d ${mode} ${open ? 'isOpen' : 'isClosed'}`}>
      <div className="photoBookMeta">
        <span>{mode === 'wide' ? 'LANDSCAPE MEMORY BOOK' : 'PORTRAIT MEMORY BOOK'}</span>
        <b>{open ? `${String(page + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}` : 'CLOSED'}</b>
      </div>
      <div className="photoBookScene">
        <div className="photoBookBody">
          <BookLeaf mode={mode} entry={leftEntry} side="left" page={flippingForward ? page : turn ? turn.to : page} total={total} />
          <div className="photoBookSpine" />
          <BookLeaf mode={mode} entry={rightEntry} side="right" page={flippingForward && turn ? turn.to : page} total={total} />
          {turn && <div className={`photoBookFlipper ${flippingForward ? 'next' : 'prev'}`} onAnimationEnd={(event) => { if (event.target === event.currentTarget) onFlipEnd() }}>
            <div className="photoBookFace front">
              <BookLeaf mode={mode} entry={entry} side={flippingForward ? 'right' : 'left'} page={page} total={total} />
              <i />
            </div>
            <div className="photoBookFace back">
              <BookLeaf mode={mode} entry={targetEntry} side={flippingForward ? 'left' : 'right'} page={turn.to} total={total} />
              <i />
            </div>
          </div>}
        </div>
        <button className="photoBookCover" onClick={onOpen} aria-label="打开摄影书">
          <span className="coverLine top" />
          <small>PERSONAL PHOTO ARCHIVE</small>
          <strong>{coverTitle}</strong>
          <b>{mode === 'wide' ? 'LANDSCAPE PHOTOGRAPHS' : 'PORTRAIT PHOTOGRAPHS'}</b>
          <span className="coverLine bottom" />
          <em>辛悦的摄影档案 / XIN YUE · 2026</em>
        </button>
      </div>
      <div className="photoBookControls">
        {open && <>
          <button onClick={() => onFlip('prev')} disabled={!hasPrevious || !!turn} aria-label="上一页">←</button>
          <span>{String(page + 1).padStart(2, '0')} <i /> {String(total).padStart(2, '0')}</span>
          <button onClick={() => onFlip('next')} disabled={!hasNext || !!turn} aria-label="下一页">→</button>
        </>}
      </div>
      <p className="photoBookHint">{open ? 'CLICK THE ARROWS TO TURN THE PAGE' : 'CLICK THE COVER TO OPEN'}</p>
    </div>
  )
}



