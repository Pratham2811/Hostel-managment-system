import React from 'react';

const PaymentHistory = ({ payments }) => {
  return (
    <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Booking</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Transaction ID</th>
            <th className="py-3 px-6 text-left">Payment Method</th>
            <th className="py-3 px-6 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {payments && payments.map((payment) => (
            <tr key={payment._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {payment.booking ? payment.booking._id : 'N/A'}
              </td>
              <td className="py-3 px-6 text-left">
                {payment.amount}
              </td>
              <td className="py-3 px-6 text-left">
                {payment.transactionId}
              </td>
              <td className="py-3 px-6 text-left">
                {payment.paymentMethod}
              </td>
              <td className="py-3 px-6 text-center">
                {payment.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;