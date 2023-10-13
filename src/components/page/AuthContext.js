import { createContext, useContext, useState, useEffect, } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);


  useEffect(() => {
    const auth = localStorage.getItem('email');
    if (auth) {
      setUserEmail(auth);
    }
    else {
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);