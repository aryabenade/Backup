//Profile component in app/profile/page.tsx
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mt-10">User Profile</h1>
      <p className="text-center mt-4 text-lg">
        Manage your profile, pets, and adoption listings.
      </p>
    </div>
  );
};

export default Profile;
