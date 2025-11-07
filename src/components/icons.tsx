import type { SVGProps } from 'react';

export const Icons = {
  qrCode: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
      <path d="M144 144h40v40h-40zM144 72h40v40h-40z" opacity=".2" />
      <path d="M216 48h-48V24a8 8 0 0 0-16 0v24h-24a8 8 0 0 0 0 16h24v24a8 8 0 0 0 16 0V64h48a8 8 0 0 0 0-16Zm-56 40a8 8 0 0 1-8 8h-24v24a8 8 0 0 1-16 0V96H88a8 8 0 0 1 0-16h24V56a8 8 0 0 1 16 0v24h24a8 8 0 0 1 8 8Z" />
      <path d="M120 48H96V24a8 8 0 0 0-16 0v24H56a8 8 0 0 0 0 16h24v24a8 8 0 0 0 16 0V64h24a8 8 0 0 0 0-16Zm-56 56a8 8 0 0 1-8 8H32v24a8 8 0 0 1-16 0v-24H-8a8 8 0 0 1 0-16H8V88a8 8 0 0 1 16 0v24h24a8 8 0 0 1 8 8Z" />
      <path d="M96 152a8 8 0 0 1-8 8H72v16a8 8 0 0 1-16 0v-16H40a8 8 0 0 1 0-16h16v-16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 8 8Zm136-32h-16a8 8 0 0 0 0 16h16v48h-48v-24a8 8 0 0 0-16 0v24h-24a8 8 0 0 0 0 16h24v24a8 8 0 0 0 16 0v-24h48a8 8 0 0 0 0-16h-16v-16a8 8 0 0 0-16 0v16h-16a8 8 0 0 0 0 16h16v16a8 8 0 0 0 16 0v-16h16a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8Zm-40 40h-40v-40h40Zm-8-32h-24v-24h24Z" />
    </svg>
  ),
};
