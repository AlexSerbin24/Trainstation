import React, { ReactNode } from 'react'
import "../Forms.css"

type Props = {
    formName: string,
    children: ReactNode
}


export default function UserForm({ formName, children }: Props) {
    return (
        <div className='user-form'>
            <div className='user-form-header'>
                <h1>{formName}</h1>
            </div>
            <div className='user-form-body'>
                {children}
            </div>
        </div>
    )
}
