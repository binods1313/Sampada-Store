/**
 * TrustStrip - Announcement Bar
 * 
 * Uses CSS transform animation (GPU compositor thread)
 * Same technique used by Shopify, Nykaa, Myntra, Gymshark
 * 
 * Why CSS instead of JS scrollLeft:
 * - JS scrollLeft runs on main thread → throttled when DevTools closed
 * - CSS transform runs on GPU compositor → always runs, guaranteed
 * 
 * Features:
 * - Continuous left-to-right scroll (30s per loop)
 * - Pauses on hover
 * - Seamless infinite loop
 * - Height: exactly 36px
 * - Respects prefers-reduced-motion
 */

export default function TrustStrip() {
  return (
    <>
      <style>{`
        @keyframes ann-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ann-outer {
          height: 36px;
          background: #6B0000;
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 100;
          border-bottom: 1px solid rgba(201, 162, 39, 0.3);
        }
        .ann-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ann-scroll 30s linear infinite;
        }
        .ann-track:hover {
          animation-play-state: paused;
        }
        .ann-item {
          white-space: nowrap;
          color: #C9A227;
          font-size: 13px;
          font-weight: 500;
          padding: 0 4rem;
          display: inline-block;
          flex-shrink: 0;
          line-height: 36px;
        }
        @media (prefers-reduced-motion: reduce) {
          .ann-track { animation: none; }
        }
      `}</style>

      <div className="ann-outer">
        <div className="ann-track">
          <span className="ann-item">
            Free Shipping ₹999+ &nbsp;•&nbsp;
            30-Day Returns &nbsp;•&nbsp;
            COD Available &nbsp;•&nbsp;
            ★★★★★ 4.8 from 1,200+ customers
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          {/* Second copy for seamless loop (exactly 50% scroll point) */}
          <span className="ann-item" aria-hidden="true">
            Free Shipping ₹999+ &nbsp;•&nbsp;
            30-Day Returns &nbsp;•&nbsp;
            COD Available &nbsp;•&nbsp;
            ★★★★★ 4.8 from 1,200+ customers
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </>
  );
}
