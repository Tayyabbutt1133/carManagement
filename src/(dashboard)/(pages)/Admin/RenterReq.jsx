import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const RenterReq = () => {
  const [renterRequests, setRenterRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenterRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'renters'));
        const renters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRenterRequests(renters);
      } catch (error) {
        console.error('Error fetching renter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenterRequests();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading renter requests...</p>;

  return (
    <div className="overflow-x-auto rounded-xl shadow p-4">
      <h2 className="text-2xl font-semibold mb-6">Renter Requests</h2>
      <table className="min-w-full bg-white text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Car</th>
            <th className="py-2 px-4 border">Days</th>
            <th className="py-2 px-4 border">Price/Day</th>
          </tr>
        </thead>
        <tbody>
          {renterRequests.map((renter) => (
            <tr key={renter.id} className="text-center">
              <td className="py-2 px-4 border">{renter.fullName}</td>
              <td className="py-2 px-4 border">{renter.email}</td>
              <td className="py-2 px-4 border">{renter.phone}</td>
              <td className="py-2 px-4 border">{`${renter.carBrand} ${renter.carModel} (${renter.carYear})`}</td>
              <td className="py-2 px-4 border">{renter.rentalDays}</td>
              <td className="py-2 px-4 border">${renter.carPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenterReq;
