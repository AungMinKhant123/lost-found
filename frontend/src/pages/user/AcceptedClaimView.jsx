import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getAcceptedClaimContact } from "../../api/itemsApi";
import { getAcceptedClaimContactMock } from "../../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchContactWithFallback(itemId, claimId) {
  try {
    return await getAcceptedClaimContact(itemId, claimId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getAcceptedClaimContactMock(itemId, claimId);
    }
    throw error;
  }
}

const AcceptedClaimView = () => {
  const { itemId, claimId } = useParams();
  const [claimant, setClaimant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContactWithFallback(itemId, claimId)
      .then(setClaimant)
      .catch((err) => setError(err.response?.data?.message ?? err.message))
      .finally(() => setLoading(false));
  }, [itemId, claimId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!claimant) return <div>Claimant not found.</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-heading-1 font-bold text-text-primary">
        Claim Accepted
      </h1>
      <p className="text-body-md text-text-primary mt-2">
        You've accepted this claim - the item has been marked as Resolved.
      </p>
      <p className="text-body-md text-text-primary">
        You can now contact the claimant below to arrange the handover.
      </p>

      <div className="border border-border rounded-lg p-8 mt-6 bg-white">
        <h2 className="text-heading-3 font-bold text-text-primary text-center">
          Contact Information
        </h2>

        <div className="flex flex-col items-center mt-4">
          {claimant.profileUrl ? (
            <img
              src={claimant.profileUrl}
              alt={`${claimant.firstName} ${claimant.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-300" />
          )}
          <p className="text-heading-3 font-bold text-text-primary mt-2">
            {claimant.firstName} {claimant.lastName}
          </p>
          <p className="text-body-sm text-text-secondary">Claimant</p>
        </div>

        {claimant.phone && (
          <div className="mt-6">
            <label className="text-body-md font-medium text-text-primary">
              Phone Number
            </label>
            <div className="border border-border rounded-lg px-4 py-2.5 mt-1 text-body-md text-text-secondary">
              {claimant.phone}
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="text-body-md font-medium text-text-primary">
            Email
          </label>
          <div className="border border-border rounded-lg px-4 py-2.5 mt-1 text-body-md text-text-secondary">
            {claimant.email}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to={`/account/posts/${itemId}`}
            className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary transition-colors"
          >
            Back to My Post
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcceptedClaimView;
