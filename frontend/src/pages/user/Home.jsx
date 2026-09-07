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
    <div>
      <h1>Lost & Found Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.title} — {item.status} — {item.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
