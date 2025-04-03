import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './SkeletonLoader.css';

const TableLoader: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#ddd" highlightColor="#ccc">
      <div className="skeleton-loader">
        <h1>
          <Skeleton width={200} height={40} />
        </h1>
        <h2>
          <Skeleton width={300} height={30} />
        </h2>
        <table>
          <thead>
            <tr>
              <th>
                <Skeleton width={50} />
              </th>
              <th>
                <Skeleton width={100} />
              </th>
              <th>
                <Skeleton width={60} />
              </th>
              <th>
                <Skeleton width={60} />
              </th>
              <th>
                <Skeleton width={60} />
              </th>
              <th>
                <Skeleton width={'100%'} />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index}>
                <td>
                  <Skeleton width={50} />
                </td>
                <td>
                  <Skeleton width={100} />
                </td>
                <td>
                  <Skeleton width={60} />
                </td>
                <td>
                  <Skeleton width={60} />
                </td>
                <td>
                  <Skeleton width={60} />
                </td>
                <td>
                  <Skeleton width={'100%'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="skeleton-buttons">
          <div className="skeleton-button">
            <Skeleton width={100} height={40} />
          </div>
          <div className="skeleton-button">
            <Skeleton width={100} height={40} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default TableLoader;
