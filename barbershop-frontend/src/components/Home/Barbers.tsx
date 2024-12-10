import { useState, useEffect } from "react";
import { getAllBarbers } from "../../services/barbers"; // Assuming the service is in a 'services' folder

interface Barber {
  id: string;
  name: string;
  // Add other properties as needed, based on your backend model
}

function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setIsLoading(true);
        const fetchedBarbers = await getAllBarbers();
        setBarbers(fetchedBarbers);
      } catch (error) {
        // setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <div className="barbers-container">
      {isLoading ? (
        <p>Loading barbers...</p>
      ) : error ? (
        <p>Error fetching barbers</p>
      ) : (
        <ul>
          {barbers.map((barber) => (
            <li key={barber.id}>{barber.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Barbers;
