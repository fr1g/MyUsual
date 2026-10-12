/*
Vite 支持在导入路径后加 ?raw 后缀，直接拿到文件内容字符串：
ts：

import starSvg from './star.svg?raw';
// starSvg 是一个 string，内容就是文件的原始文本

<Cutout shape={starSvg} />

---

如果是 TypeScript，需要在 src/vite-env.d.ts 或任意 .d.ts 里补一个类型声明：
ts

declare module '*.svg?raw' {
  const content: string;
  export default content;
}

注意：默认 import starSvg from './star.svg' 拿到的是 URL（用于 <img src>），不是字符串。必须加 ?raw。
*/


import React, {
  useLayoutEffect,
  useRef,
  useMemo,
  type CSSProperties,
} from 'react';

export type CutoutFit = 'contain' | 'cover' | 'fill' | 'none';

export interface CutoutProps {
  /**
   * 挖空形状的 SVG 字符串，必须包含 <svg>...</svg>。
   * 缺 xmlns 会自动补上。
   */
  shape: string;

  /**
   * Tailwind 类名（或任意 CSS 类），作用于锚点元素。
   *
   * 支持的 Tailwind 类：
   *   - 位置：absolute / inset-4 / top-2 / left-4 / translate-x-4 ...
   *   - 尺寸：w-16 / h-16 / w-1/2 / size-20 ...
   *   - 强度：opacity-50 / opacity-80 等，会与 intensity 相乘
   *
   * 不支持的类：
   *   - rotate-* / scale-*：只通过包围盒近似，形状不会真的旋转/缩放
   *
   * 不传时默认 "absolute inset-0"（铺满父元素）。
   */
  className?: string;

  /**
   * 挖空形状适配方式，默认 "contain"。
   * 只有在锚点没有实际尺寸（w/h 都为 0）时才生效。
   */
  fit?: CutoutFit | CSSProperties['maskSize'];

  /**
   * 挖空强度 0~1，默认 1。
   * 最终强度 = intensity × 锚点的 computed opacity。
   * 0 = 完全不挖，1 = 完全挖空。
   */
  intensity?: number;

  /** 传给锚点元素的内联样式 */
  style?: CSSProperties;
}

/** 把这些属性在改动前存下来，卸载时还原父元素 */
const MASK_PROPS = [
  '-webkit-mask-image',
  'mask-image',
  '-webkit-mask-composite',
  'mask-composite',
  '-webkit-mask-size',
  'mask-size',
  '-webkit-mask-repeat',
  'mask-repeat',
  '-webkit-mask-position',
  'mask-position',
] as const;

function buildSvgUrl(shape: string, alpha: number): string {
  let svg = shape;
  if (!/xmlns=/.test(svg)) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  // alpha 通过 SVG 根上的 opacity 烘焙进 alpha 通道
  if (alpha < 1) {
    svg = svg.replace('<svg', `<svg opacity="${alpha}"`);
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * 在父元素背景上按 shape 的形状挖空。
 *
 * 用法：
 *   <div className="relative bg-gradient-to-br from-purple-500 to-blue-500">
 *     <Cutout
 *       shape={starSvg}
 *       className="absolute w-16 h-16 top-4 left-8 opacity-80"
 *     />
 *     <div>内容</div>
 *   </div>
 *
 * 注意：
 * - 父元素需要有定位上下文（relative / absolute / fixed 都可以）。
 * - 会覆盖父元素现有的 mask-* 样式，组件卸载时还原。
 */
export function Cutout({
  shape,
  className,
  fit = 'contain',
  intensity = 1,
  style,
}: CutoutProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const parent = anchor?.parentElement as HTMLElement | null;
    if (!anchor || !parent) return;

    const applyMask = () => {
      const pr = parent.getBoundingClientRect();
      const ar = anchor.getBoundingClientRect();
      const cs = getComputedStyle(anchor);

      const anchorOpacity = Number.parseFloat(cs.opacity);
      const safeOpacity = Number.isFinite(anchorOpacity) ? anchorOpacity : 1;
      const finalIntensity = Math.max(
        0,
        Math.min(1, intensity * safeOpacity),
      );

      const svgUrl = buildSvgUrl(shape, finalIntensity);

      const hasSize = ar.width > 0 && ar.height > 0;
      const maskSize = hasSize
        ? `100% 100%, ${ar.width}px ${ar.height}px`
        : `100% 100%, ${fit}`;
      const maskPosition = hasSize
        ? `0 0, ${ar.left - pr.left}px ${ar.top - pr.top}px`
        : `0 0, center`;

      const s = parent.style;
      s.setProperty(
        '-webkit-mask-image',
        `linear-gradient(#000, #000), url("${svgUrl}")`,
      );
      s.setProperty(
        'mask-image',
        `linear-gradient(#000, #000), url("${svgUrl}")`,
      );
      s.setProperty('-webkit-mask-composite', 'xor');
      s.setProperty('mask-composite', 'exclude');
      s.setProperty('-webkit-mask-size', maskSize);
      s.setProperty('mask-size', maskSize);
      s.setProperty('-webkit-mask-repeat', 'no-repeat');
      s.setProperty('mask-repeat', 'no-repeat');
      s.setProperty('-webkit-mask-position', maskPosition);
      s.setProperty('mask-position', maskPosition);
    };

    applyMask();

    // 监听锚点的尺寸/位置变化
    const ro = new ResizeObserver(applyMask);
    ro.observe(anchor);
    ro.observe(parent);

    // 监听锚点 class/style 变化（Tailwind 类切换时重算）
    const mo = new MutationObserver(applyMask);
    mo.observe(anchor, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    window.addEventListener('resize', applyMask);

    // 记录并还原父元素原有 mask 属性
    const prev = MASK_PROPS.map((p) => [p, parent.style.getPropertyValue(p)] as const);

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', applyMask);
      const s = parent.style;
      for (const [prop, value] of prev) {
        if (value) s.setProperty(prop, value);
        else s.removeProperty(prop);
      }
    };
  }, [shape, fit, intensity]);

  return (
    <span
      ref={anchorRef}
      aria-hidden
      className={className ?? 'absolute inset-0'}
      style={{
        display: 'block',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}