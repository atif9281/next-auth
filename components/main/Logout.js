import React from 'react';

const Logout = ({clickingLogout}) => {

  return (
    <div className=' flex justify-center'>
        <button className='bg-slate-500 text-white hover:bg-slate-600  rounded p-2 ' onClick={clickingLogout}>Log out</button>
    </div>
  );
};

export default Logout;