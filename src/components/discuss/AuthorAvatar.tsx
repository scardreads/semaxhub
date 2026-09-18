import type { ReactNode } from "react";
import { initialsFromDisplayName } from "@/lib/author-image";

type AuthorAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: number;
};

export function AuthorAvatar({
  name,
  imageUrl,
  size = 28,
}: AuthorAvatarProps) {
  const style = { width: size, height: size, minWidth: size, minHeight: size };

  if (imageUrl) {
    return (
      // Decorative next to visible name — empty alt
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt=""
        width={size}
        height={size}
        style={style}
        className="rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  const initials = initialsFromDisplayName(name);
  return (
    <span
      style={style}
      className="inline-flex items-center justify-center rounded-full bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F]"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

type AuthorMetaProps = {
  name: string;
  imageUrl?: string | null;
  size?: number;
  children?: ReactNode;
  className?: string;
};

export function AuthorMeta({
  name,
  imageUrl,
  size = 28,
  children,
  className = "flex items-center gap-2 text-xs text-muted",
}: AuthorMetaProps) {
  return (
    <p className={className}>
      <AuthorAvatar name={name} imageUrl={imageUrl} size={size} />
      <span>
        {name}
        {children}
      </span>
    </p>
  );
}
