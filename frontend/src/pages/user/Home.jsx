import { useEffect, useState } from "react";
import { getItems } from "../../services/api";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItems()
      .then((data) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-display-lg font-bold text-text-primary">
        Lost & Found Items
      </h1>
      <ul className="mt-6 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="text-body-md text-text-secondary">
            {item.title} — {item.status} — {item.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
