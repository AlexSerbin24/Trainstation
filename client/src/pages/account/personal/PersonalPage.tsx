import React from 'react'
import UpdateAccountForm from './components/UpdateAccountForm.tsx';
import { useLoaderData } from 'react-router-dom';
import { UserProfileFormData } from '../../../types/userFormsData.ts';

export default function PersonalPage() {

  const user = useLoaderData() as UserProfileFormData;
  return (
    <>
      <h1 className='pesonal-page-user-name' style={{marginLeft:15}}>{user.name} {user.lastname}</h1>
      <p className='pesonal-page-user-email' style={{marginLeft:15}}>{user.email}</p>
      <UpdateAccountForm user={user}/>
    </>
  )
}
