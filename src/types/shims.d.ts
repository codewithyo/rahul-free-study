declare module 'react';
declare module 'react-dom';
declare module 'next';
declare module 'next/link';
declare module 'next/server' {
	export const NextResponse: any;
	export const cookies: any;
	export default NextResponse;
}
declare module 'lucide-react';
declare module 'axios';
declare module 'hls.js';

declare var process: any;

declare namespace React {
	type FormEvent<T = any> = any;
	type ChangeEvent<T = any> = any;
}
