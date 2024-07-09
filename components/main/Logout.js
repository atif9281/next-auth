import React from 'react';

const Logout = ({clickingLogout}) => {

 


  return (
    <div className='m-9'>
        <button className='bg-slate-500 text-white hover:bg-slate-600  mx-2 rounded p-1' onClick={clickingLogout}>Log out</button>
    </div>
  );
};

export default Logout;