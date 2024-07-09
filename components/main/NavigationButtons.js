import React from 'react';
import Link from 'next/link';

const NavigationButtons = () => {


  return (
    <div className='m-9'>
      <Link href="/login">
        <button className='bg-slate-500 text-white hover:bg-slate-600  mx-2 rounded p-1'>Login</button>
      </Link>
      <Link href="/signup">
        <button className='bg-slate-500 text-white hover:bg-slate-600 mx-2 rounded p-1'>Signup</button>
      </Link>
    </div>
  );
};

export default NavigationButtons;