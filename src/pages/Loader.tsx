import React from 'react';

const Loader: React.FC = () => {
  return (
    <div id="myModals" className="modals">
      <div className="modal-content-rkt">
        <div className="rokket-launch-outer">
          <img
            src="../../public/pink_rokket.gif"
            className="launch_img"
            alt="Example GIF"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
