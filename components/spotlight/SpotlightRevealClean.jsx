// components/spotlight/SpotlightRevealClean.jsx
import { useEffect, useRef, useState } from 'react';
import EchoCanvas from './EchoCanvas';

const LERP_FACTOR = 0.15;
const DEFAULT_SPOTLIGHT_RADIUS = 70;

/**
 * Clean spotlight reveal — base (muted) + reveal (bright) clipped to cursor.
 * Pass objectFit="contain" for portrait lookbook heroes; default "cover" for support page.
 */
export default function SpotlightRevealClean({
  baseImage,
  revealImage,
  objectPosition = 'center center',
  objectFit = 'cover',
  isActive = true,
  alt = 'Spotlight reveal',
  revealAlt = 'Spotlight reveal bright',
  imageStageClassName = '',
  imageFrameClassName = '',
  imageClassName = '',
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
}) {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: -9999, y: -9999 });
  const currentRef = useRef({ x: -9999, y: -9999 });

  const [clipPath, setClipPath] = useState(
    `circle(${spotlightRadius}px at 50% 50%)`
  );
  const [hasPointer, setHasPointer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isActive) return undefined;

    const mq = window.matchMedia('(pointer: fine)');
    setHasPointer(mq.matches);

    const container = containerRef.current;
    if (!container) return undefined;

    const getTrackEl = () =>
      (objectFit === 'contain' && frameRef.current) ? frameRef.current : container;

    const centerTarget = () => {
      const el = getTrackEl();
      const bounds = el.getBoundingClientRect();
      targetRef.current = { x: bounds.width / 2, y: bounds.height / 2 };
      currentRef.current = { x: bounds.width / 2, y: bounds.height / 2 };
    };

    centerTarget();

    const onMouseMove = (e) => {
      const el = getTrackEl();
      const bounds = el.getBoundingClientRect();
      targetRef.current = {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    };

    const onMouseLeave = () => {
      centerTarget();
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
      const t = targetRef.current;
      const c = currentRef.current;

      currentRef.current = {
        x: c.x + (t.x - c.x) * LERP_FACTOR,
        y: c.y + (t.y - c.y) * LERP_FACTOR,
      };

      setClipPath(
        `circle(${spotlightRadius}px at ${currentRef.current.x}px ${currentRef.current.y}px)`
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, baseImage, revealImage, spotlightRadius, objectFit]);

  const mobileFallback = isMobile
    ? 'circle(22% at 50% 55%)'
    : 'circle(38% at 50% 50%)';

  const isContain = objectFit === 'contain';
  const baseFilter = isContain
    ? 'brightness(0.72) saturate(0.8)'
    : 'brightness(0.45) saturate(0.65)';
  const revealFilter = isContain
    ? 'saturate(1.1) contrast(1.06) brightness(1.08)'
    : 'saturate(1.08) contrast(1.04) brightness(1.05)';

  const sharedImageStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit,
    objectPosition,
    margin: 'auto',
  };

  const imageLayers = (
    <>
      <img
        src={baseImage}
        alt={alt}
        className={imageClassName}
        draggable={false}
        style={{
          ...sharedImageStyle,
          zIndex: 0,
          filter: baseFilter,
        }}
      />
      <img
        src={revealImage}
        alt={revealAlt}
        className={imageClassName}
        draggable={false}
        style={{
          ...sharedImageStyle,
          zIndex: 1,
          clipPath: hasPointer ? clipPath : mobileFallback,
          transition: 'clip-path 0.35s ease-out',
          filter: revealFilter,
          opacity: isMobile ? 0.9 : 1,
        }}
      />
    </>
  );

  return (
    <div
      ref={containerRef}
      aria-hidden={!isActive}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        pointerEvents: isActive ? 'auto' : 'none',
        transition: 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        zIndex: isActive ? 1 : 0,
      }}
    >
      {isContain ? (
        <div
          className={imageStageClassName}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 0,
          }}
        >
          <div
            ref={frameRef}
            className={imageFrameClassName}
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            {imageLayers}
          </div>
        </div>
      ) : (
        imageLayers
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isContain
            ? 'radial-gradient(ellipse at center, transparent 45%, rgba(26,10,8,0.18) 100%)'
            : 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.3) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <EchoCanvas />
    </div>
  );
}