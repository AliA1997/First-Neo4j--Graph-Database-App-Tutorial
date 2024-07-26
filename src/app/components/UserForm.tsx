"use client";
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { retrieveOrCreateUser } from '@/services/retrieveOrCreateUser';

const UserForm: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(
    () => {
      let timeout: NodeJS.Timeout;
      if(submitting) 
        timeout = setTimeout(() => setSubmitting(false), 2000);

      return () => {
        clearTimeout(timeout);
      }
    },
    [submitting]
  );

  //We will change this for later.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const newUser = {
      userId: '',
      username,
    };
    // Create or retrieve the User
    const createdOrRetrievedUser = await retrieveOrCreateUser(newUser);
    // Set the User by the retrieve or created User
    setUser(createdOrRetrievedUser);
    //Reset State
    setUsername('');
  };

  return (
    <div className="flex items-center justify-center min-h-32">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">User Form</h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-semibold mb-2 text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder='Type your username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent px-3 py-2 border border-gray-300 rounded-lg color-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors`}
        >
          {submitting ? 'Submitting....' : 'Submit'}
        </button>
        {submitting && username && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            Submitted Username: {username}
          </div>
        )}
        {user && user.userId && <div className='my-4'>Current User: {user.username}</div>}
      </form>
    </div>
  );
};

export default UserForm;
