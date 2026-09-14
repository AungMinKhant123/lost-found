import { useNavigate } from "react-router";
import Button from "../../components/Button";

const NotFound = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <section className="my-8 w-full px-10 py-8 text-center">
      <h1 className="text-display-lg">Oops! Page Not Found</h1>
      <p className="text-body-lg mt-2">
        Sorry the page you'd like to access was not found!
      </p>
      <Button
        type="button"
        variant="primary"
        onClick={handleClick}
        className="my-4"
      >
        Go Back
      </Button>
      <div className="w-lg h-90 mx-auto">
        <img
          src="https://images.unsplash.com/vector-1743473329244-f81d2c2a18f4?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="A boy holding balloons that show 404"
          className="w-full h-full object-cover object-center animate-pulse duration-1000"
        />
      </div>
    </section>
  );
};

export default NotFound;
