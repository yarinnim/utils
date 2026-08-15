import { type ReactNode } from 'react';

const IconReg = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
  <path d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192C576 156.7 547.3 128 512 128L128 128zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/>
</svg>);

const closeIconCss = [
  'absolute top-1 right-2 size-10 text-gray-700',
  'hover:text-gray-400',
].join(' ');

const CloseIcon = (props: any) => {
  const { close } = props;
  const onClick = (evt: any) => {
    evt.preventDefault();
    close();
  };
  return (<button className={closeIconCss} onClick={onClick}>
    <IconReg />
  </button>);
};

type ModalProps = {
  children: ReactNode;
  close: () => void;
  className?: string;
};

export default function Modal(props: ModalProps) {
  const { children, close, className, ...restProps } = props;
  return (<div {...restProps} className="modal-overlay">
    <div className={`modal-backdrop ${className}`}>
      <CloseIcon close={close} />
      {children}
    </div>
  </div>);
}
