import { memo } from "react";
import { iconRegistry } from "./iconRegistry";

/**
 * Standard Icon Component & Wrapper
 * Tương thích 100% với cách gọi cũ <LucideIcon icon="..." />
 *
 * @param {Object} props
 * @param {string} props.icon - Tên icon trong iconRegistry
 * @param {string} [props.fill="#fff"] - Màu fill (dùng cho Logo)
 * @param {string} [props.color] - Màu stroke/fill tùy chỉnh
 * @param {string} [props.className] - CSS class bổ sung
 */
export const Icon = memo(function Icon({
  icon,
  fill = "#fff",
  color,
  className = "",
  ...rest
}) {
  const IconComponent = iconRegistry[icon];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      fill={fill}
      color={color}
      className={className}
      {...rest}
    />
  );
});

// Alias tương thích ngược để code cũ import { LucideIcon } hay default đều chạy tốt
export const LucideIcon = Icon;

export default Icon;
