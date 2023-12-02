import { useState, useEffect } from 'react';

export default function useUserProfile(access_token) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (access_token) {
        // Fetch user profile using the access_token
        try {
          const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` },
          });
          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [access_token]);

  return userProfile;
};