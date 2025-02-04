"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { IconUsers } from "@tabler/icons-react";
import axios from "axios";

const MatchesPage = () => {
  const { user } = useUser();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      //   fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const matchedUsers = await axios.get("/api/user/getMatches");
      setMatches(matchedUsers.data.users);
    } catch (error) {
      console.error("Error finding matches:", error);
    }
    setLoading(false);
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-primary mb-4 text-center">
        Find Your Travel Buddy
      </h1>
      {loading ? (
        <p className="text-lg text-base-content text-center h-40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle
              fill="none"
              stroke-opacity="1"
              stroke="currentColor"
              stroke-width=".5"
              cx="100"
              cy="100"
              r="0"
            >
              <animate
                attributeName="r"
                calcMode="spline"
                dur="2"
                values="1;80"
                keyTimes="0;1"
                keySplines="0 .2 .5 1"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="stroke-width"
                calcMode="spline"
                dur="2"
                values="0;25"
                keyTimes="0;1"
                keySplines="0 .2 .5 1"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="stroke-opacity"
                calcMode="spline"
                dur="2"
                values="1;0"
                keyTimes="0;1"
                keySplines="0 .2 .5 1"
                repeatCount="indefinite"
              ></animate>
            </circle>
          </svg>
        </p>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </div>
      ) : (
        <p className="text-lg">
          No matches found. Try updating your preferences.
        </p>
      )}
    </div>
  );
};

const MatchCard = ({ match }) => {
  return (
    <div className="card bg-base-100 shadow-lg p-4 flex items-center space-x-4 hover:bg-primary hover:text-white transition">
      <IconUsers className="text-3xl" />
      <div>
        <h2 className="text-lg font-semibold">{match.fullName}</h2>
        <p className="text-sm">{match.location}</p>
        <p className="text-sm">
          Shared Interests: {match.interests.join(", ")}
        </p>
      </div>
    </div>
  );
};

export default MatchesPage;
