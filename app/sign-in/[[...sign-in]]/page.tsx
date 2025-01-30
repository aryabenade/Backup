//app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='h-fit w-full flex justify-center items-center'>
        <SignIn/>
    </div>
  )
}