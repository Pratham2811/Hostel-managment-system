import React from 'react';

const ReviewList = ({ reviews }) => {
  return (
    <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">User</th>
            <th className="py-3 px-6 text-left">Rating</th>
            <th className="py-3 px-6 text-left">Comment</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {reviews && reviews.map((review) => (
            <tr key={review._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {review.user ? review.user.name : 'Unknown User'}
              </td>
              <td className="py-3 px-6 text-left">
                {review.rating} / 5
              </td>
              <td className="py-3 px-6 text-left">
                {review.comment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewList;