import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const BuyerReq = () => {
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'purchasers'));
        const buyers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBuyerRequests(buyers);
      } catch (error) {
        console.error('Error fetching buyer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerRequests();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading buyer requests...</p>;

  return (
    <div className="overflow-x-auto rounded-xl shadow p-4">
      <h2 className="text-2xl font-semibold mb-6">Buyer Requests</h2>
      <table className="min-w-full bg-white text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Address</th>
            <th className="py-2 px-4 border">Car</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Payment</th>
          </tr>
        </thead>
        <tbody>
          {buyerRequests.map((buyer) => (
            <tr key={buyer.id} className="text-center">
              <td className="py-2 px-4 border">{buyer.fullName}</td>
              <td className="py-2 px-4 border">{buyer.email}</td>
              <td className="py-2 px-4 border">{buyer.phone}</td>
              <td className="py-2 px-4 border">{buyer.address}</td>
              <td className="py-2 px-4 border">{`${buyer.carBrand} ${buyer.carModel} (${buyer.carYear})`}</td>
              <td className="py-2 px-4 border">${buyer.carPrice}</td>
              <td className="py-2 px-4 border">{buyer.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuyerReq;
