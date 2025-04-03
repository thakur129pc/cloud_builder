import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './SkeletonBox.css';

const SkeletonBox: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#ddd" highlightColor="#ccc">
      <div className="skeleton-loader ">
        <h1>
          <Skeleton width={200} height={40} />
        </h1>
        {[...Array(2)].map((_, mindex) => (
          <div className="skeleton-cards" key={mindex}>
            {[...Array(3)].map((_, index) => (
              <div className="skeleton-card" key={index}>
                <h2>
                  <Skeleton width={250} height={30} />
                </h2>
                <div className="skeleton-options">
                  {[...Array(4)].map((_, idx) => (
                    <Skeleton
                      key={idx}
                      width={200}
                      height={30}
                      style={{ marginTop: '7px' }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="skeleton-buttons">
          <div className="skeleton-button">
            <Skeleton width={150} height={40} />
          </div>
          <div className="skeleton-button">
            <Skeleton width={150} height={40} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonBox;
