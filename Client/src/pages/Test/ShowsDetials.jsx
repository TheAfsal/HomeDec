import React, { useState, useEffect } from "react";

const ShowsDetials = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    // This useEffect handles the data-fetching logic.
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate an asynchronous API call (e.g., fetch from a real API)
                const response = await fetch("https://api.tvmaze.com/search/shows?q=heist");
                const result = await response.json();
                setData(result); // Store the fetched data in state
            } catch (err) {
                setError(err); // Set any errors that happen during fetching
            }
        };

        fetchData(); // Call the async function on component mount
    }, []); // Empty dependency array means this runs only once when the component mounts

    // If the data is still loading, we need to throw a promise to suspend the render
    if (!data && !error) {
        throw new Promise(() => { }); // This causes Suspense to display the fallback UI
    }

    // If there was an error, render an error message
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Once the data is loaded, render it
    return (
        <div>
            {data && data[0] && (
                <>
                    <h2>{data[0]?.show?.name}</h2>
                    <p>Language: {data[0]?.show?.language}</p>
                    <p>Status: {data[0]?.show?.status}</p>
                    <img src={data[0]?.show?.image?.medium} alt={data[0]?.show?.name} />
                </>
            )}
        </div>
    );
};

export default ShowsDetials;
