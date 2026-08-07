import React from 'react';
import { useModal } from '@/hooks';

const ModalContent = (props: any) => (<div>
  <h2>Welcome</h2>
  <strong>{props.firstName || 'first name'}</strong>
  <em>{props.lastName || 'last name'}</em>
</div>);


export default function Home() {
  const { open } = useModal();
  const openModal = (evt: any) => {
    evt.preventDefault();
    open({
      component: [ModalContent, {
        firstName: 'Testing',
        lastName: 'USER',
      }],
    });
  }
  return (<div>
    <h1>HOME</h1>
    <div>
      <button onClick={openModal}>Open Modal</button>
    </div>
  </div>);
}
