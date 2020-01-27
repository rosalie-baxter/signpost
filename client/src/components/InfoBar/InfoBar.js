import React from 'react';

const InfoBar = ({ name, description, address, timings }) => {
  console.log(name);
  return (
    <>
      <aside>
        <a>
          <h3>{name}</h3>
          <p>{description}</p>
          <p>{address}</p>
          <p>{timings}</p>
          <p>See more</p>
        </a>
      </aside>
    </>
  );
};

export default InfoBar;
