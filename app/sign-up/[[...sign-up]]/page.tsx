//app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='h-fit w-full flex justify-center items-center'>
            <SignUp />
        </div>
    )
}