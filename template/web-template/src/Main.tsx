import { Suspense, StrictMode } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import createRouter from '@/routes';
import { ContextProvider } from '@/context';
import { useModal } from '@/hooks';
import '@/styles/main.css';

const Modal = () => {
  const { component } = useModal();
  return component;
};

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  const modalElement: any = document.getElementById('root.modal');

  if (!(rootElement || false)) {
    const errorMsg = 'Please create root element with root a ID';
    throw new Error(errorMsg);
  }

  const root = createRoot(rootElement);
  const router = createRouter();

  return root.render(<StrictMode>
    <ContextProvider>
      <Suspense fallback="Loading...">
        <RouterProvider router={router} />
        {createPortal(<Modal />, modalElement)}
      </Suspense>
    </ContextProvider>
  </StrictMode>);
});
