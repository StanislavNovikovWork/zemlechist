import React from 'react';

interface SpecialTechniqueMarkerProps {
  color: string;
  size?: number;
}

export function SpecialTechniqueMarker({ color, size = 42 }: SpecialTechniqueMarkerProps) {
  return (
    <svg 
      width={size} 
      height={size * 1.14} 
      viewBox="0 0 60 68" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(7 5)" fill={color}>
        <path d="M23.51 51.523c-.01.267-.23.477-.52.477a.5.5 0 0 1-.5-.477c-.145-3.168-1.756-5.217-4.832-6.147C7.53 42.968 0 33.863 0 23 0 10.297 10.297 0 23 0s23 10.297 23 23c0 10.863-7.53 19.968-17.658 22.376-3.076.93-4.687 2.98-4.83 6.147z"/>
      </g>

      <circle cx="30" cy="64" r="4" fill="#FFFFFF"/>
      <circle cx="30" cy="64" r="2" fill={color}/>

      <g transform="translate(14,12) scale(0.068) translate(440,0) scale(-1,1)" fill="#FFFFFF">
        <path d="M30,169.612H0v145.604c7.692-11.316,17.98-20.73,30-27.384V169.612z"/>
        <path d="M72,307c-31.43,0-57,25.57-57,57s25.57,57,57,57s57-25.57,57-57S103.43,307,72,307z"/>
        <path d="M294,297.416V214L206,49H60v228.832c3.924-0.544,7.929-0.832,12-0.832c47.972,0,87,39.028,87,87
          c0,3.382-0.201,6.718-0.578,10H209c0-42.458,34.542-77,77-77C288.701,297,291.37,297.143,294,297.416z
          M90,214V79h98l72,135H90z"/>
        <path d="M441.25,344L373,214h-49v93.071c23.267,13.262,39,38.285,39,66.929h107v-30H441.25z"/>
        <path d="M286,327c-25.916,0-47,21.084-47,47s21.084,47,47,47s47-21.084,47-47S311.916,327,286,327z"/>
        <rect x="400" y="341" width="70" height="5" rx="2"/>
      </g>
    </svg>
  );
}
