"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | null;
  name: string;
  initials: string;
  avatarBg: string;
};

export default function Avatar({ src, name, initials, avatarBg }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  if (src && !imgFailed) {
    return (
      <Image
        src={src}
        alt={name}
        width={44}
        height={44}
        className="rounded-full object-cover shrink-0"
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${avatarBg}`}
    >
      {initials}
    </div>
  );
}
